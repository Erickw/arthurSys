import React from 'react';
import Link from 'next/link';
import { Menu as MenuAntd, Divider } from 'antd';
import { useRouter } from 'next/router';
import Logo from '../../Logo';
import { useAuth } from '../../../hooks/auth';

const { Item, SubMenu } = MenuAntd;

const services = [
  {
    name: 'Solicitações',
    route: 'solicitacoes',
  },
];

const Menu: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();

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
              <Link href={`/services/${service.route}/novo`}>Novos</Link>
            </Item>
            <Item>
              <Link href={`/services/${service.route}/em-progresso`}>
                Em Andamento
              </Link>
            </Item>
            <Item>
              <Link href={`/services/${service.route}/finalizada`}>
                Finalizados
              </Link>
            </Item>
            <Item>
              <Link href={`/services/${service.route}/cancelada`}>
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
      <Item>
        <Link href="/products">Nova solicitação</Link>
      </Item>
      {user.admin && (
        <>
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
            <Link href="/users-table">Tabela de usuários</Link>
          </Item>
        </>
      )}
      <Item>
        <Link href="/settings">Configuracões</Link>
      </Item>
    </MenuAntd>
  );
};

export default Menu;
