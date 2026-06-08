# Walkthrough: Winterpause für Top-Fahrer

Ich habe die Funktionalität erfolgreich integriert, um die zwei stärksten Fahrer jedes Teams im Winter zu schonen.

Hier sind die technischen Details zur Umsetzung:

## 1. Datums-Prüfung (`isWinterBreak`)
In der Datei `backend/src/simulation/RaceRosterService.ts` gibt es nun eine neue Hilfsfunktion `isWinterBreak`. Sie analysiert das Datum (`YYYY-MM-DD`) des aktuellen Renntags.
* Wenn der Monat **Oktober** ist und der Tag **>= 15**, greift die Regel.
* Die Monate **November**, **Dezember** und **Januar** sind komplett eingeschlossen.
* Wenn der Monat **Februar** ist und der Tag **<= 15**, greift die Regel.
* Außerhalb dieser Zeiten gibt die Funktion `false` zurück.

## 2. Erfassung in der Rider-Lock Map
Die zentrale Funktion `buildRiderLockMap`, welche ermittelt, ob ein Fahrer für ein Rennen überhaupt nominiert werden darf (wegen Erschöpfung, Verletzungen, etc.), wurde um den neuen Sperrgrund erweitert.
* Ist die Funktion `isWinterBreak(currentDate)` für ein Rennen wahr, so werden alle Fahrer anhand ihrer Teamzugehörigkeit (`activeTeamId`) gruppiert.
* Für jedes Team wird die Gruppe anhand der `overallRating` absteigend sortiert.
* Den besten zwei Fahrern wird die neue `RiderLockReason` `'winter-break'` zugewiesen.

## 3. UI Integration & Sichtbarkeit
Sowohl die Algorithmen für die automatische Starterfeld-Auffüllung (`orderFillCandidates`, etc.) als auch der vom Spieler steuerbare Roster-Editor prüfen gegen diese Lock-Map.
* Versucht das Spiel automatisch Startfelder aufzufüllen, überspringt es die beiden besten Fahrer jedes Teams strikt.
* Rufst du das Rennen als Spieler manuell im Roster-Menü auf, siehst du bei deinen Top-2 Fahrern einen entsprechenden Hinweis. Die `RIDER_LOCK_MESSAGES` geben dort verständlich aus:
  > *"Winterpause zur Erholung (15.10. - 15.02.)."*

> [!TIP]
> **Zum Testen:** Simuliere bis zu einem Rennen, das in die Zeitspanne fällt (z.B. ein Rennen im Januar). Gehe in den Editor für das Start-Roster ("Kader bearbeiten"). Du solltest nun sehen, dass deine beiden Fahrer mit dem höchsten `overallRating` ausgegraut / blockiert sind und der Grund für die Schonung angezeigt wird.
