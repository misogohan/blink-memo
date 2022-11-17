import 'styled-components';

export type ThemeObject = {
}

declare module 'styled-components' {
  interface DefaultTheme extends Readonly<ThemeObject> {}
}

