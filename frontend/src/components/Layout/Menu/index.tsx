import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu as MenuAntd, Divider } from 'antd';
import { useRouter } from 'next/router';
import Logo from '../../Logo';
import api from '../../../clients/api';
import { useAuth } from '../../../hooks/auth';

const { Item, SubMenu } = MenuAntd;

const services = [
  {
    name: 'Solicitações',
    route: 'solicitacoes',
  },
];

interface Products {
  id: string;
  name: string;
}

const Menu: React.FC = () => {
  const { push } = useRouter();
  const { refreshToken } = useAuth();
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    api
      .get('/products', {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .then(response => setProducts(response.data));
  }, [refreshToken, push]);

  return (
    <MenuAntd mode="inline" theme="dark">
      <div
        style={{
          margin: '64px auto 32px',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => push('/')}
      >
        <Logo />
      </div>
      {services.map((service, index) => {
        return (
          <SubMenu
            key={index.toString()}
            title={service.name}
            style={{ color: '#fff' }}
          >
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
      <Divider
        orientation="left"
        plain
        style={{ color: '#fff', marginLeft: 5.5 }}
      >
        Visão do cliente
      </Divider>
      <SubMenu key="solicitar" title="Solicitar" style={{ color: '#fff' }}>
        {products.map(product => (
          <Item key={product.id}>
            <Link href="/requests/teste">{product.name}</Link>
          </Item>
        ))}
      </SubMenu>
      <Divider
        orientation="left"
        plain
        style={{ color: '#fff', marginLeft: 5.5 }}
      >
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
