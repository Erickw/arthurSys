import { Input, Form } from 'antd';
import React from 'react';

const { Item } = Form;

export default function AddressForm(): JSX.Element {
  return (
    <>
      <Item
        label="Cidade"
        name={['address', 'city']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira a cidade!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira a cidade!',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="Estado"
        name={['address', 'state']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira o estado!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o estado!',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="Bairro"
        name={['address', 'district']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira o bairro!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o bairro!',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="CEP"
        name={['address', 'postalCode']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira o CEP!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o CEP!',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="Número"
        name={['address', 'number']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira o número!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o número!',
          },
        ]}
      >
        <Input />
      </Item>
      <Item label="Complemento" name={['address', 'complement']}>
        <Input />
      </Item>
    </>
  );
}
