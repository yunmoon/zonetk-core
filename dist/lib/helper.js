"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const rpcClient = {};
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
function generateKeyFunc(methods, obj, providerId) {
    const methodsObj = {};
    methods.forEach(item => {
        let methodKey = item;
        if (providerId) {
            methodKey = `${providerId}.${item}`;
        }
        methodsObj[methodKey] = obj[item].bind(obj);
    });
    return methodsObj;
}
exports.generateKeyFunc = generateKeyFunc;
function setRpcClient(client, obj) {
    rpcClient[client] = obj;
}
exports.setRpcClient = setRpcClient;
function getRpcClient(client) {
    return rpcClient[client];
}
exports.getRpcClient = getRpcClient;
//# sourceMappingURL=helper.js.map