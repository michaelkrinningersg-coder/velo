# Walkthrough: Dynamisches Wettersystem ("Wetter")

Wir haben ein dynamisches Wettersystem in das Spiel integriert, das die Rennsimulation (Incident-Wahrscheinlichkeiten, Windkanten-Verbreiterung auf Flachstücken, Breakaway-Boni und die Fatigue-Generierung nach Etappen) realistisch beeinflusst.

## 1. Die neue Wetter-Tabelle (`wetter` / DB-Schema)
Es wurde eine neue Tabelle `wetter` in der Datenbank eingeführt, die 7 standardmäßige Wetterkonditionen mit konfigurierbaren Wertebereichen (Min/Max) für verschiedene Effekte speichert:
1. **Sonnig** (Standard, überall 0.0)
2. **Extreme Hitze** (Erhöht die generierte Fatigue)
3. **Leichter Regen** (Erhöht Sturz- und Defektwahrscheinlichkeiten leicht)
4. **Starkregen** (Erhöht Sturz-, Defektwahrscheinlichkeiten und Fatigue stark)
5. **Starker Wind** (Erhöht Sturzwahrscheinlichkeit und Fatigue, erzeugt Windkanten-Gefahr)
6. **Dichter Nebel** (Erhöht Sturzwahrscheinlichkeit, gewährt Breakaway-Bonus)
7. **Schnee/Eis** (Extreme Erhöhung der Sturzwahrscheinlichkeit, Defekte und Fatigue)

### Schema & Migrationen
- **Datenbank-Seeding**: [DatabaseService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/DatabaseService.ts) erstellt und befüllt die Tabelle `wetter` automatisch beim Laden/Erstellen eines Spielstands.
- **Migration `stages`**: Die Tabelle `stages` wurde erweitert um:
  - `allowed_weather TEXT NOT NULL DEFAULT '1'` (enthält erlaubte Wetter-IDs, z. B. `"1|2|5"`)
  - `rolled_weather_id INTEGER REFERENCES wetter(id)` (speichert das ausgewürfelte Wetter)

## 2. Wetter-Auswahl (Rolling) & Determinismus
- **Rolling-Logik**: Vor Etappenstart (in `/simulation/realtime/:stageId` und `/simulation/roster/:stageId/apply`) wird in `ensureWeatherRolled` zufällig ein Wetter aus `allowed_weather` bestimmt und in der Datenbank hinterlegt. So wird das Wetter genau einmal pro Etappe ausgewürfelt.
- **Deterministische Effekte**: Um die Datenbank schlank zu halten, werden die konkreten Effekte der Etappe (z. B. `rolledEffektSturz`) im Mapper [mappers.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/mappers.ts) deterministisch berechnet. Unter Verwendung der `stageId` als Seed liefert der Zufallsgenerator für dieselbe Etappe und dieselbe Wetterkategorie immer denselben Wert.

## 3. Core Simulation Integration

### Sturz- & Defektwahrscheinlichkeit ([incidents.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/incidents.ts))
Die Basiswahrscheinlichkeiten für Stürze und Defekte in `precalculateRaceIncidents` werden durch die ausgewürfelten Wettermultiplikatoren beeinflusst:
`baseChance + (rolledEffektVal / 100)`

### Fatigue-Generierung ([GameStateService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/game/GameStateService.ts))
In `applyStageFatigue` wird die generierte Kurz- und Langzeitfatigue der Fahrer multipliziert mit:
`(1 + rolledEffektFatigue / 100)`

### Windkanten-Gefahr ([SimulationEngine.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/SimulationEngine.ts))
Auf flachen Teilstücken (`Flat`) wird in `resolveRoadSpeedSkillFactor` der Windkanten-Effekt (`rolledWindkantenGefahr`) addiert, was das Fahrerfeld auf windigen Etappen stärker auseinanderzieht.

### Breakaway-Bonus ([stageBreakaways.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/stageBreakaways.ts))
Bei Nebel oder widrigen Bedingungen erhöht der breakaway_bonus den generierten Skill-Vorteil einer Ausreißergruppe:
`randomInteger(3 + breakawayBonus, 8 + breakawayBonus)`

## 4. Frontend & Benutzeroberfläche

### Live Race Header ([RaceSimView.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/RaceSimView.ts))
Im Header der Live-Rennsimulation wird das passende Wetter-Emoji (☀️, 🌡️, 🌦️, 🌧️, 💨, 🌫️, ❄️) an die Metadaten der Etappe angehängt.

### Rennereignisse ([SimulationEngine.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/SimulationEngine.ts))
Bei Rennstart (km 0) wird ein Wetterbericht-Event in das Ereignisprotokoll ("Ereignisse") eingetragen, das das aktuelle Wetter und alle aktiven Modifikatoren (> 0) übersichtlich auflistet.

### Rider Stats modal ([riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts))
In den Tabellen der Ergebnis-Historie wird neben dem Etappennamen ein passend eingefärbtes und gestyltes SVG-Wetter-Icon gerendert, welches beim Drüberfahren (Tooltip) den Namen des Wetters anzeigt.

---

## Verifikation
- Die TypeScript-Kompilierung läuft fehlerfrei.
- Spielstände werden automatisch und fehlerfrei auf die neue Datenbankstruktur migriert.
- Das Wetter wird einmalig ausgewürfelt und in der DB gespeichert.
- Die Effekte greifen in der Live-Simulation und das UI stellt sie ansprechend dar.
