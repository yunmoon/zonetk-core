"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const moment = require("moment");
const DailyRotateFile = require("winston-daily-rotate-file");
const configFunc = require("config");
const appDir = process.cwd();
const { combine, timestamp, label, printf } = winston.format;
const level = configFunc.get("logLevel") || "info";
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
const transport = new DailyRotateFile({
    filename: 'output-%DATE%.log',
    dirname: `${appDir}/logs`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '15d'
});
const winstonLogger = winston.createLogger({
    level,
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