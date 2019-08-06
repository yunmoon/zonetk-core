import { ContainerLoader, MidwayContainer } from 'midway-core';
import * as KOAApplication from 'koa';
export declare class ZonetkApplication extends KOAApplication {
    appDir: any;
    baseDir: any;
    loader: ContainerLoader;
    private controllerIds;
    private prioritySortRouters;
    constructor(options?: {
        baseDir?: string;
    });
    getBaseDir(): string;
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
