import React, { ReactNode, useEffect, useState } from 'react';
import { Layout as LayoutANTD } from 'antd';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useAuth } from '../../hooks/auth';
import Header from '../Header';

const { Footer, Sider, Content } = LayoutANTD;

interface LayoutProps {
  children: ReactNode;
}

type Menutheme = 'light' | 'dark';

const Layout: React.FC = ({ children }: LayoutProps) => {
  const { isLogged } = useAuth();
  const { push, pathname } = useRouter();

  const [theme, setTheme] = useState<Menutheme>('dark');

  useEffect(() => {
    if (
      pathname !== '/login' &&
      pathname !== '/register' &&
      pathname.split('/')[1] !== 'reset-password' &&
      !isLogged
    ) {
      push('/login');
    }
  }, [isLogged, pathname, push]);

  return (
    <LayoutANTD style={{ minWidth: 720 }}>
      <Sider breakpoint="lg" collapsedWidth="80" theme={theme}>
        <Menu theme={theme} />
      </Sider>
      <LayoutANTD>
        <Header
          theme={theme}
          handleChangeTheme={themeSelected => setTheme(themeSelected)}
        />
        <Content
          style={{ minHeight: 'calc(100vh - 134px)', padding: '24px 48px' }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright © Orto Setup 2021
        </Footer>
      </LayoutANTD>
    </LayoutANTD>
  );
};

export default Layout;
