"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injection_1 = require("injection");
const constant_1 = require("../constant");
function schedule() {
    return (target) => {
        injection_1.saveModule(constant_1.SCHEDULE_KEY, target);
    };
}
exports.schedule = schedule;
//# sourceMappingURL=schedule.js.map