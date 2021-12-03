import React from 'react';
import Link from 'next/link';
import { Menu as MenuAntd } from 'antd';
import { useRouter } from 'next/router';
import {
  CreditCardOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import RequestsMenu from './RequestsMenu';

import Logo from '../../Logo';
import { useAuth } from '../../../hooks/auth';

import { LogoDiv } from '../../../styles/components/menu';

const { Item, SubMenu } = MenuAntd;

type Menutheme = 'light' | 'dark';

interface MenuProps {
  theme: Menutheme;
}

const Menu: React.FC<MenuProps> = ({ theme }: MenuProps) => {
  const { user } = useAuth();
  const { push } = useRouter();

  return (
    <>
      <MenuAntd mode="vertical" theme={theme}>
        <LogoDiv onClick={() => push('/')}>
          <Logo />
        </LogoDiv>
      </MenuAntd>

      <RequestsMenu theme={theme} />

      <MenuAntd mode="inline" theme={theme}>
        <Item title="Nova solicitaçã" icon={<CreditCardOutlined />}>
          <Link href="/products">Nova solicitação</Link>
        </Item>
        {user.type === 'admin' && (
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
    </>
  );
};

export default Menu;
