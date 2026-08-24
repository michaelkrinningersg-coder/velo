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

# Auf mehrere Kerne verteilen (ein Prozess je Shard)
for i in 0 1 2; do
  npm run calibrate:reference -- --per-profile=8 --runs=50 --shard=$i/3 &
done

# Danach zu Kalibrierzielen je Profil verdichten
npm run calibrate:aggregate

# Gezielt einzelne Etappen oder Profile
npm run calibrate:reference -- --stages=549,594,602 --runs=50
npm run calibrate:reference -- --profiles=Mountain,High_Mountain --runs=100
```

| Option | Vorgabe | Bedeutung |
| :-- | :-- | :-- |
| `--savegame=<pfad>` | `savegames/a_1783240576758.db` | Spielstand als Datenquelle |
| `--runs=<n>` | `30` | Läufe je Etappe |
| `--per-profile=<n>` | `3` | Etappen je Profil, wenn `--stages` fehlt |
| `--stages=<id,id>` | — | Feste Etappenauswahl statt Stichprobe |
| `--profiles=<a,b>` | — | Nur diese Etappenprofile messen |
| `--shard=<i/n>` | `0/1` | Aufteilung auf n Prozesse; misst jede n-te Etappe ab i |
| `--out=<verzeichnis>` | `debug/quicksim-reference` | Ausgabeverzeichnis |

Der Spielstand wird **vor** dem Lauf in ein temporäres Verzeichnis kopiert. Die
Originaldatei wird nie beschrieben — die Startlisten-Erzeugung (`ensureRaceEntries`)
schreibt in die Datenbank.

## Ausgabe

- `stage-<id>.json` je Etappe: Kennzahlen jedes einzelnen Laufs plus Verdichtung
- `summary.csv` (bzw. `summary-shard<i>.csv`): eine Zeile je Etappe, semikolongetrennt
- `targets.csv` / `targets.json` aus `calibrate:aggregate`: eine Zeile je **Profil**,
  normalisiert auf km/h und Sekunden je Kilometer — die eigentlichen Kalibrierziele

## Aufbau

| Datei | Zweck |
| :-- | :-- |
| `metrics.ts` | Kennzahlen eines Etappenlaufs — reine Funktionen, ohne DB und ohne Engine |
| `metrics.test.ts` | Tests dazu; laufen mit `npm test` in der Backend-Suite mit |
| `bootstrap.ts` | Baut den Etappen-Bootstrap **mit denselben Funktionen** wie die API-Route |
| `referenceRun.ts` | Der eigentliche Lauf: Etappenauswahl, Simulation, Verdichtung, Ausgabe |
| `aggregate.ts` | Verdichtet die Etappenmessung zu Kalibrierzielen je Profil |
| `determinism.test.ts` | Beweist, dass derselbe Etappen-Seed dasselbe Rennen ergibt |
| `run.js` | Plattformunabhängiger Starter über das `ts-node` des Backends |

`bootstrap.ts` baut den Bootstrap nicht selbst, sondern ruft
`backend/src/simulation/StageBootstrapService.ts` auf — denselben Dienst, den auch
die Route `GET /api/simulation/realtime/:stageId` benutzt. Ein zweiter, eigener
Aufbau würde mit der Zeit von dem abweichen, was das Spiel tatsächlich simuliert,
und niemand würde es merken.

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

## Referenzlauf vom 24.08.2026

63 Etappen, 3.150 Etappenläufe, alle elf Profile — Spielstand 2027, drei Prozesse
parallel, rund 50 Minuten. Erzeugt mit:

```bash
for i in 0 1 2; do
  npm run calibrate:reference -- --per-profile=8 --runs=50 --shard=$i/3 &
