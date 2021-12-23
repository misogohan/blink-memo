import 'styled-components';

interface ThemeObject {
}

declare module 'styled-components' {
  interface DefaultTheme extends Readonly<ThemeObject> {}
}
