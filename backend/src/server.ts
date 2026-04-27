import express from 'express';
import cors from 'cors';
import { bootstrap } from './bootstrapper';
import { DatabaseService } from './db/DatabaseService';
import { createRouter } from './routes/api';

const PORT = Number(process.env['PORT'] ?? 3000);

// 1. Bootstrap: Master-DB bei jedem Start neu bauen
bootstrap(true);

// 2. Services initialisieren
const dbService = new DatabaseService();
const app = express();

// 3. Middleware
app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173' }));
app.use(express.json());

// 4. Routes
app.use('/api', createRouter(dbService));

// 5. Health-Check
app.get('/health', (_req, res) => res.json({ ok: true }));

// 6. Server starten
app.listen(PORT, () => {
  console.log(`Velo Backend läuft auf http://localhost:${PORT}`);
});
