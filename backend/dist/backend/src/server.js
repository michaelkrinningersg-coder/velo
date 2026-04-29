"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bootstrapper_1 = require("./bootstrapper");
const DatabaseService_1 = require("./db/DatabaseService");
const api_1 = require("./routes/api");
const PORT = Number(process.env['PORT'] ?? 3000);
// 1. Bootstrap: Master-DB bei jedem Start neu bauen
(0, bootstrapper_1.bootstrap)(true);
// 2. Services initialisieren
const dbService = new DatabaseService_1.DatabaseService();
const app = (0, express_1.default)();
// 3. Middleware
app.use((0, cors_1.default)({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173' }));
app.use(express_1.default.json({ limit: '8mb' }));
// 4. Routes
app.use('/api', (0, api_1.createRouter)(dbService));
// 5. Health-Check
app.get('/health', (_req, res) => res.json({ ok: true }));
// 6. Server starten
app.listen(PORT, () => {
    console.log(`Velo Backend läuft auf http://localhost:${PORT}`);
});
