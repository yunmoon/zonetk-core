"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Transformer {
    resolve(item) {
        if (_.isArray(item)) {
            return this.collection(item);
        }
        return this.item(item);
    }
    ;
}
exports.Transformer = Transformer;
//# sourceMappingURL=interface.js.map