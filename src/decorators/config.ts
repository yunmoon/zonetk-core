import * as configFunc from "config";
export function config(str?: string): PropertyDecorator {
  return (target: any, key: string) => {
    const configKey = str || key;
    try {
      const value = configFunc.get(configKey)
      target[key] = value
    } catch (error) {
      target[key] = null;
    }
  }
}