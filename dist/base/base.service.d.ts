import { Repository, EntityManager } from "typeorm";
export declare class BaseService {
    private entity;
    ctx: any;
    log: any;
    dbConfig: any;
    repository: Repository<any>;
    constructor(entity: any);
    getLogger(): any;
    getRepository(tm?: EntityManager): Repository<any>;
    findOne(where: any, tm?: EntityManager): Promise<any>;
    find(where: any, tm?: EntityManager): Promise<any[]>;
    save(data: any, tm?: EntityManager): Promise<any>;
}
