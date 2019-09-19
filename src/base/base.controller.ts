import { getManager, EntityManager } from "typeorm";
import { logger, config } from "../decorators";
import { inject } from "injection";
import { Transformer } from "../interface";
import { BaseContext } from "koa";
import { Logger } from "winston";
export class BaseController {

  @logger()
  log: Logger

  @inject()
  ctx: BaseContext;

  @config()
  requestIdKey

  getLogger() {
    const requestIdKey = this.requestIdKey || "x-request-id";
    const requestId = this.ctx.get(requestIdKey) || ""
    return this.log.child({ requestId });
  }
  transaction(doFunc: (tm: EntityManager) => any) {
    return new Promise((resolve, reject) => {
      getManager().transaction(async tm => {
        const result = await doFunc(tm);
        resolve(result);
      }).catch(error => {
        reject(error);
      })
    })
  }
  async transform(item: any | any[], transformerObj: Transformer) {
    return await transformerObj.resolve(item)
  }
}