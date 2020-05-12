import type { ColumnProps } from 'antd/lib/table';

export interface ObjectMap {
  [key: string]: any;
}

export interface UrlParamNameMap {
  PAGE_PARAM_NAME: string;
  SIZE_PARAM_NAME: string;
  FILTER_PARAM_NAME: string;
  SORTER_PARAM_NAME: string;
}

export interface Options {
  /**
   * 是否同步参数到 URL
   * 由于 URL 只有一个，而一个页面可能存在多个实体的列表，所以不能全都往 URL 上同步参数
   */
  savingParamsToUrl?: boolean;
  /**
   * URL 参数的名称
   */
  urlParamNames?: UrlParamNameMap;
  /**
   * edit 的路由
   */
  editRoute?: (entity: string, id: number | string) => string;
  /**
   * add 的路由
   */
  addRoute?: (entity: string) => string;
  /**
   * clone 的路由
   */
  cloneRoute?: (entity: string, id: number | string) => string;
}

export interface QueryObject {
  page: number;
  size: number;
  filter: {
    [k: string]: any;
  };
  sorter: [string, ColumnProps<unknown>['sortOrder']];
}

export interface FilterInputProps {
  title: string;
  field: string;
}

export interface I18N {
  filterTitle: string;
  filterFieldTitle: string;
  warning: string;
  deleteSuccess: string;
  deletePrompt: string;
  batchDeleteSuccess: string;
  batchDeletePrompt: string;
  handleColumnName: string;
  edit: string;
  delete: string;
  batchDelete: string;
  export: string;
  refreshData: string;
  create: string;
  clone: string;
}
