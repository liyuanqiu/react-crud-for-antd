import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { History } from 'history';

export interface QueryObjectOut {
  [key: string]: string | null;
}

export interface QueryObjectIn {
  [key: string]: string;
}

export function useQueryParam(key: string, defaultValue?: string) {
  const location = useLocation();
  return useMemo(() => {
    const usp = new URLSearchParams(location.search);
    const value = usp.get(key);
    if (value === null && defaultValue !== undefined) {
      return defaultValue;
    }
    return value;
  }, [location.search, key, defaultValue]);
}

export function useQueryParams(keys: string[]) {
  const location = useLocation();
  return useMemo(() => {
    const usp = new URLSearchParams(location.search);
    return keys.reduce<QueryObjectOut>(
      (acc, curr) => ({
        ...acc,
        [curr]: usp.get(curr),
      }),
      {}
    );
  }, [location.search, keys]);
}

export function useQueryParamAll(key: string) {
  const location = useLocation();
  return useMemo(() => {
    const usp = new URLSearchParams(location.search);
    return usp.getAll(key);
  }, [location.search, key]);
}

function updateSearch(history: History, search: URLSearchParams): void;
function updateSearch(history: History, search: string): void;
function updateSearch(history: History, search: URLSearchParams | string) {
  const __search =
    search instanceof URLSearchParams ? search.toString() : search;
  history.push({
    ...history.location,
    search: __search,
  });
}

export function updateQuery(history: History, params: QueryObjectIn) {
  const usp = new URLSearchParams(history.location.search);
  Object.entries(params).forEach(([key, value]) => {
    usp.set(key, value);
  });
  updateSearch(history, usp);
}

export function setQueryParamAll(
  history: History,
  key: string,
  values: string[]
) {
  const usp = new URLSearchParams(history.location.search);
  usp.delete(key);
  values.forEach(value => usp.append(key, value));
  updateSearch(history, usp);
}
