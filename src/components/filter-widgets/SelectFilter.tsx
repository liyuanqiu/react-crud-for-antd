import React, { ReactNode } from 'react';
import { Select } from 'antd';
import { CommonFilter } from './CommonFilter';
import type { FilterInputProps } from '../../typing';

function parseChangeEvent(e: unknown) {
  return e;
}

export interface SelectFilterProps extends FilterInputProps {
  /* Select 的宽度 */
  width?: number;
  options: (
    | {
        label: ReactNode;
        value: string | number;
      }
    | string
    | number
  )[];
}

export function SelectFilter({
  field,
  title,
  defaultValue,
  width = 200,
  options,
}: SelectFilterProps) {
  return (
    <CommonFilter
      title={title}
      field={field}
      defaultValue={defaultValue}
      parseChangeEvent={parseChangeEvent}
    >
      <Select
        allowClear
        size="small"
        style={{
          width,
        }}
        showSearch
      >
        {options.map((option) => {
          if (typeof option === 'object') {
            return (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            );
          }
          return (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          );
        })}
      </Select>
    </CommonFilter>
  );
}
