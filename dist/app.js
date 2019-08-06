"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("@midwayjs/decorator");
const injection_1 = require("injection");
const midway_core_1 = require("midway-core");
const path_1 = require("path");
const KOAApplication = require("koa");
const Router = require("koa-router");
function isTypeScriptEnvironment() {
    return !!require.extensions['.ts'];
}
class ZonetkApplication extends KOAApplication {
    constructor(options = {}) {
        super();
        this.controllerIds = [];
        this.prioritySortRouters = [];
        this.appDir = options.baseDir || process.cwd();
        this.baseDir = this.getBaseDir();
        this.loader = new midway_core_1.ContainerLoader({
            baseDir: this.baseDir,
            isTsMode: true,
        });
        this.loader.initialize();
        this.loader.loadDirectory();
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
        this.loadController();
    }
    prepareContext() {
        this.use(async (ctx, next) => {
            ctx.requestContext = this.applicationContext.get('requestContext');
            ctx.requestContext.updateContext(ctx);
            await next();
        });
    }
    get applicationContext() {
        return this.loader.getApplicationContext();
    }
}
exports.ZonetkApplication = ZonetkApplication;
//# sourceMappingURL=app.js.map