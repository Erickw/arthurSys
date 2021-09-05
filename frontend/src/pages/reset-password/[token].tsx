import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import Logo from '../../components/Logo';
import { Container, LogoContainer } from '../../styles/pages/reset-password';

interface PasswordResetParams {
  passwordConfirmation: string;
  password: string;
}

export default function ResetPassword(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  function handleFinish({
    password,
    passwordConfirmation,
  }: PasswordResetParams) {
    setIsSubmitting(true);
    console.log(password, passwordConfirmation);
    setIsSubmitting(false);
  }

  return (
    <Container>
      <div>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <h2>Redefinição de Senha</h2>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Senha"
            name="password"
            rules={[
              { required: true, message: 'Por favor, preencha sua senha!' },
              { whitespace: true, message: 'Por favor, preencha sua senha!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmação da Senha"
            name="passwordConfirmation"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Por favor, preencha sua confirmação de senha!',
              },
              {
                whitespace: true,
                message: 'Por favor, preencha sua confirmação de senha!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As senhas não combinam!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isSubmitting}>
            Redefinir Senha
          </Button>
        </Form>
      </div>
    </Container>
  );
}
