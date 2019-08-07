"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const appDir = process.cwd();
function isTypeScriptEnvironment() {
    return !!require.extensions['.ts'];
}
function getBaseDir() {
    if (isTypeScriptEnvironment()) {
        return path.join(appDir, 'src');
    }
    else {
        return path.join(appDir, 'dist');
    }
}
function plugin(str) {
    return (target, key) => {
        const Plugin = require(path.join(getBaseDir(), "plugin", `${str}.plugin`)).default;
        if (!Plugin) {
            throw new Error(`${str} plugin require validate.`);
        }
        const instance = Plugin.getInstance();
        target[key] = instance.resolve();
    };
}
exports.plugin = plugin;
//# sourceMappingURL=plugin.js.map