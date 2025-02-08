"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Transformer {
    resolve(item, includes) {
        if (_.isArray(item)) {
            return this.collection(item, includes);
        }
        return this.item(item, includes);
    }
}
exports.Transformer = Transformer;
//# sourceMappingURL=interface.js.map