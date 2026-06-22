import { defineConfig } from 'vite';

const apiTarget = process.env['VITE_API_TARGET'] ?? 'http://localhost:3101';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/jersey-large': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
