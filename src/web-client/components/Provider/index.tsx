import { FC, StrictMode } from "react";
import { StyledThemeProvider } from "./styled-theme";

export const Providers: FC = ({ children }) => (
  <StrictMode>
    <StyledThemeProvider>
      { children }
    </StyledThemeProvider>
  </StrictMode>
);
