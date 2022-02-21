import React, { ReactNode, useState } from 'react';
import { Layout as LayoutANTD } from 'antd';
import Menu from './Menu';
import Header from '../Header';

const { Footer, Sider, Content } = LayoutANTD;

interface LayoutProps {
  children: ReactNode;
}

type Menutheme = 'light' | 'dark';

const Layout: React.FC = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<Menutheme>('dark');

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
