import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import GlobalStyle from "../styles/GlobalStyle"

function MyApp({ Component, pageProps }) {
  
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
