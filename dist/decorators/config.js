"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configFunc = require("config");
function config(str) {
    return (target, key) => {
        const configKey = str || key;
        const value = configFunc.get(configKey);
        target[key] = value;
    };
}
exports.config = config;
//# sourceMappingURL=config.js.map