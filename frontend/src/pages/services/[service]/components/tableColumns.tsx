/* eslint-disable jsx-a11y/anchor-is-valid */
import { Space } from 'antd';
import React from 'react';

const columns = [
  {
    title: 'Paciente',
    dataIndex: 'patientName',
    key: 'patientName',
  },
  {
    title: 'Produto',
    dataIndex: 'productId',
    key: 'productId',
  },
  {
    title: 'Data',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Editar</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
export default columns;
