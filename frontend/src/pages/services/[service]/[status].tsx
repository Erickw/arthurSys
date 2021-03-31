/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Typography, Table, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../../clients/api';

const { Title } = Typography;
const { confirm } = Modal;

interface ServiceProps {
  title: string;
  data: RequestProps[] | undefined;
}

export default function Service({ title, data }: ServiceProps): JSX.Element {
  const [requests, setRequests] = useState<RequestProps[] | undefined>(data);

  function delteProductModal(requestId: string) {
    confirm({
      title: `Você tem certeza que deseja remover a solicitação ${requestId}`,
      icon: <ExclamationCircleOutlined />,
      content: 'Essa requisição será permanentemente removida do sistema.',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      async onOk() {
        await api.delete(`/requests/${requestId}`);
        setRequests(
          requests.filter(requestItem => requestItem.id !== requestId),
        );
      },
    });
  }

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
          <a onClick={() => delteProductModal(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>{title}</Title>
      <section>
        <Table columns={columns} dataSource={requests} />
      </section>
    </>
  );
}

Service.getInitialProps = async ({ query: { status } }) => {
  const response = await api.get(`requests/`);
  const product = response.data
    .filter(request => request.status === status)
    .map(requestItem => ({
      ...requestItem,
      key: requestItem.id,
    }));
  return { title: status, data: product };
};
