import { useState, ReactText, useEffect } from 'react';
import {
  TablePaginationConfig,
  SorterResult,
  TableRowSelection,
} from 'antd/es/table/interface';
import { useQueryParam, setQueryParam, setQueryParams } from '../utils/query';
import { QueryObject } from '../typing';

const defaultPageSizeOptions = [10, 20, 50, 100];

export function useTablePagination(
  pageSizeOptions: number[] = defaultPageSizeOptions
): {
  pagination: TablePaginationConfig;
  page: number;
  size: number;
} {
  const { page, size } = useQueryParam();
  useEffect(() => {
    setQueryParam('size', pageSizeOptions[0]);
  }, [pageSizeOptions]);
  function handlePageChange(p: number, s?: number) {
    const changes: Partial<QueryObject> = {
      page: p - 1,
    };
    if (s !== undefined) {
      changes.size = s;
    }
    setQueryParams(changes);
  }
  function handleShowSizeChange(c: number, s: number) {
    setQueryParams({
      page: c - 1,
      size: s,
    });
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

export function updateSorter(s: SorterResult<any>) {
  setQueryParam('sorter', [s.field, s.order]);
}

export function useTableSelection<T = unknown>(): TableRowSelection<T> {
  const [keys, setKeys] = useState<ReactText[]>([]);
  return {
    selectedRowKeys: keys,
    onChange: setKeys,
  };
}
