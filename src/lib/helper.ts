import { getManager, EntityManager } from "typeorm";
import schedule = require("node-schedule");
import _ = require("lodash");
function _interval(intr, end = 60) {
  let i = 0,
    arr = [],
    res;
  while ((res = intr * i++) < end) {
    arr.push(res);
  }
  return arr;
}
const rpcClient = {};
/**
 *
 * 获取数据库事务
 * @export
 * @param {(tm: EntityManager) => any} doFunc
 * @returns
 */
export function getTransaction(doFunc: (tm: EntityManager) => any) {
  return new Promise((resolve, reject) => {
    getManager().transaction(async tm => {
      const result = await doFunc(tm);
      resolve(result);
    }).catch(error => {
      reject(error);
    })
  })
}
export function getAllMethods(obj) {
  let props = []
  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
      .sort()
      .filter((p, i, arr) => {
        return typeof obj[p] === 'function' &&  //only the methods
          p !== 'constructor' &&           //not the constructor
          (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
          props.indexOf(p) === -1
      }    //not overridden in a child
      )
    props = props.concat(l)
  }
  while (
    (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
    Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
  )
  return props
}
export function generateKeyFunc(methods: string[], obj, providerId?: string): any {
  const methodsObj = {}
  methods.forEach(item => {
    let methodKey = item;
    if (providerId) {
      methodKey = `${providerId}.${item}`;
    }
    methodsObj[methodKey] = obj[item].bind(obj);
  })
  return methodsObj;
}

export function setRpcClient(client: string, obj) {
  rpcClient[client] = obj;
}

export function getRpcClient(client: string) {
  return rpcClient[client];
}

export function getScheduleRule(option) {
  let rule = new schedule.RecurrenceRule();
  if (option.second !== undefined && option.second !== null) {
    rule.second = _.isArray(option.second) && option.second.length === 1 ? _interval(option.second) : option.second;
  }
  if (option.minute !== undefined && option.minute !== null) {
    rule.minute = _.isArray(option.minute) && option.minute.length === 1 ? _interval(option.minute) : option.minute;
  }
  if (option.hour !== undefined && option.hour !== null) {
    rule.hour = option.hour;
  }
  if (option.date !== undefined && option.date !== null) {
    rule.date = option.date;
  }
  if (option.month !== undefined && option.month !== null) {
    rule.month = option.month;
  }
  if (option.year !== undefined && option.year !== null) {
    rule.year = option.year;
  }
  if (option.dayOfWeek !== undefined && option.dayOfWeek !== null) {
    rule.dayOfWeek = option.dayOfWeek;
  }
  return rule;
}