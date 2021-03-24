import "antd/dist/antd.css";
import Head from "next/head";
import { useRouter } from 'next/router';
import Layout from "../components/Layout";
import { AuthProvider } from "../hooks/auth";
import GlobalStyle from "../styles/GlobalStyle";

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  return (
    <AuthProvider>
      <Head>
        <title>Orto Setup</title>
      </Head>
      <GlobalStyle />
      {pathname === '/login' || pathname === '/register' ? (
        <Component {...pageProps} />
      ): (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}

export default MyApp;
