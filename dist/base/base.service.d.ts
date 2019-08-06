import { Repository, EntityManager, FindManyOptions, FindOneOptions, ObjectType } from "typeorm";
export declare class BaseService<T> {
    private entity;
    ctx: any;
    log: any;
    dbConfig: any;
    repository: Repository<T>;
    constructor(entity: ObjectType<T>);
    getLogger(): any;
    getRepository(tm?: EntityManager): Repository<T>;
    findOne(options?: FindOneOptions<T>, tm?: EntityManager): Promise<T>;
    findById(id?: string | number, tm?: EntityManager): Promise<T>;
    find(options?: FindManyOptions<T>, tm?: EntityManager): Promise<T[]>;
    findAndCount(options?: FindManyOptions<T>, tm?: EntityManager): Promise<[T[], number]>;
    delete(options: any, tm?: EntityManager): Promise<import("typeorm").DeleteResult>;
    count(options: FindManyOptions, tm?: EntityManager): Promise<number>;
    save(data: any, tm?: EntityManager): Promise<any>;
}
