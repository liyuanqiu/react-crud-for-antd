import { applyMiddleware } from 'redux';
import { Middleware } from 'redux';
import logger from 'redux-logger';
import { createStore, useSelector as useSelectorOrigin } from 'ez-react-redux';
import type { Selector } from 'ez-react-redux';
import type { State } from './typing';
import { queryObject } from '../dummy/queryObject';
import { scope } from '../dummy/scope';

const { NODE_ENV } = process.env;

const initialState: State = {
  [scope]: queryObject,
};

const middlewares: Middleware[] = [];

if (NODE_ENV === 'development') {
  middlewares.push(logger);
}

const enhancer = applyMiddleware(...middlewares);

export const store = createStore(initialState, enhancer);

if (NODE_ENV === 'development') {
  // @ts-ignore
  window.__react_crud_for_antd_store = store;
}

export function useSelector<VT = unknown>(selector: Selector<State, VT>) {
  return useSelectorOrigin(store, selector);
}
