import React, {
  useContext,
  useMemo,
  useCallback,
  isValidElement,
  Children,
  useEffect,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';
import type { PropsWithChildren } from 'react';
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
import {
  DataProviderContext,
  OptionsContext,
  I18NContext,
  ScopeContext,
} from '../context';
import { useErrorNotification } from '../utils/notification';
import { assert } from '../utils/common';
import { parse } from './columnParser';

export interface ListProps {
  entity: string;
  tableSize?: TableProps<Record>['size'];
  enableDelete?: boolean;
  enableEdit?: boolean;
  enableExport?: boolean;
  enableCreate?: boolean;
  enableSelect?: boolean;
  enableClone?: boolean;
  defaultSorter?: SorterResult<Record>;
  pageSizeOptions?: number[];
  idField?: string;
  // specify to use another scope's filter
  filterScope?: string;
  moreActions?(record: Record): ReactNode;
}

export interface ListRef {
  refresh(): Promise<boolean>;
}

const dummyData: any[] = [];

function ListCore(
  {
    entity,
    tableSize = 'small',
    enableDelete = true,
    enableEdit = true,
    enableExport = true,
    enableCreate = true,
    enableSelect = true,
    enableClone = true,
    idField = 'id',
    pageSizeOptions,
    defaultSorter,
    filterScope,
    moreActions,
    children,
  }: PropsWithChildren<ListProps>,
  ref: Ref<ListRef>
) {
  const i18n = useContext(I18NContext);
  const scope = useContext(ScopeContext);

  const history = useHistory();

  const { pagination, page, size } = useTablePagination(pageSizeOptions);
  const sorter = useTableSorter();
  const { filter } = useFilter(filterScope);
  const rowSelection = useTableSelection();

  const { editRoute, addRoute, cloneRoute } = useContext(OptionsContext);
  assert(
    editRoute !== undefined &&
      addRoute !== undefined &&
      cloneRoute !== undefined
  );

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

  useEffect(() => {
    if (defaultSorter !== undefined) {
      updateSorter(defaultSorter, scope);
    }
  }, [defaultSorter, scope]);

  const handleTableChange: TableProps<Record>['onChange'] = (_, __, s) => {
    if (
      sorter[0] === (s as SorterResult<Record>).field &&
      sorter[1] === (s as SorterResult<Record>).order
    ) {
      return;
    }
    updateSorter(s as SorterResult<Record>, scope);
  };

  const create = useCallback(() => {
    history.push(addRoute(entity));
  }, [addRoute, entity, history]);

  const edit = useCallback(
    (record: Record) => {
      history.push(editRoute(entity, record[idField]));
    },
    [editRoute, entity, history, idField]
  );

  const clone = useCallback(
    (record: Record) => {
      history.push(cloneRoute(entity, record[idField]));
    },
    [cloneRoute, entity, history, idField]
  );

  const remove = useCallback(
    async (record: Record) => {
      return dataProvider
        .delete(entity, {
          id: record[idField],
        })
        .then(({ data: deletedRecord }) => {
          return deletedRecord;
        });
    },
    [dataProvider, entity, idField]
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
      enableDelete || enableEdit || enableClone || moreActions
        ? [
            ...columns,
            {
              title: i18n.handleColumnName,
              key: '操作',
              render(_, record) {
                return (
                  <Space>
                    {enableClone ? (
                      <Button size="small" onClick={() => clone(record)}>
                        {i18n.clone}
                      </Button>
                    ) : null}
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
                    {moreActions ? moreActions(record) : null}
                  </Space>
                );
              },
            },
          ]
        : columns,
    [
      columns,
      edit,
      clone,
      removeWithInteractive,
      enableDelete,
      enableEdit,
      enableClone,
      i18n,
      moreActions,
    ]
  );

  function batchDelete() {
    batchRemoveWithInteractive(
      data?.data.filter((item) =>
        rowSelection.selectedRowKeys?.includes(item[idField] ?? false)
      ) ?? []
    );
  }

  useImperativeHandle(ref, () => ({
    refresh: revalidate,
  }));

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
          {enableExport ? (
            <Button disabled icon={<DownloadOutlined />}>
              {i18n.export}
            </Button>
          ) : null}
          <Button
            disabled={isValidating}
            icon={<RetweetOutlined />}
            onClick={revalidate}
          >
            {i18n.refreshData}
          </Button>
          {enableCreate ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={create}>
              {i18n.create}
            </Button>
          ) : null}
        </Space>
      </div>
      <div style={{ height: 4 }} />
      <Table
        rowKey={idField}
        size={tableSize}
        columns={_columns}
        dataSource={data?.data ?? dummyData}
        loading={isValidating}
        pagination={{
          ...pagination,
          total: data?.total ?? 0,
        }}
        rowSelection={enableSelect ? rowSelection : undefined}
        onChange={handleTableChange}
      />
    </div>
  );
}

export const List = forwardRef<ListRef, PropsWithChildren<ListProps>>(ListCore);
