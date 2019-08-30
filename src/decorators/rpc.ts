import { saveModule } from 'injection';
import { RPC_KEY } from '../constant'

export function rpcService(): ClassDecorator {
  return (target: any) => {
    saveModule(RPC_KEY, target);
  }
}