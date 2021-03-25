import styled, { keyframes } from 'styled-components';

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const LoginWrapper = styled.main`
  height: 100vh;
  display: flex;

  animation: ${appearFromLeft} 1s;
  section {
    &.auxiliary {
      height: 100vh;
      width: 60vw;
      background-color: #001529;
    }
    > div {
      /* border: 2px solid red; */
      width: 350px;
    }
    h2 {
      margin-bottom: 32px;
    }
    form {
      margin-bottom: 16px;
    }
    a {
      width: 100%;
    }
    > div > div {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    width: 40vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 1000px) {
    section {
      &.auxiliary {
        width: 0vw;
      }
      width: 100vw;
    }
  }
`;
