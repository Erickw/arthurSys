import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {Menu as MenuAntd} from 'antd';
import Logo from '../../Logo';
const {Item, SubMenu, Divider} = MenuAntd;

const services = [
  {
    name: "Alinhadores Ortdônticos", 
    route: "orthodontic-aligners"
  },
  {
    name: "Setup Digital Ortodôntico com Estagiamento",
    route: "digital-orthodontic"
  },
]
const Menu: React.FC = () => {
  const router = useRouter();

  return (
    <MenuAntd mode="inline" theme="dark">
      <Logo />
      {services.map((service, index) => {
        return (
          <SubMenu key={index.toString()} title={service.name} >
              <Item>
                <Link href={`/services/${service.route}/new`}>
                  Novos
                </Link>
              </Item>
            <Item>
              <Link href={`/services/${service.route}/in-progress`}>
                Em Andamento
              </Link>
            </Item>
            <Item >
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
        )
      })}
      <Divider/>
      <Item>
        <Link href="/settings">
          Configuracões
        </Link>
      </Item>
    </MenuAntd>
  );
};

export default Menu;