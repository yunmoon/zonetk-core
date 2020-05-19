import { GrpcFunction } from "../interface";

export function rpcMiddleware(middlewares: GrpcFunction[]): MethodDecorator {
  if (!Array.isArray(middlewares)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (target, key, desc: any) {
    const method = desc.value;
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
  }
}