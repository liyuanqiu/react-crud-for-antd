import { QueryObject } from '../typing';

export interface State {
  [scope: string]: QueryObject;
}
