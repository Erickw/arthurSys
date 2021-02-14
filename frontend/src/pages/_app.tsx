import 'antd/dist/antd.css';
import { AuthProvider } from '../hooks/auth';
import GlobalStyle from "../styles/GlobalStyle"

function MyApp({ Component, pageProps }) {
  
  return (
    <AuthProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
