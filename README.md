# Velo – Radsport Director

Eine datengetriebene Radsport-Simulation gebaut mit **TypeScript**, **Electron** und **better-sqlite3**.

## Technologie-Stack

| Schicht | Technologie |
|---------|-------------|
| App-Shell | Electron 30 |
| Sprache | TypeScript 5 (strict) |
| Datenbank | better-sqlite3 (synchron, WAL-Modus) |
| Renderer | Vanilla HTML/CSS/JS (kein Framework) |

---

## Projektstruktur

```
velo/
├── assets/
│   ├── schema.sql           # Master-DB Schema
│   └── world_data.db        # Schreibgeschützte Master-DB (generiert via seed)
├── data/
│   ├── division_teams.csv   # Stammdaten für Ligen/Divisionen
│   └── teams.csv            # Stammdaten für Teams
├── scripts/
│   └── seed.ts              # Baut world_data.db aus CSV-Stammdaten und Startdaten
├── src/
│   ├── shared/
│   │   └── types.ts         # Alle gemeinsamen Typen (Rider, Race, IPC, …)
│   ├── main/                # Electron Main Process
│   │   ├── index.ts         # App-Einstiegspunkt
│   │   ├── preload.ts       # contextBridge API für den Renderer
│   │   ├── database/
│   │   │   ├── DatabaseService.ts   # Master-DB vs. Savegame-Logik
│   │   │   └── GameRepository.ts    # Datenzugriffs-Schicht
│   │   ├── ipc/
│   │   │   └── handlers.ts  # IPC-Handler (Main ↔ Renderer)
│   │   └── simulation/
│   │       └── TimeTrialSimulator.ts  # Zeitfahren-Simulation
│   └── renderer/            # Frontend
│       ├── index.html
│       ├── renderer.d.ts
│       ├── styles/main.css
│       └── scripts/app.js
├── package.json
└── tsconfig.json
```

---

## Quick Start

```bash
# 1. Abhängigkeiten
npm install

# 1a. Teilpakete installieren
npm --prefix backend install
npm --prefix frontend install

# 2. Backend + Frontend im Browser starten
npm start

# 3. Alias für denselben Browser-Start
npm run browser
```

---

## Datenbank-Konzept

```
assets/world_data.db          ← Schreibgeschützte Master-DB
        │  copyFileSync() beim "Neue Karriere"-Klick
        ▼
userData/savegames/karriere_xxx.db   ← Savegame (lebende Kopie)
```

## Stammdaten per CSV

Statische Welt- und Balancing-Daten liegen unter [data/division_teams.csv](data/division_teams.csv) und [data/teams.csv](data/teams.csv). Der Seed-Lauf liest diese Dateien ein und baut daraus die Master-Datenbank neu auf.

Das Muster ist absichtlich pro Stammdatentabelle aufgebaut:
- `division_teams.csv` für Liga-Struktur und Regeln
- `teams.csv` für Team-Stammdaten

Savegame-Tabellen wie Spielstand, Verträge oder Rennergebnisse gehören nicht in dieses CSV-System.

## Browser-Testmodus

Mit `npm run browser` oder `npm start` werden Backend und Frontend parallel gestartet. Das Frontend läuft per Vite auf Port 5173 und leitet `/api` an das Backend auf Port 3000 weiter.

## Zeitfahren-Simulation (Meilenstein 1)

`TimeTrialSimulator.simulate(race, riders)` berechnet pro Fahrer:
- **Basisgeschwindigkeit** aus Streckenprofil (Flach 50 km/h / Hügelig 41 / Berg 30)
- **±0,28 km/h** pro TT-Attributpunkt über/unter 50
- **Tagesform** `[0.88–1.12]` + ±1,5% Rauschen

## Nächste Meilensteine

- M2: Etappenrennen (Flat/Hilly/Mountain)
- M3: Kaderverwaltung & Transfers
- M4: Fahrer-Progression (Alter, Potenzial)
- M5: Regen-System (neue Nachwuchsfahrer)
- M6: Mehretappige Rennen (GC, Trikots)

