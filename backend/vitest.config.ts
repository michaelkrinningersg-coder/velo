import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Die Kalibrier-Werkzeuge unter tools/ liegen ausserhalb des Backend-Builds,
    // ihre Tests laufen aber mit der Backend-Suite mit — ein Testlauf, ein Ergebnis.
    include: ['src/**/*.test.ts', '../tools/**/*.test.ts'],
    // better-sqlite3 is a native addon; keep tests in a single-threaded pool
    // to avoid loading the binding across many worker processes.
    pool: 'threads',
  },
});
