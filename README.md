# Velo – Radsport Director

Eine datengetriebene Radsport-Simulation mit Express-Backend, Vite-Frontend und better-sqlite3.

## Technologie-Stack

| Schicht | Technologie |
|---------|-------------|
| Backend | Express + TypeScript |
| Frontend | Vite + Vanilla TypeScript |
| Datenbank | better-sqlite3 |
| Gemeinsame Typen | shared/types.ts |

## Projektstruktur

```
velo/
├── backend/
│   ├── assets/
│   │   ├── schema.sql
│   │   └── world_data.db
│   └── src/
├── frontend/
│   ├── index.html
│   └── src/
├── shared/
│   └── types.ts
└── data/
    └── csv/
        ├── division_teams.csv
        ├── teams.csv
        └── game_state.csv
```

## Start

```bash
npm install
npm run dev
```

Das startet:
- Backend auf http://localhost:3000
- Frontend auf http://localhost:5173

## Datenbank-Verhalten

- Die Master-DB wird bei jedem Backend-Start neu aus den CSV-Dateien aufgebaut.
- Die Master-DB liegt unter [backend/assets/schema.sql](backend/assets/schema.sql) und [backend/assets/world_data.db](backend/assets/world_data.db).
- Neue Karrieren werden als Kopie der Master-DB im Savegame-Ordner erstellt.
- Savegames bleiben erhalten und werden beim Serverstart nicht neu gebaut.

## Startzustand

- Der initiale Spielzustand kommt aus [data/csv/game_state.csv](data/csv/game_state.csv).
- Standardmäßig startet jede neue Karriere am `2026-01-01`.

## Hinweise

- Wenn das Datum im UI nicht zum aktuellen Code passt, den Backend-Prozess neu starten und eine neue Karriere anlegen.
- Bestehende alte Savegames behalten ihren gespeicherten Zustand.

