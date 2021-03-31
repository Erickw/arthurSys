import { Input, Form } from 'antd';
import React from 'react';

const { Item } = Form;

export default function BankDataForm(): JSX.Element {
  return (
    <>
      <Item
        label="Identificação"
        name={['bankInfo', 'identification']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira a indentificação!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira a indentificação!',
          },
        ]}
      >
        <Input />
      </Item>

      <Item label="Note" name={['bankInfo', 'note']}>
        <Input />
      </Item>

      <Item
        label="Valor"
        name={['bankInfo', 'value']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira o valor!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o valor!',
          },
        ]}
      >
        <Input />
      </Item>

      <Item
        label="Conta bancária"
        name={['bankInfo', 'bankAccount']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira a conta bancária!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira a conta bancária!',
          },
        ]}
      >
        <Input />
      </Item>

      <Item
        label="Banco"
        name={['bankInfo', 'bank']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira o banco!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o banco!',
          },
        ]}
      >
        <Input />
      </Item>

      <Item
        label="Agência"
        name={['bankInfo', 'agency']}
        rules={[
          {
            required: true,
            message: 'Por favor, insira a agência!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira a agência!',
          },
        ]}
      >
        <Input />
      </Item>
    </>
  );
}
