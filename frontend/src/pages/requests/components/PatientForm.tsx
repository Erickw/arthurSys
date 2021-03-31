import { Input, Form } from 'antd';
import React from 'react';

const { Item } = Form;

export default function PatientForm(): JSX.Element {
  return (
    <>
      <Item
        label="Nome do paciente"
        name="patientName"
        rules={[
          {
            required: true,
            message: 'Por favor, insira o nome do paciente!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o nome do paciente!',
          },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="Email do paciente"
        name="patientEmail"
        rules={[
          {
            required: true,
            message: 'Por favor, insira o email do paciente!',
          },
          {
            whitespace: true,
            message: 'Por favor, insira o email do paciente!',
          },
        ]}
      >
        <Input />
      </Item>
    </>
  );
}
