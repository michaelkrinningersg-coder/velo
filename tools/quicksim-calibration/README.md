# Kalibrier-Werkzeuge für die Quick Simulation

Erzeugt den **Referenzdatensatz**, gegen den die geplante Quick Simulation kalibriert
wird. Die bestehende Instant-Simulation ist dabei das Orakel: „stimmt die Quick Sim?"
wird damit zu einer messbaren Abweichung statt zu einer Geschmacksfrage.

Das Werkzeug liegt bewusst außerhalb von `backend/` und `frontend/` und ist nicht
Teil eines Builds. Es benutzt die Abhängigkeiten des Backends.

## Benutzung

```bash
# Standard: 3 Etappen je Profil, 30 Läufe je Etappe
npm run calibrate:reference

# Ein größerer Lauf für die eigentliche Kalibrierung
npm run calibrate:reference -- --per-profile=15 --runs=200

# Gezielt einzelne Etappen
npm run calibrate:reference -- --stages=549,594,602 --runs=50
```

| Option | Vorgabe | Bedeutung |
| :-- | :-- | :-- |
| `--savegame=<pfad>` | `savegames/a_1783240576758.db` | Spielstand als Datenquelle |
| `--runs=<n>` | `30` | Läufe je Etappe |
| `--per-profile=<n>` | `3` | Etappen je Profil, wenn `--stages` fehlt |
| `--stages=<id,id>` | — | Feste Etappenauswahl statt Stichprobe |
| `--out=<verzeichnis>` | `debug/quicksim-reference` | Ausgabeverzeichnis |

Der Spielstand wird **vor** dem Lauf in ein temporäres Verzeichnis kopiert. Die
Originaldatei wird nie beschrieben — die Startlisten-Erzeugung (`ensureRaceEntries`)
schreibt in die Datenbank.

## Ausgabe

- `stage-<id>.json` je Etappe: Kennzahlen jedes einzelnen Laufs plus Verdichtung
- `summary.csv`: eine Zeile je Etappe mit den Medianwerten, semikolongetrennt

## Aufbau

| Datei | Zweck |
| :-- | :-- |
| `metrics.ts` | Kennzahlen eines Etappenlaufs — reine Funktionen, ohne DB und ohne Engine |
| `metrics.test.ts` | Tests dazu; laufen mit `npm test` in der Backend-Suite mit |
| `bootstrap.ts` | Baut den Etappen-Bootstrap **mit denselben Funktionen** wie die API-Route |
| `referenceRun.ts` | Der eigentliche Lauf: Etappenauswahl, Simulation, Verdichtung, Ausgabe |
| `determinism.test.ts` | Beweist, dass derselbe Etappen-Seed dasselbe Rennen ergibt |
| `run.js` | Plattformunabhängiger Starter über das `ts-node` des Backends |

`bootstrap.ts` ruft bewusst dieselben Funktionen in derselben Reihenfolge auf wie
`GET /api/simulation/realtime/:stageId`. Ein zweiter, eigener Aufbau würde mit der
Zeit von dem abweichen, was das Spiel tatsächlich simuliert — und niemand würde es
merken. Aus demselben Grund sind `ensureWeatherRolled` und
`resolveRealtimeTeamStartOrder` in `backend/src/routes/api.ts` exportiert statt hier
kopiert.

Typprüfung:

```bash
backend/node_modules/.bin/tsc -p tools/quicksim-calibration/tsconfig.json
```

## Etappen-Seed

Seit der Einführung von `stages.sim_seed` ist jedes Rennen wiederholbar. Der Seed
wird einmal je Etappe gezogen (`ensureSimSeedRolled`, analog zum Wetter) und über
`bootstrap.simSeed` an die Engine gereicht. Fehlt er, zieht die Engine einen — dann
verhält sie sich wie zuvor, nur eben nicht wiederholbar.

Jedes Teilsystem bekommt über `deriveSeed(seed, label)` einen eigenen Zufallsstrom
(`engine`, `incidents`, `attacks`, `breakaway`, `special-form`). Sonst würde ein
zusätzlicher Zufallsaufruf in der Engine jede spätere Ziehung verschieben — und der
Ausreißerplan derselben Etappe sähe nach einer harmlosen Änderung anders aus.

Testvorlage neu erzeugen:

```bash
npm run calibrate:reference -- --stages=549 \
  --dump-bootstrap=backend/src/__tests__/fixtures/stage-549-bootstrap.json
```

## Die Kennzahlen

Alle in `metrics.ts`, je Lauf erhoben und über die Läufe verdichtet
(Mittel, Median, Standardabweichung, 10./90. Perzentil):

- Siegerzeit
- Rückstand auf Rang 2, 5, 10, 20, 50, 100 und den letzten Finisher
- Größe der ersten Zeitgruppe, Anzahl Zeitgruppen, größte Gruppe
- DNF- und OTL-Anzahl
- **Spearman-Rangkorrelation** zwischen Favoritenwertung vor dem Rennen und Zielrang

Die Rangkorrelation ist die wichtigste Zahl. Ein Modell, das Zielzeiten direkt aus
Fahrerstärken ableitet, wird leicht zu deterministisch: Zeiten und Abstände sehen
richtig aus, aber es gewinnen immer dieselben fünf Fahrer. Liegt die Quick Sim hier
deutlich über der Instant-Sim, ist sie falsch kalibriert — auch wenn alle anderen
Kennzahlen passen.

## Erster Referenzlauf: die Profilsignatur

Aus einem Lauf über alle elf Profile (je eine Etappe, drei Läufe, Spielstand 2027).
Vorläufig — für belastbare Werte braucht es `--per-profile=15 --runs=200`:

| Profil | 1. Zeitgruppe | Spearman |
| :-- | --: | --: |
| Flat | 165 | 0,43 |
| Hilly | 82 | 0,36 |
| Rolling | 77 | 0,43 |
| Cobble_Hill | 22 | 0,63 |
| TTT | 7 | −0,02 |
| Medium_Mountain | 5 | 0,70 |
| Cobble | 4 | 0,79 |
| Mountain | 1 | 0,76 |
| High_Mountain | 1 | 0,89 |
| Hilly_Difficult | 1 | 0,56 |
| ITT | 1 | −0,09 |

Die erste Spalte ist genau die Größe, die das Gruppenmodell der Quick Sim treffen
muss: von 165 Fahrern in einer Zeitgruppe auf der Flachetappe bis zum Einzelankömmling
am Berg.

## Ein Befund aus dem ersten Lauf

**Für ITT und TTT ist die Favoritenwertung wertlos** (Spearman −0,09 und −0,02).
`calculateStageFavoriteRiderRanking` gewichtet nach Distanz und Höhenmetern, nicht
nach dem Zeitfahrskill — für Zeitfahren hat sie deshalb keine Vorhersagekraft.

Zwei Folgen für die Quick Sim:

1. Der Leistungsscore für ITT und TTT muss aus dem Zeitfahr-Gewichtsprofil kommen,
   nicht aus der allgemeinen Favoritenwertung.
2. Bis dahin ist die Spearman-Kennzahl für diese beiden Profile nicht interpretierbar.
   Sie misst dort die Schwäche der Referenzwertung, nicht die Vorhersagbarkeit des
   Rennens.
