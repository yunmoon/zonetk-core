import { Repository, EntityManager, FindManyOptions, FindOneOptions, ObjectType, FindConditions } from "typeorm";
import { BaseContext } from "koa";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Logger } from "winston";
export declare class BaseService<T> {
    private entity;
    ctx: BaseContext;
    log: Logger;
    dbConfig: any;
    repository: Repository<T>;
    requestIdKey: any;
    constructor(entity: ObjectType<T>);
    getLogger(): Logger;
    getRepository(tm?: EntityManager): Repository<T>;
    findOne(options?: FindOneOptions<T>, tm?: EntityManager): Promise<T>;
    findById(id?: string | number, tm?: EntityManager): Promise<T>;
    findAll(options?: FindManyOptions<T>, tm?: EntityManager): Promise<T[]>;
    findAndCount(options?: FindManyOptions<T>, tm?: EntityManager): Promise<[T[], number]>;
    delete(options: string | string[] | number | number[] | Date | Date[] | FindConditions<T>, tm?: EntityManager): Promise<import("typeorm").DeleteResult>;
    count(options?: FindManyOptions<T>, tm?: EntityManager): Promise<number>;
    save(data: any, tm?: EntityManager): Promise<any>;
    update(where: FindConditions<T>, data: QueryDeepPartialEntity<T>, tm?: EntityManager): Promise<import("typeorm").UpdateResult>;
}
