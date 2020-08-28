/* 只维护指定的字段 */

import { useHistory } from 'react-router-dom';
import { useContext, useEffect, useMemo } from 'react';
import { useSelector, store } from '../store';
import type { QueryObject } from '../typing';
import { OptionsContext, ScopeContext } from '../context';
import { queryObject as defaultQueryObject } from '../dummy/queryObject';

/**
 * 从 store 中自动同步到 url
 */
export function useSyncFromStore() {
  const { urlParamNames } = useContext(OptionsContext);
  const scope = useContext(ScopeContext);
  const history = useHistory();
  const { page, size, filter, sorter } = useSelector((state) => state[scope]);
  useEffect(() => {
    if (urlParamNames === undefined) {
      return;
    }
    const usp = new URLSearchParams(history.location.search);
    if (page !== undefined) {
      usp.set(urlParamNames.PAGE_PARAM_NAME, serialize(page));
    }
    if (size !== undefined) {
      usp.set(urlParamNames.SIZE_PARAM_NAME, serialize(size));
    }
    if (filter !== undefined) {
      usp.set(urlParamNames.FILTER_PARAM_NAME, serialize(filter));
    }
    if (sorter !== undefined) {
      usp.set(urlParamNames.SORTER_PARAM_NAME, serialize(sorter));
    }
    history.push({
      ...history.location,
      search: usp.toString(),
    });
  }, [urlParamNames, page, size, filter, sorter, history]);
}

/**
 * 从 URL 初始化参数到 store
 */
export function useInitParamsFromUrl() {
  const { urlParamNames } = useContext(OptionsContext);
  const scope = useContext(ScopeContext);

  useEffect(() => {
    if (urlParamNames === undefined) {
      return;
    }
    const usp = new URLSearchParams(window.location.search);
    const page = usp.get(urlParamNames.PAGE_PARAM_NAME);
    const size = usp.get(urlParamNames.SIZE_PARAM_NAME);
    const filter = usp.get(urlParamNames.FILTER_PARAM_NAME);
    const sorter = usp.get(urlParamNames.SORTER_PARAM_NAME);
    store.dispatch({
      type: 'SYNC_QUERY_TO_STORE',
      updater(state) {
        state[scope] = {
          page: page === null ? defaultQueryObject.page : deserializePage(page),
          size: size === null ? defaultQueryObject.size : deserializeSize(size),
          filter:
            filter === null
              ? defaultQueryObject.filter
              : deserializeFilter(filter),
          sorter:
            sorter === null
              ? defaultQueryObject.sorter
              : deserializeSorter(sorter),
        };
      },
    });
  }, [urlParamNames, scope]);
}

/**
 * react hook 使用查询参数
 */
export function useQueryParam(useScope?: string) {
  const selfScope = useContext(ScopeContext);
  const scope = useMemo(() => useScope ?? selfScope, [useScope, selfScope]);
  return useSelector((state) => state[scope]);
}

/**
 * 一次性获取查询参数
 */
export function getQueryParam(scope: string) {
  return store.getState()[scope];
}

/**
 * 设置单个查询参数
 */
export function setQueryParam(
  name: keyof QueryObject,
  value: any,
  scope: string
) {
  store.dispatch({
    type: `SET_QUERY_PARAM_${name}`,
    updater(state) {
      if (state[scope] === undefined) {
        state[scope] = defaultQueryObject;
      }
      state[scope][name] = value;
    },
  });
}

/**
 * 设置多个查询参数
 */
export function setQueryParams(
  queryObject: Partial<QueryObject>,
  scope: string
) {
  store.dispatch({
    type: 'SET_QUERY_PARAMS',
    updater(state) {
      if (state[scope] === undefined) {
        state[scope] = defaultQueryObject;
      }
      state[scope] = {
        ...state[scope],
        ...queryObject,
      };
    },
  });
}

/**
 * 初始化QueryObject
 */
export function initQueryParams(queryObject: QueryObject, scope: string) {
  if (getQueryParam(scope) === undefined) {
    store.dispatch({
      type: 'INIT_QUERY_PARAMS',
      updater(state) {
        state[scope] = queryObject;
      },
    });
  }
}

function serialize(value: any) {
  return JSON.stringify(value);
}

function deserializePage(value: string) {
  return parseInt(value, 10);
}
function deserializeSize(value: string) {
  return parseInt(value, 10);
}
function deserializeFilter(value: string) {
  return JSON.parse(value);
}
function deserializeSorter(value: string) {
  return JSON.parse(value);
}
