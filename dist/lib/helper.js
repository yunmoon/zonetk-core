"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const schedule = require("node-schedule");
const _ = require("lodash");
function _interval(intr, end = 60) {
    let i = 0, arr = [], res;
    while ((res = intr * i++) < end) {
        arr.push(res);
    }
    return arr;
}
/**
 *
 * 获取数据库事务
 * @export
 * @param {(tm: EntityManager) => any} doFunc
 * @returns
 */
function getTransaction(doFunc) {
    return new Promise((resolve, reject) => {
        typeorm_1.getManager().transaction(async (tm) => {
            const result = await doFunc(tm);
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });
}
exports.getTransaction = getTransaction;
function getAllMethods(obj) {
    let props = [];
    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) => {
            return typeof obj[p] === 'function' && //only the methods
                p !== 'constructor' && //not the constructor
                (i == 0 || p !== arr[i - 1]) && //not overriding in this prototype
                props.indexOf(p) === -1;
        } //not overridden in a child
        );
        props = props.concat(l);
    } while ((obj = Object.getPrototypeOf(obj)) && //walk-up the prototype chain
        Object.getPrototypeOf(obj) //not the the Object prototype methods (hasOwnProperty, etc...)
    );
    return props;
}
exports.getAllMethods = getAllMethods;
function generateKeyFunc(methods, providerId) {
    const methodsObj = {};
    methods.forEach(item => {
        let methodKey = item;
        if (providerId) {
            methodKey = `${providerId}.${item}`;
        }
        methodsObj[methodKey] = item;
    });
    return methodsObj;
}
exports.generateKeyFunc = generateKeyFunc;
function getScheduleRule(option) {
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
exports.getScheduleRule = getScheduleRule;
//# sourceMappingURL=helper.js.map