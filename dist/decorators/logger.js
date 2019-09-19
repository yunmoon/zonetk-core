"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const moment = require("moment");
const DailyRotateFile = require("winston-daily-rotate-file");
const configFunc = require("config");
const appDir = process.cwd();
const { combine, timestamp, label, printf } = winston.format;
const procIndex = !process.env.NODE_APP_INSTANCE ? 0 : process.env.NODE_APP_INSTANCE;
const logConfig = Object.assign({ level: "info", filename: 'output-%DATE%.log', dirname: `${appDir}/logs/${procIndex}`, datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '20m', maxFiles: '15d' }, configFunc.get("logger"));
const myFormat = printf((data) => {
    const { level, message, label, timestamp, requestId } = data;
    return JSON.stringify({
        level,
        requestId,
        data: message,
        appName: label,
        date: moment(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS")
    });
});
const transport = new DailyRotateFile(logConfig);
const winstonLogger = winston.createLogger({
    format: combine(label({ label: process.env.APP_NAME || "" }), timestamp(), myFormat),
    transports: [
        new winston.transports.Console(),
        transport
    ]
});
function logger() {
    return (target, key) => {
        target[key] = winstonLogger;
    };
}
exports.logger = logger;
//# sourceMappingURL=logger.js.map