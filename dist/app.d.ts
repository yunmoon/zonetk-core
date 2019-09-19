import { ContainerLoader, MidwayContainer } from 'midway-core';
import * as KOAApplication from 'koa';
import { Logger } from 'winston';
export declare class ZonetkApplication extends KOAApplication {
    appDir: any;
    baseDir: any;
    loader: ContainerLoader;
    private controllerIds;
    private rpcServiceIds;
    private scheduleIds;
    private rpcFuncIds;
    private prioritySortRouters;
    rpc: any;
    log: Logger;
    constructor(options?: {
        baseDir?: string;
    });
    getBaseDir(): string;
    runRpcServer(): Promise<void>;
    loadRpcServiceFunc(): Promise<{}>;
    initRpcClient(): Promise<void>;
    loadSchedule(): Promise<void>;
    loadController(): Promise<void>;
    protected preRegisterRouter(target: any, controllerId: any): Promise<void>;
    private handlerWebMiddleware;
    /**
     * wrap controller string to middleware function
     * @param controllerMapping like xxxController.index
     */
    generateController(controllerMapping: string): (ctx: any, next: any) => Promise<any>;
    ready(): Promise<void>;
    private prepareContext;
    readonly applicationContext: MidwayContainer;
}
