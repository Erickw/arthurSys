import { Descriptions } from 'antd';
import React from 'react';
import { RequestInfo } from '../../styles/pages/request';
import { convertSnakeCaseToNormal } from '../../utils/utils';

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
      const fileName = data.substring(
        data.lastIndexOf('/') + 1,
        data.lastIndexOf('?'),
      );
      return (
        <a href={data} target="_blank" rel="noreferrer">
          {fileName}
        </a>
      );
    }

    if (data.substr(data.length - 1) === 'Z') {
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
    <RequestInfo>
      {product && (
        <Descriptions
          title="Produto"
          layout="vertical"
          bordered
          column={{ xxl: 5, xl: 5, lg: 5, md: 5, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Nome do produto">
            {product.name}
          </Descriptions.Item>
          <Descriptions.Item label="Valor">{product.value}</Descriptions.Item>
          <Descriptions.Item label="Pagamento">
            {product.requiredPayment}
          </Descriptions.Item>
          <Descriptions.Item label="Nota">{product.notes}</Descriptions.Item>
          <Descriptions.Item label="Disponibilidade">
            {product.available ? 'Disponível' : 'Indisponível'}
          </Descriptions.Item>
          <Descriptions.Item span={5} label="Descrição">
            {product.description}
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
    </RequestInfo>
  );
}
