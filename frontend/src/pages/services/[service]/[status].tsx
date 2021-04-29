/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Table, Space, Modal, Button, PageHeader, Card } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';
import api from '../../../clients/api';

import { useAuth } from '../../../hooks/auth';
import { getColumnSearchProps } from '../../../components/ColumnSearch';

const { confirm } = Modal;

interface ServiceProps {
  status: string;
}

export default function Service({ status }: ServiceProps): JSX.Element {
  const { push } = useRouter();
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

  function displayPageTitle() {
    if (status === 'novo') {
      return 'Requisições novas';
    }
    if (status === 'em-progresso') {
      return 'Requisições em andamento';
    }
    if (status === 'finalizada') {
      return 'Requisições finalizadas';
    }
    if (status === 'cancelada') {
      return 'Requisições canceladas';
    }

    return 'Requisições';
  }

  useEffect(() => {
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
  }, [status, user.admin, user.id]);

  const columns: ColumnsType<any> = [
    {
      title: 'Requisição',
      dataIndex: 'id',
      key: 'id',
      responsive: ['lg'],
      render: (request: string) => (
        <Button type="primary" onClick={() => push(`/request-info/${request}`)}>
          Vizualizar requisição
        </Button>
      ),
    },
    {
      title: () => {
        return typeof window !== 'undefined' && window.innerWidth < 991
          ? 'Paciente - Produto'
          : 'Paciente';
      },
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text, record) =>
        typeof window !== 'undefined' && window.innerWidth < 991 ? (
          <>
            {record.patientName}
            <br />
            {record.productName}
          </>
        ) : (
          record.patientName
        ),
      ...getColumnSearchProps('patientName'),
    },
    {
      title: 'Produto',
      dataIndex: 'productName',
      key: 'productName',
      responsive: ['lg'],
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
      responsive: ['sm'],
      render: (text, record) => (
        <Space size="middle">
          {typeof window !== 'undefined' && window.innerWidth < 991 && (
            <Link href={`/request-info/${record.id}`}>Requisição</Link>
          )}
          <Link href={`/edit-request/${record.id}`}>Editar</Link>
          <a onClick={() => deleteRequestModal(record.id)}>Deletar</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={displayPageTitle()}
        ghost={false}
        style={{ marginBottom: 24, minWidth: 450 }}
      />
      <Card bordered={false} style={{ minWidth: 450 }}>
        <Table
          columns={columns}
          dataSource={requests}
          loading={tableIsLoading}
        />
      </Card>
    </>
  );
}

Service.getInitialProps = async ({ query: { status } }) => {
  return { status };
};
