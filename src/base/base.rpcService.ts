import { getManager, EntityManager } from "typeorm";
import { logger, config } from "../decorators";
import { Transformer } from "../interface";
import { Logger } from "winston";
export class BaseRpcService {

  @logger()
  log: Logger

  @config()
  requestIdKey

  getLogger(ctx) {
    const requestIdKey = this.requestIdKey || "x-request-id";
    const requestId = ctx.headers[requestIdKey] || ""
    return this.log.child({ requestId });
  }
  transaction(doFunc: (tm: EntityManager) => any) {
    return new Promise<any>((resolve, reject) => {
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