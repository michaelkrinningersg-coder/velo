import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    // better-sqlite3 is a native addon; keep tests in a single-threaded pool
    // to avoid loading the binding across many worker processes.
    pool: 'threads',
  },
});
