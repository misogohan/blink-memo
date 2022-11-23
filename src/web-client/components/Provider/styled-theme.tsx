import {FC, PropsWithChildren} from 'react';
import { ThemeProvider } from 'styled-components';
import { ThemeObject } from '~/types/styled-components';

export const StyledThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme: ThemeObject = {};
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
