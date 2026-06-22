import './prelude';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { bootstrap } from './bootstrapper';
import { DatabaseService } from './db/DatabaseService';
import { createRouter } from './routes/api';

const PORT = Number(process.env['PORT'] ?? 3101);

function resolveFrontendDistDir(): string | null {
  const envDir = process.env['FRONTEND_DIST'];
  const candidates = [
    envDir,
    path.join(process.cwd(), 'frontend-dist'),
    path.join(path.dirname(process.execPath), 'frontend-dist'),
    path.resolve(__dirname, '..', '..', '..', '..', 'frontend', 'dist'),
    path.resolve(__dirname, '..', '..', '..', '..', '..', 'frontend', 'dist'),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'index.html'))) {
      return candidate;
    }
  }

  return null;
}

// 1. Bootstrap: Master-DB bei jedem Start neu bauen
bootstrap(true);

// 2. Services initialisieren
const dbService = new DatabaseService();
const app = express();

// 3. Middleware
app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '8mb' }));

// Serve large high-resolution jerseys (check cwd and relative paths robustly)
function resolveJerseyDir(): string {
  const candidates = [
    path.join(process.cwd(), 'data', 'Jersey'),
    path.join(process.cwd(), '..', 'data', 'Jersey'),
    path.resolve(__dirname, '..', '..', 'data', 'Jersey'),
    path.resolve(__dirname, '..', '..', '..', 'data', 'Jersey'),
    path.resolve(__dirname, '..', '..', '..', '..', 'data', 'Jersey'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.join(process.cwd(), 'data', 'Jersey'); // fallback
}
app.use('/jersey-large', express.static(resolveJerseyDir()));

// 4. Routes
app.use('/api', createRouter(dbService));

// 5. Health-Check
app.get('/health', (_req, res) => res.json({ ok: true }));

const frontendDistDir = resolveFrontendDistDir();
if (frontendDistDir) {
  app.use(express.static(frontendDistDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDistDir, 'index.html'));
  });
}

// 6. Server starten
app.listen(PORT, () => {
  console.log(`Velo Backend läuft auf http://localhost:${PORT}`);

  // Im verpackten Zustand (pkg) automatisch den Browser öffnen
  if ((process as any).pkg) {
    const url = `http://localhost:${PORT}`;
    const cmd = process.platform === 'win32' ? `start ""` : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${cmd} "${url}"`, (err) => {
      if (err) {
        console.error(`Fehler beim automatischen Öffnen des Browsers: ${err.message}`);
      }
    });
  }
});
