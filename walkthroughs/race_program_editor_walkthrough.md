# Walkthrough - Rennen Programm-Editor (Programmübersicht)

Wir haben eine neue, interaktive View **Programmübersicht** (Programm-Editor) als eigenständigen Menüpunkt am Ende der Sidebar implementiert. Diese Ansicht bietet 5 spezialisierte Tabs zur Verwaltung und zum Export der Rennprogramme, Peak-Wochen, Rennzuweisungen und Rollenstatistiken.

## Durchgeführte Änderungen

### 1. Benutzeroberfläche & Navigation

- **Sidebar-Button:** Ein neuer Button mit dem Icon `🗓` ("Programm-Editor") wurde am unteren Ende der Navigationsleiste in [index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html) hinzugefügt.
- **Main View Container:** Der Container `#view-race-programs` wurde in [index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html) definiert und steuert die Visualisierung und Aktionstasten (Export/Zurücksetzen).
- **Styling:** Die Stylings für das Matrix-Grid, Sticky-Columns, Farbmarkierungen und absolute Popover-Karten wurden in [main.css](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/main.css) implementiert.

### 2. Frontend-Logik & Steuerungen ([racePrograms.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/racePrograms.ts))

- **Tab 1: Kalender Programme (Spalten)**
  - Zeigt Programme als Spalten und Kalendertage als Zeilen an.
  - Hebt Peak-Wochen (Orange) und Vorbereitungswochen (Grau, bis zu 8 Wochen vor dem Peak) farblich hervor.
  - **Rennkategorien-Anzeige:** Unterhalb des Datum-Labels in der ersten Spalte werden alle an diesem Tag stattfindenden Rennen mit ihren jeweiligen Farbcodes der Rennkategorien (gemäß `resolveRaceCategoryBadgeStyle`) aufgelistet.
  - Ermöglicht das Zuweisen von Programmen auf Rennen am Tag durch Klicken (Toggle/Cycle-Logik bei mehreren Rennen).
  - Zeigt Statistiken über verplante Tage im Peak, Aufbau oder ohne Phase im Tabellenkopf.

- **Tab 2: Kalender Programme (Zeilen)**
  - Transponierte Ansicht mit Programmen in den Zeilen und Tagen in den Spalten.
  - Der Tabellenkopf zeigt das Datum, die Kalenderwoche, die Anzahl der täglichen Rennen sowie 3 separate Zeilen für stattfindende Rennen an.
  - Hover-Tooltips geben detaillierte Auskunft über die Namen der Rennen und die Anzahl zugewiesener Programme.

- **Tab 3: Peak-Editor Programme**
  - Ermöglicht die direkte Bearbeitung der Min/Max KW für drei separate Peaks pro Programm.
  - Bietet eine komfortable Datumsauswahl (Date Picker), die automatisch die Kalenderwoche berechnet und das Min/Max-Intervall auf `KW - 2` bis `KW + 2` (geclampt auf `[1..53]`) setzt.
  - Zeigt ein gelbes Warnsymbol `⚠️`, falls Peak-Bereiche weniger als 8 Wochen auseinander liegen.

