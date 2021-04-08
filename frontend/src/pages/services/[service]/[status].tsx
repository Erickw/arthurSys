/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Typography, Table, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import api from '../../../clients/api';

import { useAuth } from '../../../hooks/auth';
import DisplayRequestInfo from '../../../components/DisplayRequestInfo';

const { Title } = Typography;
const { confirm } = Modal;

interface ServiceProps {
  status: string;
  products?: ProductProps[];
}

export default function Service({
  status,
  products,
}: ServiceProps): JSX.Element {
  const [requests, setRequests] = useState<RequestProps[] | undefined>();
  const { user } = useAuth();
  const [tableIsLoading, setTableIsLoading] = useState(false);

  function deleteRequestModal(requestId: string) {
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

  useEffect(() => {
    setTableIsLoading(true);
    if (user.admin) {
      api.get(`/requests/${status}`).then(response => {
        setRequests(
          response.data.map(request => ({ ...request, key: request.id })),
        );
        setTableIsLoading(false);
      });
    } else {
      api.get(`/requests/${user.id}/${status}`).then(response => {
        setRequests(
          response.data.map(request => ({ ...request, key: request.id })),
        );
        setTableIsLoading(false);
      });
    }
  }, [status, user.admin, user.id]);

  const columns = [
    {
      title: 'Paciente',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Requisição',
      dataIndex: 'id',
      key: 'id',
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
      render: (date: Date) => (
        <span>{new Intl.DateTimeFormat('pt-BR').format(new Date(date))}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link href={`/edit-request/${record.id}`}>Editar</Link>
          <a onClick={() => deleteRequestModal(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>{status}</Title>
      <section>
        <Table
          columns={columns}
          dataSource={requests}
          loading={tableIsLoading}
          expandable={{
            expandedRowRender: (record: RequestProps) =>
              DisplayRequestInfo({
                request: record,
                product: products.find(
                  product => product.id === record.productId,
                ),
              }),
          }}
        />
      </section>
    </>
  );
}

Service.getInitialProps = async ({ query: { status } }) => {
  const productsFromApi = await api.get('/products');
  const products = productsFromApi.data;
  return { status, products };
};
