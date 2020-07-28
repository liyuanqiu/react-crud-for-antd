import React, {
  cloneElement,
  ReactNode,
  isValidElement,
  useMemo,
  useCallback,
} from 'react';
import { useFilter } from '../../utils/filter';
import type { FilterInputProps } from '../../typing';

export interface CommonFilterProps extends FilterInputProps {
  parseChangeEvent(e: any): unknown;
  parseValue?(value: any): unknown;
  eventHandlerNames?: string[];
  children: ReactNode;
}

export function CommonFilter({
  field,
  parseValue,
  parseChangeEvent,
  eventHandlerNames,
  children,
}: CommonFilterProps) {
  const { filter, updateFilter } = useFilter();
  const value = useMemo(() => {
    if (parseValue === undefined) {
      return filter[field];
    }
    return parseValue(filter[field]);
  }, [field, filter, parseValue]);
  const handleChange = useCallback(
    (e: unknown) => {
      updateFilter((draft) => {
        draft[field] = parseChangeEvent(e);
      });
    },
    [field, parseChangeEvent, updateFilter]
  );
  const appendedProps = useMemo(() => {
    const props: {
      [k: string]: any;
    } = {
      value,
    };
    (eventHandlerNames ?? ['onChange']).forEach((name) => {
      props[name] = handleChange;
    });
    return props;
  }, [eventHandlerNames, handleChange, value]);
  return (
    <>
      {isValidElement(children) ? cloneElement(children, appendedProps) : null}
    </>
  );
}
