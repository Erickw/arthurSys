import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  * {
    padding: 0;
    margin: 0;
    outline: none;
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
  }

  body {
    min-width: 700px;
  }

  html, body {
    font-family: 'Roboto', sans-serif;
  }
`;
