import { Button, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import cepPromise from 'cep-promise';
import { LoginWrapper } from '../../styles/pages/login';
import { useAuth } from '../../hooks/auth';
import Logo from '../../components/Logo';
import states from '../../utils/states';

import { InputGroupWrapper } from '../../styles/pages/users-table';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  type: 'admin' | 'cadista' | 'cliente';
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  number: string;
  contactNumber: string;
}

const { Option } = Select;

const Register: React.FC = () => {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();
  const [form] = useForm();

  async function handleFinish({
    name,
    email,
    password,
    type = 'cliente',
    state,
    city,
    zipCode,
    neighborhood,
    street,
    number,
    contactNumber,
  }: RegisterParams) {
    setIsSubmitting(true);
    await register({
      name,
      email,
      password,
      type,
      state,
      city,
      zipCode,
      neighborhood,
      street,
      number,
      contactNumber,
    });
    setIsSubmitting(false);
    push('/login');
  }

  async function hanldeFillAddress(cep: string) {
    try {
      if (cep.length === 8 || cep.length === 9) {
        const formatedCep = cep.replace(/-/g, '');
        const address = await cepPromise(formatedCep);
        form.setFieldsValue({
          city: address.city,
          neighborhood: address.neighborhood,
          state: address.state,
          street: address.street,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <LoginWrapper>
      <section>
        <div>
          <div>
            <Logo />
          </div>
          <h2>Cadastrar-se</h2>
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <InputGroupWrapper>
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
                  {
                    whitespace: true,
                    message: 'Por favor, preencha seu email!',
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item
                label="Senha"
                name="password"
                rules={[
                  { required: true, message: 'Por favor, preencha seu email!' },
                  {
                    whitespace: true,
                    message: 'Por favor, preencha seu email!',
                  },
                  {
                    min: 8,
                    message: 'Sua senha deve conter pelo menos 8 dígitos!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item label="CEP/Bairro">
                <Input.Group compact>
                  <Form.Item style={{ width: '27%' }} name="zipCode">
                    <Input
                      placeholder="CEP"
                      onChange={event => hanldeFillAddress(event.target.value)}
                    />
                  </Form.Item>
                  <Form.Item style={{ width: '73%' }} name="neighborhood">
                    <Input placeholder="Bairro" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item label="Estado/Cidade">
                <Input.Group compact>
                  <Form.Item style={{ width: '35%' }} name="state">
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Selecione o estado"
                    >
                      {states.map(state => (
                        <Option value={state}>{state}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ width: '65%' }} name="city">
                    <Input placeholder="Cidade" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item label="Rua">
                <Input.Group compact>
                  <Form.Item style={{ width: '77%' }} name="street">
                    <Input placeholder="Nome da rua" />
                  </Form.Item>
                  <Form.Item style={{ width: '23%' }} name="number">
                    <Input placeholder="Número" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item label="Número para contato" name="contactNumber">
                <Input />
              </Form.Item>
            </InputGroupWrapper>

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
