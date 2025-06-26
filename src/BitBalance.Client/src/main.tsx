import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from '@radix-ui/react-toast';
import { store } from './lib/store.ts';

createRoot(document.getElementById("root")!).render(<Provider store={store}> <App /></Provider>);
