import { Button, Form, Input } from 'antd';
import React from 'react';
import Link from 'next/link';
import { LoginWrapper } from './styles';

const login: React.FC = () => {
  return (
    <LoginWrapper>
      <section>
        <div>
          <h2>Login</h2>
          <Form layout="vertical">
            <Form.Item label="Email">
              <Input />
            </Form.Item>
            <Form.Item label="Senha">
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

export default login;