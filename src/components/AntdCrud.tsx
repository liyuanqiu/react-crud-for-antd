import React, { useMemo, PropsWithChildren } from 'react';
import type { Options } from '../typing';
import { OptionsContext, DataProviderContext } from '../context';
import { options as dummyOptions } from '../dummy/options';
import type { DataProvider } from 'ra-core';

export interface AntdCrudProps {
  options?: Options;
  /**
   * 数据源
   */
  dataProvider: DataProvider;
}

export function AntdCrud({
  options,
  dataProvider,
  children,
}: PropsWithChildren<AntdCrudProps>) {
  const __options = useMemo<Options>(
    () => ({
      ...dummyOptions,
      ...options,
    }),
    [options]
  );
  return (
    <OptionsContext.Provider value={__options}>
      <DataProviderContext.Provider value={dataProvider}>
        {children}
      </DataProviderContext.Provider>
    </OptionsContext.Provider>
  );
}
