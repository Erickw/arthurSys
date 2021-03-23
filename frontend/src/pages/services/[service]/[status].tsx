import React from "react";
import { Typography, Table } from "antd";
import tableColumns from "./tableColumns.json";
import axios from "axios";

const { Title } = Typography;

interface ServiceProps {
  title: string;
  data: Array<{
    key: number;
    professionalName: string;
    patientName: string;
    date: Date;
  }>;
}
const Service: React.FC<ServiceProps> = ({ title, data }) => {
  return (
    <>
      <Title level={2}>{title}</Title>
      <section>
        <Table columns={tableColumns} dataSource={data} />
      </section>
    </>
  );
};
export async function getServerSideProps(ctx) {
  const { service, status } = ctx.query;
  var sufix = "";
  switch (status) {
    case "new":
      sufix = "Novo";
      break;
    case "in-progress":
      sufix = "Em Progresso";
      break;
    case "finished":
      sufix = "Finalizados";
      break;
    case "cancelled":
      sufix = "Cancelados";
      break;
    default:
      sufix = " ";
      break;
  }
  function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const produto = service
    .split("-")
    .map((word) => jsUcfirst(word))
    .join(" ");
    
  return {
    props: {
      title: `${produto} ${sufix}`,
      data: [
        {
          key: 1,
          professionalName: "John doe",
          patientName: "John Doe",
          date: new Date().toLocaleDateString(),
        },
        {
          key: 2,
          professionalName: "John doe",
          patientName: "John Doe",
          date: new Date().toLocaleDateString(),
        },
        {
          key: 3,
          professionalName: "John doe",
          patientName: "John Doe",
          date: new Date().toLocaleDateString(),
        },
        {
          key: 4,
          professionalName: "John doe",
          patientName: "John Doe",
          date: new Date().toLocaleDateString(),
        },
      ],
    },
  };
}
export default Service;
