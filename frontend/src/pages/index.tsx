/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Typography, Table, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import api from '../clients/api';

import { useAuth } from '../hooks/auth';
import DisplayRequestInfo from '../components/DisplayRequestInfo';
import { getColumnSearchProps } from '../components/ColumnSearch';

const { Title } = Typography;
const { confirm } = Modal;

interface ServiceProps {
  status: string;
}

export default function Home({ status = 'novo' }: ServiceProps): JSX.Element {
  const [requests, setRequests] = useState<RequestProps[] | undefined>();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const { user, refreshToken } = useAuth();
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
    if (refreshToken) {
      setTableIsLoading(true);
      api.get('/products').then(response => setProducts(response.data));
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
    }
  }, [status]);

  const columns = [
    {
      title: 'Paciente',
      dataIndex: 'patientName',
      key: 'patientName',
      ...getColumnSearchProps('patientName'),
    },
    {
      title: 'Requisição',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Produto',
      dataIndex: 'productId',
      key: 'productId',
      ...getColumnSearchProps('productId'),
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      render: (date: Date) => (
        <span>{new Intl.DateTimeFormat('pt-BR').format(new Date(date))}</span>
      ),
    },
    {
      title: 'Opções',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link href={`/edit-request/${record.id}`}>Editar</Link>
          <a onClick={() => deleteRequestModal(record.id)}>Deletar</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>
        {status.charAt(0).toUpperCase() + status.substr(1)}
      </Title>
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
