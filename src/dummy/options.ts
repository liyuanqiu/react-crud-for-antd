import { join } from 'path';
import { Options } from '../typing';

const { PUBLIC_URL } = process.env;

export const options: Options = {
  savingParamsToUrl: false,
  urlParamNames: {
    PAGE_PARAM_NAME: '__page',
    SIZE_PARAM_NAME: '__size',
    FILTER_PARAM_NAME: '__filter',
    SORTER_PARAM_NAME: '__sorter',
  },
  editRoute(entity, id) {
    return join('/', `${PUBLIC_URL}`, entity, 'edit', `${id}`);
  },
  addRoute(entity) {
    return join('/', `${PUBLIC_URL}`, entity, 'add');
  },
};
