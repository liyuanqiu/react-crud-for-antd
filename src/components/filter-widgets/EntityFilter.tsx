import React, { useContext, useEffect, useState } from 'react';
import { Select } from 'antd';
import type { Record } from 'ra-core';
import { useFilter } from '../../utils/filter';
import { DataProviderContext } from '../../context';
import { queryObject } from '../../dummy/queryObject';
import type { FilterInputProps } from '../../typing';

export interface EntityFilterProps extends FilterInputProps {
  /* 目标 entity */
  target: string;
  /* 目标 entity 的哪个字段作为 select 的 label */
  labelField?: string;
  /* 目标 entity 的哪个字段作为 select 的 value */
  valueField: string;
  /* Select 的宽度 */
  width?: number;
}

export function EntityFilter({
  field,
  target,
  labelField,
  valueField,
  width,
}: EntityFilterProps) {
  const dataProvider = useContext(DataProviderContext);
  const { filter, updateFilter } = useFilter();
  const [entities, setEntities] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    dataProvider
      .getList(target, {
        pagination: {
          page: -1,
          perPage: queryObject.size,
        },
        sort: { field: '', order: '' },
        filter: {},
      })
      .then((result) => setEntities(result.data))
      .finally(() => setLoading(false));
  }, [dataProvider, target]);
  function handleChange(e: unknown) {
    updateFilter((draft) => {
      draft[field] = e;
    });
  }

  return (
    <Select
      loading={loading}
      allowClear
      size="small"
      value={filter[field]}
      style={{
        width,
      }}
      showSearch
      onChange={handleChange}
    >
      {entities.map((entity) => (
        <Select.Option value={entity[valueField]}>
          {entity[labelField ?? valueField]}
        </Select.Option>
      ))}
    </Select>
  );
}
