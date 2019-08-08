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
