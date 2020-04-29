import produce from 'immer';
import { useContext } from 'react';
import { ScopeContext } from '../context';
import { useQueryParam, setQueryParams } from './query';
import type { QueryObject } from '../typing';

export function useFilter(): {
  filter: QueryObject['filter'];
  updateFilter: (updater: (draft: QueryObject['filter']) => void) => void;
} {
  const scope = useContext(ScopeContext);
  const { filter } = useQueryParam();

  function updateFilter(updater: (draft: QueryObject['filter']) => void) {
    const nextFilter = produce(filter, updater);

    setQueryParams(
      {
        filter: nextFilter,
        page: 0,
      },
      scope
    );
  }

  return {
    filter,
    updateFilter,
  };
}
