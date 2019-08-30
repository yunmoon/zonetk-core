import { logger, config } from "../decorators";
import { BaseContext } from "koa";

export class BaseMiddleware {
  @logger()
  log: any

  ctx: BaseContext;

  @config()
  requestIdKey

  getLogger() {
    const requestIdKey = this.requestIdKey || "x-request-id";
    const requestId = this.ctx.get(requestIdKey) || ""
    return this.log.child({ requestId });
  }
}