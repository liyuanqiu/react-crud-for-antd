import type { ColumnType } from 'antd/es/table';
import type { Record } from 'ra-core';

export interface CustomColumnProps {
  title: string;
  field: string;
  sortable?: boolean;
}

export function CustomColumn(
  // @ts-ignore
  props: ColumnType<Record>
) {
  return null;
}
