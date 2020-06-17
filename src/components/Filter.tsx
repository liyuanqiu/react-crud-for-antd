import React, { useMemo, Children, isValidElement, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import { Descriptions, Card, Tag, Row, Col, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useFilter } from '../utils/filter';
import { I18NContext } from '../context';

export function Filter({ children }: PropsWithChildren<{}>) {
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
        <Row gutter={8} style={{ width: 300 }}>
          <Col span={6}>{i18n.filterFieldTitle}</Col>
          <Col span={18}>
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
      <Descriptions column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}>
        {Children.map(children, (element) => {
          if (!isValidElement(element)) {
            return null;
          }
          const { field, title } = element.props;
          if (filter.hasOwnProperty(field)) {
            return (
              <Descriptions.Item label={title}>{element}</Descriptions.Item>
            );
          }
          return null;
        })}
      </Descriptions>
    </Card>
  );
}
