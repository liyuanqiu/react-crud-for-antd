import React, { useContext, useEffect, useState } from 'react';
import { Select } from 'antd';
import type { Record } from 'ra-core';
import { DataProviderContext } from '../../context';
import { CommonFilter } from './CommonFilter';
import type { FilterInputProps } from '../../typing';

function parseChangeEvent(e: unknown) {
  return e;
}

export interface EntityFilterProps extends FilterInputProps {
  /* 目标 entity */
  target: string;
  /* 目标 entity 的哪个字段作为 select 的 label */
  labelField?: string;
  /* 目标 entity 的哪个字段作为 select 的 value */
  valueField: string;
  /* Select 的宽度 */
  width?: number;
  /* 同 antd Select 的 optionFilterProp */
  optionFilterProp?: string;
}

export function EntityFilter({
  field,
  title,
  target,
  labelField,
  valueField,
  defaultValue,
  optionFilterProp,
  width = 200,
}: EntityFilterProps) {
  const dataProvider = useContext(DataProviderContext);
  const [entities, setEntities] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    dataProvider
      .getList(target, {
        pagination: {
          page: 0,
          // may cause bugs
          perPage: 99999,
        },
        sort: { field: '', order: '' },
        filter: {},
      })
      .then((result) => setEntities(result.data))
      .finally(() => setLoading(false));
  }, [dataProvider, target]);

  return (
    <CommonFilter
      title={title}
      field={field}
      defaultValue={defaultValue}
      parseChangeEvent={parseChangeEvent}
    >
      <Select
        loading={loading}
        allowClear
        size="small"
        optionFilterProp={optionFilterProp}
        style={{
          width,
        }}
        showSearch
      >
        {entities.map((entity) => (
          <Select.Option value={entity[valueField]}>
            {entity[labelField ?? valueField]}
          </Select.Option>
        ))}
      </Select>
    </CommonFilter>
  );
}
