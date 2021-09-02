import { Button, Card, Descriptions, Form, Input, message, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import cepPromise from 'cep-promise';
import { GetServerSideProps } from 'next';
import React, { useCallback, useEffect, useState } from 'react';
import api from '../../clients/api';
import { getApiClient } from '../../clients/axios';
import {
  InputGroupWrapper,
  SettingsButtons,
} from '../../styles/pages/users-table';
import states from '../../utils/states';

interface EditUserParams {
  name: string;
  email: string;
  type: 'admin' | 'cadista' | 'cliente';
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  number: string;
  contactNumber: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: 'admin' | 'cadista' | 'cliente';
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  number: string;
  contactNumber: string;
}

interface SettingsProps {
  user: User;
}

const { Option } = Select;

const settings: React.FC<SettingsProps> = ({ user }: SettingsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = useForm();

  async function handleFinish({
    name,
    email,
    state,
    city,
    zipCode,
    neighborhood,
    street,
    number,
    contactNumber,
  }: EditUserParams) {
    const userToUpdate = {
      ...user,
      name,
      email,
      state,
      city,
      zipCode,
      neighborhood,
      street,
      number,
      contactNumber,
    };

    try {
      setIsSubmitting(true);
      await api.put(`/users/${user.id}`, userToUpdate);
      setIsSubmitting(false);
      setIsEditing(false);
      message.success('Os seus dados foram atualizados com sucesso', 4);
    } catch (err) {
      message.error(
        'Não conseguimos atualizar os seus dados, por favor tente novamente',
        4,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function hanldeFillAddress(cep: string) {
    try {
      if (cep.length === 8 || cep.length === 9) {
        const formatedCep = cep.replace(/-/g, '');
        const address = await cepPromise(formatedCep);
        form.setFieldsValue({
          city: address.city,
          neighborhood: address.neighborhood,
          state: address.state,
          street: address.street,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const resetForm = useCallback(() => {
    form.setFieldsValue({
      ...user,
    });
  }, [form, user]);

  function handleCancelEditUser() {
    resetForm();
    setIsEditing(false);
  }

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <>
      <Card bordered style={{ minWidth: 450, maxWidth: 700 }}>
        <Descriptions title="Dados do usuário">
          <Descriptions.Item style={{ float: 'right' }}>
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Alterar dados
            </Button>
          </Descriptions.Item>
        </Descriptions>
        <Form
          layout="vertical"
          id="editUser"
          form={form}
          onFinish={handleFinish}
        >
          <InputGroupWrapper>
            <Form.Item
              label="Nome completo"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Por favor, preencha seu nome completo!',
                },
                {
                  whitespace: true,
                  message: 'Por favor, preencha seu nome completo!',
                },
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              initialValue={user.email}
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Por favor, insira um email valido!',
                },
                { whitespace: true, message: 'Por favor, preencha seu email!' },
              ]}
            >
              <Input type="email" disabled={!isEditing} />
            </Form.Item>

            <Form.Item label="CEP/Bairro">
              <Input.Group compact>
                <Form.Item
                  style={{ width: '21%' }}
                  name="zipCode"
                  initialValue={user.zipCode}
                >
                  <Input
                    onChange={event => hanldeFillAddress(event.target.value)}
                    placeholder="CEP"
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item
                  style={{ width: '79%' }}
                  name="neighborhood"
                  initialValue={user.neighborhood}
                >
                  <Input placeholder="Bairro" disabled={!isEditing} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item label="Estado/Cidade">
              <Input.Group compact>
                <Form.Item style={{ width: '35%' }} name="state">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Selecione o estado"
                    disabled={!isEditing}
                  >
                    {states.map(state => (
                      <Option key={state} value={state}>
                        {state}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item style={{ width: '65%' }} name="city">
                  <Input placeholder="Cidade" disabled={!isEditing} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item label="Rua">
              <Input.Group compact>
                <Form.Item style={{ width: '80%' }} name="street">
                  <Input placeholder="Nome da rua" disabled={!isEditing} />
                </Form.Item>
                <Form.Item style={{ width: '20%' }} name="number">
                  <Input placeholder="Número" disabled={!isEditing} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item label="Número para contato" name="contactNumber">
              <Input disabled={!isEditing} />
            </Form.Item>
          </InputGroupWrapper>

          {isEditing && (
            <SettingsButtons>
              <Button onClick={handleCancelEditUser}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Salvar
              </Button>
            </SettingsButtons>
          )}
        </Form>
      </Card>
    </>
  );
};

export default settings;

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
  const apiCLient = getApiClient(token);

  const { data: responseUser } = await apiCLient.get(`users/${user.id}`);
  return {
    props: { user: responseUser },
  };
};
