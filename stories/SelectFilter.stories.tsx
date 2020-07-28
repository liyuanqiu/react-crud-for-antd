import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  AntdCrud,
  List,
  Filter,
  TextFilter,
  SelectFilter,
  TextColumn,
  Scope,
} from '../src';
import { dataProvider } from './JPADataProvider';

import 'antd/dist/antd.css';

export default {
  title: 'Select Filter',
};

export function Default() {
  const options = ['P1', 'P2', 'P3', 'P4', 'S1', 'S2', 'S3', 'S4', 'S5'];
  return (
    <BrowserRouter>
      <Scope id="select-filter">
        <AntdCrud dataProvider={dataProvider}>
          <Filter>
            <TextFilter field="id" title="数据库ID" />
            <TextFilter field="ruleName" title="规则名称" />
            <SelectFilter
              field="alarmLevel"
              title="报警等级"
              options={options}
            />
          </Filter>
          <List entity="rule/configprimary/list">
            <TextColumn title="数据库ID" field="id" sortable />
            <TextColumn title="规则名称" field="ruleName" sortable />
            <TextColumn title="报警等级" field="alarmLevel" sortable />
          </List>
        </AntdCrud>
      </Scope>
    </BrowserRouter>
  );
}

export function LabelValueOptions() {
  const options: {
    label: ReactNode;
    value: string | number;
  }[] = [
    { label: 'S1等级', value: 'S1' },
    { label: 'S2等级', value: 'S2' },
    { label: 'S3等级', value: 'S3' },
  ];
  return (
    <BrowserRouter>
      <Scope id="select-filter">
        <AntdCrud dataProvider={dataProvider}>
          <Filter>
            <TextFilter field="id" title="数据库ID" />
            <TextFilter field="ruleName" title="规则名称" />
            <SelectFilter
              field="alarmLevel"
              title="报警等级"
              options={options}
            />
          </Filter>
          <List entity="rule/configprimary/list">
            <TextColumn title="数据库ID" field="id" sortable />
            <TextColumn title="规则名称" field="ruleName" sortable />
            <TextColumn title="报警等级" field="alarmLevel" sortable />
          </List>
        </AntdCrud>
      </Scope>
    </BrowserRouter>
  );
}
