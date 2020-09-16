import React from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { CommonFilter } from './CommonFilter';
import type { FilterInputProps } from '../../typing';

function parseValue(value: any): [Moment | null, Moment | null] | null {
  if (typeof value === 'string' && value.length > 0) {
    const [t1, t2] = value.split(',');
    return [
      t1 === '' ? null : moment(parseInt(t1, 10)),
      t2 === '' ? null : moment(parseInt(t2, 10)),
    ];
  }
  return null;
}

function parseChangeEvent(e: [Moment | null, Moment | null] | null) {
  if (e !== null) {
    return e
      .map((item: Moment | null) => (item === null ? '' : +item))
      .join(',');
  } else {
    return '';
  }
}

export interface DateRangeFilterProps extends FilterInputProps {
  timeFormat?: string;
  ranges?: {
    [name: string]: [Moment, Moment];
  };
}

const eventHandlerNames = ['onChange', 'onOk'];

export function DateRangeFilter({
  title,
  field,
  defaultValue,
  timeFormat = 'YYYY-MM-DD',
  ranges,
}: DateRangeFilterProps) {
  return (
    <CommonFilter
      title={title}
      field={field}
      defaultValue={defaultValue}
      eventHandlerNames={eventHandlerNames}
      parseChangeEvent={parseChangeEvent}
      parseValue={parseValue}
    >
      <DatePicker.RangePicker
        allowClear
        size="small"
        format={timeFormat}
        ranges={ranges}
      />
    </CommonFilter>
  );
}
