import { Repository, getRepository, EntityManager, FindManyOptions, FindOneOptions, ObjectType, FindConditions } from "typeorm";
import { inject } from "injection";
import { logger, config } from "../decorators";
import { BaseContext } from "koa";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class BaseService<T>{
  @inject()
  ctx: BaseContext;
  @logger()
  log
  @config("db")
  dbConfig
  repository: Repository<T>;

  requestId

  constructor(private entity: ObjectType<T>) {
    this.repository = getRepository(this.entity);
  }
  updateRequestId(requestId: string) {
    this.requestId = requestId
  }
  getLogger() {
    if (this.ctx) {
      this.requestId = this.ctx.get("request-id") || ""
    }
    return this.log.child({ requestId: this.requestId });
  }
  getRepository(tm?: EntityManager) {
    let repository = this.repository;
    if (tm) {
      repository = tm.getRepository(this.entity);
    }
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
  delete(options, tm?: EntityManager) {
    return this.getRepository(tm).delete(options)
  }
  count(options: FindManyOptions, tm?: EntityManager) {
    return this.getRepository(tm).count(options)
  }
  save(data, tm?: EntityManager) {
    return this.getRepository(tm).save(data);
  }
  update(where: FindConditions<T>, data: QueryDeepPartialEntity<T>, tm?: EntityManager) {
    return this.getRepository(tm).update(where, data);
  }
}