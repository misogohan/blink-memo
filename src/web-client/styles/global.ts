import { createGlobalStyle } from 'styled-components';
import wedgeLight from '~/img/wedge.light.svg';
import wedgeDark from '~/img/wedge.dark.svg';

export const GlobalStyle = createGlobalStyle`
  :root {
    background: white;
    color: black;
    font-size: 16px;
    @media screen and (min-width: 720px) {
      font-size: 24px;
    }
    font-family: 'Noto Sans JP', 'Noto Sans', sans-serif;
    --wedge-url: url("${wedgeLight}");
  }

  h1,h2,h3,h4,h5,h6 {
    font-weight: normal;
  }
  button {
    border-width: 0;
    border-color: black;
    padding: 0 .5rem;
    color: inherit;
    line-height: inherit;
    font-family: inherit;
    font-size: 1rem;
    background-color: transparent;
  }
  input[type='text'] {
    font-size: inherit;
    line-height: inherit;
    box-sizing: border-box;
    border-width: 0;
    border-color: black;
    color: inherit;
    background-color: transparent;
  }
  textarea {
    border-width: 1px;
    border-color: black;
    color: inherit;
    line-height: inherit;
    font-family: inherit;
    font-size: inherit;
    background-color: transparent;
  }

  * {
    margin: 0;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      background: black;
      color: white;
      --wedge-url: url("${wedgeDark}");
    }
    button, textarea, input[type='text'] {
      border-color: white;
    }
  }
`;
