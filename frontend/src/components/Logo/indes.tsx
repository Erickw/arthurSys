import React from 'react';
import Image from 'next/image'
// import { Container } from './styles';

const Logo: React.FC = () => {
  return (
    <div>
      <Image src="/assets/logo_image.png" width={60} height={50}/>
    </div>
  );
}

export default Logo;