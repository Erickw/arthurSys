import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import { AuthProvider } from '../hooks/auth';
import GlobalStyle from "../styles/GlobalStyle"

function MyApp({ Component, pageProps }) {
  
  return (
    <AuthProvider>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
