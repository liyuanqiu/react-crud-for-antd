import React, { ChangeEvent } from 'react';
import { Input } from 'antd';
import { CommonFilter } from './CommonFilter';
import type { FilterInputProps } from '../../typing';

function parseChangeEvent(e: ChangeEvent<HTMLInputElement>) {
  return e.target.value;
}

export interface TextFilterProps extends FilterInputProps {}

export function TextFilter({ field, title, defaultValue }: TextFilterProps) {
  return (
    <CommonFilter
      title={title}
      field={field}
      defaultValue={defaultValue}
      parseChangeEvent={parseChangeEvent}
    >
      <Input allowClear size="small" />
    </CommonFilter>
  );
}
