import {
  CONTROLLER_KEY,
  ControllerOption,
  KoaMiddleware,
  PRIORITY_KEY,
  RouterOption,
  WEB_ROUTER_KEY,
} from '@midwayjs/decorator';
import { getClassMetadata, getProviderId, listModule } from 'injection';
import { ContainerLoader, MidwayContainer, MidwayRequestContainer } from 'midway-core';
import { join } from 'path';
import * as KOAApplication from 'koa';
import { WebMiddleware } from './interface';
import * as Router from 'koa-router';
import { config, logger } from './decorators';
import * as sofaRpc from 'sofa-rpc-node';
import { RPC_KEY } from './constant';
import { getAllMethods, generateKeyFunc, setRpcClient } from "./lib"

function isTypeScriptEnvironment() {
  return !!require.extensions['.ts'];
}

export class ZonetkApplication extends KOAApplication {

  appDir;
  baseDir;
  loader: ContainerLoader;
  private controllerIds: string[] = [];
  private rpcServiceIds: string[] = [];
  private rpcFuncIds: string[] = [];
  private prioritySortRouters: Array<{
    priority: number,
    router: Router,
  }> = [];

  @config()
  rpc
  @logger()
  logger

  constructor(options: {
    baseDir?: string;
  } = {}) {
    super();
    this.appDir = options.baseDir || process.cwd();
    this.baseDir = this.getBaseDir();

    this.loader = new ContainerLoader({
      baseDir: this.baseDir,
      isTsMode: true,
    });
    this.loader.initialize();
    this.loader.loadDirectory();
    this.prepareContext();
  }

  getBaseDir() {
    if (isTypeScriptEnvironment()) {
      return join(this.appDir, 'src');
    } else {
      return join(this.appDir, 'dist');
    }
  }

  async runRpcServer() {
    if (this.rpc && this.rpc.server) {
      const zookeeperAddress = (this.rpc.zookeeper && this.rpc.zookeeper.address) || "127.0.0.1:2181"
      const registry = new sofaRpc.registry.ZookeeperRegistry({
        logger: console,
        address: zookeeperAddress, // 需要本地启动一个 zkServer
      });
      const rpcServer = new sofaRpc.server.RpcServer({
        logger: console,
        registry, // 传入注册中心客户端
        port: this.rpc.server.port || 12200,
      });
      if (!this.rpc.server.service) {
        throw new Error("config rpc.server.service is required");
      }
      const serviceFuncs = await this.loadRpcServiceFunc();
      rpcServer.addService({
        interfaceName: this.rpc.server.service,
      }, serviceFuncs);
      // 4. 启动 Server 并发布服务
      await rpcServer.start();
      await rpcServer.publish();
    }
  }

  async loadRpcServiceFunc() {
    const rpcServiceModules = listModule(RPC_KEY);
    let serviceFuncs = {};
    for (const module of rpcServiceModules) {
      const providerId = getProviderId(module);
      if (providerId) {
        if (this.rpcServiceIds.indexOf(providerId) > -1) {
          throw new Error(`rpcService identifier [${providerId}] is exists!`);
        }
        this.rpcServiceIds.push(providerId);
        const moduleDefinition = await this.applicationContext.getAsync(providerId)
        const moduleServiceFuncs = getAllMethods(moduleDefinition);
        for (const func of moduleServiceFuncs) {
          if (this.rpcFuncIds.includes(func)) {
            throw new Error(`rpcService func [${func}] is exists!`);
          }
          this.rpcFuncIds.push(func);
        }
        serviceFuncs = {
          ...serviceFuncs,
          ...generateKeyFunc(moduleServiceFuncs, moduleDefinition)
        }
      }
    }
    return serviceFuncs
  }
  async initRpcClient() {
    if (this.rpc && this.rpc.client) {
      const zookeeperAddress = (this.rpc.zookeeper && this.rpc.zookeeper.address) || "127.0.0.1:2181"
      const registry = new sofaRpc.registry.ZookeeperRegistry({
        logger: console,
        address: zookeeperAddress,
      });
      const client = new sofaRpc.client.RpcClient({
        logger: console,
        registry,
      });
      const clientNames = Object.keys(this.rpc.client)
      for (let index = 0; index < clientNames.length; index++) {
        const clientName = clientNames[index];
        const consumer = client.createConsumer({
          interfaceName: this.rpc.client[clientName],
        });
        // 4. 等待 consumer ready（从注册中心订阅服务列表...）
        await consumer.ready();
        setRpcClient(clientName, consumer);
      }
    }
  }
  async loadController() {
    const controllerModules = listModule(CONTROLLER_KEY);

    // implement @controller
    for (const module of controllerModules) {
      const providerId = getProviderId(module);
      if (providerId) {
        if (this.controllerIds.indexOf(providerId) > -1) {
          throw new Error(`controller identifier [${providerId}] is exists!`);
        }
        this.controllerIds.push(providerId);
        await this.preRegisterRouter(module, providerId);
      }
    }
    // implement @priority
    if (this.prioritySortRouters.length) {
      this.prioritySortRouters = this.prioritySortRouters.sort((routerA, routerB) => {
        return routerB.priority - routerA.priority;
      });
      this.prioritySortRouters.forEach((prioritySortRouter) => {
        this.use(prioritySortRouter.router.middleware());
      });
    }
  }

