/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Typography, Table, Space, Modal, Descriptions } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import api from '../../../clients/api';

import { RequestInfo } from '../../../styles/pages/request';

const { Title } = Typography;
const { confirm } = Modal;

interface ServiceProps {
  title: string;
  data: RequestProps[] | undefined;
}

export default function Service({ title, data }: ServiceProps): JSX.Element {
  const [requests, setRequests] = useState<RequestProps[] | undefined>(data);

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
      render: ({ date }: RequestProps) => (
        <span>{new Intl.DateTimeFormat('pt-BR').format(date)}</span>
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

  function displayRequestInfo(request: RequestProps) {
    return (
      <RequestInfo>
        <Descriptions title="Endereço" size="default" column={8}>
          <Descriptions.Item label="Estado">
            {request.address.state}
          </Descriptions.Item>
          <Descriptions.Item label="Cidade">
            {request.address.city}
          </Descriptions.Item>
          <Descriptions.Item label="CEP">
            {request.address.postalCode}
          </Descriptions.Item>
          <Descriptions.Item label="Bairro">
            {request.address.district}
          </Descriptions.Item>
          <Descriptions.Item label="Rua">
            {request.address.street}
          </Descriptions.Item>
          <Descriptions.Item label="Número">
            {request.address.number}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions title="Requisção" size="default" column={8}>
          <Descriptions.Item label="Nome do paciente">
            {request.patientName}
          </Descriptions.Item>
          <Descriptions.Item label="Email do paciente">
            {request.patientEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Produto">
            {request.productId}
          </Descriptions.Item>
          <Descriptions.Item label="Data">
            {new Intl.DateTimeFormat('pt-br').format(new Date(request.date))}
          </Descriptions.Item>
        </Descriptions>
      </RequestInfo>
    );
  }

  return (
    <>
      <Title level={2}>{title}</Title>
      <section>
        <Table
          columns={columns}
          dataSource={requests}
          expandable={{
            expandedRowRender: record => displayRequestInfo(record),
          }}
        />
      </section>
    </>
  );
}

Service.getInitialProps = async ({ query: { status } }) => {
  const response = await api.get(`/requests`);
  const request = response.data
    .filter(requestFromApi => requestFromApi.status === status)
    .map(requestItem => ({
      ...requestItem,
      key: requestItem.id,
    }));
  return { title: status, data: request };
};
