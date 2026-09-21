import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import DemoOne from '@/components/ui/demo';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {new URLSearchParams(window.location.search).get('demo') === 'matrix' ? <DemoOne /> : <App />}
  </StrictMode>,
);
