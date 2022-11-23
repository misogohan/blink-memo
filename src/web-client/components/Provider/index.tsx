import {FC, PropsWithChildren, StrictMode} from "react";
import { StyledThemeProvider } from "./styled-theme";

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <StrictMode>
    <StyledThemeProvider>
      { children }
    </StyledThemeProvider>
  </StrictMode>
);
