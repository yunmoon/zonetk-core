"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const appDir = process.cwd();
const winstonLogger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: `${appDir}/logs/output.log`
        })
    ]
});
function logger() {
    return (target, key) => {
        target[key] = winstonLogger;
    };
}
exports.logger = logger;
//# sourceMappingURL=logger.js.map