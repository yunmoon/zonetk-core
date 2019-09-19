import * as winston from "winston";
import * as moment from "moment";
import * as DailyRotateFile from "winston-daily-rotate-file";
import * as configFunc from "config";

const appDir = process.cwd();
const { combine, timestamp, label, printf } = winston.format;
const procIndex = !process.env.NODE_APP_INSTANCE ? 0 : process.env.NODE_APP_INSTANCE;
const logConfig: DailyRotateFile.DailyRotateFileTransportOptions = {
  level: "info",
  filename: 'output-%DATE%.log',
  dirname: `${appDir}/logs/${procIndex}`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '15d',
  ...configFunc.get("logger")
};
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
  format: combine(
    label({ label: process.env.APP_NAME || "" }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console(),
    transport
  ]
});
export function logger(): PropertyDecorator {
  return (target: any, key: string) => {
    target[key] = winstonLogger
  }
}