import { useState, useEffect, useContext } from 'react';
import type { ReactText } from 'react';
import type {
  TablePaginationConfig,
  SorterResult,
  TableRowSelection,
} from 'antd/es/table/interface';
import { useQueryParam, setQueryParam, setQueryParams } from '../utils/query';
import type { QueryObject } from '../typing';
import { ScopeContext } from '../context';

const defaultPageSizeOptions = [10, 20, 50, 100];

export function useTablePagination(
  pageSizeOptions: number[] = defaultPageSizeOptions
): {
  pagination: TablePaginationConfig;
  page: number;
  size: number;
} {
  const scope = useContext(ScopeContext);
  const { page, size } = useQueryParam();
  useEffect(() => {
    setQueryParam('size', pageSizeOptions[0], scope);
  }, [pageSizeOptions, scope]);
  function handlePageChange(p: number, s?: number) {
    const changes: Partial<QueryObject> = {
      page: p - 1,
    };
    if (s !== undefined) {
      changes.size = s;
    }
    setQueryParams(changes, scope);
  }
  function handleShowSizeChange(c: number, s: number) {
    setQueryParams(
      {
        page: c - 1,
        size: s,
      },
      scope
    );
  }
  return {
    pagination: {
      pageSize: size,
      pageSizeOptions: pageSizeOptions.map((item) => `${item}`),
      current: page + 1,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: handlePageChange,
      showTotal(total, [from, to]) {
        return `${from}~${to} of ${total}`;
      },
      onShowSizeChange: handleShowSizeChange,
    },
    page,
    size,
  };
}

export function useTableSorter() {
  const { sorter } = useQueryParam();
  return sorter;
}

export function updateSorter(s: SorterResult<any>, scope: string) {
  setQueryParam('sorter', [s.field, s.order], scope);
}

export function useTableSelection<T = unknown>(): TableRowSelection<T> {
  const [keys, setKeys] = useState<ReactText[]>([]);
  return {
    selectedRowKeys: keys,
    onChange: setKeys,
  };
}
