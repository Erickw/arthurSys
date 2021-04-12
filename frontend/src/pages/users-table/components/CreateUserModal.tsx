import { Button, Checkbox, Form, Input, message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/auth';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

interface CreateUserModalProps {
  modalVisible: boolean;
  close: () => void;
}

export default function CreateUserModal({
  modalVisible,
  close,
}: CreateUserModalProps): JSX.Element {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFinish({
    name,
    email,
    password,
    admin = false,
  }: RegisterParams) {
    setIsSubmitting(true);
    await register({ name, email, password, admin });
    setIsSubmitting(false);
    message.success('Usuário criado com sucesso', 4);
    close();
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
      <Form layout="vertical" id="createUser" onFinish={handleFinish}>
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

        <Form.Item name="admin" valuePropName="checked">
          <Checkbox>Admin</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
