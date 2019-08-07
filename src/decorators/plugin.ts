import * as path from "path";
import { ZonetkPlugin } from "../interface"
const appDir = process.cwd();
function isTypeScriptEnvironment() {
  return !!require.extensions['.ts'];
}
function getBaseDir() {
  if (isTypeScriptEnvironment()) {
    return path.join(appDir, 'src');
  } else {
    return path.join(appDir, 'dist');
  }
}
export function plugin(str?: string): PropertyDecorator {
  return (target: any, key: string) => {
    const Plugin = require(path.join(getBaseDir(), "plugin", `${str}.plugin`)).default;
    if (!Plugin) {
      throw new Error(`${str} plugin require validate.`)
    }
    const instance: ZonetkPlugin<any> = Plugin.getInstance();
    target[key] = instance.resolve();
  }
}