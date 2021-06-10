import { Card, Descriptions, PageHeader } from 'antd';
import React from 'react';
import api from '../../clients/api';
import { convertSnakeCaseToNormal } from '../../utils/utils';
import Comments from './components/Comments';

import { RequestInfo as RequestDisplay } from '../../styles/pages/request';

interface CommentProps {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

interface RequestInfoParams {
  product: ProductProps;
  request: RequestProps;
  comments: CommentProps[];
}

export default function RequestInfo({
  product,
  request,
  comments,
}: RequestInfoParams): JSX.Element {
  function displayCorrectFormatData(item) {
    const data = item;
    if (Array.isArray(data)) {
      const test = data.map(file => {
        if (file.slice(0, 38) === 'https://firebasestorage.googleapis.com') {
          const fileName = file.substring(
            file.lastIndexOf('/') + 1,
            file.lastIndexOf('?'),
          );
          return (
            <div key={file}>
              <a href={file} target="_blank" rel="noreferrer">
                {fileName}
              </a>
              <br />
            </div>
          );
        }
        return <></>;
      });

      return test;
    }

    if (!Array.isArray(data) && data.substr(data.length - 1) === 'Z') {
      // verify if data pass is a date, if is a date return in date format
      try {
        const dateString = new Intl.DateTimeFormat('pt-br').format(
          new Date(data),
        );
        return dateString;
      } catch (err) {
        return data;
      }
    }

    return data;
  }
  return (
    <>
      <PageHeader
        title={`Requisição ${request.id}`}
        ghost={false}
        subTitle={product.name}
        style={{ marginBottom: 24, minWidth: 450 }}
      />
      <RequestDisplay>
        <Card bordered={false} style={{ minWidth: 450 }}>
          {product && (
            <Descriptions
              title="Produto"
              layout="vertical"
              bordered
              column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Nome do produto">
                {product.name}
              </Descriptions.Item>
              <Descriptions.Item label="Valor">
                {product.value}
              </Descriptions.Item>
              <Descriptions.Item label="Pagamento">
                {product.requiredPayment}
              </Descriptions.Item>
              <Descriptions.Item label="Disponibilidade">
                {product.available ? 'Disponível' : 'Indisponível'}
              </Descriptions.Item>
              <Descriptions.Item span={4} label="Descrição">
                {product.description}
              </Descriptions.Item>
              <Descriptions.Item span={4} label="Nota">
                {product.notes}
              </Descriptions.Item>
            </Descriptions>
          )}

          <Descriptions
            title="Endereço"
            layout="vertical"
            bordered
            column={{ xxl: 12, xl: 8, lg: 5, md: 3, sm: 2, xs: 1 }}
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
            column={{ xxl: 12, xl: 8, lg: 5, md: 3, sm: 2, xs: 1 }}
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
            column={{ xxl: 5, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            {request.fieldsValues.map(fieldValue =>
              Object.entries(fieldValue.fields).map(item => (
                <Descriptions.Item label={convertSnakeCaseToNormal(item[0])}>
                  {displayCorrectFormatData(item[1])}
                </Descriptions.Item>
              )),
            )}
          </Descriptions>
        </Card>
      </RequestDisplay>
      <Comments comments={comments} requestId={request.id} />
    </>
  );
}

RequestInfo.getInitialProps = async ({ query }) => {
  const { id } = query;
  const requestsFromApi = await api.get('/requests');
  const request = requestsFromApi.data.find(
    requestFromApi => requestFromApi.id === id,
  );
  const { data: product } = await api.get(`/products/${request.productId}`);
  const { data: comments } = await api.get(`/comments/request/${id}`);
  const commentsSorted = comments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return {
    request,
    product,
    comments: commentsSorted,
  };
};
