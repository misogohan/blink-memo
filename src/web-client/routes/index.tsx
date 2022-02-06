import { Component, FC } from 'react';
import Rocon, { isLocationNotFoundError, useRoutes } from 'rocon/react';
import Note from '../components/Page/edit/note';
import TopPage from '../components/Page/top';

export const editRoutes = Rocon.Path()
  .route('note', route => route.action(() => <Note/>));

export const toplevelRoutes = Rocon.Path()
  .exact({ action: () => <TopPage /> })
  .route('edit', route => route.attach(editRoutes));

export const ToplevelRoutes: FC = () => useRoutes(toplevelRoutes);

export class RoconErrorBoundary extends Component<{}, { notFound: boolean }> {
  state = {
    notFound: false,
  };

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
