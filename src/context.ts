import { createContext } from 'react';
import { dataProvider } from './dummy/dataProvider';
import { options } from './dummy/options';
import { i18n } from './dummy/i18n';
import { scope } from './dummy/scope';

export const DataProviderContext = createContext(dataProvider);

export const OptionsContext = createContext(options);

export const I18NContext = createContext(i18n);

export const ScopeContext = createContext<string>(scope);
