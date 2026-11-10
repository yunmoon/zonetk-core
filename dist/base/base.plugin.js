"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePlugin = void 0;
class BasePlugin {
    constructor() {
        if (BasePlugin.instance) {
            throw new Error("Error - use Class.getInstance()");
        }
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}
exports.BasePlugin = BasePlugin;
//# sourceMappingURL=base.plugin.js.map