import { controller, get, post, put, del, patch, all } from '@midwayjs/decorator';
declare const Http: {
    get: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: (string | import("@midwayjs/decorator").KoaMiddleware<any>)[];
    }) => MethodDecorator;
    post: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: (string | import("@midwayjs/decorator").KoaMiddleware<any>)[];
    }) => MethodDecorator;
    put: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: (string | import("@midwayjs/decorator").KoaMiddleware<any>)[];
    }) => MethodDecorator;
    del: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: (string | import("@midwayjs/decorator").KoaMiddleware<any>)[];
    }) => MethodDecorator;
    patch: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: (string | import("@midwayjs/decorator").KoaMiddleware<any>)[];
    }) => MethodDecorator;
    all: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: (string | import("@midwayjs/decorator").KoaMiddleware<any>)[];
    }) => MethodDecorator;
};
export { controller, get, post, put, del, patch, all, Http };
