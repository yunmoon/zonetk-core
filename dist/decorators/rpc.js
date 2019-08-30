"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injection_1 = require("injection");
const constant_1 = require("../constant");
function rpcService() {
    return (target) => {
        injection_1.saveModule(constant_1.RPC_KEY, target);
    };
}
exports.rpcService = rpcService;
//# sourceMappingURL=rpc.js.map