"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const moment = require("moment");
const appDir = process.cwd();
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return JSON.stringify({
        level,
        data: message,
        appName: label,
        date: moment(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS")
    });
});
const winstonLogger = winston.createLogger({
    format: combine(label({ label: process.env.APP_NAME || "" }), timestamp(), myFormat),
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