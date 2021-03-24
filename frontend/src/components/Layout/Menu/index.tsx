import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu as MenuAntd, Divider } from "antd";
import Logo from "../../Logo";
const { Item, SubMenu } = MenuAntd;

const services = [
  {
    name: "Produto Teste",
    route: "produto-teste",
  },
];
const Menu: React.FC = () => {
  const router = useRouter();

  return (
    <MenuAntd mode="inline" theme="dark">
      <div
        style={{
          margin: "64px auto 32px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Logo />
      </div>
      <Divider orientation="left" plain style={{ color: "#fff" }}>
        Solicitações
      </Divider>
      {services.map((service, index) => {
        return (
          <SubMenu key={index.toString()} title={service.name}>
            <Item>
              <Link href={`/services/${service.route}/new`}>Novos</Link>
            </Item>
            <Item>
              <Link href={`/services/${service.route}/in-progress`}>
                Em Andamento
              </Link>
            </Item>
            <Item>
              <Link href={`/services/${service.route}/finished`}>
                Finalizados
              </Link>
            </Item>
            <Item>
              <Link href={`/services/${service.route}/cancelled`}>
                Cancelados
              </Link>
            </Item>
          </SubMenu>
        );
      })}
      <Divider orientation="left" plain style={{ color: "#fff" }}>
        Visão do cliente
      </Divider>
      <Item>
        <Link href="/requests/teste">Solicitar Produto Teste</Link>
      </Item>
      <Divider orientation="left" plain style={{ color: "#fff" }}>
        Admin
      </Divider>
      <Item>
        <Link href="/new-product">Cria novo produto</Link>
      </Item>
      <Item>
        <Link href="/settings">Configuracões</Link>
      </Item>
    </MenuAntd>
  );
};

export default Menu;
