import React, { useState } from 'react';
import Link from 'next/link';
import { Menu as MenuAntd } from 'antd';
import { useRouter } from 'next/router';
import {
  CreditCardOutlined,
  TeamOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Logo from '../../Logo';
import { useAuth } from '../../../hooks/auth';

import { LogoDiv } from '../../../styles/components/menu';

const { Item, SubMenu } = MenuAntd;

const services = [
  {
    name: 'Solicitações',
    route: 'solicitacoes',
  },
];

type Menutheme = 'light' | 'dark';

interface MenuProps {
  theme: Menutheme;
}

const Menu: React.FC<MenuProps> = ({ theme }: MenuProps) => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [isCollapsed] = useState(true);

  return (
    <MenuAntd mode="inline" theme={theme} inlineCollapsed={isCollapsed}>
      {isCollapsed && (
        <LogoDiv onClick={() => push('/')}>
          <Logo />
        </LogoDiv>
      )}
      {services.map((service, index) => {
        return (
          <SubMenu
            key={index.toString()}
            title={service.name}
            icon={<PieChartOutlined />}
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
      <Item title="Nova solicitaçã" icon={<CreditCardOutlined />}>
        <Link href="/products">Nova solicitação</Link>
      </Item>
      {user.admin && (
        <SubMenu title="Área administrativa" icon={<TeamOutlined />}>
          <Item>
            <Link href="/new-product">Criar novo produto</Link>
          </Item>
          <Item>
            <Link href="/users-table">Tabela de usuários</Link>
          </Item>
        </SubMenu>
      )}
      <Item icon={<SettingOutlined />}>
        <Link href="/settings">Configuracões</Link>
      </Item>
    </MenuAntd>
  );
};

export default Menu;
