/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-assign */
import { Button, Descriptions, Form, message, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import api from '../../clients/api';
import { useAuth } from '../../hooks/auth';
import AddressForm from '../requests/components/AddressForm';
import PatientForm from '../requests/components/PatientForm';
import ProductDynamicForm from '../requests/components/ProductDynamicForm';

const { Title } = Typography;

interface DynamicValues {
  [x: string]: string;
}

type EditRequestProps = {
  product: ProductProps;
  request: RequestProps;
  dynamicValues: DynamicValues;
};

export default function EditRequest({
  product,
  request,
  dynamicValues,
}: EditRequestProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async data => {
      const requestToUpdate = data;
      requestToUpdate.id = request.id;
      requestToUpdate.userId = user.id;
      requestToUpdate.productId = product.id;
      requestToUpdate.status = 'novo';
      requestToUpdate.date = new Date();
      // requestToUpdate.fields = requestToUpdate.fields.map((field, index) => ({
      //  title: product.fields[index].title,
      //  fields: { ...field },
      // }));
      setIsSubmitting(true);
      await api.put(`/requests/${request.id}`, requestToUpdate);
      setIsSubmitting(false);
      message.success(`Solicitação do ${product.name} criada com sucesso!`);
      push('/');
    },
    [product.id, product.name, push, request.id, user.id],
  );

  return (
    <>
      <Title>Editar Solicitação</Title>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          patientName: request.patientName,
          patientEmail: request.patientEmail,
          status: request.status,
          date: request.date,
          address: {
            state: request.address.state,
            city: request.address.city,
            postalCode: request.address.postalCode,
            district: request.address.district,
            street: request.address.street,
            number: request.address.number,
            complement: request.address.complement,
          },
          fieldsValues: dynamicValues,
        }}
        style={{ width: '40%' }}
      >
        <h2>Dados bancários</h2>
        <Descriptions title="">
          <Descriptions.Item label="Indentificação">
            {product.bankInfo.identification}
          </Descriptions.Item>
          <Descriptions.Item label="Banco">
            {product.bankInfo.bank}
          </Descriptions.Item>
          <Descriptions.Item label="Agência">
            {product.bankInfo.agency}
          </Descriptions.Item>
          <Descriptions.Item label="Conta bancária">
            {product.bankInfo.bankAccount}
          </Descriptions.Item>
          <Descriptions.Item label="Valor">
            {new Intl.NumberFormat('pt-br', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.bankInfo.value)}
          </Descriptions.Item>
          {product.bankInfo.note && (
            <Descriptions.Item label="Nota">
              {product.bankInfo.note}
            </Descriptions.Item>
          )}
        </Descriptions>

        <h2>Dados do paciente</h2>

        <PatientForm />

        <ProductDynamicForm fields={product.fields} />

        <h2>Endereço</h2>

        <AddressForm />

        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Enviar
        </Button>
      </Form>
    </>
  );
}

EditRequest.getInitialProps = async ({ query: { id } }) => {
  const responseRequest = await api.get(`requests`);
  const request = responseRequest.data.find(
    requestItem => requestItem.id === id,
  );

  const responseProduct = await api.get(`products/${request.productId}`);
  const product = responseProduct.data;
  return { product, request };
};
