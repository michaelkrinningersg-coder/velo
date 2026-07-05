# `total_km`-Spalte — Backend-Patch (commit-fertig)

Ziel: nach jeder gefahrenen Etappe/jedem Rennen die Distanz eines Fahrers in einer eigenen
Spalte hochzählen und in der Karrierestatistik anzeigen. Analog zu den bestehenden Zählern
(`superform_days`, `home_advantage_days` …).

## 1) Shared-Typen — `shared/types.ts`

`RiderCareerStats` um ein Feld erweitern:

```ts
export interface RiderCareerStats {
  // ... bestehende Felder ...
  totalKm?: number;   // NEU: kumulierte gefahrene Kilometer über die Karriere
}
```

## 2) Schema + Migration — `backend/src/db/DatabaseService.ts`

Im Aggregat-Spalten-Array von `rider_career_stats` (dort wo `['superform_days', ...]` steht)
ergänzen:

```ts
['total_km', 'REAL NOT NULL DEFAULT 0'],
```

Und eine Migration (dort wo die `if (!columnExists(db, 'rider_career_stats', 'superform_days'))`
Blöcke stehen):

```ts
if (!columnExists(db, 'rider_career_stats', 'total_km')) {
  db.exec(`ALTER TABLE rider_career_stats ADD COLUMN total_km REAL NOT NULL DEFAULT 0`);
}
// analog für rider_season_stats, falls pro Saison summiert werden soll:
if (!columnExists(db, 'rider_season_stats', 'total_km')) {
  db.exec(`ALTER TABLE rider_season_stats ADD COLUMN total_km REAL NOT NULL DEFAULT 0`);
}
```

Falls die Career-Aggregation aus den Season-Rows summiert wird (wie bei `superform_days` mit
`COALESCE((SELECT SUM(...) ...))`), dort ergänzen:

```sql
total_km = COALESCE((SELECT SUM(total_km) FROM rider_season_stats
           WHERE rider_season_stats.rider_id = rider_career_stats.rider_id), 0),
```

## 3) Hochzählen beim Etappen-Commit — `backend/src/simulation/StageResultCommitService.ts`

Beim Update der Season-/Career-Stats pro klassiertem Fahrer die Etappendistanz addieren.
Dort, wo bereits `superform_days = superform_days + ?` o. ä. steht, das UPDATE erweitern:

```ts
// distanceKm = Distanz der committeten Etappe (aus stage.distanceKm)
// Für jeden Fahrer, der die Etappe klassiert beendet hat:
//   ... SET total_km = total_km + ? ...  (Parameter: distanceKm)
```

Konkret: im vorhandenen `UPDATE rider_season_stats SET ... WHERE rider_id = ?`
die Zeile `total_km = total_km + ?,` ergänzen und `stage.distanceKm ?? 0` als Parameter binden.
(Nur klassierte Finisher zählen — DNF/DNS/OTL entsprechend eurer bestehenden Logik ausschließen
oder anteilig; wir empfehlen: gefahrene km = zurückgelegte Distanz, bei DNF ggf. `coveredMeters/1000`.)

## 4) Auslesen — `backend/src/db/repositories/RiderRepository.ts`

Im Career-Stats-SELECT (dort wo `race_days, superform_days, supermalus_days, home_advantage_days`
selektiert werden) `total_km` ergänzen und im Row-Typ deklarieren:

```ts
//   SELECT ... race_days, superform_days, ..., total_km FROM rider_career_stats ...
//   Row-Interface: total_km: number;
```

## 5) Mapping — `backend/src/db/mappers.ts`

Beim Aufbau des `careerStats`-Objekts:

```ts
totalKm: row.total_km ?? 0,
```

## 6) Anzeige — `frontend/src/views/riderStats.ts` (`renderRiderStatsCareerTab`)

In der Highlight-Kartenreihe eine Kachel **zwischen „Renntage" und „Ausreißer-Kms"** ergänzen
(Design siehe `design/Velo Redesign.dc.html`, Tab „Karriere", Kachel „Gesamt-km"):

```ts
<div style="...card...">
  <div style="...label...">Gesamt-km</div>
  <div style="font-size:1.75rem; font-weight:bold; color:#22d3ee;">
    ${(stats.totalKm ?? 0).toLocaleString('de-DE')}
  </div>
</div>
```

> Nach dem Patch **Backend neu starten** (Migration greift beim Bootstrapping). Bestehende
> Savegames starten `total_km` bei 0 und zählen ab dem nächsten gefahrenen Rennen hoch.
