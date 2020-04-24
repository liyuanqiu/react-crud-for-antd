import produce from 'immer';
import { useQueryParam, setQueryParams } from './query';
import { QueryObject } from 'typing';

export function useFilter(): {
  filter: QueryObject['filter'];
  updateFilter: (updater: (draft: QueryObject['filter']) => void) => void;
} {
  const { filter } = useQueryParam();

  function updateFilter(updater: (draft: QueryObject['filter']) => void) {
    const nextFilter = produce(filter, updater);

    setQueryParams({
      filter: nextFilter,
      page: 0,
    });
  }

  return {
    filter,
    updateFilter,
  };
}
