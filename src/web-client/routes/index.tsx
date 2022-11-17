import { Component, FC } from 'react';
import Rocon, { isLocationNotFoundError, useRoutes } from 'rocon/react';
import Edit, {List} from '../components/Page/edit';
import TopPage from '../components/Page/top';

export const editRoute = Rocon.Search('id', { optional: true })
  .action(({ id }) => id == null ? <List /> : <Edit id={ id }/>);

export const toplevelRoutes = Rocon.Path()
  .exact({ action: () => <TopPage /> })
  .route('edit', route => route.attach(editRoute));

export const ToplevelRoutes: FC = () => useRoutes(toplevelRoutes);
export class RoconErrorBoundary extends Component<{}, { notFound: boolean }> {
  state = { notFound: false };

  componentDidCatch(error: unknown) {
    if (isLocationNotFoundError(error)) {
      this.setState({
        notFound: true,
      });
    } else {
      throw error;
    }
  }

  render() {
    if (this.state.notFound) {
      return (
        <p>
          Location Not Found.<br />
          <a href='/'>back to top</a>.
        </p>
      );
    } else return this.props.children;
  }
}

