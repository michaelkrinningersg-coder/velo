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

## Referenzlauf

63 Etappen, 3.150 Etappenläufe, alle elf Profile — Spielstand 2027, drei Prozesse
parallel, rund 50 Minuten:

```bash
for i in 0 1 2; do
  npm run calibrate:reference -- --per-profile=8 --runs=50 --shard=$i/3 &
done
npm run calibrate:aggregate    # Zielwerte je Profil
npm run calibrate:groups       # Regime-Analyse der Gruppenbildung
```

| Profil | Etappen | km/h | 1. Zeitgruppe | Anteil | Zeitgruppen | s/km (Letzter) | Spearman |
| :-- | --: | --: | --: | --: | --: | --: | --: |
| TTT | 5 | 57,87 | 9,0 | 0,050 | 31 | 21,50 | 0,21 |
| ITT | 5 | 51,74 | 1,0 | 0,020 | 34 | 13,25 | 0,57 |
| Cobble_Hill | 8 | 47,31 | 43,0 | 0,265 | 26 | 8,70 | 0,41 |
| Cobble | 2 | 47,07 | 3,0 | 0,015 | 42 | 12,28 | 0,66 |
| Flat | 8 | 44,70 | 148,5 | 0,833 | 11 | 7,37 | 0,18 |
| Hilly | 7 | 44,41 | 72,5 | 0,418 | 19 | 8,33 | 0,32 |
| Rolling | 5 | 43,66 | 125,0 | 0,679 | 17 | 8,06 | 0,19 |
| Hilly_Difficult | 6 | 41,57 | 3,5 | 0,019 | 48 | 9,71 | 0,44 |
| Medium_Mountain | 6 | 40,76 | 5,0 | 0,049 | 44 | 10,84 | 0,61 |
| High_Mountain | 7 | 38,98 | 2,0 | 0,010 | 107 | 17,50 | 0,62 |
| Mountain | 4 | 38,50 | 3,0 | 0,016 | 83 | 13,65 | 0,65 |

Von 82 ausgewählten Etappen lieferten 19 keine Startliste und wurden übersprungen;
für Cobble gibt es im Spielstand nur zwei Etappen.

`base_speed_kmh` in `quick_sim_profiles.csv` stammt aus dieser Messung — es ist die
einzige Modellgröße, die sich direkt ablesen lässt.

## Das Gruppenmodell: Regime statt Schwelle

Der ursprüngliche Entwurf sah eine feste Gruppenschwelle θ je Profil vor: eine neue
Zeitgruppe beginnt, wenn der Score-Abstand θ überschreitet. **Die Messung widerlegt
das.**

Die erste Beobachtung war ein scheinbarer Sprung zwischen zwei Regimen — Flat 0,83,
Rolling 0,68, Hilly 0,42, und dann direkt unter 0,05 für alles Schwerere. Die
Analyse je Etappe zeigt aber: der Sprung ist ein Artefakt der Aggregation. Die
Bimodalität sitzt **zwischen Etappen**, nicht zwischen Profilen — innerhalb eines
Profils gibt es Etappen, die praktisch immer geschlossen ankommen, und andere, die
es nie tun.

Was das vorhersagt, ist die **Schwierigkeit je Kilometer**:

```
D = stage_score / distanceKm
```

Spearman(Anteil geschlossener Ankünfte, D) = **−0,71** über 53 Straßenetappen.

Drei Modellformen im Vergleich (gewichtete logistische Regression, 2.650 Läufe):

| Modell | LogLik | Parameter | BIC |
| :-- | --: | --: | --: |
| logit = a + b·D | −1057,2 | 2 | 2130 |
| logit = a + b·log(D) | −1100,9 | 2 | 2218 |
| **logit = a(Profil) + b·D** | **−891,9** | 10 | **1863** |

Das dritte gewinnt deutlich. Die gemeinsame Steigung ist **b = −5,869**; die
Achsenabschnitte stehen als `bunch_intercept` in `quick_sim_profiles.csv`:

| klumpt eher | | zerfällt eher | |
| :-- | --: | :-- | --: |
| Rolling | +3,02 | High_Mountain | −0,98 |
| Hilly_Difficult | +2,73 | Mountain | −1,33 |
| Hilly | +2,00 | Medium_Mountain | −2,69 |
| Cobble_Hill | +1,64 | Cobble | −4,03 |
| Flat | +1,57 | | |

Cobble mit −4,03 ist der stärkste Profileffekt: Kopfsteinpflaster zersprengt das
Feld weit über das hinaus, was die Schwierigkeit je Kilometer erwarten ließe. Genau
dafür ist der Achsenabschnitt da.

### Das korrigierte Modell

Statt einer Schwelle auf Score-Abständen wird die Gruppenstruktur **gezogen**:

1. **Regime**: `P(geschlossen) = sigmoid(bunch_intercept + BUNCH_SLOPE · D)`
2. **Größe der ersten Gruppe** aus der regime-bedingten Verteilung:
   - geschlossen: Anteil der Finisher, Mittel 0,772, sd 0,124 → `Beta(8,065; 2,382)`
   - zerfallen: Mittel 0,092, sd 0,124 → `Beta(0,408; 4,025)`
3. **Zuordnung**: Fahrer nach Score sortieren, die ersten n bilden die erste
   Zeitgruppe
4. **Dahinter** Gruppen nach dem Abstandsmodell

Der Score bestimmt damit nur noch, **wer** in welcher Gruppe ist — nicht mehr,
**wie viele**. Das ist der wesentliche Unterschied zum Entwurf, und es ist der
Grund, warum die Zahlen direkt kalibrierbar sind: alle vier Größen sind gemessen,
keine ist geraten.

Als Kontrollgröße für das Abstandsmodell: die Zahl der Zeitgruppen liegt bei
geschlossener Ankunft im Median bei 15 (p10 8, p90 24), bei zerfallenem Feld bei 45
(p10 14, p90 123).

### Was das Modell noch nicht trifft

Die logistische Kurve unterschätzt das obere Ende: bei D ≈ 0,1 sagt sie rund 80 %
voraus, beobachtet sind 94–98 %. Für die Sattigungszone braucht es entweder eine
asymmetrische Verknüpfungsfunktion oder eine Untergrenze auf dem gezogenen Anteil.

## Bekannte Grenzen der Messung

- **Das Wetter wird je Referenzlauf neu gewürfelt.** Innerhalb eines Laufs ist es
  je Etappe fest, zwischen zwei Läufen aber nicht. Deshalb schwanken die
  Profilmittel zwischen Läufen stärker als die Laufzahl vermuten lässt — Hilly lag
  in zwei Läufen bei 42,4 und 44,4 km/h. Für stabile Zielwerte müsste das Wetter
  entweder festgeschrieben oder je Lauf statt je Etappe gewürfelt werden, damit
  über die Wetterlagen gemittelt wird.
- **Cobble ruht auf zwei Etappen.** Der Achsenabschnitt −4,03 ist plausibel, aber
  dünn belegt.
- **19 der 82 ausgewählten Etappen lieferten keine Startliste.** Die Stichprobe ist
  dadurch auf Etappen verschoben, für die das Rennprogramm ein Feld stellt.
