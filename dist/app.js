"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("@midwayjs/decorator");
const injection_1 = require("injection");
const midway_core_1 = require("midway-core");
const path_1 = require("path");
const KOAApplication = require("koa");
const Router = require("koa-router");
const decorators_1 = require("./decorators");
const sofaRpc = require("sofa-rpc-node");
const constant_1 = require("./constant");
const lib_1 = require("./lib");
const os = require("os");
const _ = require("lodash");
const schedule = require("node-schedule");
const hostname = os.hostname();
const env = process.env.NODE_ENV || "development";
function isTypeScriptEnvironment() {
    return !!require.extensions['.ts'];
}
class ZonetkApplication extends KOAApplication {
    constructor(options = {}) {
        super();
        this.controllerIds = [];
        this.rpcServiceIds = [];
        this.scheduleIds = [];
        this.rpcFuncIds = [];
        this.prioritySortRouters = [];
        this.appDir = options.baseDir || process.cwd();
        this.baseDir = this.getBaseDir();
        this.loader = new midway_core_1.ContainerLoader({
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
            return path_1.join(this.appDir, 'src');
        }
        else {
            return path_1.join(this.appDir, 'dist');
        }
    }
    async runRpcServer() {
        if (this.rpc && this.rpc.server) {
            const zookeeperAddress = (this.rpc.zookeeper && this.rpc.zookeeper.address) || "127.0.0.1:2181";
            const registry = new sofaRpc.registry.ZookeeperRegistry({
                logger: console,
                address: zookeeperAddress,
            });
            const rpcServer = new sofaRpc.server.RpcServer({
                logger: console,
                registry,
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
        const rpcServiceModules = injection_1.listModule(constant_1.RPC_KEY);
        let serviceFuncs = {};
        for (const module of rpcServiceModules) {
            const providerId = injection_1.getProviderId(module);
            if (providerId) {
                if (this.rpcServiceIds.indexOf(providerId) > -1) {
                    throw new Error(`rpcService identifier [${providerId}] is exists!`);
                }
                this.rpcServiceIds.push(providerId);
                const moduleDefinition = await this.applicationContext.getAsync(providerId);
                const moduleServiceFuncs = lib_1.getAllMethods(moduleDefinition);
                for (const func of moduleServiceFuncs) {
                    if (this.rpcFuncIds.includes(`${providerId}.${func}`)) {
                        throw new Error(`rpcService func [${providerId}.${func}] is exists!`);
                    }
                    this.rpcFuncIds.push(`${providerId}.${func}`);
                }
                serviceFuncs = Object.assign(Object.assign({}, serviceFuncs), lib_1.generateKeyFunc(moduleServiceFuncs, moduleDefinition, providerId));
            }
        }
        return serviceFuncs;
    }
    async initRpcClient() {
        if (this.rpc && this.rpc.client) {
            const zookeeperAddress = (this.rpc.zookeeper && this.rpc.zookeeper.address) || "127.0.0.1:2181";
            const registry = new sofaRpc.registry.ZookeeperRegistry({
                logger: console,
                address: zookeeperAddress,
            });
            const client = new sofaRpc.client.RpcClient({
                logger: console,
                registry,
            });
            const clientNames = Object.keys(this.rpc.client);
            for (let index = 0; index < clientNames.length; index++) {
                const clientName = clientNames[index];
                const consumer = client.createConsumer({
                    interfaceName: this.rpc.client[clientName],
                });
                //等待 consumer ready（从注册中心订阅服务列表...）
                await consumer.ready();
                lib_1.setRpcClient(clientName, consumer);
            }
        }
    }
    async loadSchedule() {
        const scheduleModules = injection_1.listModule(constant_1.SCHEDULE_KEY);
        for (const module of scheduleModules) {
            const providerId = injection_1.getProviderId(module);
            if (providerId) {
                if (this.scheduleIds.indexOf(providerId) > -1) {
                    throw new Error(`schedule identifier [${providerId}] is exists!`);
                }
                this.scheduleIds.push(providerId);
                const moduleDefinition = await this.applicationContext.getAsync(providerId);
                let targetHost = moduleDefinition.targetHost;
                if (moduleDefinition.targetHost && _.isObject(moduleDefinition.targetHost)) {
                    targetHost = moduleDefinition.targetHost[env];
                }
                let rule = lib_1.getScheduleRule(moduleDefinition.time);
                const procIndex = !process.env.NODE_APP_INSTANCE ? 0 : parseInt(process.env.NODE_APP_INSTANCE);
                //是否只允许在一个节点中启用
                if (moduleDefinition.enable && (!targetHost || targetHost === hostname)
                    && ((moduleDefinition.pm2OneInstance && procIndex === 0) || !moduleDefinition.pm2OneInstance)) {
                    //启动定时任务
                    schedule.scheduleJob(rule, moduleDefinition.resolve.bind(moduleDefinition));
                    this.log.info(`${providerId} schedule task has successfully started`);
                }
            }
        }
    }
    async loadController() {
        const controllerModules = injection_1.listModule(decorator_1.CONTROLLER_KEY);
        // implement @controller
        for (const module of controllerModules) {
            const providerId = injection_1.getProviderId(module);
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
    async preRegisterRouter(target, controllerId) {
        const controllerOption = injection_1.getClassMetadata(decorator_1.CONTROLLER_KEY, target);
        let newRouter;
        if (controllerOption.prefix) {
            newRouter = new Router({
                sensitive: true,
            }, this);
            newRouter.prefix(controllerOption.prefix);
            // implement middleware in controller
            const middlewares = controllerOption.routerOptions.middleware;
            await this.handlerWebMiddleware(middlewares, (middlewareImpl) => {
                newRouter.use(middlewareImpl);
            });
            // implement @get @post
            const webRouterInfo = injection_1.getClassMetadata(decorator_1.WEB_ROUTER_KEY, target);
            if (webRouterInfo && typeof webRouterInfo[Symbol.iterator] === 'function') {
                for (const webRouter of webRouterInfo) {
                    // get middleware
                    const middlewares = webRouter.middleware;
                    const methodMiddlwares = [];
                    await this.handlerWebMiddleware(middlewares, (middlewareImpl) => {
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
            const priority = injection_1.getClassMetadata(decorator_1.PRIORITY_KEY, target);
            this.prioritySortRouters.push({
                priority: priority || 0,
                router: newRouter,
            });
        }
    }
    async handlerWebMiddleware(middlewares, handlerCallback) {
        if (middlewares && middlewares.length) {
            for (const middleware of middlewares) {
                if (typeof middleware === 'function') {
                    // web function middleware
                    handlerCallback(middleware);
                }
                else {
                    const middlewareImpl = await this.applicationContext.getAsync(middleware);
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
    generateController(controllerMapping) {
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
        await this.loadSchedule();
        this.loadController();
    }
    prepareContext() {
        this.use(async (ctx, next) => {
            ctx.requestContext = new midway_core_1.MidwayRequestContainer(this.applicationContext, ctx);
            this.applicationContext.registerObject("requestContext", ctx.requestContext);
            await next();
        });
    }
    get applicationContext() {
        return this.loader.getApplicationContext();
    }
}
__decorate([
    decorators_1.config()
], ZonetkApplication.prototype, "rpc", void 0);
__decorate([
    decorators_1.logger()
], ZonetkApplication.prototype, "log", void 0);
exports.ZonetkApplication = ZonetkApplication;
//# sourceMappingURL=app.js.map