import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  message,
  PageHeader,
  Row,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import api from '../../clients/api';
import { useAuth } from '../../hooks/auth';
import AddressForm from './components/AddressForm';
import PatientForm from './components/PatientForm';
import ProductDynamicForm from './components/ProductDynamicForm';

type RequestProps = {
  product: ProductProps;
};

export default function Requests({ product }: RequestProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();
  const { user } = useAuth();
  const [form] = useForm();

  const handleSubmit = useCallback(
    async data => {
      const request = data;
      request.userId = user.id;
      request.productId = product.id;
      request.status = 'novo';
      request.date = new Date();
      request.fieldsValues = request.fieldsValues.map((field, index) => ({
        title: product.fields[index].title,
        fields: { ...field },
      }));

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
      <PageHeader
        title="Nova Solicitação"
        ghost={false}
        style={{ marginBottom: 20, minWidth: 450 }}
        subTitle={product.name}
      >
        <Descriptions
          title="Dados bancários"
          column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item
            label="Indentificação"
            labelStyle={{ fontWeight: 600 }}
          >
            {product.bankInfo.identification}
          </Descriptions.Item>
          <Descriptions.Item label="Banco" labelStyle={{ fontWeight: 600 }}>
            {product.bankInfo.bank}
          </Descriptions.Item>
          <Descriptions.Item label="Agência" labelStyle={{ fontWeight: 600 }}>
            {product.bankInfo.agency}
          </Descriptions.Item>
          <Descriptions.Item
            label="Conta bancária"
            labelStyle={{ fontWeight: 600 }}
          >
            {product.bankInfo.bankAccount}
          </Descriptions.Item>
          {product.bankInfo.note && (
            <Descriptions.Item label="Nota" labelStyle={{ fontWeight: 600 }}>
              {product.bankInfo.note}
            </Descriptions.Item>
          )}
        </Descriptions>

        <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>Observações</h3>
        <p style={{ whiteSpace: 'break-spaces' }}>{product.notes}</p>
      </PageHeader>
      <Card bordered={false} style={{ minWidth: 450 }}>
        <Row>
          <Col xxl={12} xl={16} lg={22} md={24} sm={24} xs={24}>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <h2>Dados do paciente</h2>
              <PatientForm />
              <ProductDynamicForm
                form={form}
                fields={product.fields}
                onUpdateFile={(
                  url: string,
                  index: number,
                  fieldItemName: string,
                ) => {
                  const { fieldsValues } = form.getFieldsValue();
                  fieldsValues[index][fieldItemName] = url;
                  form.setFieldsValue({ fieldsValues });
                }}
              />
              <h2>Endereço</h2>
              <AddressForm />
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
              >
                Enviar
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
}

Requests.getInitialProps = async ({ query: { id } }) => {
  const response = await api.get(`products/${id}`);
  const product = response.data;
  return { product };
};
