import { GrpcFunction } from "../interface";
export declare function rpcService(args?: rpcServiceOptions): ClassDecorator;
export interface rpcServiceOptions {
    middlewares?: GrpcFunction[];
}
