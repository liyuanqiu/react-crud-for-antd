import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  AntdCrud,
  List,
  Filter,
  TextFilter,
  EntityFilter,
  TextColumn,
  Scope,
} from '../src';
import { dataProvider } from './JPADataProvider';

import 'antd/dist/antd.css';

export default {
  title: 'Entity Filter',
};

export function Default() {
  return (
    <BrowserRouter>
      <Scope id="table1">
        <AntdCrud dataProvider={dataProvider}>
          <Filter>
            <TextFilter field="id" title="数据库ID" />
            <TextFilter field="ruleName" title="规则名称" />
            <EntityFilter
              field="metricRefer"
              title="Metric"
              target="metric/simpleconfig/list"
              labelField="metricName"
              valueField="metricSeq"
              width={200}
            />
          </Filter>
          <List entity="rule/configprimary/list">
            <TextColumn title="数据库ID" field="id" sortable />
            <TextColumn title="规则名称" field="ruleName" sortable />
            <TextColumn title="Metric Id" field="metricRefer" sortable />
          </List>
        </AntdCrud>
      </Scope>
    </BrowserRouter>
  );
}
