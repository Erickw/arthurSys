import "antd/dist/antd.css";
import Head from "next/head";
import Layout from "../components/Layout";
import { AuthProvider } from "../hooks/auth";
import GlobalStyle from "../styles/GlobalStyle";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Orto Setup</title>
      </Head>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
