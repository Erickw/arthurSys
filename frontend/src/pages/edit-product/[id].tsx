/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Button, Form, Input, message, Select, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useRouter } from 'next/router';
import { InputsWrapper } from '../../styles/pages/new-product';
import api from '../../clients/api';
import { convertToSnakeCase } from '../../utils/utils';

const { Item, List, ErrorList } = Form;
const { Title } = Typography;

type EditProductProps = {
  product: ProductProps;
};

export default function EditProduct({
  product,
}: EditProductProps): JSX.Element {
  const [form] = useForm();
  const { push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const handleSubmit = useCallback(
    async data => {
      setIsSubmitting(true);
      if (data.available === 'true') {
        data.available = true;
      } else {
        data.available = false;
      }
      data.id = product.id;
      // convert the name in the dynamic fields to snakecase
      data.fields = data.fields.map(field => ({
        title: field.title,
        fields: field.fields.map(fieldItem => ({
          ...fieldItem,
          label: fieldItem.name,
          name: convertToSnakeCase(fieldItem.name),
        })),
      }));
      await api.put(`/products/${product.id}`, data);
      setIsSubmitting(false);
      message.success(`Produto editado com sucesso!`);
      push('/products');
    },
    [product.id, push],
  );

  useEffect(() => {
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      value: product.value,
      requiredPayment: product.requiredPayment,
      notes: product.notes,
      available: product.available,
      bankInfo: {
        agency: product.bankInfo.agency,
        value: product.bankInfo.value,
        bankAccount: product.bankInfo.bankAccount,
        bank: product.bankInfo.bank,
        identification: product.bankInfo.identification,
        note: product.bankInfo.note,
      },
      fields:
        product.fields.length === 0
          ? []
          : product.fields.map(field => ({
              title: field.title,
              fields: field.fields.map(fieldItem => ({
                name: fieldItem.name,
                label: fieldItem.label,
                type: fieldItem.type,
                options: fieldItem.options,
              })),
            })),
    });
  }, [
    form,
    product.available,
    product.bankInfo.agency,
    product.bankInfo.bank,
    product.bankInfo.bankAccount,
    product.bankInfo.identification,
    product.bankInfo.note,
    product.bankInfo.value,
    product.description,
    product.fields,
    product.name,
    product.notes,
    product.requiredPayment,
    product.value,
  ]);

  return (
    <>
      <Title>Editar Produto</Title>
      <Form
        layout="vertical"
        form={form}
        style={{ width: '60%' }}
        onFinish={handleSubmit}
      >
        <h2>Dados do produto</h2>
        <Item
          label="Nome do produto"
          name="name"
          rules={[
            { required: true, message: 'Por favor, insira o nome do produto!' },
            {
              whitespace: true,
              message: 'Por favor, insira o nome do produto!',
            },
          ]}
        >
          <Input />
        </Item>
        <Item label="Descrição do serviço" name="description">
          <Input.TextArea />
        </Item>
        <Item label="Valor" name="value">
          <Input />
        </Item>
        <Item label="Pagamento" name="requiredPayment">
          <Input />
        </Item>
        <Item label="Observações" name="notes">
          <Input.TextArea />
        </Item>
        <Item label="Disponibilidade" name="available">
          <Select defaultValue="true">
            <Select.Option value="true">Disponível</Select.Option>
            <Select.Option value="false">Não Disponível</Select.Option>
          </Select>
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

        <List name="fields">
          {(groups, { add, remove }, { errors }) => (
            <>
              {groups.map((group, index) => (
                <Item
                  label={
                    <Title level={3}>
                      {`Grupo ${index + 1}`}
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(group.name)}
                        style={{ marginLeft: '16px' }}
                      />
                    </Title>
                  }
                  key={group.name}
                >
                  <Item
                    label="Título do Grupo"
                    name={[group.name, 'title']}
                    fieldKey={[group.fieldKey, 'title']}
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, insira o título do grupo!',
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, insira o título do grupo!',
                      },
                    ]}
                  >
                    <Input />
                  </Item>
                  <List name={[group.name, 'fields']}>
                    {(
                      fields,
                      { add: addField, remove: removeField },
                      { errors: errorsFields },
                    ) => (
                      <>
                        {fields.map((field, fieldIndex) => (
                          <Item
                            label={
                              <>
                                {`Input ${fieldIndex + 1}`}
                                {fieldIndex > 0 && (
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => removeField(field.name)}
                                    style={{ marginLeft: '16px' }}
                                  />
                                )}
                              </>
                            }
                            key={field.name}
                          >
                            <InputsWrapper>
                              <Item
                                label="Nome"
                                name={[field.name, 'name']}
                                fieldKey={[field.fieldKey, 'name']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Por favor, insira o nome!',
                                  },
                                  {
                                    whitespace: true,
                                    message: 'Por favor, insira o nome!',
                                  },
                                ]}
                              >
                                <Input />
                              </Item>
                              <Item
                                label="Tipo"
                                name={[field.name, 'type']}
                                fieldKey={[field.fieldKey, 'type']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Por favor, selecione o tipo!',
                                  },
                                  {
                                    whitespace: true,
                                    message: 'Por favor, selecione o tipo!',
                                  },
                                ]}
                              >
                                <Select
                                  defaultValue="string"
                                  onSelect={() => forceUpdate()}
                                >
                                  <Select.Option value="string">
                                    Texto
                                  </Select.Option>
                                  <Select.Option value="number">
                                    Número
                                  </Select.Option>
                                  <Select.Option value="select">
                                    Select
                                  </Select.Option>
                                  <Select.Option value="date">
                                    Date
                                  </Select.Option>
                                  <Select.Option value="file">
                                    Arquivo
                                  </Select.Option>
                                </Select>
                              </Item>
                              {form.getFieldsValue().fields[index].fields[
                                fieldIndex
                              ]?.type === 'select' && (
                                <Item
                                  label="Opções"
                                  name={[field.name, 'options']}
                                  fieldKey={[field.fieldKey, 'options']}
                                >
                                  <Select mode="tags" tokenSeparators={[',']} />
                                </Item>
                              )}
                            </InputsWrapper>
                          </Item>
                        ))}
                        <Item>
                          <Button
                            type="link"
                            block
                            onClick={() => addField()}
                            icon={<PlusOutlined />}
                          >
                            Adiconar campos
                          </Button>
                          <ErrorList errors={errorsFields} />
                        </Item>
                      </>
                    )}
                  </List>
                </Item>
              ))}

              <Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Adiconar grupo de campos
                </Button>
                <ErrorList errors={errors} />
              </Item>
            </>
          )}
        </List>
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          Editar Produto
        </Button>
      </Form>
    </>
  );
}

EditProduct.getInitialProps = async ({ query: { id } }) => {
  const response = await api.get(`products/${id}`);
  const product = response.data;
  return { product };
};
