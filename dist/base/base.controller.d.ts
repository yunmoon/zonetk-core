import { EntityManager } from "typeorm";
import { Transformer } from "../interface";
import { BaseContext } from "koa";
export declare class BaseController {
    log: any;
    ctx: BaseContext;
    getLogger(): any;
    transaction(doFunc: (tm: EntityManager) => any): Promise<unknown>;
    transform(item: any | any[], transformerObj: Transformer): Promise<any>;
}
