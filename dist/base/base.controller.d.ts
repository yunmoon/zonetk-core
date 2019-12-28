import { EntityManager } from "typeorm";
import { Transformer } from "../interface";
import { Context } from "koa";
import { Logger } from "winston";
export declare class BaseController {
    log: Logger;
    ctx: Context;
    requestIdKey: any;
    getLogger(): Logger;
    transaction(doFunc: (tm: EntityManager) => any): Promise<unknown>;
    transform(item: any | any[], transformerObj: Transformer): Promise<any>;
}
