import { PageHeader } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
// import { Container } from './styles';

const Header: React.FC = () => {
  const { back } = useRouter();

  return <PageHeader onBack={back}/>;
}

export default Header;