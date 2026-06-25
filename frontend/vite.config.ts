import { defineConfig } from 'vite';
import { webcrypto } from 'node:crypto';

// Polyfill global crypto for older Node.js versions
if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: true,
    configurable: true,
  });
}

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
