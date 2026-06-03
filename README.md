# Velo – Radsport Director

Eine datengetriebene Radsport-Simulation als Monorepo mit Express-Backend, Vite-Frontend, gemeinsamen TypeScript-Verträgen und CSV-basierter Spieldatenbasis.

## Technologie-Stack

| Schicht | Technologie |
|---------|-------------|
| Backend | Express + TypeScript + better-sqlite3 |
| Frontend | Vite + Vanilla TypeScript |
| Gemeinsamer Code | shared/types.ts, shared/stageResultRules.ts, shared/skillWeights.ts |
| Datenbasis | CSV-Dateien unter data/csv plus Stage-Profile unter data/stages |

## Projektstruktur

```text
velo/
├── backend/
│   ├── assets/              # SQLite-Schema und generierte Master-DB
│   ├── dist/                # Backend-Build-Ausgabe
│   ├── scripts/             # Hilfsskripte fuer Seed- und Datenaufbau
│   ├── src/
│   │   ├── bootstrapper.ts  # Server- und Initialisierungslogik
│   │   ├── server.ts        # Express-Startpunkt
│   │   ├── db/              # Repository- und DB-Zugriff
│   │   ├── game/            # Karriere- und Spiellogik
│   │   ├── routes/          # REST-API-Endpunkte
│   │   └── simulation/      # Renn- und Etappensimulation
│   └── tsconfig.json
├── frontend/
│   ├── dist/                # Frontend-Build-Ausgabe
│   ├── public/              # Statische Assets wie Trikots
│   ├── src/
│   │   ├── api.ts           # Frontend-API-Client
│   │   ├── app.ts           # App-State und View-Logik
│   │   ├── main.ts          # Vite-Einstiegspunkt
│   │   ├── main.css         # Globale Styles
│   │   ├── race-sim/        # Live-Race-UI und Simulation-Rendering
│   │   └── riderStatsUi.ts  # Fahrerstatistik-UI
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
├── shared/
│   ├── skillWeights.ts      # Gemeinsame Skill-Gewichtungen
│   ├── stageResultRules.ts  # Etappenresultat- und Zeitlimit-Regeln
│   └── types.ts             # Gemeinsame Typen zwischen Backend und Frontend
├── data/
│   ├── csv/                 # Stammdaten wie Teams, Fahrer, Rennen, Regeln, Verträge
│   ├── stages/              # Etappenprofil-Dateien und Dummy-Profile
│   └── Jersey/              # Zusätzliche Jersey-Assets
├── package.json             # Root-Skripte fuer parallelen Dev-Start und Build
└── README.md
```

## Entwicklung starten

Im Root-Verzeichnis installieren und starten:

```bash
npm install
npm run start
```

`npm install` im Root installiert automatisch auch die Abhängigkeiten in `backend/` und `frontend/`.

Alternativ identisch:

```bash
npm run dev
npm run browser
```

Das Root-Skript startet beide Teilprojekte parallel:
- Backend auf http://localhost:3101
- Frontend auf http://localhost:5173

Das Frontend proxyt API-Aufrufe an das Backend.

## Wichtige Skripte

Im Root:

```bash
npm run start     # Backend-Dev-Server + Frontend-Vite parallel
npm run dev       # Alias fuer start
npm run browser   # Alias fuer start
npm run build     # Build fuer backend/ und frontend/
```

Im Backend:

```bash
npm --prefix backend run dev
npm --prefix backend run build
```

Im Frontend:

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
```

## Daten und Datenbank

- Die Spiellogik basiert auf CSV-Stammdaten unter [data/csv](data/csv).
- Etappenprofile liegen unter [data/stages](data/stages).
- Das SQLite-Schema liegt unter [backend/assets/schema.sql](backend/assets/schema.sql).
- Die generierte Master-DB liegt unter [backend/assets](backend/assets).
- Backend und Frontend verwenden gemeinsame Typen und Regeln aus [shared/types.ts](shared/types.ts), [shared/stageResultRules.ts](shared/stageResultRules.ts) und [shared/skillWeights.ts](shared/skillWeights.ts).

## Hinweise

- Wenn sich CSV-, Regel- oder Simulationslogik aendert, Backend neu starten.
- Wenn das UI auf alten API-Stand reagiert, den Root-Dev-Start neu ausfuehren.
- Build-Ausgaben liegen getrennt in [backend/dist](backend/dist) und [frontend/dist](frontend/dist).

