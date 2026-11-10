"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const configFunc = require("config");
function config(str) {
    return (target, key) => {
        const configKey = str || key;
        try {
            const value = configFunc.get(configKey);
            target[key] = value;
        }
        catch (error) {
            target[key] = null;
        }
    };
}
exports.config = config;
//# sourceMappingURL=config.js.map