# Walkthrough: Massensturz-Feature

Ich habe das Massensturz-Feature erfolgreich in die Rennsimulation integriert, wie im Implementierungsplan beschrieben.

Hier ist eine Zusammenfassung der durchgeführten Änderungen:

## 1. Datenmodell (`shared/types.ts`)
Das Interface `PrecalculatedRaceIncident` wurde erweitert, um Massenstürze abbilden zu können:
- `isMassCrashTrigger`: Markiert, ob ein vorberechneter Sturz ein Massensturz ist.
- `massCrashPotentialRiderIds`: Speichert die IDs der 2 bis 25 Fahrer, die vor der Etappe potenziell als Opfer bestimmt wurden.
- `hasAdditionalMechanical`: Speichert, ob bei dem Sturz zusätzlich ein Defekt (mit 20% Chance) aufgetreten ist.

## 2. Vorberechnung der Stürze (`incidents.ts`)
- Bei der Vorberechnung der Vorfälle (`precalculateRaceIncidents`) vor der Etappe wird nun bei jedem regulären Sturz eine Wahrscheinlichkeit von **1%** gewürfelt.
- Fällt der Würfel auf den Massensturz, wird die Anzahl der betroffenen Fahrer (**2 bis 25**) bestimmt und diese zufällig aus dem Peloton ausgewählt.
- Es wurde eine neue Hilfsfunktion `buildDynamicCrashIncident` implementiert. Diese wird zur Laufzeit aufgerufen, um für jeden tatsächlich betroffenen Fahrer einen individuellen Sturz (mit zufälliger Schwere, Wartezeit etc.) zu generieren. Hier greift auch die **20%-Chance**, dass der Fahrer zusätzlich zum Sturz direkt einen Defekt erleidet, was seine Wartezeit entsprechend verlängert.

## 3. Logik im Rennen (`SimulationEngine.ts`)

### Konsolen-Log vor dem Start
- Die Simulation prüft beim Initialisieren, ob Massenstürze vorberechnet wurden.
- Ist dies der Fall, wird direkt in der Browser-Konsole eine Meldung ausgegeben:
  ```text
  [RaceIncidents] Massensturz vor der Etappe ausgewuerfelt! Auslöser: Fahrer X bei Km Y. Potenziell betroffene Fahrer (N): [ID1, ID2, ...]
  ```

### Auslösen während der Fahrt
- Wenn der auslösende Fahrer seinen Sturz-Kilometer erreicht, greift die Methode `applyIncident`.
- Diese prüft nun, ob es sich um einen Massensturz handelt.
- Ist dies der Fall, wird für jeden der vorberechneten potenziellen Fahrer geprüft, ob seine Distanz zum Auslöser in diesem Moment **maximal 50 Meter** (+/- 50m) beträgt.
- Nur Fahrer, die sich in diesem Radius befinden, stürzen tatsächlich. Für diese Fahrer wird via `buildDynamicCrashIncident` ein neuer Sturz berechnet und angewendet. Ihr UI-Status zeigt dann z.B. `crash:medium+mechanical`.
- Die Simulation loggt die tatsächlich verwickelten Fahrer ebenfalls in die Konsole:
  ```text
  [RaceIncidents] Massensturz ausgelöst durch Fahrer X bei Km Y. Tatsächlich verwickelte Fahrer (Z): [ID1, ID3]
  ```

> [!TIP]
> **Testen der Funktion:** Du kannst das Feature testen, indem du ein Rennen simulierst und die Browser-Konsole (`F12`) im Auge behältst. Da die Wahrscheinlichkeit mit 1% recht niedrig ist, wird nicht auf jeder Etappe ein Massensturz passieren. Für Testzwecke kannst du den Wert `Math.random() < 0.01` in der `incidents.ts` lokal kurzzeitig auf z.B. `0.5` oder `1.0` erhöhen, um das Verhalten sofort zu erzwingen.
