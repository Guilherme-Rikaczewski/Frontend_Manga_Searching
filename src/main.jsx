import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App.jsx';
import { ToastProvider } from './shared/components/ToastGlobal/Toast.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
)