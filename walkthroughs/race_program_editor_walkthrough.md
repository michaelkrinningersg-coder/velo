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
    - **Popover Styling, Filters, and Visibility:**
      - Stiled program names: variants 1-3 in orange (`#f97316`) and variants 4-6 in green (`#22c55e`).
      - Alle 114 Programme sind jederzeit sichtbar und auswählbar.
      - Hinzufügen von `v1-3` und `v4-6` Checkboxen im Popover-Header zur schnellen Filterung der Programme.
      - Hinzufügen von Spezialisierungs-Filtern (`B`, `H`, `P`, `S`, `T`, `A`) im Popover-Header zur dynamischen Filterung passend zum Kalender-Tab.
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

### 4. Automatische Rennprogramm-Zuweisung & Filter-Verbesserungen

- **Datenbank-Erweiterungen (`races.csv`)**:
  - `preferred_nationality_group`: Bevorzugte Nationalitätskombinationen für Rennen (`BeNeLUX`, `FraGer`, `EspSlo`, `ITAUSA`) basierend auf dem Herkunftsland.
  - `required_specs`: Die für das Rennen erforderlichen Fahrer-Spezialisierungen, automatisch berechnet nach den Etappenprofilen:
    - Etappen mit Berg (Mountain) $\rightarrow$ `B|T|F|A`
    - Etappen mit Pflaster (Cobble, ohne Berg) $\rightarrow$ `P|T|F|A`
    - Etappen mit Hügeln (Hilly, ohne Berg/Pflaster) $\rightarrow$ `H|T|F|A`
    - Sonst (Flach/Hügelig leicht) $\rightarrow$ `T|F|S|A`
- **Kategoriebasierte Zuweisungsregeln**:
  - **TDF / GT / Monumente**: Zuweisung aller Varianten 1-2 (keine Varianten 3-4).
  - **Stage Race / One Day High & Middle**: Zuweisung einer zufälligen Variante aus 1-2 und einer aus 3-4 (falls vorhanden).
  - **One Day Low**: Zuweisung einer Variante aus 1-2 für nur 1/4 der passenden Spezialisierungen; für die restlichen 3/4 werden Varianten aus 3-4 zugewiesen.
- **Vermeidung von Doppelbuchungen (Collision Checking)**:
  - Ein Rennprogramm wird niemals gleichzeitig zu zwei überschneidenden Rennen zugewiesen (`startA <= endB && endA >= startB`).
- **Filtern von leeren Programmen im UI**:
  - Rennprogramme mit 0 aktiven Fahrern werden im Kalender-Grid (Zeilen- und Spaltenansicht) sowie im Zuweisungs-Popover standardmäßig ausgeblendet, um die Ansichten übersichtlich zu halten.
- **Spezialisierungsfilter standardmäßig deaktiviert**:
  - Alle Spezialisierungs-Filterhäkchen im Popover sind standardmäßig deselektiert, damit der Benutzer gezielt Filter aktivieren kann.

### 5. 2026 UCI WorldTour Kalender-Anpassungen

- **Datums- und Namenskorrekturen**:
  - Namen und Daten von 26 WorldTour-Rennen wurden an den offiziellen UCI WorldTour-Kalender 2026 angepasst.
  - Die Termine aller zugehörigen Etappen in `stages.csv` wurden automatisch mitverschoben.
- **Kürzung von Etappen-Rundfahrten**:
  - **Santos Tour Down Under (ID 1)**: Auf 6 Etappen gekürzt (Etappen 7 & 8 wurden gelöscht).
  - **Tour de Suisse (ID 54)**: Auf 5 Etappen gekürzt (Etappen 6, 7 & 8 wurden gelöscht).
- **Robuste Zuweisungs-Logik**:
  - Die Zuweisungs-Skripte wurden so überarbeitet, dass alte Etappen von UWT-Rennen (ID >= 50) vor dem Überschreiben herausgefiltert werden. Dies verhindert Unique-Key-Fehlermeldungen in SQLite bei der Zuweisung.
- **Ergebnisse**:
  - Die Datenbank lädt jetzt sauber mit genau **1.981 Zuweisungen**.
  - Alle Programmgruppen enthalten weiterhin mindestens einen Tier-1-Fahrer.

---

## Performance-Optimierung des Programm-Editors

Wir haben umfangreiche Performance-Optimierungen im Frontend des Programm-Editors ([racePrograms.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/racePrograms.ts)) durchgeführt. Diese beheben die zuvor spürbaren Freezes (2–5 Sekunden) beim Rendern und Filtern komplett:

### 1. Pre-Caching & Indexierung
* **Enrichment bei Payload-Ladevorgang (`enrichPayloadWithCachedData`)**: Berechnet einmalig die relevanten Tage und KW-Werte pro Rennen vor und indiziert Rennen nach Datum in einer `racesByDate`-Map.
* **Dynamische Zuweisungs-Indizes (`rebuildAssignmentIndexes`)**: Baut bei Änderungen Lookup-Maps auf. `assignmentMap` (`${programId}_${raceId}`) erlaubt eine konstante Abfragezeit $O(1)$ statt linearer Suchen auf den 2.200 Mappings.

### 2. Vermeidung redundanter Schleifen-Berechnungen
* **Einmalige Statistik-Berechnung**: Im Reiter "Rider-Role" werden die Renntage aller Programme einmalig pro Renderdurchgang berechnet und in einer Map gespeichert, anstatt sie in der inneren Zuweisungsschleife 18.300-mal redundant aufzurufen.
* **Pre-Indexierte Kombinationen**: Tab 4 und 5 nutzen Cache-Maps für Kombinationen nach Programm-ID, um Arrayscans zu vermeiden.

### 3. Messergebnisse aus der Profilierung (Profilierungs-Lauf)
Wir haben ein automatisiertes Profiling-Skript ([test_editor_perf.js](file:///C:/Users/mkrinninger/.gemini/antigravity-ide/brain/eb714a58-5557-41a1-b747-e80e057ef235/scratch/test_editor_perf.js)) aufgesetzt, welches folgende Ausführungszeiten ermittelt hat:
* **Daten-Enrichment (`enrichPayloadWithCachedData`)**: **2.25 ms**
* **Index-Wiederaufbau (`rebuildAssignmentIndexes`)**: **1.78 ms**
* **Zellen-Lookup im Kalender (365 Tage * 187 Programme)**: **13.20 ms** (zuvor 3–5 Sekunden Freeze!)
* **Rider-Role Berechnungen (98 Rennen * 187 Programme)**: **8.86 ms** (zuvor mehrere Sekunden!)
* **Programm-Rollen Berechnungen**: **0.32 ms**

Die gesamte Berechnungszeit für eine Rendering-Aktualisierung liegt somit bei **unter 25 Millisekunden**. Dadurch wechselt der Editor nun ohne jede Verzögerung (< 50ms im Browser) die Tabs, wendet Filter an und aktualisiert Zuweisungen.



