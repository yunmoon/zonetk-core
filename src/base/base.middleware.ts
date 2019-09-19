import { logger, config } from "../decorators";
import { BaseContext } from "koa";
import { Logger } from "winston";

export class BaseMiddleware {
  @logger()
  log: Logger

  ctx: BaseContext;

  @config()
  requestIdKey

  getLogger() {
    const requestIdKey = this.requestIdKey || "x-request-id";
    const requestId = this.ctx.get(requestIdKey) || ""
    return this.log.child({ requestId });
  }
}