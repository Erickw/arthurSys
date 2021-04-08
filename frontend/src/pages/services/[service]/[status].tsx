/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Typography, Table, Space, Modal, Descriptions } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import api from '../../../clients/api';

import { useAuth } from '../../../hooks/auth';
import { RequestInfo } from '../../../styles/pages/request';

const { Title } = Typography;
const { confirm } = Modal;

interface ServiceProps {
  status: string;
  products: ProductProps[];
}

export default function Service({
  status,
  products,
}: ServiceProps): JSX.Element {
  const [requests, setRequests] = useState<RequestProps[] | undefined>();
  const { user } = useAuth();

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

  function handleDisplayRequestInfo(
    request: RequestProps,
    product: ProductProps,
  ) {
    return (
      <RequestInfo>
        <Descriptions
          title="Produto"
          layout="vertical"
          bordered
          column={{ xxl: 12, xl: 8, lg: 5, md: 5, sm: 2, xs: 1 }}
        >
          <Descriptions.Item
            labelStyle={{ width: '130px', padding: '10px' }}
            label="Nome do produto"
          >
            {product.name}
          </Descriptions.Item>
          <Descriptions.Item label="Descrição">
            {product.description}
          </Descriptions.Item>
          <Descriptions.Item label="Valor">{product.value}</Descriptions.Item>
          <Descriptions.Item label="Pagamento">
            {product.requiredPayment}
          </Descriptions.Item>
          <Descriptions.Item label="Nota">{product.notes}</Descriptions.Item>
          <Descriptions.Item label="Disponibilidade">
            {product.available ? 'Disponível' : 'Indisponível'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title="Endereço"
          layout="vertical"
          bordered
          column={{ xxl: 12, xl: 8, lg: 5, md: 5, sm: 2, xs: 1 }}
        >
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

        <Descriptions
          title="Requisção"
          layout="vertical"
          bordered
          column={{ xxl: 12, xl: 8, lg: 5, md: 5, sm: 2, xs: 1 }}
        >
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

        <Descriptions
          title="Informações adicionais do produto"
          layout="vertical"
          bordered
          column={{ xxl: 12, xl: 8, lg: 5, md: 5, sm: 2, xs: 1 }}
        >
          {request.fieldsValues.map(fieldValue =>
            Object.entries(fieldValue.fields).map(item => (
              <Descriptions.Item label={item[0]}>{item[1]}</Descriptions.Item>
            )),
          )}
        </Descriptions>
      </RequestInfo>
    );
  }

  useEffect(() => {
    if (user.admin) {
      api
        .get(`/requests/${status}`)
        .then(response =>
          setRequests(
            response.data.map(request => ({ ...request, key: request.id })),
          ),
        );
    } else {
      api
        .get(`/requests/${user.id}/${status}`)
        .then(response =>
          setRequests(
            response.data.map(request => ({ ...request, key: request.id })),
          ),
        );
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

  return (
    <>
      <Title level={2}>{status}</Title>
      <section>
        <Table
          columns={columns}
          dataSource={requests}
          expandable={{
            expandedRowRender: (record: RequestProps) =>
              handleDisplayRequestInfo(
                record,
                products.find(product => product.id === record.productId),
              ),
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
