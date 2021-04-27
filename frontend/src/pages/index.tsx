/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Typography, Table, Space, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../clients/api';

import { useAuth } from '../hooks/auth';
import { getColumnSearchProps } from '../components/ColumnSearch';

const { Title } = Typography;
const { confirm } = Modal;

interface ServiceProps {
  status: string;
}

export default function Home({ status = 'novo' }: ServiceProps): JSX.Element {
  const { push } = useRouter();
  const [requests, setRequests] = useState<RequestProps[] | undefined>();
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
      api.get('/products').then(response => {
        const prodcutsFromApi = response.data;
        if (user.admin) {
          api.get(`/requests/${status}`).then(requestsresponse => {
            setRequests(
              requestsresponse.data.map(request => ({
                ...request,
                key: request.id,
                productName: prodcutsFromApi.find(
                  product => product.id === request.productId,
                ).name,
              })),
            );
            setTableIsLoading(false);
          });
        } else {
          api.get(`/requests/${user.id}/${status}`).then(requestsresponse => {
            setRequests(
              requestsresponse.data.map(request => ({
                ...request,
                key: request.id,
                productName: prodcutsFromApi.find(
                  product => product.id === request.productId,
                ).name,
              })),
            );
            setTableIsLoading(false);
          });
        }
      });
    }
  }, [status]);

  const columns = [
    {
      title: 'Requisição',
      dataIndex: 'id',
      key: 'id',
      render: (request: string) => (
        <Button type="primary" onClick={() => push(`/request-info/${request}`)}>
          Vizualizar requisição
        </Button>
      ),
    },
    {
      title: 'Paciente',
      dataIndex: 'patientName',
      key: 'patientName',
      ...getColumnSearchProps('patientName'),
    },
    {
      title: 'Produto',
      dataIndex: 'productName',
      key: 'productName',
      ...getColumnSearchProps('productName'),
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
      <Title level={2}>Requisições Novas</Title>
      <section>
        <Table
          columns={columns}
          dataSource={requests}
          loading={tableIsLoading}
        />
      </section>
    </>
  );
}
