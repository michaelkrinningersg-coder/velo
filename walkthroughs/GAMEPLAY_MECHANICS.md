# Gameplay-Mechaniken & Kernsysteme

Dieses Dokument dokumentiert die Funktionsweise und den Code-Hintergrund der wichtigsten sportlichen Simulationssysteme im Spiel. Dies dient als zentrale Referenz bei der Weiterentwicklung dieser Systeme.

---

## 1. Mentoren-System (Mentorensystem)

Das Mentoren-System sorgt dafür, dass erfahrene Rennfahrer jungen Nachwuchstalenten im selben Team wertvolle Tipps und vorübergehende Leistungssteigerungen für Rennen geben können.

### Kriterien für Mentoren und Mentees
- **Mentor (Erfahrener Fahrer)**:
  - Alter: $\ge 31$ Jahre
  - Gesamtstärke (`overallRating`): $\ge 73$
  - Fahrertyp: Muss dem Fahrertyp des Nachwuchsfahrers entsprechen oder mit einer seiner Spezialisierungen (`specialization1`/`2`/`3`) übereinstimmen.
- **Mentee (Junger Fahrer)**:
  - Alter: $\le 23$ Jahre (beziehungsweise U23-Fahrer)

### Code-Referenzen
1. **Auflösung der Mentoren (Datenabfrage)**:
   - **Funktion**: `attachMentorData(riders)` in [RiderRepository.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/repositories/RiderRepository.ts#L128)
   - **Logik**: Filtert die Fahrerliste nach berechtigten Mentoren im selben Team, sortiert sie nach Gesamtstärke absteigend und weist dem jungen Fahrer den stärksten Mentor als Eigenschaft (`mentorName`, `mentorAge`, `mentorCountryCode`) zu.
2. **Mentoren-Leistungsboosts im Rennen**:
   - **Funktion**: `/api/simulation/roster/:stageId/apply` Route in [api.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/routes/api.ts#L451)
   - **Logik**: Wenn ein Kader für ein Rennen registriert wird, erhalten Fahrer im Alter von $\le 22$ Jahren einen Boost, falls qualifizierte Mentoren im Starterfeld des Teams vorhanden sind.
   - **Auswirkung**: Es wird zufällig aus 15 Skills gewählt und dem Fahrer ein temporärer Bonus (`mentorBoosts[skillKey] += 1` pro Mentor) zugeschrieben.

---

## 2. Fatigue-System (Ermüdung / Frische)

Bei Etappenrennen akkumulieren Fahrer über die Renntage hinweg Ermüdung (Fatigue), was ihre Performance-Werte verschlechtert.

### Berechnungsformel & Faktoren
- **Basisermüdung**: Steigt progressiv mit der Anzahl der gefahrenen Etappen an und wird durch den Wert von `recuperation` (Erholung) gemildert.
- **Zufällige Ermüdung**: Tägliche Schwankungen, die im Rennverlauf hinzukommen.
- **Erholungs-Penalties**: Verletzungs- oder Sturzfolgen beeinflussen die effektive Erholung.

### Code-Referenzen
- **Funktionen** in [mappers.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/mappers.ts):
  1. `resolveStageRaceBaseFatigue(stageNumber, recuperationSkill)`:
     ```typescript
     const baseFatigueRate = 0.10 + (((85 - cappedRecuperation) / 35) * 0.75);
     const stageProgressionFatigue = 0.01 * ((stageNumber - 2) * completedStages / 2);
     return (completedStages * baseFatigueRate) + stageProgressionFatigue;
     ```
  2. `resolveStageRaceFatigueMalus(stageNumber, recuperationSkill, accumulatedRandomFatigue)`:
     Führt die Basisermüdung und den zufälligen Fatigue-Zustand zusammen.
  3. `resolveEffectiveRecuperationSkill(recuperationSkill, stageRaceRecuperationPenalty)`:
     Berechnet den effektiven Erholungswert abzüglich akkumulierter Rennstrafen.
- **Ermüdungsfortschritt**:
  - `GameStateService.ts` aktualisiert die Ermüdungswerte täglicher Events.
  - Das UI ([riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts)) visualisiert den Fatigue-Malus.

---

## 3. Tie-Break & Zeitnahme (Etappenfinish)

Bei Radrennen kommen häufig größere Fahrergruppen (Peleton) zeitgleich im Ziel an. Um Stürze in hektischen Sprints zu vermeiden, gilt die 1-Sekunden-Regel.

### Funktionsweise
1. **Die 1-Sekunden-Regel (Time Groups)**:
   Fahrer, die innerhalb von 1 Sekunde hinter ihrem Vordermann die Ziellinie überqueren, erhalten dieselbe Zielzeit (`stageTimeSeconds` bzw. `timeSeconds`).
2. **Photo-Finish (Platzierung innerhalb der Zeitgruppe)**:
   Da alle Fahrer der Gruppe dieselbe Zeit erhalten, wird der exakte Etappenplatz (Rank) über den `photoFinishScore` ermittelt (höherer Score = bessere Platzierung).

### Code-Referenzen
- **Funktion**: `rankStageResultEntries(entries, profile)` in [stageResultRules.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/shared/stageResultRules.ts#L60)
- **Gruppezeit-Zuweisung**: `normalizeRoadStageTimeGroups(performance, profile)` in [StageResultCommitService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/simulation/StageResultCommitService.ts#L154)
- **Logik**:
  - Bei Einzel- und Teamzeitfahren (ITT/TTT) wird streng nach Realzeit, dann nach Photo-Finish und zuletzt nach Fahrer-ID sortiert.
  - Bei Straßenetappen sortiert das System die Fahrer nach Zeit. Beträgt die Lücke zum Vordermann $\le 1$ Sekunde (`TIME_TIE_THRESHOLD_SECONDS = 1`), wird der Fahrer derselben Zeitgruppe zugewiesen. Die interne Rangfolge der Gruppe wird dann rein über `photoFinishScore` ermittelt.

---

## 4. Live-Sim-Logik (Echtzeitsimulation)

Die Live-Sim koordiniert die Rennvorbereitung, Zwischenwertungen und das Committen der Endergebnisse einer Etappe.

### Ablauf & beteiligte Funktionen
1. **Renn-Initialisierung**:
   - Route `/api/simulation/realtime/:stageId` in [api.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/routes/api.ts#L330) lädt das Etappenprofil, die aktuellen Gesamtklassements (GC, Punkte, Berg, Nachwuchs) sowie das Starterfeld.
   - `StageParser.summarizeStageProfile()` parst die Segmentdaten und berechnet Höhenmeter und Steigungsprozente.
2. **Roster-Zuweisung**:
   - Route `/api/simulation/roster/:stageId/apply` speichert die vom Spieler ausgewählten Fahrer für das Rennen und wendet Mentorenhilfen an.
3. **Abschluss & Committen**:
   - Route `/api/simulation/realtime/:stageId/complete` ruft `commitRealtimeStage(...)` in [StageResultCommitService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/simulation/StageResultCommitService.ts#L293) auf.
   - **Logikschritte beim Committen**:
     - *Validierung*: Prüft, ob Zielzeiten und Status (Finisher/DNF) aller Fahrer vorhanden sind.
     - *Zeitlimits (OTL)*: Filtert Fahrer heraus, die außerhalb des Zeitlimits liegen (`splitOtlPerformance`). Das Limit wird über `resolveStageTimeLimitSeconds` (z. B. Winner-Zeit + 12% bei Flachetappen) berechnet.
     - *Sprint- & Bergwertungen*: `applyMarkerClassificationAwards` ermittelt, wer an Zwischenwertungs-Markern (`climb_top`, `sprint_intermediate`) Punkte und Zeitbonifikationen erhält.
     - *Zieleinlauf*: `applyFinishLineAwards` vergibt Punkte und Zeitgutschriften im Ziel.
     - *Ergebnis-Persistierung*: `persistStagePerformance` speichert die Ergebnisse aller Wertungen (Stage, GC, Punkte, Berg, Nachwuchs, Team) in der Datenbank und aktualisiert die Fahrerstatistiken (z.B. Verletzungen bei schweren Stürzen via `applySevereCrashInjury`).
