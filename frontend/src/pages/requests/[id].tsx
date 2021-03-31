import { Button, Descriptions, Form, message, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import api from '../../clients/api';
import { useAuth } from '../../hooks/auth';
import AddressForm from './components/AddressForm';
import BankData from './components/BankData';
import PatientForm from './components/PatientForm';
import ProductDynamicForm from './components/ProductDynamicForm';

const { Title } = Typography;

type RequestProps = {
  product: ProductProps;
};

export default function Requests({ product }: RequestProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async data => {
      const request = data;
      request.userId = user.id;
      request.productId = product.id;
      request.status = 'novo';
      request.date = new Date();
      request.fields = JSON.stringify(
        request.fields.map((field, index) => ({
          title: product.fields[index].title,
          fields: { ...field },
        })),
      );
      setIsSubmitting(true);
      await api.post('/requests', request);
      setIsSubmitting(false);
      message.success(`Solicitação do ${product.name} criada com sucesso!`);
      push('/');
    },
    [product.fields, product.id, product.name, push, user.id],
  );

  return (
    <>
      <Title>Nova Solicitação</Title>
      <Form layout="vertical" onFinish={handleSubmit} style={{ width: '40%' }}>
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

Requests.getInitialProps = async ({ query: { id } }) => {
  const response = await api.get(`products/${id}`);
  const product = response.data;
  return { product };
};
