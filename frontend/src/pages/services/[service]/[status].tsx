import React from 'react';
import { Typography, Table } from 'antd';
import axios from 'axios';
import tableColumns from './tableColumns.json';
import api from '../../../clients/api';

const { Title } = Typography;

interface ServiceProps {
  title: string;
  data: RequestProps[] | undefined;
}

export default function Service({ title, data }: ServiceProps): JSX.Element {
  return (
    <>
      <Title level={2}>{title}</Title>
      <section>
        <Table columns={tableColumns} dataSource={data} />
      </section>
    </>
  );
}

Service.getInitialProps = async ({ query: { status } }) => {
  const response = await api.get(`requests/`);
  const product = response.data
    .filter(request => request.status === status)
    .map(requestItem => ({
      ...requestItem,
      key: requestItem.id,
    }));
  return { title: status, data: product };
};

/*
export async function getServerSideProps(ctx): Promise<ServiceProps> {
  const { service, status } = ctx.query;
  console.log(status);
  console.log(service);
  let sufix = '';
  switch (status) {
    case 'new':
      sufix = 'Novo';
      break;
    case 'in-progress':
      sufix = 'Em Progresso';
      break;
    case 'finished':
      sufix = 'Finalizados';
      break;
    case 'cancelled':
      sufix = 'Cancelados';
      break;
    default:
      sufix = ' ';
      break;
  }
  function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const produto = service
    .split('-')
    .map(word => jsUcfirst(word))
    .join(' ');

  const response = await api.get('/requests');
  const requests = response.data.map(
    request => request.status === status,
  ) as RequestProps[];

  return {
    props: {
      title: `${produto} ${sufix}`,
      data: requests,
    },
  };
} */
