import 'antd/dist/antd.css';
import GlobalStyle from "../styles/GlobalStyle"
import { Layout } from 'antd';
import Menu from "../components/Menu";

const { Header, Footer, Sider, Content } = Layout;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Layout>
        <Sider>
          <Menu/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ minHeight: "calc(100vh - 134px)", padding: "24px 48px" }}>
            <Component {...pageProps} />
          </Content>
          <Footer style={{textAlign: "center"}}>
            Copyright © Litesense 2021
          </Footer>
        </Layout>
      </Layout>
      
    </>
  )
}

export default MyApp
