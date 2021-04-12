import { Button, Checkbox, Form, Input, message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import api from '../../../clients/api';

interface EditUserParams {
  name: string;
  email: string;
  admin: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
}

interface EditUserModalProps {
  modalVisible: boolean;
  close: () => void;
  user: User;
}

export default function EditUserModal({
  modalVisible,
  close,
  user,
}: EditUserModalProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFinish({ name, email, admin = false }: EditUserParams) {
    setIsSubmitting(true);
    await api.put(`/users/${user.id}`, { id: user.id, name, email, admin });
    setIsSubmitting(false);
    message.success('Usuário editado com sucesso', 4);
    close();
  }

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
      <Form
        layout="vertical"
        id="editUser"
        onFinish={handleFinish}
        initialValues={{
          name: user.name,
          email: user.email,
          admin: user.admin,
        }}
      >
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

        <Form.Item name="admin" valuePropName="checked">
          <Checkbox>Admin</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
