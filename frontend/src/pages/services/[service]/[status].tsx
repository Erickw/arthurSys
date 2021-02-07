import { useRouter } from 'next/router';
import React from 'react';
import { Typography, Table } from 'antd';
import tableColumns from './tableColumns.json';

const { Title } = Typography;
const Service: React.FC = () => {

  const router = useRouter()
  const { service, status } = router.query

  return (
    <>
      <Title level={2}>
        {` ${status} ${service}` }
      </Title>
      <section>
        <Table columns={tableColumns} />
      </section>
    </>
  );
}

export default Service;