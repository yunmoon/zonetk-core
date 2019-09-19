import { saveModule } from 'injection';
import { SCHEDULE_KEY } from '../constant'

export function schedule(): ClassDecorator {
  return (target: any) => {
    saveModule(SCHEDULE_KEY, target);
  }
}