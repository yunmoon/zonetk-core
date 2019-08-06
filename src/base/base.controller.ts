import { getManager } from "typeorm";
import { logger } from "../decorators";
import { inject } from "injection";
export class BaseController {

  @logger()
  log

  @inject()
  ctx

  getLogger() {
    const requestId = this.ctx.get("request-id") || ""
    return this.log.child({ requestId });
  }
  transaction(doFunc) {
    return new Promise((resolve, reject) => {
      getManager().transaction(async tm => {
        const result = await doFunc(tm);
        resolve(result);
      }).catch(error => {
        reject(error);
      })
    })
  }
}