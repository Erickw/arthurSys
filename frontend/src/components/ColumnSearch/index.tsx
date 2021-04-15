/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import React from 'react';

export const getColumnSearchProps = (dataIndex: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder="Procurar"
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={confirm}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={confirm}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : '',
  onFilterDropdownVisibleChange: visible => {
    if (visible) {
      setTimeout(() => 100);
    }
  },
});
