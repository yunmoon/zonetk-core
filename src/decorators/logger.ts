import * as winston from "winston";
const appDir = process.cwd();
const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${appDir}/logs/output.log`
    })
  ]
});
export function logger(): PropertyDecorator {
  return (target: any, key: string) => {
    target[key] = winstonLogger
  }
}