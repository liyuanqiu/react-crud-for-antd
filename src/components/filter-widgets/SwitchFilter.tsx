import React from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useFilter } from '../../utils/filter';
import { assert } from '../../utils/common';
import type { FilterInputProps } from '../../typing';

export interface SwitchFilterProps extends FilterInputProps {
  valueMapping?: [
    {
      label: string;
      value: unknown;
    },
    {
      label: string;
      value: unknown;
    }
  ];
}

const dummyValueMapping: SwitchFilterProps['valueMapping'] = [
  {
    label: '否',
    value: false,
  },
  {
    label: '是',
    value: true,
  },
];

export function SwitchFilter({
  field,
  valueMapping = dummyValueMapping,
}: SwitchFilterProps) {
  const { filter, updateFilter } = useFilter();
  function handleChange(e: RadioChangeEvent) {
    updateFilter((draft) => {
      draft[field] = e.target.value;
    });
  }
  assert(valueMapping !== undefined);
  return (
    <Radio.Group
      size="small"
      value={filter[field]}
      onChange={handleChange}
      buttonStyle="solid"
    >
      <Radio.Button value={valueMapping[0].value}>
        {valueMapping[0].label}
      </Radio.Button>
      <Radio.Button value={valueMapping[1].value}>
        {valueMapping[1].label}
      </Radio.Button>
    </Radio.Group>
  );
}
