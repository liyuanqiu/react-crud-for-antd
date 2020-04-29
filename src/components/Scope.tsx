import React, { PropsWithChildren, useEffect } from 'react';
import { ScopeContext } from '../context';
import { queryObject } from '../dummy/queryObject';
import { setQueryParams, useQueryParam } from '../utils/query';

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
    setQueryParams(queryObject, id);
  }, [id]);

  return (
    <ScopeContext.Provider value={id}>
      <ScopeChecker>{children}</ScopeChecker>
    </ScopeContext.Provider>
  );
}
