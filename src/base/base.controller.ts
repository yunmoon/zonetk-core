import { getManager, EntityManager } from "typeorm";
import { logger } from "../decorators";
import { inject } from "injection";
import { Transformer } from "../interface";
import { BaseContext } from "koa";
export class BaseController {

  @logger()
  log

  @inject()
  ctx: BaseContext;

  getLogger() {
    const requestId = this.ctx.get("request-id") || ""
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