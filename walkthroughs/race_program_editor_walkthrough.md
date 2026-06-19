# Walkthrough - Rennen Programm-Editor (Programmübersicht & Analyse-Indikatoren)

Wir haben eine neue, interaktive View **Programmübersicht** (Programm-Editor) als eigenständigen Menüpunkt am Ende der Sidebar implementiert. Diese Ansicht bietet 5 spezialisierte Tabs zur Verwaltung und zum Export der Rennprogramme, Peak-Wochen, Rennzuweisungen und Rollenstatistiken. Zudem wurden vertiefte Analysemethoden, farbliche Warnindikatoren, Überschneidungsprüfungen und Einschränkungen bei der Rennprogramm-Auswahl integriert.

---

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
  - **Streckenprofile:** Zeigt bei Eintagesrennen das Profil (z. B. Flat, Cobble, Rolling) in einer eigenen Spalte an. Bei Rundfahrten öffnet ein Klick auf das Rennen ein Popover mit der Etappenübersicht.
  - **Sprinter-Defizit bei flachen Rundfahrten:** Sind bei Rundfahrten mit $\ge 2$ flachen/hügeligen Etappen (`Flat` / `Rolling`) $< 10$ Sprinter zugewiesen, wird die Zahl farblich hervorgehoben: Gelb bei 8-9 Sprintern, Rot bei $\le 7$ Sprintern.
  - **Cobble-Defizit bei Klassikern:** Sind bei Eintagesrennen mit Kopfsteinpflaster (`Cobble` / `Cobble_Hill`) $< 20$ Fahrer mit Pflasterspezialität (`Cobble` in `spec1`, `spec2` oder `spec3`) zugewiesen, leuchtet die Gesamtteilnehmerzahl im Tabellenfeld sowie im Header des Zuweisungs-Popovers rot auf.
  - **Zuweisungs-Popover per Klick auf Fahreranzahl:**
    - Ermöglicht das Aktivieren/Deaktivieren von Programmen für das Rennen.
    - **Einschränkung der Rennprogramm-Auswahl:** Ein Rennprogramm ist im Popover nur dann auswählbar, wenn dessen Peak- oder Vorbereitungsphase während des Laufs des jeweiligen Rennens aktiv ist. Bei Rundfahrten reicht es, wenn ein beliebiger Tag des Rennens in das Peak- oder Vorbereitungsfenster fällt. Inaktive Programme werden ausgegraut, sind nicht klickbar (`pointer-events: none`) und haben einen `not-allowed`-Cursor. Bereits zugewiesene inaktive Programme bleiben deselektierbar.
    - **Automatische Überschneidungsprüfung:** Wird ein Programm einem Rennen zugewiesen und hat dieses Programm bereits eine Zuweisung zu einem anderen Rennen, das sich zeitlich überschneidet, wird die vorherige Zuweisung automatisch entfernt, um Doppelplanungen zu verhindern. Die gesamte Seite wird direkt live aktualisiert.
    - Zeigt ein **orangefarbenes Ausrufezeichen-Icon `!`** neben Programmen, wenn das Rennen außerhalb deren Peak- und Aufbauphase liegt.
  - **Accordion-Details (Split auf Spec 1 / Spec 2):**
    - Zeigt Kombinationen aus Rolle, Spezialisierung 1 und Spezialisierung 2 (z. B. `Kapitän (Berg / Hügel)`).
    - Es werden **immer** Spec 1 und Spec 2 angezeigt. Wenn Spec 2 nicht vorhanden ist, wird diese als `—` dargestellt (z. B. `Sprinter (Sprint / —)`).
    - Kombinationen, die sowohl `Berg` als auch `Cobble` in Spec 1 and Spec 2 besitzen, werden orange hervorgehoben.
    - Ein Klick auf die Fahreranzahl klappt die genaue **Programmherkunft** (welches Programm wie viele Fahrer beiträgt) einzeilig auf.

- **Tab 5: Programm-Rollen (Erweitert & Sortierbar)**
  - Listet alle Programme mit Gesamtanzahl an Fahrern, Renntagen und Aufteilung nach Hauptrollen auf.
  - **Spalte "Renntage" (Neu):** Berechnet die Summe aller Renntage der zugewiesenen Rennen.
  - **Interaktive Sortierung:** Alle Spalten (ID, Name, Gesamt, Renntage und jede einzelne Rolle) sind sortierbar.
  - **Ausklappbare Detailansicht (Accordion mit Spec 1 / Spec 2 Split):**
    - Listet alle Rollen- und Spezialisierungskombinationen (Spec 1 / Spec 2) für das jeweilige Programm auf.
    - Spec 1 und Spec 2 werden immer angezeigt (mit `—` als Platzhalter).
    - Berg/Cobble-Kombinationen werden orange hervorgehoben.
    - Klick auf die Anzahl klappt die Zuweisungsherkunft (das Programm selbst) einzeilig auf.

### 3. Backend & Datenspeicherung ([RaceProgramsEditorService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/editor/RaceProgramsEditorService.ts))

- **Erweiterte SQL-Abfrage:** Die Methode `getRoleSpecCombinationsFromDb` selektiert und gruppiert zusätzlich nach `specialization_3_id`, um alle drei Spezialisierungen der Fahrer aus der Datenbank im Payload zur Verfügung zu stellen.
- Beim Klick auf **"Änderungen exportieren"** werden die Zuweisungen mit fortlaufenden IDs in `data/csv/race_program_races.csv` und `data/csv/race_programs.csv` zurückgeschrieben und live in die SQLite-Datenbank der laufenden Karriere synchronisiert.
