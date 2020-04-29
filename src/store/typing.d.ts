import type { QueryObject } from '../typing';

export interface State {
  [scope: string]: QueryObject;
}
