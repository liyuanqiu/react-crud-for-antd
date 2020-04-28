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
import { DataProviderContext, OptionsContext } from '../context';
import { useErrorNotification } from '../utils/notification';
import { assert } from '../utils/common';
import { parse } from './columnParser';

export interface ListProps {
  entity: string;
  tableSize?: TableProps<Record>['size'];
  enableDelete?: boolean;
  pageSizeOptions?: number[];
}

const dummyData: any[] = [];

export function List({
  entity,
  tableSize = 'small',
  enableDelete = true,
  pageSizeOptions,
  children,
}: PropsWithChildren<ListProps>) {
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
        title: '警告',
        content: '您将删除一条配置，该操作无法撤销，确认执行？',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          remove(record).then((deletedRecord) => {
            if (deletedRecord !== undefined) {
              Modal.success({
                title: '删除成功',
                onOk() {
                  revalidate();
                },
              });
            }
          });
        },
      });
    },
    [remove, revalidate]
  );

  const batchRemoveWithInteractive = useCallback(
    (records: Record[]) => {
      Modal.confirm({
        title: '警告',
        content: '您将删除多条配置，该操作无法撤销，确认执行？',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          Promise.all(records.map((record) => remove(record))).then(() => {
            Modal.success({
              title: '批量删除成功',
              onOk() {
                revalidate();
              },
            });
          });
        },
      });
    },
    [remove, revalidate]
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
    () => [
      ...columns,
      {
        title: '操作',
        key: '操作',
        render(_, record) {
          return (
            <Space>
              <Button size="small" type="primary" onClick={() => edit(record)}>
                编辑
              </Button>
              {enableDelete ? (
                <Button
                  size="small"
                  type="danger"
                  onClick={() => removeWithInteractive(record)}
                >
                  删除
                </Button>
              ) : null}
            </Space>
          );
        },
      },
    ],
    [columns, edit, removeWithInteractive, enableDelete]
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
              批量删除
            </Button>
          ) : null}
          <Button disabled icon={<DownloadOutlined />}>
            导出
          </Button>
          <Button
            disabled={isValidating}
            icon={<RetweetOutlined />}
            onClick={revalidate}
          >
            刷新数据
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={create}>
            新建
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
