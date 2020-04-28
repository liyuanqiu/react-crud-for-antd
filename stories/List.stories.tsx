import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  AntdCrud,
  List,
  Filter,
  TextFilter,
  TextColumn,
  CustomColumn,
} from '..';
import { dataProvider } from './JPADataProvider';

import 'antd/dist/antd.css';
import type { ColumnsType } from 'antd/lib/table';

export default {
  title: 'List',
};

export interface SLSWorker {
  id: number;
  name: string;
  projectName: string;
  logstoreName: string;
  metricName: string;
  keyword: string;
  aggStr: string;
  queryInterval: number;
  cronExpression: string;
  status: boolean;
}

const columns: ColumnsType<SLSWorker> = [
  {
    dataIndex: 'id',
    title: '数据库ID',
    key: 'id',
  },
  {
    dataIndex: 'name',
    title: '规则名称',
    key: 'name',
  },
];

export function Default() {
  return (
    <BrowserRouter>
      <AntdCrud dataProvider={dataProvider}>
        <Filter>
          <TextFilter field="id" title="数据库ID" />
          <TextFilter field="name" title="规则名称" />
        </Filter>
        <List columns={columns} entity="logCountRule">
          <TextColumn title="数据库ID" field="id" sortable />
          <TextColumn title="规则名称" field="name" sortable />
          <CustomColumn title="规则名称2" key="name" dataIndex="name" sorter />
        </List>
      </AntdCrud>
    </BrowserRouter>
  );
}
