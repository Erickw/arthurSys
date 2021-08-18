import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import cepPromise from 'cep-promise';
import { useAuth } from '../../../hooks/auth';
import states from '../../../utils/states';

import { InputGroupWrapper } from '../../../styles/pages/users-table';

interface RegisterParams {
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

interface CreateUserModalProps {
  modalVisible: boolean;
  close: () => void;
}

const { Option } = Select;

export default function CreateUserModal({
  modalVisible,
  close,
}: CreateUserModalProps): JSX.Element {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = useForm();

  async function handleFinish({
    name,
    email,
    password,
    state,
    city,
    zipCode,
    neighborhood,
    street,
    number,
    contactNumber,
    type,
  }: RegisterParams) {
    setIsSubmitting(true);
    await register({
      name,
      email,
      password,
      type,
      state,
      city,
      zipCode,
      neighborhood,
      street,
      number,
      contactNumber,
    });
    setIsSubmitting(false);
    close();
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

  return (
    <Modal
      destroyOnClose
      title="Criar usuário"
      visible={modalVisible}
      onCancel={() => close()}
      footer={[
        <Button
          key="register"
          type="primary"
          loading={isSubmitting}
          form="createUser"
          htmlType="submit"
        >
          Criar
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        id="createUser"
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
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Por favor, insira um email valido!',
              },
              { whitespace: true, message: 'Por favor, preencha seu email!' },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name="password"
            rules={[
              { required: true, message: 'Por favor, preencha seu email!' },
              { whitespace: true, message: 'Por favor, preencha seu email!' },
              {
                min: 8,
                message: 'Sua senha deve conter pelo menos 8 dígitos!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="CEP/Bairro">
            <Input.Group compact>
              <Form.Item style={{ width: '21%' }} name="zipCode">
                <Input
                  placeholder="CEP"
                  onChange={event => hanldeFillAddress(event.target.value)}
                />
              </Form.Item>
              <Form.Item style={{ width: '79%' }} name="neighborhood">
                <Input placeholder="Bairro" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item label="Estado/Cidade">
            <Input.Group compact>
              <Form.Item style={{ width: '35%' }} name="state">
                <Select
                  style={{ width: '100%' }}
                  placeholder="Selecione o estado"
                >
                  {states.map(state => (
                    <Option key={state} value={state}>
                      {state}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ width: '65%' }} name="city">
                <Input placeholder="Cidade" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item label="Rua">
            <Input.Group compact>
              <Form.Item style={{ width: '80%' }} name="street">
                <Input placeholder="Nome da rua" />
              </Form.Item>
              <Form.Item style={{ width: '20%' }} name="number">
                <Input placeholder="Número" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item label="Número para contato" name="contactNumber">
            <Input />
          </Form.Item>

          <Form.Item
            label="Tipo de usuário"
            name="type"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione o tipo do usuário',
              },
            ]}
          >
            <Select defaultValue="comum">
              <Option value="admin">Admin</Option>
              <Option value="cadista">Cadista</Option>
              <Option value="cliente">Cliente</Option>
            </Select>
          </Form.Item>
        </InputGroupWrapper>
      </Form>
    </Modal>
  );
}
