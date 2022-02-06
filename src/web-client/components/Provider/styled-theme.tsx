import { FC } from 'react';
import { ThemeProvider } from 'styled-components';
import { ThemeObject } from '~/types/styled-components';

export const StyledThemeProvider: FC = ({ children }) => {
  const theme: ThemeObject = {};
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
