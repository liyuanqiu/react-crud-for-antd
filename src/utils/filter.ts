import produce from 'immer';
import { useContext, useMemo } from 'react';
import { ScopeContext } from '../context';
import { useQueryParam, setQueryParams } from './query';
import type { QueryObject } from '../typing';

export function useFilter(
  useScope?: string
): {
  filter: QueryObject['filter'];
  updateFilter: (updater: (draft: QueryObject['filter']) => void) => void;
} {
  const selfScope = useContext(ScopeContext);
  const scope = useMemo(() => useScope ?? selfScope, [useScope, selfScope]);
  const { filter } = useQueryParam(scope);

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
