import { BaseContext } from "koa";
import { Logger } from "winston";
export declare class BaseMiddleware {
    log: Logger;
    ctx: BaseContext;
    requestIdKey: any;
    getLogger(): Logger;
}
