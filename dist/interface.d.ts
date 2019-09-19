import schedule = require("node-schedule");
export interface WebMiddleware {
    resolve(): (context: any, next: () => Promise<any>) => any;
}
export interface ZonetkPlugin<T> {
    resolve(): T;
}
export declare abstract class Transformer {
    resolve(item: any | any[]): Promise<any>;
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
