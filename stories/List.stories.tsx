import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  AntdCrud,
  List,
  Filter,
  TextFilter,
  TextColumn,
  CustomColumn,
  BoolColumn,
  I18NContext,
  Scope,
} from '../src';
import type { I18N } from '../src';
import { dataProvider } from './JPADataProvider';

import 'antd/dist/antd.css';

const i18n: I18N = {
  filterTitle: 'Filter',
  filterFieldTitle: 'Fields',
  warning: 'Warning',
  deleteSuccess: 'Successfully deleted one record',
  deletePrompt:
    "You'll delete one record, this operation can't be reverted, sure to perform?",
  batchDeleteSuccess: 'Successfully deleted multiple records',
  batchDeletePrompt:
    "You'll delete multiple records, this operation can't be reverted, sure to perform?",
  handleColumnName: 'Handle',
  edit: 'Edit',
  delete: 'Delete',
  batchDelete: 'Batch Delete',
  export: 'Export',
  refreshData: 'Refresh Data',
  create: 'Create',
};

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

const dictionary = {
  false: '禁用',
  true: '启用',
};

export function Default() {
  return (
    <BrowserRouter>
      <Scope id="table1">
        <AntdCrud dataProvider={dataProvider}>
          <Filter>
            <TextFilter field="id" title="数据库ID" />
            <TextFilter field="name" title="规则名称" />
          </Filter>
          <List entity="logCountRule">
            <TextColumn title="数据库ID" field="id" sortable />
            <TextColumn title="规则名称" field="name" sortable />
            <CustomColumn title="规则名称2" dataIndex="name" sorter />
          </List>
        </AntdCrud>
      </Scope>
      <Scope id="table2">
        <I18NContext.Provider value={i18n}>
          <AntdCrud dataProvider={dataProvider}>
            <Filter>
              <TextFilter field="id" title="数据库ID" />
              <TextFilter field="name" title="规则名称" />
            </Filter>
            <List entity="logCountRule" enableSelect={false}>
              <TextColumn title="数据库ID" field="id" sortable />
              <TextColumn title="规则名称" field="name" sortable />
              <CustomColumn title="规则名称2" dataIndex="name" sorter />
              <BoolColumn title="状态" field="status" sortable />
              <BoolColumn
                title="状态"
                field="status"
                sortable
                dictionary={dictionary}
              />
            </List>
          </AntdCrud>
        </I18NContext.Provider>
      </Scope>
    </BrowserRouter>
  );
}
