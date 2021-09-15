/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'antd/dist/antd.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { AuthProvider } from '../hooks/auth';
import GlobalStyle from '../styles/GlobalStyle';

function MyApp({ Component, pageProps }): JSX.Element {
  const { pathname } = useRouter();

  return (
    <AuthProvider>
      <Head>
        <title>Orto Setup</title>
      </Head>
      <GlobalStyle />
      {pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/send-reset-password-email' ||
      pathname.split('/')[1] === 'reset-password' ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}

export default MyApp;
