import { Button, Form, Input } from 'antd';
import React from 'react';
import Link from 'next/link';
import { LoginWrapper } from '../login/styles';

const register: React.FC = () => {
  return (
    <LoginWrapper>
      <section>
        <div>
          <h2>Cadastrar-se</h2>
          <Form layout="vertical">
            <Form.Item label="Nome completo" name="fullname" >
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" >
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Senha" name="password">
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