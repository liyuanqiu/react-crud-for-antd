import React, { useMemo } from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons';

export interface BoolColumnProps {
  title: string;
  field: string;
  sortable?: boolean;
  dictionary?: {
    [k: string]: string;
  };
}

export function BoolColumn(
  //@ts-ignore
  props: BoolColumnProps
) {
  return null;
}

export function BoolField({
  value,
  dictionary,
}: {
  value: 0 | 1 | boolean;
  dictionary?: {
    [k: string]: string;
  };
}) {
  const { icon, color } = useMemo(() => {
    let _icon = null;
    let _color = 'gray';
    if (value === 1 || value === true) {
      _color = 'green';
      _icon =
        dictionary === undefined ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CheckCircleOutlined />
        );
    }
    if (value === 0 || value === false) {
      _color = 'red';
      _icon =
        dictionary === undefined ? (
          <CloseCircleTwoTone twoToneColor={_color} />
        ) : (
          <CloseCircleOutlined />
        );
    }
    return {
      icon: _icon,
      color: _color,
    };
  }, [value, dictionary]);
  if (dictionary !== undefined) {
    return (
      <Tag icon={icon} color={color}>
        {dictionary[`${value}`] ?? 'UNKNOWN'}
      </Tag>
    );
  }
  return icon;
}
