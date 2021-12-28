import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    background: white;
    color: black;
    font-size: 16px;
    @media screen and (min-width: 720px) {
      font-size: 24px;
    }
    font-family: 'Noto Sans JP', 'Noto Sans', sans-serif;
  }

  a {
    color: #66F;
  }

  * {
    margin: 0;
  }

  @media (prefers-color-scheme: dark) {
    html {
      background: black;
      color: white;
    }
  }
`;
