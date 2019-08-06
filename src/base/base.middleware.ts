import { logger } from "../decorators";

export class BaseMiddleware {
  @logger()
  log: any

  ctx: any

  getLogger() {
    const requestId = this.ctx.get("request-id") || ""
    return this.log.child({ requestId });
  }
}