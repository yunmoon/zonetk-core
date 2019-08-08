import * as _ from "lodash";
export interface WebMiddleware {
  resolve(): (context: any, next: () => Promise<any>) => any;
}

export interface ZonetkPlugin<T> {
  resolve(): T;
}

export abstract class Transformer {
  resolve(item: any | any[]): Promise<any> {
    if (_.isArray(item)) {
      return this.collection(item);
    }
    return this.item(item);
  };
  abstract item(item: any): Promise<any>;
  abstract collection(item: any[]): Promise<any>;
}