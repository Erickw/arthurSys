/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Menu,
  Checkbox,
  Dropdown,
  Tooltip,
} from 'antd';
import {
  DownOutlined,
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';
import { GetServerSideProps } from 'next';
import Cookies from 'js-cookie';
import api from '../clients/api';

import { getColumnSearchProps } from '../components/ColumnSearch';
import { getApiClient } from '../clients/axios';
import { useAuth } from '../hooks/auth';

const { confirm } = Modal;
interface ServiceProps {
  requestsFromApi: RequestProps[];
  isAdmin: boolean;
  dateSortOrder: 'ascend' | 'descend';
}

export default function Home({
  requestsFromApi,
  isAdmin,
  dateSortOrder,
}: ServiceProps): JSX.Element {
  const { push } = useRouter();
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestProps[] | undefined>();

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

  function handleChangeRequestStatus(
    requestToUpdate: RequestProps,
    statusToChange: string,
  ) {
    const requestUpdated = requestToUpdate;
    if (statusToChange === 'em-andamento') {
      requestUpdated.responsible = {
        id: user.id,
        name: user.name,
      };
    }
    api.put(`requests/${requestUpdated.id}`, {
      ...requestUpdated,
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
        key="aguardando-aprovacao"
        onClick={() =>
          handleChangeRequestStatus(request, 'aguardando-aprovacao')
        }
      >
        <Checkbox
          disabled={request.status === 'aguardando-aprovacao'}
          checked={request.status === 'aguardando-aprovacao'}
        >
          Aguardando Aprovação
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
          Em Andamento
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

  function handleDateOrder(sorter) {
    if (sorter.columnKey === 'date') {
      Cookies.set('ortoSetup.tableDateSortOrder', sorter.order);
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Requisição',
      dataIndex: 'id',
      key: 'id',
      responsive: ['lg'],
      render: (requestId: string, request: RequestProps) => (
        <Button
          type="primary"
          onClick={() => push(`/request-info/${requestId}`)}
          style={{ maxWidth: '162px' }}
        >
          Vizualizar requisição
          {((isAdmin && request?.hasNewCommentUser) ||
            (!isAdmin && request?.hasNewCommentAdmin)) && (
            <Tooltip title="Essa requisição tem um comentário não lido.">
              <ExclamationCircleTwoTone style={{ marginLeft: '1.7px' }} />
            </Tooltip>
          )}
        </Button>
      ),
    },
    {
      title: 'Solicitante',
      dataIndex: 'userName',
      key: 'userName',
      responsive: ['lg'],
      ...getColumnSearchProps('userName'),
    },
    {
      title: () => {
        return typeof window !== 'undefined' && window.innerWidth < 991
          ? 'Solicitante - Paciente - Produto'
          : 'Paciente';
      },
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text, record) =>
        typeof window !== 'undefined' && window.innerWidth < 991 ? (
          <>
            {record.userName}
            <br />
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
      defaultSortOrder: dateSortOrder,
      render: (date: Date) => (
        <span>{new Intl.DateTimeFormat('pt-BR').format(new Date(date))}</span>
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
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
    });
  } else {
    columns.push({
      title: 'Opções',
      key: 'action',
      responsive: ['sm'],
      render: (text, record) => (
        <Space size="middle">
          {typeof window !== 'undefined' && window.innerWidth < 991 && (
            <Link href={`/request-info/${record.id}`}>Requisição</Link>
          )}
          <Button
            onClick={() => handleChangeRequestStatus(record, 'finalizado')}
            style={{
              background: '#34a853',
              borderColor: '#34a853',
              color: 'white',
            }}
          >
            Aprovar solicitação
          </Button>
        </Space>
      ),
    });
  }

  useEffect(() => {
    setRequests(requestsFromApi);
  }, [requestsFromApi]);

  return (
    <>
      <PageHeader
        title="Requisições Novas"
        ghost={false}
        style={{ marginBottom: 24, minWidth: 450 }}
      />
      <Card bordered={false} style={{ minWidth: 450 }}>
        <Table
          columns={columns}
          dataSource={requests}
          onChange={(pagination, filters, sorter) => handleDateOrder(sorter)}
        />
      </Card>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const {
    'ortoSetup.token': token,
    'ortoSetup.user': userJson,
    'ortoSetup.tableDateSortOrder': dateSortOrderFromCookies,
  } = req.cookies;

  const dateSortOrder =
    dateSortOrderFromCookies === undefined ? null : dateSortOrderFromCookies;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const user = JSON.parse(userJson);

  const apiCLient = getApiClient(token);

  const productsResponse = await apiCLient.get('/products');

  const productsFromApi = productsResponse.data;

  if (user.type === 'admin' || user.type === 'cadista') {
    const requestsResponse = await apiCLient.get(`/requests/novo`);

    const requests = requestsResponse.data.map(request => ({
      ...request,
      key: request.id,
      productName: productsFromApi.find(
        product => product.id === request.productId,
      ).name,
    }));

    return {
      props: { requestsFromApi: requests, isAdmin: true, dateSortOrder },
    };
  }

  const requestsResponse = await apiCLient.get(`/requests/${user.id}/novo`);
  const requests = requestsResponse.data.map(request => ({
    ...request,
    key: request.id,
    productName: productsFromApi.find(
      product => product.id === request.productId,
    ).name,
  }));

  return {
    props: { requestsFromApi: requests, isAdmin: false, dateSortOrder },
  };
};
