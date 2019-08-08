import { EntityManager } from "typeorm";
import { Transformer } from "../interface";
export declare class BaseController {
    log: any;
    ctx: any;
    getLogger(): any;
    transaction(doFunc: (tm: EntityManager) => any): Promise<unknown>;
    transform(item: any | any[], transformerObj: Transformer): Promise<any>;
}
