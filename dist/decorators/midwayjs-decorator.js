"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = exports.all = exports.patch = exports.del = exports.put = exports.post = exports.get = exports.controller = void 0;
const decorator_1 = require("@midwayjs/decorator");
Object.defineProperty(exports, "controller", { enumerable: true, get: function () { return decorator_1.controller; } });
Object.defineProperty(exports, "get", { enumerable: true, get: function () { return decorator_1.get; } });
Object.defineProperty(exports, "post", { enumerable: true, get: function () { return decorator_1.post; } });
Object.defineProperty(exports, "put", { enumerable: true, get: function () { return decorator_1.put; } });
Object.defineProperty(exports, "del", { enumerable: true, get: function () { return decorator_1.del; } });
Object.defineProperty(exports, "patch", { enumerable: true, get: function () { return decorator_1.patch; } });
Object.defineProperty(exports, "all", { enumerable: true, get: function () { return decorator_1.all; } });
const Http = {
    get: decorator_1.get,
    post: decorator_1.post,
    put: decorator_1.put,
    del: decorator_1.del,
    patch: decorator_1.patch,
    all: decorator_1.all
};
exports.Http = Http;
//# sourceMappingURL=midwayjs-decorator.js.map