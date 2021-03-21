import React from "react";
import Image from "next/image";
// import { Container } from './styles';

const Logo: React.FC = () => {
  return <Image src="/images/logo.png" width={160} height={160} />;
};

export default Logo;
