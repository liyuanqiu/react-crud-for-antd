import { applyMiddleware, Middleware } from 'redux';
import logger from 'redux-logger';
import {
  createStore,
  useSelector as useSelectorOrigin,
  Selector,
} from 'ez-react-redux';
import { State } from './typing';
import { queryObject } from '../dummy/queryObject';

const { NODE_ENV } = process.env;

const initialState: State = {
  queryObject,
};

const middlewares: Middleware[] = [];

if (NODE_ENV === 'development') {
  middlewares.push(logger);
}

const enhancer = applyMiddleware(...middlewares);

export const store = createStore(initialState, enhancer);

export function useSelector<VT = unknown>(selector: Selector<State, VT>) {
  return useSelectorOrigin(store, selector);
}
