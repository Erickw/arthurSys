import { Descriptions } from 'antd';
import React from 'react';
import { RequestInfo } from '../../styles/pages/request';

interface DisplayRequestInfoProps {
  request: RequestProps;
  product: ProductProps;
}

export default function DisplayRequestInfo({
  request,
  product,
}: DisplayRequestInfoProps): JSX.Element {
  function displayCorrectFormatData(item) {
    const data = item;
    if (data.slice(0, 38) === 'https://firebasestorage.googleapis.com') {
      return (
        <a href={data} target="_blank" rel="noreferrer">
          {data}
        </a>
      );
    }

    return data;
  }

  return (
    <RequestInfo>
      {product && (
        <Descriptions
          title="Produto"
          layout="vertical"
          bordered
          column={{ xxl: 12, xl: 8, lg: 5, md: 5, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Nome do produto">
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
      )}

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
            <Descriptions.Item label={item[0]}>
              {displayCorrectFormatData(item[1])}
            </Descriptions.Item>
          )),
        )}
      </Descriptions>
    </RequestInfo>
  );
}
