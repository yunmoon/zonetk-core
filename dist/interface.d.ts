export interface WebMiddleware {
    resolve(): (context: any, next: () => Promise<any>) => any;
}
export interface ZonetkPlugin<T> {
    resolve(): T;
}
