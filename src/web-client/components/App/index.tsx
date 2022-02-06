import { RoconRoot } from 'rocon/react';
import { RoconErrorBoundary, ToplevelRoutes } from '~/web-client/routes';
import { GlobalStyle } from '~/web-client/styles/global';

const App = () => (
  <>
    <RoconErrorBoundary>
      <RoconRoot>
        <ToplevelRoutes />
      </RoconRoot>
    </RoconErrorBoundary>
    <GlobalStyle />
  </>
);

export default App;
