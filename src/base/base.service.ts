import { Repository, getRepository, EntityManager, FindManyOptions, FindOneOptions, ObjectType, FindConditions } from "typeorm";
import { inject } from "injection";
import { logger, config } from "../decorators";
import { BaseContext } from "koa";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Logger } from "winston";

export class BaseService<T>{
  @inject()
  ctx: BaseContext;

  @inject()
  rpcRequestCall

  @logger()
  log: Logger

  @config("db")
  dbConfig

  repository: Repository<T>;

  @config()
  requestIdKey

  constructor(private entity: ObjectType<T>) {
    this.repository = getRepository(this.entity);
  }
  getLogger() {
    let requestId = "";
    if (this.ctx) {
      const requestIdKey = this.requestIdKey || "x-request-id";
      requestId = this.ctx.get(requestIdKey) || ""
    }
    if (!this.ctx && !requestId) {
      const rpcCall = this.rpcRequestCall
      if (rpcCall && rpcCall.request.headers) {
        requestId = rpcCall.request.headers[this.requestIdKey || "requestId"] || ""
      }
    }
    return this.log.child({ requestId: requestId });
  }
  getRepository(tm?: EntityManager) {
    let repository = this.repository;
    if (tm) {
      repository = tm.getRepository(this.entity);
    }
    repository.queryRunner.data.logger = this.getLogger();
    return repository;
  }
  findOne(options?: FindOneOptions<T>, tm?: EntityManager) {
    return this.getRepository(tm).findOne(options);
  }
  findById(id?: string | number, tm?: EntityManager) {
    return this.getRepository(tm).findOne(id);
  }
  findAll(options?: FindManyOptions<T>, tm?: EntityManager) {
    return this.getRepository(tm).find(options);
  }
  findAndCount(options?: FindManyOptions<T>, tm?: EntityManager) {
    return this.getRepository(tm).findAndCount(options);
  }
  delete(options: string | string[] | number | number[] | Date | Date[] | FindConditions<T>, tm?: EntityManager) {
    return this.getRepository(tm).delete(options)
  }
  count(options?: FindManyOptions<T>, tm?: EntityManager) {
    return this.getRepository(tm).count(options)
  }
  save(data, tm?: EntityManager) {
    return this.getRepository(tm).save(data);
  }
  update(where: FindConditions<T>, data: QueryDeepPartialEntity<T>, tm?: EntityManager) {
    return this.getRepository(tm).update(where, data);
  }
}