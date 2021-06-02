/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-assign */
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
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import api from '../../clients/api';
import { getApiClient } from '../../clients/axios';
import { useAuth } from '../../hooks/auth';
import AddressForm from '../requests/components/AddressForm';
import PatientForm from '../requests/components/PatientForm';
import RequestDynamicForm from './components/RequestDynamicForm';

type EditRequestProps = {
  product: ProductProps;
  request: RequestProps;
};

export default function EditRequest({
  product,
  request,
}: EditRequestProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();
  const { user } = useAuth();
  const [form] = useForm();

  const handleSubmit = useCallback(
    async data => {
      const requestToUpdate = data;
      requestToUpdate.id = request.id;
      requestToUpdate.userId = user.id;
      requestToUpdate.productId = product.id;
      requestToUpdate.status = 'novo';
      requestToUpdate.date = new Date();
      requestToUpdate.fieldsValues = requestToUpdate.fieldsValues.map(
        (field, index) => ({
          title: product.fields[index].title,
          fields: { ...field },
        }),
      );
      setIsSubmitting(true);
      await api.put(`/requests/${request.id}`, requestToUpdate);
      setIsSubmitting(false);
      message.success(`Solicitação do ${product.name} criada com sucesso!`);
      push('/');
    },
    [product.fields, product.id, product.name, push, request.id, user.id],
  );

  return (
    <>
      <PageHeader
        title="Editar Solicitação"
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
      </PageHeader>
      <Card bordered={false} style={{ minWidth: 450 }}>
        <Row>
          <Col xxl={12} xl={16} lg={22} md={24} sm={24} xs={24}>
            <Form
              layout="vertical"
              form={form}
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
              }}
            >
              <h2>Dados do paciente</h2>

              <PatientForm />

              <RequestDynamicForm
                form={form}
                fieldsFromProduct={product.fields}
                fieldsFromRequest={request.fieldsValues}
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { id },
}) => {
  const { 'ortoSetup.token': token } = req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const apiCLient = getApiClient(token);

  const responseRequest = await apiCLient.get(`/requests`);

  const request = responseRequest.data.find(
    requestItem => requestItem.id === id,
  );

  const responseProduct = await apiCLient.get(`products/${request.productId}`);

  const product = responseProduct.data;

  return {
    props: { product, request },
  };
};
