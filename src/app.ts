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
import { WebMiddleware, ScheduleInterface } from './interface';
import * as Router from 'koa-router';
import { config, logger } from './decorators';
import { RPC_KEY, SCHEDULE_KEY } from './constant';
import { getAllMethods, generateKeyFunc, getScheduleRule } from "./lib"
import * as os from "os";
import _ = require("lodash");
import schedule = require("node-schedule");
import { Logger } from 'winston';
const hostname = os.hostname();
const env = process.env.NODE_ENV || "development";
function isTypeScriptEnvironment() {
  return !!require.extensions['.ts'];
}

export class ZonetkApplication extends KOAApplication {

  appDir;
  baseDir;
  loader: ContainerLoader;
  private controllerIds: string[] = [];
  private rpcServiceIds: string[] = [];
  private scheduleIds: string[] = [];
  private rpcFuncIds: string[] = [];
  private prioritySortRouters: Array<{
    priority: number,
    router: Router,
  }> = [];

  @config()
  rpc

  @logger()
  log: Logger

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
    this.loader.loadDirectory({
      ignore: "script/**"
    });
    this.prepareContext();
  }

  getBaseDir() {
    if (isTypeScriptEnvironment()) {
      return join(this.appDir, 'src');
    } else {
      return join(this.appDir, 'dist');
    }
  }

  async loadRpcServiceFunc() {
    const rpcServiceModules: any[] = listModule(RPC_KEY);
    let serviceFuncs = {};
    for (const module of rpcServiceModules) {
      const providerId = getProviderId(module);
      if (providerId) {
        if (this.rpcServiceIds.indexOf(providerId) > -1) {
          throw new Error(`rpcService identifier [${providerId}] is exists!`);
        }
        this.rpcServiceIds.push(providerId);
        const moduleServiceFuncs = getAllMethods(module.prototype);
        for (const func of moduleServiceFuncs) {
          if (this.rpcFuncIds.includes(`${providerId}.${func}`)) {
            throw new Error(`rpcService func [${providerId}.${func}] is exists!`);
          }
          this.rpcFuncIds.push(`${providerId}.${func}`);
        }
        serviceFuncs = {
          ...serviceFuncs,
          ...generateKeyFunc(moduleServiceFuncs, providerId)
        }
      }
    }
    return serviceFuncs
  }
  async loadSchedule() {
    const scheduleModules = listModule(SCHEDULE_KEY);
    for (const module of scheduleModules) {
      const providerId = getProviderId(module);
      if (providerId) {
        if (this.scheduleIds.indexOf(providerId) > -1) {
          throw new Error(`schedule identifier [${providerId}] is exists!`);
        }
        this.scheduleIds.push(providerId);
        const moduleDefinition: ScheduleInterface = await this.applicationContext.getAsync(providerId)
        let targetHost = moduleDefinition.targetHost;
        if (moduleDefinition.targetHost && _.isObject(moduleDefinition.targetHost)) {
          targetHost = moduleDefinition.targetHost[env];
        }

        const procIndex = !process.env.NODE_APP_INSTANCE ? 0 : parseInt(process.env.NODE_APP_INSTANCE);
        //是否只允许在一个节点中启用
        if (moduleDefinition.enable && (!targetHost || targetHost === hostname)
          && ((moduleDefinition.pm2OneInstance && procIndex === 0) || !moduleDefinition.pm2OneInstance)) {
          //启动定时任务
          let rule = getScheduleRule(moduleDefinition.time);
          schedule.scheduleJob(rule, moduleDefinition.resolve.bind(moduleDefinition));
          this.log.info(`${providerId} schedule task has successfully started`);
        }
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
    await this.loadSchedule();
    this.loadController();
  }

  private prepareContext() {
    this.use(async (ctx, next) => {
      ctx.requestContext = new MidwayRequestContainer(this.applicationContext, ctx);
      ctx.requestContext.registerObject("rpcRequestCall", {})
      this.applicationContext.registerObject("requestContext", ctx.requestContext);
      await next();
    });
  }

  get applicationContext(): MidwayContainer {
    return this.loader.getApplicationContext();
  }

}
