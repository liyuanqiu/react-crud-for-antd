import React, { isValidElement } from 'react';
import type { ReactNode } from 'react';
import type { ColumnType } from 'antd/es/table';
import type { Record } from 'ra-core';
import { TextColumn } from './table-widgets/TextColumn';
import { BoolColumn, BoolField } from './table-widgets/BoolColumn';
import { CustomColumn } from './table-widgets/CustomColumn';
import { assert } from '../utils/common';

export function parse(node: ReactNode): ColumnType<Record> {
  assert(isValidElement(node));
  switch (node.type) {
    case TextColumn:
      return {
        title: node.props.title,
        key: node.props.field,
        dataIndex: node.props.field,
        sorter: node.props.sortable,
      };
    case BoolColumn:
      return {
        title: node.props.title,
        key: node.props.field,
        dataIndex: node.props.field,
        sorter: node.props.sortable,
        render(value) {
          return <BoolField value={value} dictionary={node.props.dictionary} />;
        },
      };
    case CustomColumn:
      return node.props;
    default:
      return {};
  }
}