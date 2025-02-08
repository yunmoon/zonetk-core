import schedule = require("node-schedule");
export interface WebMiddleware {
    resolve(): (context: any, next: () => Promise<any>) => any;
}
export interface ZonetkPlugin<T> {
    resolve(): T;
}
export declare abstract class Transformer {
    resolve(item: any | any[], includes?: string[]): Promise<any>;
    abstract item(item: any, includes?: string[]): Promise<any>;
    abstract collection(item: any[], includes?: string[]): Promise<any>;
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
    (call: any, callback: CallbackFunc, next?: Function): void;
}
export interface CallbackFunc {
    (error: Error, data: any): void;
}
