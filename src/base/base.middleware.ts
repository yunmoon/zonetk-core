import { logger } from "../decorators";
import { Context } from "koa";

export class BaseMiddleware {
  @logger()
  log: any

  ctx: Context;

  getLogger() {
    const requestId = this.ctx.get("request-id") || ""
    return this.log.child({ requestId });
  }
}