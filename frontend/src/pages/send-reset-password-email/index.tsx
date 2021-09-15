/* eslint-disable react/jsx-no-bind */

import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { LoginWrapper } from '../../styles/pages/login';
import Logo from '../../components/Logo';
import { auth } from '../../config/firebase';

interface SendResetPasswordEmailParams {
  email: string;
}

const SendResetPasswordEmail: React.FC = () => {
  const { push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendResetPasswordEmail({
    email,
  }: SendResetPasswordEmailParams) {
    try {
      setIsSubmitting(true);
      await auth.sendPasswordResetEmail(email);
      message.success(
        'Um email com o link para resetar a senha foi enviado para o seu email.',
        10,
      );
      push('/login');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        message.error('O email não está cadastrado sistema!');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LoginWrapper>
      <section>
        <div>
          <div>
            <Logo />
          </div>
          <h2>Esqueceu a sua senha ?</h2>

          <span>
            Digite o seu email, e iremos enviar um link para você resetar a sua
            senha.
          </span>
          <Form layout="vertical" onFinish={handleSendResetPasswordEmail}>
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
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isSubmitting}
            >
              Enviar
            </Button>
          </Form>

          <Link href="/login">Voltar para a página de login.</Link>
        </div>
      </section>
      <section className="auxiliary" />
    </LoginWrapper>
  );
};

export default SendResetPasswordEmail;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { 'ortoSetup.token': token } = req.cookies;

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
