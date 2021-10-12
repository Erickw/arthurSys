/* eslint-disable no-param-reassign */
import React, { useCallback, useReducer, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  PageHeader,
  Row,
  Select,
  Typography,
} from 'antd';
import {
  DownCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UpCircleOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { InputsWrapper } from '../../styles/pages/new-product';
import API from '../../clients/api';
import { convertToSnakeCase } from '../../utils/utils';

const { Item, List, ErrorList } = Form;
const { Title } = Typography;
const { TextArea } = Input;

const NewProduct: React.FC = () => {
  const [form] = useForm();
  const { push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  function handleMoveGroupOrder(index: number, type: 'up' | 'down') {
    const formData = form.getFieldsValue();
    const { fields } = formData;
    if (type === 'up' && index > 0) {
      const fieldDataToMoveUp = fields[index];
      const fieldDataToMoveDown = fields[index - 1];
      fields[index] = fieldDataToMoveDown;
      fields[index - 1] = fieldDataToMoveUp;
    }

    if (type === 'down' && formData.fields.length - 1 > index) {
      const fieldDataToMoveDown = fields[index];
      const fieldDataToMoveUp = fields[index + 1];
      fields[index] = fieldDataToMoveUp;
      fields[index + 1] = fieldDataToMoveDown;
    }

    form.setFieldsValue(formData);
  }

  function handleMoveInputGroupOrder(
    groupIndex: number,
    inputIndex: number,
    type: 'up' | 'down',
  ) {
    const formData = form.getFieldsValue();
    const { fields } = formData;
    const fieldToChangeOrder = fields[groupIndex];

    if (type === 'up' && inputIndex > 0) {
      const inputToMoveUp = fieldToChangeOrder.fields[inputIndex];
      const inputToMoveDown = fieldToChangeOrder.fields[inputIndex - 1];
      fieldToChangeOrder.fields[inputIndex] = inputToMoveDown;
      fieldToChangeOrder.fields[inputIndex - 1] = inputToMoveUp;
    }
    if (type === 'down' && fieldToChangeOrder.fields.length - 1 > inputIndex) {
      const inputToMoveDown = fieldToChangeOrder.fields[inputIndex];
      const inputToMoveUp = fieldToChangeOrder.fields[inputIndex + 1];
      fieldToChangeOrder.fields[inputIndex] = inputToMoveUp;
      fieldToChangeOrder.fields[inputIndex + 1] = inputToMoveDown;
    }

    form.setFieldsValue(formData);
  }

  const handleSubmit = useCallback(
    async data => {
      setIsSubmitting(true);
      if (data.available === 'true') {
        data.available = true;
      } else {
        data.available = false;
      }
      // convert the name in the dynamic fields to snakecase
      if (data.fields) {
        data.fields = data.fields.map(field => ({
          title: field.title,
          comments: field.comments,
          fields: field.fields?.map(fieldItem => ({
            ...fieldItem,
            label: fieldItem.name,
            name: convertToSnakeCase(fieldItem.name),
          })),
        }));
      }
      await API.post('/products', data);
      setIsSubmitting(false);
      message.success('Novo produto criado com sucesso!');
      push('/products');
    },
    [push],
  );

  return (
    <>
      <PageHeader
        title="Novo Produto"
        ghost={false}
        style={{ marginBottom: 20, minWidth: 450 }}
      />
      <Card bordered={false} style={{ minWidth: 450 }}>
        <Row>
          <Col xxl={12} xl={16} lg={22} md={24} sm={24} xs={24}>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <h2>Dados do produto</h2>
              <Item
                label="Nome do produto"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira o nome do produto!',
                  },
                  {
                    whitespace: true,
                    message: 'Por favor, insira o nome do produto!',
                  },
                ]}
              >
                <Input />
              </Item>
              <Item label="Descrição do serviço" name="description">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
              </Item>
              <Item label="Valor" name="value">
                <Input />
              </Item>
              <Item label="Pagamento" name="requiredPayment">
                <Input />
              </Item>
              <Item label="Observações" name="notes">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 10 }} />
              </Item>
              <Item
                label="Disponibilidade"
                name="available"
                initialValue="true"
              >
                <Select>
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

                            <DownCircleOutlined
                              onClick={() =>
                                handleMoveGroupOrder(index, 'down')
                              }
                              style={{ marginLeft: '16px' }}
                            />
                            <UpCircleOutlined
                              onClick={() => handleMoveGroupOrder(index, 'up')}
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
                        <Item
                          label="Comentários do Grupo"
                          name={[group.name, 'comments']}
                          fieldKey={[group.fieldKey, 'comments']}
                        >
                          <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
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
                                          onClick={() =>
                                            removeField(field.name)
                                          }
                                          style={{ marginLeft: '16px' }}
                                        />
                                      )}

                                      <DownCircleOutlined
                                        onClick={() =>
                                          handleMoveInputGroupOrder(
                                            index,
                                            fieldIndex,
                                            'down',
                                          )
                                        }
                                        style={{ marginLeft: '12px' }}
                                      />
                                      <UpCircleOutlined
                                        onClick={() =>
                                          handleMoveInputGroupOrder(
                                            index,
                                            fieldIndex,
                                            'up',
                                          )
                                        }
                                        style={{ marginLeft: '12px' }}
                                      />
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
                                      initialValue="string"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            'Por favor, selecione o tipo!',
                                        },
                                        {
                                          whitespace: true,
                                          message:
                                            'Por favor, selecione o tipo!',
                                        },
                                      ]}
                                    >
                                      <Select onSelect={() => forceUpdate()}>
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
                                        <Select
                                          mode="tags"
                                          tokenSeparators={[',']}
                                        />
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
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                Criar Produto
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default NewProduct;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { 'ortoSetup.token': token, 'ortoSetup.user': userJson } = req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = JSON.parse(userJson);

  if (user.type !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
