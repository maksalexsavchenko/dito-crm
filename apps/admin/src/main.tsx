import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { tenants, defaultTenantId } from '@dito/config';
import { router } from './router';
import { applyTenantTheme } from './lib/theme';
import './i18n';
import './index.css';

// Застосовуємо тему дефолтного tenant-а до першого рендеру.
applyTenantTheme(tenants[defaultTenantId]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
