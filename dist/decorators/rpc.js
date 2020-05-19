"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injection_1 = require("injection");
const constant_1 = require("../constant");
const util_1 = require("util");
function rpcService(args) {
    const middlewares = args.middlewares || [];
    if (!Array.isArray(middlewares))
        throw new TypeError('Middleware stack must be an array!');
    for (const fn of middlewares) {
        if (typeof fn !== 'function')
            throw new TypeError('Middleware must be composed of functions!');
    }
    return (constructor) => {
        const prototypeKeys = Object.getOwnPropertyNames(constructor.prototype);
        for (const key of prototypeKeys) {
            if (key === "constructor")
                continue;
            const desc = Object.getOwnPropertyDescriptor(constructor.prototype, key);
            const method = desc.value;
            if (!util_1.isFunction(method)) {
                continue;
            }
            desc.value = function (call, callback) {
                const self = this;
                const args = arguments;
                let isLastFn = false;
                let index = -1;
                return dispatch(0);
                function dispatch(i) {
                    if (i <= index)
                        return Promise.reject(new Error('next() called multiple times'));
                    let fn = middlewares[i];
                    if (i === middlewares.length) {
                        fn = method;
                        isLastFn = true;
                    }
                    if (!fn) {
                        return Promise.resolve();
                    }
                    try {
                        if (!isLastFn) {
                            return Promise.resolve(fn(call, callback, dispatch.bind(null, i + 1)));
                        }
                        else {
                            return Promise.resolve(fn.apply(self, args));
                        }
                    }
                    catch (err) {
                        return Promise.reject(err);
                    }
                }
            };
            Object.defineProperty(constructor.prototype, key, desc);
        }
        injection_1.saveModule(constant_1.RPC_KEY, constructor);
    };
}
exports.rpcService = rpcService;
//# sourceMappingURL=rpc.js.map