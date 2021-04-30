import React, { ReactNode, useEffect } from 'react';
import { Layout as LayoutANTD } from 'antd';
import { useRouter } from 'next/router';
import Menu from './Menu';
import { useAuth } from '../../hooks/auth';
import Header from '../Header';

const { Header: HeaderANTD, Footer, Sider, Content } = LayoutANTD;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC = ({ children }: LayoutProps) => {
  const { isLogged } = useAuth();
  const { push, pathname } = useRouter();

  useEffect(() => {
    if (pathname !== '/login' && pathname !== '/register' && !isLogged) {
      push('/login');
    }
  }, [isLogged, pathname, push]);

  // if(!isLogged) {
  //   return <>{children}</>
  // }

  // return (<>{children}</>)

  return (
    <LayoutANTD style={{ width: 720 }}>
      <Sider>
        <Menu />
      </Sider>
      <LayoutANTD>
        <HeaderANTD>
          <Header />
        </HeaderANTD>
        <Content
          style={{ minHeight: 'calc(100vh - 134px)', padding: '24px 48px' }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright © Litesense 2021
        </Footer>
      </LayoutANTD>
    </LayoutANTD>
  );
};

export default Layout;
