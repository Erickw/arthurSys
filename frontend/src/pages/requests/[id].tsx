import {
  Button,
  Collapse,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
} from "antd";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import CustomInput from "../../components/CustomComponent";
import RequestForm from "../../components/RequestForm";

// import { Container } from './styles';

const { Panel } = Collapse;
const { Title, Text } = Typography;

type RequestProps = {
  product: ProductProps;
};

const Requests: React.FC<RequestProps> = ({ product }) => {
  return (
    <>
      <Title>Nova {product.name}</Title>
      <Text type="secondary">{product.description}</Text>
      <Form layout="vertical" style={{ width: "40%" }}>
        {product.form.map((group) => (
          <div key={group.title.split(" ").join("-").toLowerCase()}>
            <Title level={3}>{group.title}</Title>
            {group.fields.map((field) => (
              <Form.Item
                name={field.name}
                label={field.label}
                key={field.name}
                required
              >
                <CustomInput type={field.type} options={field.options} />
              </Form.Item>
            ))}
          </div>
        ))}
        <Button type="primary" htmlType="submit" block>
          Enviar
        </Button>
      </Form>
    </>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  if (params.id == "teste") {
    return {
      props: {
        product: {
          name: "Teste",
          description: "Esse é um produto de testes",
          form: [
            {
              title: "Dados Pessoais",
              fields: [
                {
                  name: "name",
                  label: "Nome Completo",
                },
                {
                  name: "genre",
                  label: "Sexo",
                  type: "select",
                  options: ["Masculino", "Feminino", "Outro"],
                },
                {
                  name: "birthday",
                  label: "Data de nascimento",
                  type: "date",
                },
              ],
            },
            {
              title: "Outros Dados",
              fields: [
                {
                  type: "number",
                  name: "number-teste",
                  label: "Digite um número",
                },
                {
                  name: "select-teste",
                  label: "Selecione uma opção",
                  type: "select",
                  options: ["opção 1", "opção 2", "opção 3"],
                },
                {
                  name: "file-teste",
                  label: "Insira um arquivo",
                  type: "file",
                },
              ],
            },
          ],
        },
      },
    };
  }
}

export default Requests;
