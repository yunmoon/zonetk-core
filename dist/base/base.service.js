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
    findOne(options, tm) {
        return this.getRepository(tm).findOne(options);
    }
    findById(id, tm) {
        return this.getRepository(tm).findOne(id);
    }
    find(options, tm) {
        return this.getRepository(tm).find(options);
    }
    findAndCount(options, tm) {
        return this.getRepository(tm).findAndCount(options);
    }
    delete(options, tm) {
        return this.getRepository(tm).delete(options);
    }
    count(options, tm) {
        return this.getRepository(tm).count(options);
    }
    save(data, tm) {
        return this.getRepository(tm).save(data);
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