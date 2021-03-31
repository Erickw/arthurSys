import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Typography,
  DatePicker,
} from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import api from '../../clients/api';
import { useAuth } from '../../hooks/auth';

const { Title } = Typography;
const { Item } = Form;

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
        <h2>Dados do paciente</h2>

        <Item
          label="Nome do paciente"
          name="patientName"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o nome do paciente!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o nome do paciente!',
            },
          ]}
        >
          <Input />
        </Item>
        <Item
          label="Email do paciente"
          name="patientEmail"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o email do paciente!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o email do paciente!',
            },
          ]}
        >
          <Input />
        </Item>

        {product.fields?.map((field, index) => (
          <>
            <h2>{field.title}</h2>
            {field.fields?.map(fieldItem => (
              <>
                {fieldItem.type === 'string' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Input />
                  </Item>
                )}
                {fieldItem.type === 'number' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Input type="number" />
                  </Item>
                )}
                {fieldItem.type === 'select' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Select>
                      {fieldItem.options.map(option => (
                        <Select.Option value={option}>{option}</Select.Option>
                      ))}
                    </Select>
                  </Item>
                )}
                {fieldItem.type === 'date' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    fieldKey={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" />
                  </Item>
                )}
                {fieldItem.type === 'file' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Item>
                )}
              </>
            ))}
          </>
        ))}

        <h2>Endereço</h2>

        <Item
          label="Cidade"
          name={['address', 'city']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira a cidade!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira a cidade!',
            },
          ]}
        >
          <Input />
        </Item>
        <Item
          label="Estado"
          name={['address', 'state']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira o estado!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o estado!',
            },
          ]}
        >
          <Input />
        </Item>
        <Item
          label="Bairro"
          name={['address', 'district']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira o bairro!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o bairro!',
            },
          ]}
        >
          <Input />
        </Item>
        <Item
          label="CEP"
          name={['address', 'postalCode']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira o CEP!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o CEP!',
            },
          ]}
        >
          <Input />
        </Item>
        <Item
          label="Número"
          name={['address', 'number']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira o número!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o número!',
            },
          ]}
        >
          <Input />
        </Item>
        <Item label="Complemento" name={['address', 'complement']}>
          <Input />
        </Item>

        <h2>Dados bancários</h2>

        <Item
          label="Identificação"
          name={['bankInfo', 'identification']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira a indentificação!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira a indentificação!',
            },
          ]}
        >
          <Input />
        </Item>

        <Item label="Note" name={['bankInfo', 'note']}>
          <Input />
        </Item>

        <Item
          label="Valor"
          name={['bankInfo', 'value']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira o valor!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o valor!',
            },
          ]}
        >
          <Input />
        </Item>

        <Item
          label="Conta bancária"
          name={['bankInfo', 'bankAccount']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira a conta bancária!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira a conta bancária!',
            },
          ]}
        >
          <Input />
        </Item>

        <Item
          label="Banco"
          name={['bankInfo', 'bank']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira o banco!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira o banco!',
            },
          ]}
        >
          <Input />
        </Item>

        <Item
          label="Agência"
          name={['bankInfo', 'agency']}
          rules={[
            {
              required: true,
              message: 'Por favor, insira a agência!',
            },
            {
              whitespace: true,
              message: 'Por favor, insira a agência!',
            },
          ]}
        >
          <Input />
        </Item>

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
