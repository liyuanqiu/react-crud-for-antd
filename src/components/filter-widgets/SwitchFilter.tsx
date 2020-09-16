import React from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { assert } from '../../utils/common';
import { CommonFilter } from './CommonFilter';
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

function parseChangeEvent(e: RadioChangeEvent) {
  return e.target.value;
}

export function SwitchFilter({
  field,
  title,
  defaultValue,
  valueMapping = dummyValueMapping,
}: SwitchFilterProps) {
  assert(valueMapping !== undefined);
  return (
    <CommonFilter
      title={title}
      field={field}
      defaultValue={defaultValue}
      parseChangeEvent={parseChangeEvent}
    >
      <Radio.Group size="small" buttonStyle="solid">
        <Radio.Button value={valueMapping[0].value}>
          {valueMapping[0].label}
        </Radio.Button>
        <Radio.Button value={valueMapping[1].value}>
          {valueMapping[1].label}
        </Radio.Button>
      </Radio.Group>
    </CommonFilter>
  );
}
