# Performance Optimierung RiderStatsView

Ich habe die im Umsetzungsplan besprochenen Änderungen zur drastischen Verbesserung der Ladezeiten für das Fahrerprofil umgesetzt.

## Was geändert wurde

1. **Gefiltertes Laden von Renndaten (SQL)**
   - Die Methode `getSeasonRaceStatsByRiderId` in [RiderRepository.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/repositories/RiderRepository.ts) wurde so modifiziert, dass sie optional eine `riderId` akzeptiert. Beim Laden des Profils wird jetzt explizit die `WHERE rider_id = ?`-Bedingung an die Datenbank übergeben, sodass nicht mehr die Renntage und Siege für alle Fahrer des Spiels aggregiert werden müssen.

2. **Leichtgewichtiges Laden der Mentoren**
   - Zuvor wurde beim Laden des Fahrerprofils `this.getRiders(...)` für das gesamte Team aufgerufen, was tiefgreifende Statistiken, Programme und Skills für das gesamte Team in den Arbeitsspeicher lud, nur um Mentoren zu ermitteln.
   - Dies wurde in [RiderRepository.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/repositories/RiderRepository.ts) durch eine leichte SQL-Abfrage auf die `riders`-Tabelle ersetzt, die nur die benötigten Basisfelder (ID, Name, Rating, Alter, Fahrertyp) abruft.

3. **Gezielte Abfrage der Saison-Rangliste**
   - Anstatt die gesamte Saison-Rangliste (`getSeasonStandings`) in den Arbeitsspeicher zu laden und dort mit `.find()` nach dem Fahrer zu suchen, habe ich die Funktion `getSeasonRankForRider` in [ResultRepository.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/repositories/ResultRepository.ts) hinzugefügt.
   - Diese nutzt eine effiziente SQL-Fensterfunktion (`RANK() OVER (...)`), um direkt in der Datenbank den Rang des abgefragten Fahrers zu berechnen.

4. **Entfernung teurer Re-Synchronisationen**
   - Der Aufruf `syncSeasonPointEventsForSeason(season)`, der bisher in einer Schleife für jede jemals gefahrene Saison des Fahrers ausgeführt wurde, wurde komplett aus `getRiderStats` entfernt, da Lese-Anfragen keine massiven Neuberechnungen anstoßen sollten.

5. **Datenbank-Indizes**
   - In [DatabaseService.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/DatabaseService.ts) habe ich sichergestellt, dass die relevanten Abfragen durch Indizes beschleunigt werden.
   - (Hinweis: Die Indizes für `stage_entries(rider_id, ...)` und `results(rider_id, ...)` waren bereits vorhanden. Ein neuer Index für `season_point_events(rider_id)` wurde in `ensureDayChangeIndexes` ergänzt).

> [!TIP]
> Die Ladezeiten des RiderStatsViews sollten sich nach diesen Optimierungen auch bei Spielständen mit vielen simulierten Saisons massiv verbessert haben (von potenziell mehreren Sekunden auf wenige Millisekunden).

## Manuelle Validierung
Du kannst nun das Spiel starten und das Profil eines Fahrers öffnen, der in der aktuellen Saison bereits Rennen gefahren ist. Die Anzeige sollte nun ohne spürbare Verzögerung erscheinen und die Statistiken wie Mentoren, Rang und Renntage weiterhin korrekt berechnet werden.
