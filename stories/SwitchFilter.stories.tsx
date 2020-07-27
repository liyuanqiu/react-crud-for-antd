import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  AntdCrud,
  List,
  Filter,
  TextFilter,
  SwitchFilter,
  SwitchFilterProps,
  TextColumn,
  BoolColumn,
  Scope,
} from '../src';
import { dataProvider } from './JPADataProvider';

import 'antd/dist/antd.css';

export default {
  title: 'Switch Filter',
};

const statusDictionary = {
  1: '启用',
  0: '禁用',
};

const statusValueMapping: SwitchFilterProps['valueMapping'] = [
  {
    label: '禁用',
    value: 0,
  },
  {
    label: '启用',
    value: 1,
  },
];

export function Default() {
  return (
    <BrowserRouter>
      <Scope id="table1">
        <AntdCrud dataProvider={dataProvider}>
          <Filter>
            <TextFilter field="id" title="数据库ID" />
            <TextFilter field="ruleName" title="规则名称" />
            <SwitchFilter
              field="ruleStatus"
              title="状态"
              valueMapping={statusValueMapping}
            />
          </Filter>
          <List entity="rule/configprimary/list">
            <TextColumn title="数据库ID" field="id" sortable />
            <TextColumn title="规则名称" field="ruleName" sortable />
            <BoolColumn
              title="状态"
              field="ruleStatus"
              sortable
              dictionary={statusDictionary}
            />
          </List>
        </AntdCrud>
      </Scope>
    </BrowserRouter>
  );
}
