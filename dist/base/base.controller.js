"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const decorators_1 = require("../decorators");
const injection_1 = require("injection");
class BaseController {
    getLogger() {
        const requestIdKey = this.requestIdKey || "x-request-id";
        const requestId = this.ctx.get(requestIdKey) || "";
        return this.log.child({ requestId });
    }
    transaction(doFunc) {
        return new Promise((resolve, reject) => {
            typeorm_1.getManager().transaction(async (tm) => {
                const result = await doFunc(tm);
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }
    async transform(item, transformerObj) {
        return await transformerObj.resolve(item);
    }
}
__decorate([
    decorators_1.logger()
], BaseController.prototype, "log", void 0);
__decorate([
    injection_1.inject()
], BaseController.prototype, "ctx", void 0);
__decorate([
    decorators_1.config()
], BaseController.prototype, "requestIdKey", void 0);
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map