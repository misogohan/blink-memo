import { RoconRoot } from 'rocon/react';
import { ToplevelRoutes } from '~/routes';
import { GlobalStyle } from '~/styles/global';

const App = () => (
  <>
    <RoconRoot>
      <ToplevelRoutes />
    </RoconRoot>
    <GlobalStyle />
  </>
);

export default App;