- **Tab 4: Rider-Role Programme**
  - Listet alle Rennen chronologisch nach Datum auf.
  - **Eintagesrennen:** Zeigt das Streckenprofil (z. B. Flat, Cobble, Rolling) in einer eigenen Spalte an.
  - **Rundfahrten:** Durch Klicken auf den Rennnamen öffnet sich ein kleines, absolut positioniertes Hover-Fenster (im Stil der Season-Standings) mit der Übersicht aller Etappenprofile und einer aggregierten, absteigend sortierten Liste der Profile (z. B. "Flat: 3x", "Rolling: 2x").
  - **Programm-Verwaltung per Klick auf Fahreranzahl:** Durch Klick auf die Gesamtfahreranzahl eines Rennens öffnet sich ein weiteres absolut positioniertes Hover-Fenster:
    - Listet alle Programme absteigend sortiert nach ihrer Fahreranzahl auf.
    - Zeigt für jedes Programm die Rollenverteilung der Fahrer (z. B. `(5 Kap., 2 Edel.)`).
    - Ermöglicht es, das Programm direkt für dieses Rennen an- oder abzuwählen (Toggle).
    - Zeigt ein **orangefarbenes Ausrufezeichen-Icon `!`** (im Kreis) neben dem Programm an, wenn das Rennen für dieses Programm weder in dessen Peak- noch in dessen Aufbauwoche liegt (Fehlplanungs-Indikator).
  - **Erweiterte Accordion-Details:** Jedes Rennen kann per Klick auf `▶` aufgeklappt werden, um die genaue Kombination aus Rolle, Spezialisierung 1 (Spec 1) und Spezialisierung 2 (Spec 2) sortiert nach den Profilvorgaben des Rennens aufzulisten (z. B. `Kapitän (Berg / Hill) - 1 Fahrer`).

- **Tab 5: Programm-Rollen (Neu)**
  - Ein neuer fünfter Tab, der eine Übersicht über alle Programme und deren detaillierte Rollenverteilung liefert.
  - Zeigt in Tabellenform für jedes Programm die Anzahl der zugewiesenen Fahrer insgesamt sowie die Anzahl der Fahrer pro Rolle (Kapitän, Co-Kapitän, Sprinter, Edelhelfer, Starke Helfer, Wasserträger) an.
  - Bietet einen schnellen Überblick über die Zusammensetzung der Kader der einzelnen Programme.

### 3. Backend & Datenspeicherung ([RaceProgramsEditorService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/editor/RaceProgramsEditorService.ts))

- Der Service lädt alle CSVs aus `data/csv/` und `debug/`.
- **Echte Kombinationsabfrage aus der SQLite DB:** Wenn eine aktive Savegame-Verbindung geladen ist, fragt der Service die tatsächlichen Zuweisungen und Fahrerdaten (Rolle, Spec 1, Spec 2) direkt per SQL-Abfrage aus der Datenbank ab. Andernfalls fällt er sicher auf die CSV-Statistiken zurück.
- Beim Klick auf **"Änderungen exportieren"** werden die Zuweisungen mit fortlaufenden IDs versehen und direkt in `data/csv/race_program_races.csv` und `data/csv/race_programs.csv` zurückgeschrieben.
- Die Änderungen werden live in die aktive SQLite-Datenbank der laufenden Karriere geschrieben, um eine sofortige Auswirkung im Spiel ohne Neustart zu garantieren.

---

## Verifikationsergebnisse

### Automatische Tests / Build
- Das Projekt kompiliert vollständig und fehlerfrei via Vite und tsc. Der `npm run build` Befehl wurde erfolgreich ausgeführt.

```
vite v5.4.21 building for production...
✓ 43 modules transformed.
dist/index.html                  56.51 kB │ gzip:   9.11 kB
dist/assets/index-CwH_KKhQ.css   98.76 kB │ gzip:  17.88 kB
dist/assets/index-BQhW7eqC.js   581.49 kB │ gzip: 141.38 kB
✓ built in 1.62s
```

### Manuelle Tests / Gameplay-Verhalten
1. Der **Programm-Editor** lässt sich über die Sidebar öffnen.
2. Der neue Tab **Programm-Rollen** stellt alle Programmnamen mit den Riderzahlen je Rolle sauber in einer Tabelle dar.
3. Im Tab 4 (Rider Role) werden beim Aufklappen der Details nun sowohl Spec 1 als auch Spec 2 mit der Rolle kombiniert dargestellt (z. B. `Kapitän (Berg / Hill) 5 fahrer`).
4. Der "Änderungen exportieren"-Button speichert die Werte persistent ab und synchronisiert sie direkt mit der SQLite-Verbindung.
