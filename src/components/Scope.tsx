import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { ScopeContext } from '../context';
import { queryObject } from '../dummy/queryObject';
import { useQueryParam, initQueryParams } from '../utils/query';

function ScopeChecker({ children }: PropsWithChildren<{}>) {
  const query = useQueryParam();

  if (query === undefined) {
    return null;
  }

  return <>{children}</>;
}

export interface ScopeProps {
  id: string;
}

export function Scope({ id, children }: PropsWithChildren<ScopeProps>) {
  useEffect(() => {
    initQueryParams(queryObject, id);
  }, [id]);

  return (
    <ScopeContext.Provider value={id}>
      <ScopeChecker>{children}</ScopeChecker>
    </ScopeContext.Provider>
  );
}
