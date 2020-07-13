import React, { useMemo } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useFilter } from '../../utils/filter';
import type { FilterInputProps } from '../../typing';

export interface TimeRangeFilterProps extends FilterInputProps {
  showTimeFormat?: string;
  timeFormat?: string;
}

export function TimeRangeFilter({
  field,
  showTimeFormat = 'HH:mm',
  timeFormat = 'YYYY-MM-DD HH:mm',
}: TimeRangeFilterProps) {
  const { filter, updateFilter } = useFilter();
  const value = useMemo<[Moment | null, Moment | null] | null>(() => {
    const fieldValue = filter[field];
    if (typeof fieldValue === 'string' && fieldValue.length > 0) {
      const [t1, t2] = filter[field].split(',');
      return [
        t1 === '' ? null : moment(parseInt(t1, 10)),
        t2 === '' ? null : moment(parseInt(t2, 10)),
      ];
    }
    return null;
  }, [filter, field]);
  function handleChange(e: [Moment | null, Moment | null] | null) {
    updateFilter((draft) => {
      if (e !== null) {
        draft[field] = e
          .map((item: Moment | null) => (item === null ? '' : +item))
          .join(',');
      } else {
        draft[field] = '';
      }
    });
  }
  return (
    <DatePicker.RangePicker
      allowClear
      size="small"
      showTime={{ format: showTimeFormat }}
      format={timeFormat}
      value={value}
      onChange={handleChange}
      onOk={handleChange}
    />
  );
}
