export interface WebMiddleware {
    resolve(): (context: any, next: () => Promise<any>) => any;
}
