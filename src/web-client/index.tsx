import App from './components/App';
import { createRoot } from "react-dom/client";

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

createRoot(root).render(<App />);
