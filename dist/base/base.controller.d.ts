export declare class BaseController {
    log: any;
    ctx: any;
    getLogger(): any;
    transaction(doFunc: any): Promise<unknown>;
}
