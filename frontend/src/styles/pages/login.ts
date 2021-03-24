import styled from "styled-components";

export const LoginWrapper = styled.main`
  height: 100vh;
  display: flex;
  section {
    &.auxiliary {
      height: 100vh;
      width: 65vw;
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
    width: 35vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
