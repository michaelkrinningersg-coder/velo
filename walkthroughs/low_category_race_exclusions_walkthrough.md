# Walkthrough: Ausschluss von Kapitänen & Top-Fahrern für Low-Kategorie-Rennen

Ich habe die Funktionalität erfolgreich integriert, um Fahrer mit der Rolle Kapitän sowie die jeweils besten Co-Kapitäne und Sprinter pro Team von Rennen der niedrigen Prestige-Kategorien auszuschließen.

Hier sind die technischen Details zur Umsetzung:

## 1. Identifikation der Betroffenen Rennen (Kategorien)
Die Regelungen greifen bei Rennen der folgenden Kategorien (definiert in `data/csv/race_categories.csv`):
* **World Tour - Stage Race Low** (Kategorie-ID `5`)
* **World Tour - One Day Low** (Kategorie-ID `8`)

## 2. Erfassung in der Rider-Lock Map
Die zentrale Roster-Funktion `buildRiderLockMap` in [RaceRosterService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/simulation/RaceRosterService.ts), welche die Sperren für die Startlisten ermittelt, wurde erweitert:
* Wenn das Rennen der Kategorie-ID `5` oder `8` angehört, werden alle aktiven Fahrer nach Team (`activeTeamId`) gruppiert.
* Für jedes Team werden folgende Fahrer ermittelt und mit der neuen `RiderLockReason` `'low-category-exclusion'` gesperrt:
  * Alle Fahrer mit der Rolle **Kapitän** (`roleId === 1`).
  * Der beste Fahrer mit der Rolle **Co-Kapitän** (`roleId === 2`), sortiert nach `overallRating` absteigend (mit Alphabet-Name und ID als Fallback-Tie-Breaker).
  * Der beste Fahrer mit der Rolle **Sprinter** (`roleId === 6`), sortiert nach `overallRating` absteigend (mit gleichem Fallback-Tie-Breaker).

## 3. UI-Integration & Starterfeld-Editor
* **Roster-Editor**: Wenn du das Starterfeld als Spieler manuell bearbeitest, siehst du, dass diese Fahrer blockiert/ausgegraut sind. Die `RIDER_LOCK_MESSAGES` geben dort aus:
  > *"Nicht startberechtigt für Low-Kategorie Rennen (Kapitän / bester Co-Kapitän / bester Sprinter)."*
* **Automatische Starterfelder**: Der automatische Auffüll-Algorithmus der Teams filtert gesperrte Fahrer heraus, sodass sie gar nicht erst in die Vorauswahl rutschen.

## 4. Dashboard - Verfügbare Teilnehmer
In [RaceRepository.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/repositories/RaceRepository.ts) wurde die Funktion `getRaceProgramParticipants` angepasst:
* Für Rennen der Kategorien `5` und `8` werden dieselben ausgeschlossenen Fahrer (Kapitäne, bester Co-Kapitän, bester Sprinter pro Team) herausgefiltert.
* Dadurch tauchen diese Fahrer im Dashboard unter **Nächste Rennen -> Teilnehmer** nicht mehr in der Liste der verfügbaren Fahrer auf.

> [!TIP]
> **Zum Testen:**
> Simuliere bis zu einem Rennen der Kategorie **Stage Race Low** oder **One Day Low**. Öffne das Modal **Teilnehmer** für das Rennen im Dashboard. Überprüfe, dass dort keine Kapitäne und nicht die stärksten Co-Kapitäne/Sprinter der Teams gelistet sind. 
> Im **Starterfeld bearbeiten**-Menü kannst du sehen, dass diese Fahrer deines Teams mit der entsprechenden Begründung gesperrt sind.
