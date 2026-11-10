import { controller, get, post, put, del, patch, all } from '@midwayjs/decorator';
declare const Http: {
    get: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: import("@midwayjs/decorator").KoaMiddlewareParamArray<any>;
    }) => MethodDecorator;
    post: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: import("@midwayjs/decorator").KoaMiddlewareParamArray<any>;
    }) => MethodDecorator;
    put: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: import("@midwayjs/decorator").KoaMiddlewareParamArray<any>;
    }) => MethodDecorator;
    del: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: import("@midwayjs/decorator").KoaMiddlewareParamArray<any>;
    }) => MethodDecorator;
    patch: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: import("@midwayjs/decorator").KoaMiddlewareParamArray<any>;
    }) => MethodDecorator;
    all: (path?: string, routerOptions?: {
        routerName?: string;
        middleware?: import("@midwayjs/decorator").KoaMiddlewareParamArray<any>;
    }) => MethodDecorator;
};
export { controller, get, post, put, del, patch, all, Http };
