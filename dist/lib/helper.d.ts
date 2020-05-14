import { EntityManager } from "typeorm";
/**
 *
 * 获取数据库事务
 * @export
 * @param {(tm: EntityManager) => any} doFunc
 * @returns
 */
export declare function getTransaction(doFunc: (tm: EntityManager) => any): Promise<unknown>;
export declare function getAllMethods(obj: any): any[];
export declare function generateKeyFunc(methods: string[], obj: any, providerId?: string): any;
export declare function getScheduleRule(option: any): any;
