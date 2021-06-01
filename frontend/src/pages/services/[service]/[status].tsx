/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import {
  Table,
  Space,
  Modal,
  Button,
  PageHeader,
  Card,
  Dropdown,
  Menu,
  Checkbox,
} from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';
import { GetServerSideProps } from 'next';
import api from '../../../clients/api';

import { getColumnSearchProps } from '../../../components/ColumnSearch';

const { confirm } = Modal;

interface ServiceProps {
  status: string;
  requestsFromApi: RequestProps[];
}

export default function Service({
  status,
  requestsFromApi,
}: ServiceProps): JSX.Element {
  const { push } = useRouter();
  const [requests, setRequests] = useState<RequestProps[] | undefined>(
    requestsFromApi,
  );

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
    if (status === 'em-andamento') {
      return 'Requisições em andamento';
    }
    if (status === 'finalizado') {
      return 'Requisições finalizadas';
    }
    if (status === 'cancelado') {
      return 'Requisições canceladas';
    }

    return 'Requisições';
  }

  function handleChangeRequestStatus(
    requestToUpdate: RequestProps,
    statusToChange: string,
  ) {
    api.put(`requests/${requestToUpdate.id}`, {
      ...requestToUpdate,
      status: statusToChange,
    });
    setRequests(oldState =>
      oldState.filter(request => request.id !== requestToUpdate.id),
    );
  }

  const changeStatusDropdown = (request: RequestProps) => (
    <Menu>
      <Menu.Item
        key="novo"
        onClick={() => handleChangeRequestStatus(request, 'novo')}
      >
        <Checkbox
          disabled={request.status === 'novo'}
          checked={request.status === 'novo'}
        >
          Novo
        </Checkbox>
      </Menu.Item>
      <Menu.Item
        key="em-andamento"
        onClick={() => handleChangeRequestStatus(request, 'em-andamento')}
      >
        <Checkbox
          disabled={request.status === 'em-andamento'}
          checked={request.status === 'em-andamento'}
        >
          Em-Progresso
        </Checkbox>
      </Menu.Item>
      <Menu.Item
        key="finalizado"
        onClick={() => handleChangeRequestStatus(request, 'finalizado')}
      >
        <Checkbox
          disabled={request.status === 'finalizado'}
          checked={request.status === 'finalizado'}
        >
          Finalizado
        </Checkbox>
      </Menu.Item>
      <Menu.Item
        key="cancelado"
        onClick={() => handleChangeRequestStatus(request, 'cancelado')}
      >
        <Checkbox
          disabled={request.status === 'cancelado'}
          checked={request.status === 'cancelado'}
        >
          Cancelado
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

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
          <Dropdown overlay={changeStatusDropdown(record)} trigger={['click']}>
            <a>
              Alterar status <DownOutlined />
            </a>
          </Dropdown>
          <a onClick={() => deleteRequestModal(record.id)}>Deletar</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setRequests(requestsFromApi);
  }, [requestsFromApi, status]);

  return (
    <>
      <PageHeader
        title={displayPageTitle()}
        ghost={false}
        style={{ marginBottom: 24, minWidth: 450 }}
      />
      <Card bordered={false} style={{ minWidth: 450 }}>
        <Table columns={columns} dataSource={requests} />
      </Card>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { status },
}) => {
  const { token } = req.cookies;
  const user = JSON.parse(req.cookies.user);

  const productsResponse = await api.get('/products', {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  const productsFromApi = productsResponse.data;

  if (user.admin) {
    const requestsResponse = await api.get(`/requests/${status}`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    const requests = requestsResponse.data.map(request => ({
      ...request,
      key: request.id,
      productName: productsFromApi.find(
        product => product.id === request.productId,
      ).name,
    }));
    return {
      props: { status, requestsFromApi: requests },
    };
  }

  const requestsResponse = await api.get(`/requests/${user.id}/${status}`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  const requests = requestsResponse.data.map(request => ({
    ...request,
    key: request.id,
    productName: productsFromApi.find(
      product => product.id === request.productId,
    ).name,
  }));

  return {
    props: { status, requestsFromApi: requests },
  };
};
