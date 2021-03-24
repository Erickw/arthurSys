import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import Link from 'next/link';
import { LoginWrapper } from '../../styles/pages/login';
import Logo from '../../components/Logo';
import { useAuth } from '../../hooks/auth';

interface LoginParams {
  email: string;
  password: string;
}

const login: React.FC = () => {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFinish({ email, password }: LoginParams) {
    setIsSubmitting(true);
    await login({ email, password });
    setIsSubmitting(false);
  }

  return (
    <LoginWrapper>
      <section>
        <div>
          <div>
            <Logo />
          </div>
          <h2>Login</h2>
          <Form layout="vertical" onFinish={handleFinish}>
            <Form.Item label="Email" name="email" rules={[
              { required: true, message: 'Por favor, preencha seu email!'},
              { whitespace: true, message: 'Por favor, preencha seu email!' }
            ]}>
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Senha" name="password" rules={[
              { required: true, message: 'Por favor, preencha sua senha!'},
              { whitespace: true, message: 'Por favor, preencha sua senha!' }
            ]}>
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={isSubmitting}>Entrar</Button>
          </Form>
          <Link href="/register">Não possuo conta, quero me registrar!</Link>
        </div>
      </section>
      <section className="auxiliary"></section>
    </LoginWrapper>
  );
}

export default login;