import { Repository, EntityManager, FindManyOptions, FindOneOptions, ObjectType, FindConditions } from "typeorm";
import { BaseContext } from "koa";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
export declare class BaseService<T> {
    private entity;
    ctx: BaseContext;
    log: any;
    dbConfig: any;
    repository: Repository<T>;
    requestId: any;
    constructor(entity: ObjectType<T>);
    updateRequestId(requestId: string): void;
    getLogger(): any;
    getRepository(tm?: EntityManager): Repository<T>;
    findOne(options?: FindOneOptions<T>, tm?: EntityManager): Promise<T>;
    findById(id?: string | number, tm?: EntityManager): Promise<T>;
    findAll(options?: FindManyOptions<T>, tm?: EntityManager): Promise<T[]>;
    findAndCount(options?: FindManyOptions<T>, tm?: EntityManager): Promise<[T[], number]>;
    delete(options: any, tm?: EntityManager): Promise<import("typeorm").DeleteResult>;
    count(options: FindManyOptions, tm?: EntityManager): Promise<number>;
    save(data: any, tm?: EntityManager): Promise<any>;
    update(where: FindConditions<T>, data: QueryDeepPartialEntity<T>, tm?: EntityManager): Promise<import("typeorm").UpdateResult>;
}
