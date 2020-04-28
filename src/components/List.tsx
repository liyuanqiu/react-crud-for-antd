import React, {
  useContext,
  useMemo,
  useCallback,
  PropsWithChildren,
  isValidElement,
  Children,
} from 'react';
import { Table, Space, Button, Modal } from 'antd';
import type { TableProps, ColumnsType } from 'antd/lib/table';
import useSWR from 'swr';
import type { SorterResult } from 'antd/lib/table/interface';
import { useHistory } from 'react-router-dom';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  RetweetOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { Record } from 'ra-core';
import {
  useTablePagination,
  useTableSorter,
  useTableSelection,
  updateSorter,
} from '../utils/table';
import { useFilter } from '../utils/filter';
import { DataProviderContext, OptionsContext, I18NContext } from '../context';
import { useErrorNotification } from '../utils/notification';
import { assert } from '../utils/common';
import { parse } from './columnParser';

export interface ListProps {
  entity: string;
  tableSize?: TableProps<Record>['size'];
  enableDelete?: boolean;
  enableEdit?: boolean;
  pageSizeOptions?: number[];
}

const dummyData: any[] = [];

export function List({
  entity,
  tableSize = 'small',
  enableDelete = true,
  enableEdit = true,
  pageSizeOptions,
  children,
}: PropsWithChildren<ListProps>) {
  const i18n = useContext(I18NContext);

  const history = useHistory();

  const { pagination, page, size } = useTablePagination(pageSizeOptions);
  const sorter = useTableSorter();
  const { filter } = useFilter();
  const rowSelection = useTableSelection();

  const { editRoute, addRoute } = useContext(OptionsContext);
  assert(editRoute !== undefined && addRoute !== undefined);

  const dataProvider = useContext(DataProviderContext);

  const { data, isValidating, error, revalidate } = useSWR(
    [entity, page, size, sorter, filter, dataProvider],
    () =>
      dataProvider.getList(entity, {
        pagination: {
          page,
          perPage: size,
        },
        sort:
          sorter[1] === undefined || sorter[1] === null
            ? { field: '', order: '' }
            : { field: sorter[0], order: sorter[1] },
        filter: Object.entries(filter).reduce((acc, [k, v]) => {
          if (v === undefined || v === '' || v === null) {
            return acc;
          }
          return {
            ...acc,
            [k]: v,
          };
        }, {}),
      }),
    {
      revalidateOnFocus: false,
    }
  );

  useErrorNotification(error);

  const handleTableChange: TableProps<Record>['onChange'] = (_, __, s) => {
    if (
      sorter[0] === (s as SorterResult<Record>).field &&
      sorter[1] === (s as SorterResult<Record>).order
    ) {
      return;
    }
    updateSorter(s as SorterResult<Record>);
  };

  const create = useCallback(() => {
    history.push(addRoute(entity));
  }, [addRoute, entity, history]);

  const edit = useCallback(
    (record: Record) => {
      history.push(editRoute(entity, record.id));
    },
    [editRoute, entity, history]
  );

  const remove = useCallback(
    async (record: Record) => {
      return dataProvider
        .delete(entity, {
          id: record.id,
        })
        .then(({ data: deletedRecord }) => {
          return deletedRecord;
        });
    },
    [dataProvider, entity]
  );

  const removeWithInteractive = useCallback(
    (record: Record) => {
      Modal.confirm({
        title: i18n.warning,
        content: i18n.deletePrompt,
        icon: <ExclamationCircleOutlined />,
        onOk() {
          remove(record).then((deletedRecord) => {
            if (deletedRecord !== undefined) {
              Modal.success({
                title: i18n.deleteSuccess,
                onOk() {
                  revalidate();
                },
              });
            }
          });
        },
      });
    },
    [remove, revalidate, i18n]
  );

  const batchRemoveWithInteractive = useCallback(
    (records: Record[]) => {
      Modal.confirm({
        title: i18n.warning,
        content: i18n.batchDeletePrompt,
        icon: <ExclamationCircleOutlined />,
        onOk() {
          Promise.all(records.map((record) => remove(record))).then(() => {
            Modal.success({
              title: i18n.batchDeleteSuccess,
              onOk() {
                revalidate();
              },
            });
          });
        },
      });
    },
    [remove, revalidate, i18n]
  );

  const columns = useMemo(() => {
    const __columns: ColumnsType<Record> = [];
    Children.forEach(children, (element) => {
      if (!isValidElement(element)) return;
      __columns.push(parse(element));
    });
    return __columns;
  }, [children]);

  const _columns = useMemo<ColumnsType<Record>>(
    () =>
      enableDelete || enableEdit
        ? [
            ...columns,
            {
              title: i18n.handleColumnName,
              key: '操作',
              render(_, record) {
                return (
                  <Space>
                    {enableEdit ? (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => edit(record)}
                      >
                        {i18n.edit}
                      </Button>
                    ) : null}
                    {enableDelete ? (
                      <Button
                        size="small"
                        type="danger"
                        onClick={() => removeWithInteractive(record)}
                      >
                        {i18n.delete}
                      </Button>
                    ) : null}
                  </Space>
                );
              },
            },
          ]
        : columns,
    [columns, edit, removeWithInteractive, enableDelete, enableEdit, i18n]
  );

  function batchDelete() {
    batchRemoveWithInteractive(
      data?.data.filter((item) =>
        rowSelection.selectedRowKeys?.includes(item.id ?? false)
      ) ?? []
    );
  }

  return (
    <div>
      <div
        style={{
          textAlign: 'right',
        }}
      >
        <Space>
          {enableDelete ? (
            <Button
              disabled={(rowSelection?.selectedRowKeys?.length ?? 0) === 0}
              icon={<DeleteOutlined />}
              danger
              onClick={batchDelete}
            >
              {i18n.batchDelete}
            </Button>
          ) : null}
          <Button disabled icon={<DownloadOutlined />}>
            {i18n.export}
          </Button>
          <Button
            disabled={isValidating}
            icon={<RetweetOutlined />}
            onClick={revalidate}
          >
            {i18n.refreshData}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={create}>
            {i18n.create}
          </Button>
        </Space>
      </div>
      <div style={{ height: 4 }} />
      <Table
        rowKey="id"
        size={tableSize}
        columns={_columns}
        dataSource={data?.data ?? dummyData}
        loading={isValidating}
        pagination={{
          ...pagination,
          total: data?.total ?? 0,
        }}
        rowSelection={rowSelection}
        onChange={handleTableChange}
      />
    </div>
  );
}
