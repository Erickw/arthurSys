import { Button, Checkbox, Form, Input, message, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import cepPromise from 'cep-promise';
import api from '../../../clients/api';
import states from '../../../utils/states';

import { InputGroupWrapper } from '../../../styles/pages/users-table';

interface EditUserParams {
  name: string;
  email: string;
  admin: boolean;
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
  admin: boolean;
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  number: string;
  contactNumber: string;
}

interface EditUserModalProps {
  modalVisible: boolean;
  close: () => void;
  // eslint-disable-next-line react/require-default-props
  user: User;
}

const { Option } = Select;

export default function EditUserModal({
  modalVisible,
  close,
  user,
}: EditUserModalProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = useForm();

  async function handleFinish({
    name,
    email,
    admin = false,
    state,
    city,
    zipCode,
    neighborhood,
    street,
    number,
    contactNumber,
  }: EditUserParams) {
    setIsSubmitting(true);
    await api.put(`/users/${user.id}`, {
      id: user.id,
      name,
      email,
      admin,
      state,
      city,
      zipCode,
      neighborhood,
      street,
      number,
      contactNumber,
    });
    setIsSubmitting(false);
    message.success('Usuário editado com sucesso', 4);
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

  useEffect(() => {
    form.setFieldsValue({ ...user });
  }, [form, user]);

  return (
    <Modal
      destroyOnClose
      title="Editar usuário"
      visible={modalVisible}
      onCancel={() => close()}
      footer={[
        <Button
          key="register"
          type="primary"
          loading={isSubmitting}
          form="editUser"
          htmlType="submit"
        >
          Editar
        </Button>,
      ]}
    >
      <Form layout="vertical" id="editUser" form={form} onFinish={handleFinish}>
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

          <Form.Item label="CEP/Bairro">
            <Input.Group compact>
              <Form.Item style={{ width: '21%' }} name="zipCode">
                <Input
                  onChange={event => hanldeFillAddress(event.target.value)}
                  placeholder="CEP"
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
                    <Option value={state}>{state}</Option>
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

          <Form.Item name="admin" valuePropName="checked">
            <Checkbox>Admin</Checkbox>
          </Form.Item>
        </InputGroupWrapper>
      </Form>
    </Modal>
  );
}
