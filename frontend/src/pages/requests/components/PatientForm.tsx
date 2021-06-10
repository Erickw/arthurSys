import { Input, Form } from 'antd';
import React from 'react';

const { Item } = Form;

export default function PatientForm(): JSX.Element {
  return (
    <>
      <Item label="Nome do paciente" name="patientName">
        <Input />
      </Item>
      <Item label="Email do paciente" name="patientEmail">
        <Input />
      </Item>
    </>
  );
}
