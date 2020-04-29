import React, { ChangeEvent } from 'react';
import { Input } from 'antd';
import { useFilter } from '../../utils/filter';
import type { FilterInputProps } from '../../typing';

export interface TextFilterProps extends FilterInputProps {}

export function TextFilter({ field, title }: TextFilterProps) {
  const { filter, updateFilter } = useFilter();
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    updateFilter((draft) => {
      draft[field] = e.target.value;
    });
  }
  return (
    <Input
      allowClear
      alt={title}
      size="small"
      value={filter[field]}
      onChange={handleChange}
    />
  );
}
