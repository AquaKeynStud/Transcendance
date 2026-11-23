import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@/index.css';

// MSW ne tourne qu'en dev, et seulement si VITE_MSW ne vaut pas "off".
async function enableMocks() {
  if (!import.meta.env.DEV || import.meta.env.VITE_MSW === 'off') return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true });
}

const root = document.getElementById('root');
if (!root) throw new Error('#root introuvable dans index.html');

void enableMocks().then(() => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
