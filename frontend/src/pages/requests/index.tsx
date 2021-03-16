import { Collapse, Divider, Space, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import RequestForm from '../../components/RequestForm';

// import { Container } from './styles';

const { Panel } = Collapse
const { Title, Text } = Typography
const Requests: React.FC = () => {
  return (
    <Space 
      direction="horizontal" 
      align="start" 
      size="large" 
      split={<Divider type="vertical" style={{margin: "75px 16px", height: "600px"}}/>}
    >
      <Space direction="vertical">
      <div style={{marginBottom: "24px"}}>
        <Title>
          Nova Solicitação
        </Title>
        <Text type="secondary">Escolha uma produto/serviço abaixo para iniciar o processo de solicitação.</Text>
      </div>
        <Collapse expandIconPosition="right">
          <Panel header={<Link href="/">Testando Link</Link>} key="1">
            <Text>descrição</Text>
          </Panel>
        </Collapse>
        <Collapse expandIconPosition="right">
          <Panel header="teste" key="2">
            <p>descrição</p>
          </Panel>
        </Collapse>
        <Collapse expandIconPosition="right">
          <Panel header="teste" key="3">
            <p>descrição</p>
          </Panel>
        </Collapse>
      </Space>
      <section>
        <RequestForm/>
      </section>
    </Space>
  );
}

export default Requests;