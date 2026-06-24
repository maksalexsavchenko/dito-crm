import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // У монорепо змушуємо єдиний інстанс React (інакше "invalid hook call").
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Резолвимо workspace-пакети прямо на TS-сорси, щоб Vite їх транспілював.
      '@dito/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@dito/config': path.resolve(__dirname, '../../packages/config/src'),
    },
  },
  server: { port: 5173 },
});
