# velo

Reduzierter Neustart des Projekts mit einem einfachen Hauptmenue in Flet.

## Enthaltene Menuepunkte
- Kalender
- Saison Ergebnisse
- Fahrer
- Teams Standings

## Lokales Setup
1. Virtuelle Umgebung erstellen:
   `/usr/local/python/3.12.1/bin/python -m venv .venv`
2. Pakete installieren:
   `.venv/bin/python -m pip install --upgrade pip setuptools wheel`
   `.venv/bin/python -m pip install -r requirements.txt`
3. App starten:
   `.venv/bin/python main.py`

## Hinweis
Das bisherige Datenmodell und alle zugehoerigen Daten/Import-Export-Features wurden entfernt.

## Teams Datenbasis
- Beim Start der App wird eine lokale SQLite-Datei `velo.db` im Projektverzeichnis angelegt.
- Das Schema fuer die Teams-Tabelle liegt in `schema.sql`.
- Die Seed-Daten fuer Teams liegen in `data/teams.csv`.
- Die Divisionen liegen in `data/divisions.csv`.
- Beide CSV-Dateien werden beim App-Start importiert/aktualisiert.

## Relationales Schema
Die `teams` Tabelle referenziert die `divisions` Tabelle ueber einen Foreign Key:
- `teams.division_id` -> `divisions.division_id`
- Dies ermoeglicht eine normalisierende Struktur und zentrale Verwaltung von Divisionen.

## Teams CSV Format
Die Datei `data/teams.csv` verwendet diese Spalten:

`team_id, team_name, abbreviation, budget, main_sponsor1_id, main_sponsor2_id, prestige, division_id, uci_points, jersey_asset_id`

Leere Felder fuer `team_id`, `main_sponsor1_id`, `main_sponsor2_id` und `jersey_asset_id` werden beim Import als `NULL` behandelt. `team_id` wird automatisch durch SQLite vergeben.

## Divisions CSV Format
Die Datei `data/divisions.csv` verwendet diese Spalten:

`Division_Id, Division_name`

Gueltige Divisionen werden beim App-Start synchronisiert. Die Standard-Divisionen sind:
- 1: Fantasy
- 2: Development

## Migration
Wenn eine bestehende `velo.db` mit dem alten Schema (TEXT division Spalte) existiert, wird diese automatisch migriert. Die Tabellenstruktur wird aktualisiert und Daten werden unter Beibehaltung der Division-Mappings uebertragen.
