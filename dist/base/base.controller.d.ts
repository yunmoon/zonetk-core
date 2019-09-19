import { EntityManager } from "typeorm";
import { Transformer } from "../interface";
import { BaseContext } from "koa";
import { Logger } from "winston";
export declare class BaseController {
    log: Logger;
    ctx: BaseContext;
    requestIdKey: any;
    getLogger(): Logger;
    transaction(doFunc: (tm: EntityManager) => any): Promise<unknown>;
    transform(item: any | any[], transformerObj: Transformer): Promise<any>;
}
