import { RoconRoot } from 'rocon/react';
import { RoconErrorBoundary, ToplevelRoutes } from '~/web-client/routes';
import { GlobalStyle } from '~/web-client/styles/global';
import { Providers } from '~/web-client/components/Provider';

const App = () => (
  <Providers>
    <RoconErrorBoundary>
      <RoconRoot>
        <ToplevelRoutes />
      </RoconRoot>
    </RoconErrorBoundary>
    <GlobalStyle />
  </Providers>
);

export default App;
