import { BaseContext } from "koa";
export declare class BaseMiddleware {
    log: any;
    ctx: BaseContext;
    requestIdKey: any;
    getLogger(): any;
}
