import { BaseContext } from "koa";
export declare class BaseMiddleware {
    log: any;
    ctx: BaseContext;
    getLogger(): any;
}
