/* eslint-disable react/jsx-no-bind */
import { Button, Form, Input, message } from 'antd';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Logo from '../../components/Logo';
import { auth } from '../../config/firebase';
import { Container, LogoContainer } from '../../styles/pages/reset-password';

interface PasswordResetParams {
  passwordConfirmation: string;
  password: string;
}

interface ResetPasswordProps {
  code: string;
}

export default function ResetPassword({
  code,
}: ResetPasswordProps): JSX.Element {
  const { push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleFinish({ password }: PasswordResetParams) {
    try {
      setIsSubmitting(true);
      await auth.confirmPasswordReset(code, password);
      push('/login');
      message.success('A sua senha foi resetada.');
    } catch (err) {
      message.error(
        'Ocorreu um erro ao resetar a sua senha, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    async function verifyCode() {
      try {
        await auth.verifyPasswordResetCode(code);
      } catch (err) {
        message.error('O link para resetar a senha expirou!');
        push('/login');
      }
    }
    verifyCode();
  }, [code, push]);

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
              {
                min: 8,
                message: 'Sua senha deve conter pelo menos 8 dígitos!',
              },
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
              {
                min: 8,
                message: 'Sua senha deve conter pelo menos 8 dígitos!',
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

export const getServerSideProps: GetServerSideProps = async ({
  query: { oobCode },
}) => {
  const code: string = Array.isArray(oobCode) ? oobCode[0] : oobCode;

  return {
    props: {
      code,
    },
  };
};
