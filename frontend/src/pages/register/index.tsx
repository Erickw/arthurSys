import { Button, Form, Input } from 'antd';
import React from 'react';
import Link from 'next/link';
import { LoginWrapper } from '../login/styles';
import { useAuth } from '../../hooks/auth';

const register: React.FC = () => {
  const { register } = useAuth()

  return (
    <LoginWrapper>
      <section>
        <div>
          <h2>Cadastrar-se</h2>
          <Form layout="vertical" onFinish={register}>
            <Form.Item label="Nome completo" name="fullname" rules={[
              { required: true, message: 'Por favor, preencha seu nome completo!'},
              { whitespace: true, message: 'Por favor, preencha seu nome completo!' }
            ]} >
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[
              { required: true, message: 'Por favor, preencha seu email!'},
              { whitespace: true, message: 'Por favor, preencha seu email!' }
            ]}>
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Senha" name="password" rules={[
              { required: true, message: 'Por favor, preencha seu email!'},
              { whitespace: true, message: 'Por favor, preencha seu email!'},
              { min: 8, message: "Sua senha deve conter pelo menos 8 dígitos!" }
            ]}>
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>Entrar</Button>
          </Form>
          <Link href="/register">Não possuo conta, quero me registrar!</Link>
        </div>
      </section>
      <section className="auxiliary"></section>
    </LoginWrapper>
  );
}

export default register;