import { Descriptions } from 'antd';
import React from 'react';

interface BankInfoProps {
  bankInfo: BankInfo;
}

export default function BankData({ bankInfo }: BankInfoProps): JSX.Element {
  return (
    <>
      <h2>Dados bancários</h2>
      <Descriptions title="">
        {bankInfo.identification && (
          <Descriptions.Item label="Indentificação">
            {bankInfo.identification}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Banco">{bankInfo.bank}</Descriptions.Item>
        <Descriptions.Item label="Agência">{bankInfo.agency}</Descriptions.Item>
        <Descriptions.Item label="Conta bancária">
          {bankInfo.bankAccount}
        </Descriptions.Item>
        <Descriptions.Item label="Valor">
          {new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL',
          }).format(bankInfo.value)}
        </Descriptions.Item>
        {bankInfo.note && (
          <Descriptions.Item label="Nota">{bankInfo.note}</Descriptions.Item>
        )}
      </Descriptions>
    </>
  );
}
