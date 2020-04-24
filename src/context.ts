import { createContext } from 'react';
import { dataProvider } from './dummy/dataProvider';
import { options } from './dummy/options';

export const DataProviderContext = createContext(dataProvider);

export const OptionsContext = createContext(options);
