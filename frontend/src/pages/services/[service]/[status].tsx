import React from 'react';
import { Typography, Table } from 'antd';
import tableColumns from './tableColumns.json';
import axios from 'axios';

const { Title } = Typography;

const Service = ({title, data}) => {
  return (
    <>
      <Title level={2}>{title}</Title>
      <section>
        <Table columns={tableColumns} dataSource={data}/>
      </section>
    </>
  );
}
Service.getInitialProps = async (ctx) => {
  const { service, status } = ctx.query
  
  const {data} = await axios.get('https://us-central1-teste-869ba.cloudfunctions.net/api/requests');
  return { title: status + ' ' + service, data }
} 

export default Service;