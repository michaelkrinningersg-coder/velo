# Velo – Copilot Instructions

Velo ist eine Radsport-Manager-Simulation gebaut mit **TypeScript 5 (strict)**, **Electron 30** und **better-sqlite3**.

## Build & Test

```bash
npm install          # Abhängigkeiten
npm run seed         # Master-DB aus CSV neu aufbauen (assets/world_data.db)
npm run build        # TypeScript kompilieren → dist/
npm start            # Build + Electron starten
npm run browser      # Renderer isoliert im Browser testen (Mock-Daten)
npm run lint         # ESLint auf src/
```

Es gibt keine automatisierten Tests. Logik manuell über `npm start` oder `npm run browser` prüfen.

## Architektur

```
Electron Main Process  ←IPC→  Renderer (Vanilla HTML/CSS/JS)
        │
   DatabaseService
   ├── world_data.db   (schreibgeschützte Master-DB, Assets)
   └── savegame.db     (lebende Kopie pro Karriere, userData)
```

- **`src/shared/types.ts`** — einzige Quelle für alle gemeinsamen Typen (Rider, Race, Team, IPC-Payloads). Neue Typen immer hier.
- **`src/main/ipc/handlers.ts`** — alle IPC-Handler registriert; neues Feature → neuer Handler hier + `preload.ts` erweitern.
- **`src/main/database/GameRepository.ts`** — Datenzugriff (SQL); **`DatabaseService.ts`** — Master-DB vs. Savegame-Logik.
- **`src/renderer/scripts/app.js`** — UI-Logik; spricht ausschließlich über `window.veloApi` (contextBridge).

## Datenbankkonventionen

- SQLite synchron (better-sqlite3), kein async/await für DB-Aufrufe.
- Savegame entsteht durch `copyFileSync()` von `world_data.db` → `userData/savegames/`.
- Stammdaten (Teams, Divisionen) kommen aus CSV-Dateien unter `data/`; nach Änderungen `npm run seed` ausführen.
- Divisionen: `WorldTour`, `ProTour`, `U23` — Quelle ist `division_teams.csv`, nicht eine `divisions`-Tabelle.
- Savegame-Tabellen (Spielstand, Verträge, Rennergebnisse) gehören **nicht** ins CSV-System.

## Spielstand & Simulation

- `game_state`-Zeile ist die Single Source of Truth für `current_date` (ISO-String) und `season` (Jahr).
- `GameStateService.advanceDay()` erhöht das Datum exakt um einen Tag; Jahreswechsel hebt `season` mit.
- `TimeTrialSimulator`: Basisgeschwindigkeit nach Streckenprofil (Flach 50 / Hügelig 41 / Berg 30 km/h), ±0,28 km/h pro TT-Attributpunkt um 50, Tagesform `[0.88–1.12]` + ±1,5% Rauschen.
- Altersberechnung: `age = season - birthYear` (kein `Date`-Objekt wegen IPC-Serialisierung).

## Konventionen

- TypeScript `strict: true` — kein `any` ohne Kommentar.
- Attribute-Werte sind immer `[0–100]`.
- `Nationality`-Typ statt freier Strings für Ländercodes.
- Renderer nutzt kein Framework — kein React, Vue o. Ä. hinzufügen.
- Browser-Testmodus: `src/renderer/scripts/browser-api.js` liefert Mock-Daten wenn `window.veloApi` fehlt.

## Nächste Meilensteine (Kontext)

M2 Etappenrennen · M3 Kaderverwaltung & Transfers · M4 Fahrer-Progression · M5 Nachwuchs · M6 GC/Trikots
