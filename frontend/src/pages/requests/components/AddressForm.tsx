import { Input, Form } from 'antd';
import React from 'react';

const { Item } = Form;

export default function AddressForm(): JSX.Element {
  return (
    <>
      <Item label="Cidade" name={['address', 'city']}>
        <Input />
      </Item>
      <Item label="Estado" name={['address', 'state']}>
        <Input />
      </Item>
      <Item label="Bairro" name={['address', 'district']}>
        <Input />
      </Item>
      <Item label="CEP" name={['address', 'postalCode']}>
        <Input />
      </Item>

      <Item label="Rua" name={['address', 'street']}>
        <Input />
      </Item>

      <Item label="Número" name={['address', 'number']}>
        <Input />
      </Item>
      <Item label="Complemento" name={['address', 'complement']}>
        <Input />
      </Item>
    </>
  );
}
