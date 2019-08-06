"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const injection_1 = require("injection");
const decorators_1 = require("../decorators");
class BaseService {
    constructor(entity) {
        this.entity = entity;
        this.repository = typeorm_1.getRepository(this.entity);
    }
    getLogger() {
        const requestId = this.ctx.get("request-id") || "";
        return this.log.child({ requestId });
    }
    getRepository(tm) {
        let repository = this.repository;
        if (tm) {
            repository = tm.getRepository(this.entity);
        }
        return repository;
    }
    async findOne(where, tm) {
        return await this.getRepository(tm).findOne(where);
    }
    async find(where, tm) {
        return await this.getRepository(tm).find(where);
    }
    async save(data, tm) {
        return await this.getRepository(tm).save(data, { data: { ctx: this.ctx } });
    }
}
__decorate([
    injection_1.inject()
], BaseService.prototype, "ctx", void 0);
__decorate([
    decorators_1.logger()
], BaseService.prototype, "log", void 0);
__decorate([
    decorators_1.config("db")
], BaseService.prototype, "dbConfig", void 0);
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map