import * as _ from "lodash";
import schedule = require("node-schedule")
export interface WebMiddleware {
  resolve(): (context: any, next: () => Promise<any>) => any;
}

export interface ZonetkPlugin<T> {
  resolve(): T;
}

export abstract class Transformer {
  resolve(item: any | any[]): Promise<any> {
    if (_.isArray(item)) {
      return this.collection(item);
    }
    return this.item(item);
  };
  abstract item(item: any): Promise<any>;
  abstract collection(item: any[]): Promise<any>;
}
export interface ScheduleInterface {
  targetHost?: string | {
    [key: string]: string;
  };
  enable: boolean;
  pm2OneInstance: boolean;
  time: schedule.RecurrenceRule;
  resolve(): Promise<any>;
}

export interface GrpcFunction {
  (call, callback: CallbackFunc, next?: Function): void
}

export interface CallbackFunc {
  (error: Error, data: any): void
}