  protected async preRegisterRouter(target, controllerId) {
    const controllerOption: ControllerOption = getClassMetadata(CONTROLLER_KEY, target);
    let newRouter;
    if (controllerOption.prefix) {
      newRouter = new Router({
        sensitive: true,
      }, this);
      newRouter.prefix(controllerOption.prefix);
      // implement middleware in controller
      const middlewares = controllerOption.routerOptions.middleware;
      await this.handlerWebMiddleware(middlewares, (middlewareImpl: KoaMiddleware) => {
        newRouter.use(middlewareImpl);
      });

      // implement @get @post
      const webRouterInfo: RouterOption[] = getClassMetadata(WEB_ROUTER_KEY, target);
      if (webRouterInfo && typeof webRouterInfo[Symbol.iterator] === 'function') {
        for (const webRouter of webRouterInfo) {
          // get middleware
          const middlewares = webRouter.middleware;
          const methodMiddlwares = [];

          await this.handlerWebMiddleware(middlewares, (middlewareImpl: KoaMiddleware) => {
            methodMiddlwares.push(middlewareImpl);
          });

          const routerArgs = [
            webRouter.routerName,
            webRouter.path,
            ...methodMiddlwares,
            this.generateController(`${controllerId}.${webRouter.method}`)
          ].concat(methodMiddlwares);

          // apply controller from request context
          newRouter[webRouter.requestMethod].apply(newRouter, routerArgs);
        }
      }
    }

    // sort for priority
    if (newRouter) {
      const priority = getClassMetadata(PRIORITY_KEY, target);
      this.prioritySortRouters.push({
        priority: priority || 0,
        router: newRouter,
      });
    }
  }

  private async handlerWebMiddleware(middlewares, handlerCallback) {
    if (middlewares && middlewares.length) {
      for (const middleware of middlewares) {
        if (typeof middleware === 'function') {
          // web function middleware
          handlerCallback(middleware);
        } else {
          const middlewareImpl: WebMiddleware = await this.applicationContext.getAsync(middleware);
          if (middlewareImpl && middlewareImpl.resolve) {
            handlerCallback(middlewareImpl.resolve());
          }
        }
      }
    }
  }

  /**
   * wrap controller string to middleware function
   * @param controllerMapping like xxxController.index
   */
  public generateController(controllerMapping: string) {
    const mappingSplit = controllerMapping.split('.');
    const controllerId = mappingSplit[0];
    const methodName = mappingSplit[1];
    return async (ctx, next) => {
      const controller = await ctx.requestContext.getAsync(controllerId);
      return controller[methodName].call(controller, ctx, next);
    };
  }

  async ready() {
    await this.loader.refresh();
    await this.runRpcServer();
    await this.initRpcClient();
    this.loadController();
  }

  private prepareContext() {
    this.use(async (ctx, next) => {
      ctx.requestContext = new MidwayRequestContainer(this.applicationContext, ctx);
      this.applicationContext.registerObject("requestContext", ctx.requestContext);
      await next();
    });
  }

  get applicationContext(): MidwayContainer {
    return this.loader.getApplicationContext();
  }

}
