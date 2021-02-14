import React, { useEffect } from 'react';
import { Layout as LayoutANTD} from 'antd';
import Menu from './Menu';
import { useAuth } from '../../hooks/auth';
import { useRouter } from 'next/router';

const { Header, Footer, Sider, Content } = LayoutANTD;

const Layout: React.FC = ({children}) => {
  const { isLogged } = useAuth();
  const { push, pathname } = useRouter();

  // useEffect(() => {
  //   if(pathname !== '/login' && pathname !== '/register' && !isLogged)  {
  //     push('/login')
  //   }
  // }, [isLogged, pathname])

  // if(!isLogged) {
  //   return <>{children}</>
  // }
  
  return (<>{children}</>)

  return (
    <Layout>
      <Sider>
        <Menu/>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{ minHeight: "calc(100vh - 134px)", padding: "24px 48px" }}>
          {children}
        </Content>
        <Footer style={{textAlign: "center"}}>
          Copyright © Litesense 2021
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Layout;