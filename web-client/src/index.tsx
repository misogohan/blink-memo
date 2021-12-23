import { render } from 'react-dom';
import App        from '~/components/App';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

render(<App/>, root);
