import { getManager, EntityManager } from "typeorm";
import { logger, config } from "../decorators";
import { Transformer } from "../interface";
import { inject } from "injection";
import { Logger } from "winston";
export class BaseRpcService {

  @logger()
  log: Logger

  @inject()
  getRpcCall: Function

  @config()
  requestIdKey

  getLogger() {
    let requestId = "";
    const rpcCall = this.getRpcCall()
    if (rpcCall && rpcCall.request.headers) {
      requestId = rpcCall.request.headers[this.requestIdKey || "requestId"] || ""
    }
    return this.log.child({ requestId: requestId });
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