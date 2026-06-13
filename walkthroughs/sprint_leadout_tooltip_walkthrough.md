# Walkthrough: Leadout-Bonus Hover Tooltip in der Tageswertung

Alle geplanten Anpassungen für die Anzeige des Leadout-Bonus als Tooltip/Hover in der Tageswertung ("Ergebnisse" -> "Stage") wurden erfolgreich implementiert, kompiliert und verifiziert.

---

## Durchgeführte Änderungen

### 1. Datenstrukturen & Interfaces
* **[shared/types.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/shared/types.ts)**:
  - Erweiterung des `RaceClassificationRow`-Interfaces um:
    - `leadoutRiderId: number | null;`
    - `leadoutBonus: number | null;`
    - `leadoutRiderLastName: string | null;`
    - `leadoutRiderCountryCode: string | null;`

### 2. Backend & Datenbankabfragen
* **[backend/src/db/mappers.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/mappers.ts)**:
  - Anpassung der `StageResultDbRow` zur Abbildung der neuen Spalten `leadout_rider_id`, `leadout_bonus`, `leadout_rider_last_name` und `leadout_rider_country_code`.
* **[backend/src/db/DatabaseService.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/DatabaseService.ts)**:
  - Hinzufügen der Spalten `leadout_rider_id` (INTEGER) und `leadout_bonus` (REAL) zur Tabelle `results` in der Schema-Migration (`ensureResultsSchema`).
* **[backend/assets/schema.sql](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/assets/schema.sql)**:
  - Anpassung des Master-Schemas der `results`-Tabelle zur dauerhaften Integration der Leadout-Spalten.
* **[backend/src/simulation/StageResultCommitService.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/simulation/StageResultCommitService.ts)**:
  - Speichern der berechneten Leadout-Fahrer-IDs und Bonuswerte in der SQL-Datenbank beim Abschließen einer Etappe.
* **[backend/src/db/repositories/ResultRepository.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/repositories/ResultRepository.ts)**:
  - Erweitern des Stage-Results-Statements um einen `LEFT JOIN` auf `riders` und `sta_country`, um den Nachnamen des Leadout-Fahrers sowie dessen Länderflaggen-Code in der Tageswertung mitzuladen.

### 3. Frontend-Logik, Tooltip & Styling
* **[frontend/src/race-sim/SimulationEngine.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/frontend/src/race-sim/SimulationEngine.ts)**:
  - Berechnung des exakten Teampartners, der den höchsten Sprint-Leadout-Bonus liefert, und Zuordnung zu dem im Sprint befindlichen Fahrer.
* **[frontend/src/views/liveRace.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/frontend/src/views/liveRace.ts)**:
  - Übertragung von `leadoutRiderId` und `leadoutBonus` im Commit-Payload nach Beendigung der Echtzeitsimulation.
* **[frontend/src/views/results.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/frontend/src/views/results.ts)**:
  - Integration der `getFlagEmoji`-Hilfsfunktion zur Konvertierung des 3-stelligen Ländercodes (z.B. `GER`) in Unicode-Flaggen-Emojis.
  - Dynamische Erstellung des `title`-Attributs der Punkte-Zelle (`<td>`) mit dem Format:
    `Leadout-Bonus von #<RiderNummer> <FlagEmoji> <LastName> (+<BonusValue>)` (z.B. `Leadout-Bonus von #509 🇵🇱 Owsian (+0,45)`).
  - Styling der Punkte-Zelle bei vorhandenem Bonus mit gestrichelter Unterstreichung in der Akzentfarbe (`text-decoration: underline dotted var(--accent-primary, #fbbf24)`), fetter Schrift (`font-weight: bold`) und Hilfe-Cursor (`cursor: help`).

---

## Verifikationsergebnisse

1. **Automatisierte Tests**:
   - Das temporäre Verifikationsskript `scratch_test_leadout.js` wurde unter Nutzung der Live-Karrieredatenbank ausgeführt.
   - Ergebnisse bestätigen die fehlerfreie Migration des Datenbankschemas sowie die fehlerfreie Zuordnung und Rückgabe aller Leadout-Details via JOINs in `ResultRepository.getStageResults`.
2. **Kompilierung**:
   - Der Build (`npm run build`) lief im gesamten Projekt fehlerfrei durch.
