import { Button, Form, Input, Space, Steps } from 'antd';
import React from 'react';

// import { Container } from './styles';

const { Step } = Steps;


const { Item } = Form
const RequestForm: React.FC = () => {
  return (
    <Space direction="vertical">
      <Steps current={1} >
        <Step key="first" title="First" />
        <Step key="second" title="Second" />
        <Step key="third" title="Third" />
      </Steps>
      <Form layout="vertical">
       
        <Button type="primary" block>Próximo</Button>
      </Form>
    </Space>
  );
}

export default RequestForm;