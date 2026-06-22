"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./prelude");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const bootstrapper_1 = require("./bootstrapper");
const DatabaseService_1 = require("./db/DatabaseService");
const api_1 = require("./routes/api");
const PORT = Number(process.env['PORT'] ?? 3101);
function resolveFrontendDistDir() {
    const envDir = process.env['FRONTEND_DIST'];
    const candidates = [
        envDir,
        node_path_1.default.join(process.cwd(), 'frontend-dist'),
        node_path_1.default.join(node_path_1.default.dirname(process.execPath), 'frontend-dist'),
        node_path_1.default.resolve(__dirname, '..', '..', '..', '..', 'frontend', 'dist'),
        node_path_1.default.resolve(__dirname, '..', '..', '..', '..', '..', 'frontend', 'dist'),
    ].filter((value) => Boolean(value));
    for (const candidate of candidates) {
        if (node_fs_1.default.existsSync(node_path_1.default.join(candidate, 'index.html'))) {
            return candidate;
        }
    }
    return null;
}
// 1. Bootstrap: Master-DB bei jedem Start neu bauen
(0, bootstrapper_1.bootstrap)(true);
// 2. Services initialisieren
const dbService = new DatabaseService_1.DatabaseService();
const app = (0, express_1.default)();
// 3. Middleware
app.use((0, cors_1.default)({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173' }));
app.use(express_1.default.json({ limit: '8mb' }));
// Serve large high-resolution jerseys (check cwd and relative paths robustly)
function resolveJerseyDir() {
    const candidates = [
        node_path_1.default.join(process.cwd(), 'data', 'Jersey'),
        node_path_1.default.join(process.cwd(), '..', 'data', 'Jersey'),
        node_path_1.default.resolve(__dirname, '..', '..', 'data', 'Jersey'),
        node_path_1.default.resolve(__dirname, '..', '..', '..', 'data', 'Jersey'),
        node_path_1.default.resolve(__dirname, '..', '..', '..', '..', 'data', 'Jersey'),
    ];
    for (const candidate of candidates) {
        if (node_fs_1.default.existsSync(candidate)) {
            return candidate;
        }
    }
    return node_path_1.default.join(process.cwd(), 'data', 'Jersey'); // fallback
}
app.use('/jersey-large', express_1.default.static(resolveJerseyDir()));
// 4. Routes
app.use('/api', (0, api_1.createRouter)(dbService));
// 5. Health-Check
app.get('/health', (_req, res) => res.json({ ok: true }));
const frontendDistDir = resolveFrontendDistDir();
if (frontendDistDir) {
    app.use(express_1.default.static(frontendDistDir));
    app.get('*', (_req, res) => {
        res.sendFile(node_path_1.default.join(frontendDistDir, 'index.html'));
    });
}
// 6. Server starten
app.listen(PORT, () => {
    console.log(`Velo Backend läuft auf http://localhost:${PORT}`);
    // Im verpackten Zustand (pkg) automatisch den Browser öffnen
    if (process.pkg) {
        const url = `http://localhost:${PORT}`;
        const cmd = process.platform === 'win32' ? `start ""` : process.platform === 'darwin' ? 'open' : 'xdg-open';
        (0, node_child_process_1.exec)(`${cmd} "${url}"`, (err) => {
            if (err) {
                console.error(`Fehler beim automatischen Öffnen des Browsers: ${err.message}`);
            }
        });
    }
});
