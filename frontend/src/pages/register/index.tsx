import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LoginWrapper } from '../../styles/pages/login';
import { useAuth } from '../../hooks/auth';
import Logo from '../../components/Logo';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, isLogged } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();

  async function handleFinish({ name, email, password }: RegisterParams) {
    setIsSubmitting(true);
    await register({ name, email, password });
    setIsSubmitting(false);
    message.success('Usuário criado com sucesso', 4);
    push('/login');
  }

  useEffect(() => {
    if (isLogged) {
      push('/');
    }
  }, [isLogged, push]);

  return (
    <LoginWrapper>
      <section>
        <div>
          <div>
            <Logo />
          </div>
          <h2>Cadastrar-se</h2>
          <Form layout="vertical" onFinish={handleFinish}>
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
                { required: true, message: 'Por favor, preencha seu email!' },
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
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isSubmitting}
            >
              Registrar
            </Button>
          </Form>
          <Link href="/login">Voltar para login</Link>
        </div>
      </section>
      <section className="auxiliary" />
    </LoginWrapper>
  );
};

export default Register;
