import React, {
  useMemo,
  Children,
  isValidElement,
  useContext,
  useEffect,
} from 'react';
import type { PropsWithChildren } from 'react';
import { Card, Tag, Row, Col, Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useFilter } from '../utils/filter';
import { I18NContext, ScopeContext } from '../context';
import { store } from '../store';

export interface FilterProps {
  defaultSelectedKeys?: string[];
}

export function Filter({
  defaultSelectedKeys = [],
  children,
}: PropsWithChildren<FilterProps>) {
  const scope = useContext(ScopeContext);
  useEffect(() => {
    store.dispatch({
      type: 'SET_DEFALUT_SELECTED_KEYS',
      updater(state) {
        defaultSelectedKeys.forEach((key) => {
          if (state[scope].filter[key] === undefined) {
            state[scope].filter[key] = undefined;
          }
        });
      },
    });
  }, [defaultSelectedKeys, scope]);
  const { filter, updateFilter } = useFilter();
  const i18n = useContext(I18NContext);

  const filters = useMemo(() => {
    const __filters: {
      [key: string]: {
        field: string;
        title: string;
      };
    } = {};
    Children.forEach(children, (element) => {
      if (!isValidElement(element)) return;
      const { field, title } = element.props;
      __filters[field] = {
        field,
        title,
      };
    });
    return __filters;
  }, [children]);

  const selectedFields = useMemo(() => Object.keys(filter), [filter]);

  function handleSelectChange(keys: string[]) {
    updateFilter((draft) => {
      const currentKeys = Object.keys(draft);
      currentKeys
        .filter((key) => !keys.includes(key))
        .forEach((key) => {
          delete draft[key];
        });
      keys
        .filter((key) => !currentKeys.includes(key))
        .forEach((key) => {
          draft[key] = undefined;
        });
    });
  }

  return (
    <Card
      title={<Tag icon={<FilterOutlined />}>{i18n.filterTitle}</Tag>}
      bordered={false}
      extra={
        <Row gutter={8} style={{ width: 500 }}>
          <Col span={4}>{i18n.filterFieldTitle}:</Col>
          <Col span={20}>
            <Select<string[]>
              size="small"
              style={{ width: '100%' }}
              mode="multiple"
              allowClear
              value={selectedFields}
              onChange={handleSelectChange}
            >
              {Object.values(filters).map(({ field, title }) => (
                <Select.Option key={field} value={field}>
                  {title}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      }
    >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Children.map(children, (element) => {
          if (!isValidElement(element)) {
            return null;
          }
          const { field, title } = element.props;
          if (filter.hasOwnProperty(field)) {
            return (
              <div
                key={title}
                style={{ display: 'flex', padding: '8px 8px 0 8px' }}
              >
                <Space>
                  <div>{title}: </div>
                  <div>{element}</div>
                </Space>
              </div>
            );
          }
          return null;
        })}
      </div>
    </Card>
  );
}
