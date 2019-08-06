import { Repository, getRepository, EntityManager } from "typeorm";
import { inject } from "injection";
import { logger, config } from "../decorators";

export class BaseService {
  @inject()
  ctx;
  @logger()
  log
  @config("db")
  dbConfig
  repository: Repository<any>;

  constructor(private entity) {
    this.repository = getRepository(this.entity);
  }
  getLogger() {
    const requestId = this.ctx.get("request-id") || ""
    return this.log.child({ requestId });
  }
  getRepository(tm?: EntityManager) {
    let repository = this.repository;
    if (tm) {
      repository = tm.getRepository(this.entity);
    }
    return repository;
  }
  async findOne(where: any, tm?: EntityManager) {

    return await this.getRepository(tm).findOne(where)
  }
  async find(where, tm?: EntityManager) {
    return await this.getRepository(tm).find(where)
  }
  async save(data, tm?: EntityManager) {
    return await this.getRepository(tm).save(data, { data: { ctx: this.ctx } })
  }
}