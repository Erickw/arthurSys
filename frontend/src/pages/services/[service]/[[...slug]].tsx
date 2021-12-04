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
import api from '../../../clients/api';

import { getColumnSearchProps } from '../../../components/ColumnSearch';
import { getApiClient } from '../../../clients/axios';
import { useAuth } from '../../../hooks/auth';

const { confirm } = Modal;

interface ServiceProps {
  status: string;
  requestsFromApi: RequestProps[];
  productName: string;
  isAdmin: boolean;
  dateSortOrder: 'ascend' | 'descend';
}

export default function Service({
  status,
  requestsFromApi,
  productName,
  isAdmin,
  dateSortOrder,
}: ServiceProps): JSX.Element {
  const { push } = useRouter();
  const { user } = useAuth();
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
      return `Requisições novas`;
    }
    if (status === 'aguardando-aprovacao') {
      return `Requisições aguardando aprovação`;
    }
    if (status === 'em-andamento') {
      return `Requisições em andamento`;
    }
    if (status === 'finalizado') {
      return `Requisições finalizadas`;
    }
    if (status === 'cancelado') {
      return `Requisições canceladas`;
    }

    return 'Requisições';
  }

  function handleChangeRequestStatus(
    requestToUpdate: RequestProps,
    statusToChange: string,
  ) {
    const requestUpdated = requestToUpdate;
    if (statusToChange === 'em-andamento') {
      requestUpdated.responsible.id = user.id;
      requestUpdated.responsible.name = user.name;
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="primary"
            onClick={() => push(`/request-info/${requestId}`)}
            style={{ maxWidth: '162px' }}
          >
            Vizualizar requisição
          </Button>
          {((isAdmin && !!request?.hasNewCommentUser) ||
            (!isAdmin && !!request?.hasNewCommentAdmin)) && (
            <Tooltip title="Essa requisição tem um comentário não lido.">
              <ExclamationCircleTwoTone
                twoToneColor="#fc0900"
                style={{ marginLeft: '5px' }}
              />
            </Tooltip>
          )}
        </div>
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
      title: 'Responsável',
      dataIndex: ['responsible', 'name'],
      key: 'responsible.name',
      responsive: ['lg'],
      ...getColumnSearchProps('responsible.name'),
      onFilter: (value: string, record) =>
        record.responsible.name
          ? record.responsible.name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
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
  } else if (status === 'novo') {
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
  }, [requestsFromApi, status]);

  return (
    <>
      <PageHeader
        title={displayPageTitle()}
        subTitle={productName}
        ghost={false}
        style={{ minWidth: 450 }}
      />
      <Card bordered={false} style={{ minWidth: 450 }}>
        <Table
          columns={columns}
          dataSource={requests}
          onChange={(pagination, filters, sorter) => handleDateOrder(sorter)}
          size="small"
        />
      </Card>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { slug } = query;

  const status = slug.length > 1 ? slug[1] : slug[0];
  const productId = slug.length > 1 ? slug[0] : undefined;

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

  const productsResponse = await apiCLient('/products');

  const productsFromApi = productsResponse.data;

  if (user.type === 'admin' || user.type === 'cadista') {
    const productName = productsFromApi.find(
      product => product.id === productId,
    ).name;

    const { data: requestsResponse } = await apiCLient(
      `/requestsbytypes/?productId=${productId}&status=${status}`,
    );

    const requests = requestsResponse.map(request => ({
      ...request,
      key: request.id,
      productName,
    }));

    // filter request for test
    const requestsWithoutTestRequest = requests.filter(
      request => request.id !== '11TY57BI',
    );

    return {
      props: {
        status,
        requestsFromApi: requestsWithoutTestRequest,
        productName,
        isAdmin: true,
        dateSortOrder,
      },
    };
  }

  const requestsResponse = await apiCLient(`/requests/${user.id}/${status}`);
  const requests = requestsResponse.data.map(request => ({
    ...request,
    key: request.id,
    productName: productsFromApi.find(
      product => product.id === request.productId,
    ).name,
  }));

  return {
    props: {
      status,
      requestsFromApi: requests,
      isAdmin: false,
      dateSortOrder,
    },
  };
};
