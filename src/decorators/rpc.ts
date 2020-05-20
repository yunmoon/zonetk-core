import { saveModule } from 'injection';
import { RPC_KEY } from '../constant'
import { isFunction } from "util";
import { GrpcFunction } from "../interface";

export function rpcService(args?: rpcServiceOptions): ClassDecorator {
  const middlewares = (args && args.middlewares) || []
  if (!Array.isArray(middlewares)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return (constructor: any) => {
    const prototypeKeys = Object.getOwnPropertyNames(constructor.prototype)
    for (const key of prototypeKeys) {
      if (key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(constructor.prototype, key);
      const method = desc.value;
      if (!isFunction(method)) {
        continue;
      }
      desc.value = function (call, callback) {
        const self = this
        const args = arguments
        let isLastFn = false
        let index = -1
        return dispatch(0)
        function dispatch(i) {
          if (i <= index) return Promise.reject(new Error('next() called multiple times'))
          let fn = middlewares[i]
          if (i === middlewares.length) {
            fn = method
            isLastFn = true
          }
          if (!fn) {
            return Promise.resolve()
          }
          try {
            if (!isLastFn) {
              return Promise.resolve(fn(call, callback, dispatch.bind(null, i + 1)));
            } else {
              return Promise.resolve(fn.apply(self, args))
            }
          } catch (err) {
            return Promise.reject(err)
          }
        }
      }
      Object.defineProperty(constructor.prototype, key, desc)
    }
    saveModule(RPC_KEY, constructor);
  }
}

export interface rpcServiceOptions {
  middlewares?: GrpcFunction[]
}