done
npm run calibrate:aggregate
```

| Profil | Etappen | km/h | 1. Zeitgruppe | Anteil | Zeitgruppen | s/km (Letzter) | Spearman |
| :-- | --: | --: | --: | --: | --: | --: | --: |
| TTT | 5 | 55,33 | 7,0 | 0,200 | 15 | 24,20 | 0,00 |
| Cobble | 2 | 48,24 | 5,0 | 0,025 | 38 | 13,73 | 0,68 |
| Cobble_Hill | 8 | 48,09 | 36,0 | 0,227 | 25 | 8,77 | 0,36 |
| Flat | 8 | 45,31 | 164,0 | 0,888 | 11 | 6,22 | 0,23 |
| Rolling | 5 | 43,70 | 123,5 | 0,670 | 18 | 8,85 | 0,24 |
| Hilly_Difficult | 6 | 43,64 | 6,0 | 0,032 | 47 | 9,52 | 0,48 |
| ITT | 5 | 43,36 | 1,0 | 0,167 | 6 | 23,12 | −0,50 |
| Medium_Mountain | 6 | 42,66 | 3,0 | 0,033 | 42 | 10,13 | 0,55 |
| Hilly | 7 | 42,41 | 58,0 | 0,375 | 19 | 10,10 | 0,38 |
| Mountain | 4 | 38,59 | 3,0 | 0,017 | 83 | 15,37 | 0,64 |
| High_Mountain | 7 | 38,21 | 2,0 | 0,011 | 106 | 16,72 | 0,63 |

Von 82 ausgewählten Etappen lieferten 19 keine Startliste (`ensureRaceEntries`
gibt leer zurück) und wurden übersprungen. Für Cobble gibt es im Spielstand nur
zwei Etappen — diese Zeile ist entsprechend dünn.

## Drei Befunde aus dem Referenzlauf

### 1. Die Referenzgeschwindigkeit ist gemessen, nicht geschätzt

`base_speed_kmh` ist die einzige Modellgröße, die sich direkt ablesen lässt. Die
Werte in `quick_sim_profiles.csv` stammen jetzt aus dieser Messung. Sie weichen
deutlich von den zunächst geschätzten ab:

| Profil | geschätzt | gemessen |
| :-- | --: | --: |
| Cobble | 39,0 | **48,2** |
| Cobble_Hill | 39,0 | **48,1** |
| Medium_Mountain | 36,0 | **42,7** |
| High_Mountain | 32,0 | **38,2** |
| Mountain | 34,0 | **38,6** |
| Hilly_Difficult | 38,0 | **43,6** |
| ITT | 48,0 | **43,4** |
| TTT | 52,0 | **55,3** |

Die Schätzungen orientierten sich am echten Radsport — die Simulation fährt aber
in den Bergen und auf Kopfsteinpflaster spürbar schneller und im Zeitfahren
langsamer als die Wirklichkeit. Die Quick Simulation muss die **Simulation**
treffen, nicht die Realität; deshalb gelten die gemessenen Werte.

### 2. Es gibt zwei Regime, keinen gleitenden Übergang

Der Anteil der Finisher in der ersten Zeitgruppe fällt nicht gleichmäßig ab,
sondern springt:

```
Flat 0,89 → Rolling 0,67 → Hilly 0,38 → Cobble_Hill 0,23
                                        ▼  Sprung
Hilly_Difficult 0,032 · Medium_Mountain 0,033 · Cobble 0,025 · Mountain 0,017 · High_Mountain 0,011
```

Entweder kommt das Feld weitgehend geschlossen an, oder es zerfällt fast
vollständig. Ein Gruppenmodell mit gleichmäßig sinkender Schwelle θ bildet das
nicht ab — die Schwelle muss diesen Sprung erzeugen. Das ist die wichtigste
Strukturaussage des Laufs.

### 3. Für ITT und TTT ist die Favoritenwertung wertlos

Bestätigt bei 250 Läufen je Profil: Spearman **−0,50** (ITT) und **0,00** (TTT).
Der ITT-Wert ist nicht nur schwach, sondern klar negativ — die allgemeine
Favoritenwertung ordnet Zeitfahrspezialisten systematisch nach hinten, weil
`calculateStageFavoriteRiderRanking` nach Distanz und Höhenmetern gewichtet und
den Zeitfahrskill nicht kennt.

Zwei Folgen für die Quick Sim:

1. Der Leistungsscore für ITT und TTT muss aus dem Zeitfahr-Gewichtsprofil
   kommen, nicht aus der allgemeinen Favoritenwertung.
2. Bis dahin ist die Spearman-Kennzahl für diese beiden Profile nicht
   interpretierbar. Sie misst dort die Schwäche der Referenzwertung, nicht die
   Vorhersagbarkeit des Rennens.
