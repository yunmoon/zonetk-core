import { logger } from "../decorators";
import { BaseContext } from "koa";

export class BaseMiddleware {
  @logger()
  log: any

  ctx: BaseContext;

  getLogger() {
    const requestId = this.ctx.get("request-id") || ""
    return this.log.child({ requestId });
  }
}