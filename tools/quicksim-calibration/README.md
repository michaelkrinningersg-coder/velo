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
| `analyzeGroupRegime.ts` | Passt die Regime-Kurve an und weist Residuen je Profil aus |
| `validateGroupModel.ts` | Stellt die Modellvorhersage gegen die gemessenen Etappen |
| `quickSimAdapter.ts` | Ruft denselben Läufer auf wie das Spiel (`runQuickSimulation`) |
| `quickSimRunner.test.ts` | Prüft die Anbindung: Ergebniszeilen, Wertungen, Ereignisse |
| `compareQuickSim.ts` | Fährt dieselben Etappen mit dem Quick-Kern und stellt sie gegenüber |
| `fitAll.ts` | Leitet **alle** gemessenen Parameter her und schreibt CSV und Vorgabewerte |
| `fit/regression.ts` | Die Anpassungen dahinter — rein, ohne Datei und ohne Simulation |
| `fit/regression.test.ts` | Prueft sie gegen bekannte Wahrheiten |
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
wird einmal je Etappe gezogen (`ensureSimSeedRolled`) und über `bootstrap.simSeed`
an die Engine gereicht. Fehlt er, zieht die Engine einen — dann verhält sie sich wie
zuvor, nur eben nicht wiederholbar.

**Auch das Wetter wird aus dem Seed abgeleitet** (`deriveSeed(seed, 'weather')`), so
dass `stages.rolled_weather_id` bei gleichem Seed derselbe Wert ist.

**Korrektur:** hier stand vorher, das habe eine Quelle von Unterschieden zwischen
zwei Referenzläufen beseitigt. Das war falsch. Eine Sonde zeigt, dass die gerollten
Wetterwerte den Bootstrap gar nicht erreichen — `rolledWeatherId`,
`rolledEffektSturz`, `rolledEffektDefekt`, `rolledWindkantenGefahr`,
`rolledEffektFatigue` und `rolledBreakawayBonus` sind dort alle `undefined`, obwohl
sie in der Datenbank stehen. Die Engine fällt auf `weatherId = 1` und Effekt 0
zurück; **Wetter beeinflusst das Rennergebnis auf diesem Weg überhaupt nicht.** Der
gemessene Unterschied zwischen zwei Läufen kommt allein aus der ungeseedeten
Startliste. Ursache und Umfang stehen unter „Bekannte Grenzen".

Für Messungen nagelt der Harness den Etappen-Seed deterministisch fest
(`pinStageSeed`, abgeleitet aus der Etappen-ID) und gibt jedem Lauf einen eigenen
davon abgeleiteten Seed (`resolveRunSeed`). Der Etappenaufbau steht damit über alle
Referenzläufe fest, der Rennverlauf variiert weiterhin.

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
- Rückstand an den Feldpositionen 50 %, 75 %, 90 %, 95 %, 99 % — erst diese Kurve
  macht das abgehängte Ende sichtbar
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
npm run calibrate:validate     # Modell gegen die Referenz pruefen
npm run calibrate:compare      # Quick-Kern gegen Instant, Kennzahl fuer Kennzahl
npm run calibrate:fit -- --write   # alle Parameter neu herleiten und schreiben
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

### Der zweite Lauf — und eine Korrektur

Für die Kurve des Feldendes wurde derselbe Lauf mit den neuen Kennzahlen wiederholt
(`debug/quicksim-reference-v2`): dieselben 63 Etappen, dieselben Distanzen, derselbe
Spielstand. Der Vergleich beider Läufe ist damit auch eine Messung der
Wiederholbarkeit — und die fällt schlechter aus, als hier vorher stand.

| Profil | km/h Lauf 1 | km/h Lauf 2 | Delta |
| :-- | --: | --: | --: |
| ITT | 51,74 | 48,53 | **−6,2 %** |
| High_Mountain | 38,98 | 37,52 | −3,7 % |
| Hilly | 44,41 | 43,65 | −1,7 % |
| Rolling | 43,66 | 43,02 | −1,5 % |
| Cobble | 47,07 | 47,53 | +1,0 % |
| übrige | | | < 1 % |

**Die frühere Angabe „innerhalb von 0,3 %" war falsch.** Sie stammte aus einem
Vergleich zweier Läufe *derselben* Etappen nach der Wetterkorrektur, nicht aus zwei
vollständigen Referenzläufen. Der verbliebene Unterschied ist die noch ungeseedete
Startliste (`useTrueRandom` in `RaceRosterService`): jede frische Kopie des
Spielstands lost die letzten Kaderplätze neu. Beim ITT schlägt das am stärksten
durch, weil dort die Siegerzeit an einem einzelnen Fahrer hängt.

Die gemessenen Parameter in `quick_sim_profiles.csv` sind deshalb das **Mittel aus
beiden Läufen**. Für `base_speed_kmh` heißt das eine Unsicherheit von rund ±2 %,
beim ITT ±3 %.

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

### Wie gut das Modell die Referenz trifft

`npm run calibrate:validate` stellt für jede gemessene Etappe den erwarteten Anteil
der ersten Zeitgruppe gegen den beobachteten. Stand des aktuellen Datensatzes:

| Profil | Etappen | beobachtet | Modell | Delta |
| :-- | --: | --: | --: | --: |
| Flat | 8 | 0,635 | 0,633 | −0,001 |
| Rolling | 5 | 0,567 | 0,564 | −0,003 |
| Hilly | 7 | 0,451 | 0,451 | −0,000 |
| Cobble_Hill | 8 | 0,292 | 0,290 | −0,002 |
| Hilly_Difficult | 6 | 0,244 | 0,246 | +0,001 |
| Medium_Mountain | 6 | 0,078 | 0,078 | +0,000 |
| Mountain | 4 | 0,034 | 0,038 | +0,004 |
| Cobble | 2 | 0,027 | 0,030 | +0,002 |
| High_Mountain | 7 | 0,022 | 0,024 | +0,001 |

**Mittlerer absoluter Fehler: 0,002.** Das Werkzeug bricht ab, wenn er über 0,08
steigt — damit fällt eine Parameteränderung auf, die das Modell von der Referenz
wegzieht.

Vorher lag er bei 0,047, und das Muster war eindeutig: das Modell sagte für **jedes**
Bergprofil 0,092 voraus — den gepoolten Mittelwert für zerfallene Felder — beobachtet
waren 0,022 bis 0,034. `Beta(0,408; 4,025)` mischte Cobble_Hill (0,21) und Rolling
(0,23) mit High_Mountain (0,02). Beide Regime hängen selbst noch vom Profil ab:

- **geschlossen**: Mittelwert je Profil (`bunched_share_mean`), relative Streuung
  0,123 gemeinsam. Gemessen: Flat 0,858, Hilly 0,786, Hilly_Difficult 0,734,
  Rolling 0,704, Cobble_Hill 0,624.
- **zerfallen**: `Anteil = split_share_intercept + (−0,0673) · ln(D)`, relative
  Streuung 0,694. Diese Form erklärt 54 % der Streuung zwischen den Etappen
  (R² 0,540, BIC −9679), ein gepoolter Mittelwert 0 %.

### Was das Modell noch nicht trifft

Die logistische Kurve unterschätzt das obere Ende: bei D ≈ 0,1 sagt sie rund 75–80 %
voraus, beobachtet sind 94–98 %. Für die Sättigungszone braucht es entweder eine
asymmetrische Verknüpfungsfunktion oder eine Untergrenze auf dem gezogenen Anteil.

## Quick gegen Instant

`npm run calibrate:compare` fährt dieselben Etappen mit dem Quick-Kern und misst sie
mit **derselben** `computeStageRunMetrics`. Das ist die Prüfung, die
`calibrate:validate` nicht leisten kann: ein Modell kann die Momente einer einzelnen
Größe treffen und trotzdem Etappenergebnisse liefern, die kein Radrennen sind.

55 Etappen, 20 Quick-Läufe je Etappe, Median über alle Läufe eines Profils
(I = Instant, Q = Quick):

| Profil | km/h I → Q | 1. Gruppe I → Q | Zeitgruppen I → Q | s/km Letzter I → Q |
| :-- | :-- | :-- | :-- | :-- |
| Flat | 44,56 → 44,46 | 0,858 → 0,844 | 11 → 9 | 6,00 → 6,89 |
| Rolling | 43,28 → 43,43 | 0,699 → 0,682 | 16 → 17,5 | 8,84 → 8,18 |
| Hilly | 43,52 → 44,08 | 0,375 → 0,305 | 19 → 17,5 | 8,93 → 8,55 |
| Cobble_Hill | 47,48 → 47,37 | 0,207 → 0,216 | 23 → 26 | 7,44 → 8,13 |
| Hilly_Difficult | 41,81 → 41,56 | 0,038 → 0,044 | 46,5 → 47 | 10,25 → 9,70 |
| Cobble | 47,61 → 46,79 | 0,030 → 0,019 | 34,5 → 34 | 12,90 → 12,78 |
| Medium_Mountain | 41,18 → 40,86 | 0,039 → 0,073 | 41 → 41 | 9,94 → 10,56 |
| Mountain | 38,28 → 38,46 | 0,016 → 0,033 | 70,5 → 72 | 13,77 → 13,47 |
| High_Mountain | 37,40 → 38,32 | 0,017 → 0,020 | 86,5 → 87 | 14,84 → 16,40 |
| **ITT** | 48,53 → 50,03 | 0,020 → 0,020 | 34 → 29 | 11,83 → 12,07 |
| **TTT** | 57,44 → 57,45 | 0,047 → 0,050 | 30,5 → 31 | 22,38 → 22,27 |

Alle elf Profile treffen: Geschwindigkeit auf ±0,9 km/h (ITT siehe unten), Anteil
der ersten Gruppe auf ±0,07, Zahl der Zeitgruppen auf ±5, Rückstand des Letzten auf
±1,6 s/km. Der Kern läuft dabei rund **1.460-mal schneller** als die
Instant-Simulation (0,53 ms gegen 774 ms je Etappe).

Die **+1,51 km/h beim ITT sind kein Modellfehler, sondern die Streuung zwischen zwei
Referenzläufen**: gegen Lauf 1 gemessen liegt derselbe Wert bei −1,68 km/h. Das
Modell steht mit 50,0 km/h zwischen den beiden Messungen (51,74 und 48,53), weil
`base_speed_kmh` das Mittel aus beiden ist. Beim ITT hängt die Siegerzeit an einem
einzelnen Fahrer, und die Startliste ist noch nicht geseedet.

### Zeitfahren: ein eigenes Modell

ITT und TTT liefen zunächst durch das Straßenmodell und trafen als einzige nicht —
15 Zeitgruppen statt 34 beim ITT, eine erste Gruppe von 15 % des Feldes statt 2 %.
Das war zu erwarten: eine Regime-Ziehung, eine Ausreißergruppe und gezogene
Zeitgruppen gibt es beim Zeitfahren nicht.

Eine Sonde über die Instant-Simulation zeigt, was stattdessen passiert:

**TTT — die Mannschaft *ist* die Zeitgruppe.** Über zwei Etappen und 51 Mannschaften
beträgt die Spanne innerhalb eines Teams **exakt 0,0 Sekunden**, ausnahmslos. Die
Zahl der Zeitgruppen ist damit die Zahl der Mannschaften. Die Teamzeit hängt am
Mittel der besten fünf, minus einem Punkt je fehlendem Fahrer — dieselbe Regel wie
in `applyTeamTimeTrialTempo`, hier übernommen statt nachgebaut.

Die anfangs vermuteten „Abreißer" gibt es nicht. Ohne die Messung wäre ein
Mechanismus dafür eingebaut worden, den das Spiel gar nicht kennt.

**ITT — jeder fährt allein.** Der Rückstand wächst linear mit dem Score-Abstand zum
Besten, dazu die Tagesform als Streuung. Über fünf Etappen gemessen: Steigung 0,0042
der Siegerzeit je Score-Punkt (0,0027–0,0063), Reststreuung 1,9 % (1,75–2,26 %),
Pearson 0,53–0,85. Der Score erklärt also das meiste, aber nicht alles — auf einer
Etappe lag der Fünftplatzierte mit dem *höchsten* Score 11 Sekunden zurück.

Beide Profile bekommen dieselbe Konstruktion:

```
versatz_i = time_trial_slope · (bester_score − score_i) + N(0, time_trial_noise)
rueckstand_i = siegerzeit · (versatz_i − min versatz)
```

Beim TTT je Mannschaft statt je Fahrer. Die Normierung auf den tatsächlich
Schnellsten ist nötig, damit die gezogene Siegerzeit die Siegerzeit bleibt —
`base_speed_kmh` ist selbst eine Siegergeschwindigkeit.

Die Zeitgruppen entstehen in beiden Fällen **aus den Zeiten**, nicht aus einer
Ziehung. Das erklärt nebenbei eine Beobachtung, die vorher unverständlich war: ein
10-km-Zeitfahren hat 35 Zeitgruppen, ein 23-km-Zeitfahren 80 — bei gleichem Feld.
Dieselbe relative Streuung, auf mehr Sekunden verteilt, reißt mehr Ein-Sekunden-
Lücken.

Die Werte aus der Sonde trafen die Zielgrößen noch nicht (TTT: 13,8 s/km statt
22,4), weil die Streuung zwischen den Etappen groß ist. `npm run calibrate:fit-tt`
fittet beide Parameter über ein Raster gegen den Rückstand des Letzten und die Zahl
der Zeitgruppen. Ergebnis: ITT 0,0060 / 0,0200, TTT 0,0150 / 0,0050. Beim TTT ist
die Steigung deutlich höher und die Streuung fast null — was zur Beobachtung passt,
dass eine Mannschaft geschlossen ankommt: das Ergebnis steht mit der Teamaufstellung
praktisch fest.

### Wie das Rückstandsmodell zustande kam

Zwei Fassungen sind an der Messung gescheitert, bevor die dritte stand.

**Fassung 1 — Rückstand aus dem Score-Abstand.** `Δt = f · (S_vorn − S)^γ · km`.
Sie erzeugt auf einer Flachetappe einen Rückstand des Letzten von 0,58 s/km statt
gemessener 6,5. Ein Fit über `f` und `γ` hilft nicht, weil das Problem nicht die
Skalierung ist: Rang 100 liegt bei 0,035 s/km, der Letzte bei 6,5 — **Faktor 185**.
So einen Sprung erzeugt kein Score-Abstand, denn die Scores springen dort nicht.

**Was stattdessen passiert:** das Ende des Feldes wird abgehängt. Eine Sonde über
die volle Rückstandskurve (Median über 6 Läufe):

| Rang | Etappe 260 (Flat, 109 km, 183 Finisher) | Etappe 336 (Flat, 235 km, 178 Finisher) |
| --: | --: | --: |
| 100 | 10,9 s | 62,7 s |
| 140 | 18,2 s | 242,8 s |
| 170 | 28,4 s | 742,5 s |
| 175 | **196,4 s** | 876,5 s |
| letzter | 891,8 s | 1007,4 s |

*Wo* das anfängt, hängt an der Etappe: bei 109 km um Rang 172 von 183, bei 235 km
schon um Rang 130 von 178. Es sind keine Stürze — der Effekt tritt in **jedem** Lauf
auf und die DNF-Zahl ist im Median null. Ein Versuch, ihn über
`incident_loss_multiplier` zu erklären, lief bis an die Obergrenze 200, ohne den
beobachteten Wert zu erreichen.

**Fassung 2 — eine Kurve über der Position im Feld.** Der zweite Referenzlauf misst
den Rückstand an relativen Feldpositionen. Aufgetragen über der Position *hinter der
ersten Zeitgruppe* — also v = (u − Anteil) / (1 − Anteil) — fallen die Kurven aller
neun Straßenprofile zusammen:

```
rueckstand(v) = tail_gap_per_km · km · ε · v^α / (1 − v + ε)      ε = 0,081   α = 0,50
```

Bei v = 1 ergibt das genau `tail_gap_per_km`, den gemessenen Rückstand des letzten
Fahrers. Beide Formparameter sind **gemeinsam** über alle Profile, nur die Höhe ist
profilabhängig — aus 11.601 Messpunkten über 53 Etappen, RMSE 0,69 im Log-Raum
(0,25 im Hochgebirge, 0,50 gepoolt bei den mittleren Profilen).

Damit stimmte der Rückstand, aber das Feld zerfiel zu fein: 28 Zeitgruppen auf einer
Flachetappe statt 11, 174 im Hochgebirge statt 87. Jeder Fahrer fuhr allein.

**Fassung 3 — die Klumpung dazu.** Das abgehängte Ende fährt in kleinen Gruppen. Die
Zahl der Fahrer je Gruppe wird geometrisch gezogen; ihr Mittelwert ist der neue
Parameter `tail_group_size`.

Er lässt sich nicht ablesen: der Median des Verhältnisses „Fahrer je Gruppe" über
die Läufe ergibt für Flat 2,00, gepoolt 4,49 — **keiner von beiden** reproduziert die
gemessenen 11 Zeitgruppen. `npm run calibrate:fit-tail` fittet ihn deshalb direkt
gegen die Zielgröße (Bisektion, ein Parameter, ein Ziel) und trifft jedes Profil auf
eine Gruppe genau. Für Flat kommt 4,83 heraus.

**Was das Modell dafür aufgibt:** die Rückstände hängen jetzt nur noch an der
Position im Feld, nicht mehr an den Score-Abständen. Zwei Felder gleicher Größe mit
völlig verschiedener Stärkespreizung bekommen dieselben Zeiten — nur die Reihenfolge
unterscheidet sich. Das ist bewusst: die Messung zeigt, dass die Instant-Simulation
sich im Wesentlichen genauso verhält, und ein Modell, das eine Abhängigkeit
behauptet, die niemand gemessen hat, wäre schlechter, nicht besser.

## Bekannte Grenzen der Messung

- **Die Startliste ist noch nicht geseedet.** `RaceRosterService` füllt die letzten
  Kaderplätze bewusst mit echtem Zufall (`useTrueRandom`), damit ein Team nicht
  immer dieselben Wasserträger schickt. Auf einer frischen Kopie des Spielstands
  wird der Kader dadurch neu gelost. Nach der Wetterkorrektur ist das die einzige
  verbliebene Quelle von Unterschieden zwischen zwei Referenzläufen — und sie ist
  **größer als hier vorher stand**: zwei vollständige Läufe derselben 63 Etappen
  unterscheiden sich in der mittleren Geschwindigkeit um bis zu 6,2 % (ITT), 3,7 %
  (High_Mountain) und unter 2 % bei den übrigen. Die gemessenen Parameter sind
  deshalb das Mittel aus beiden Läufen.
- **`incident_loss_multiplier` ist ungemessen.** Der Rückstand des letzten Fahrers,
  der naheliegende Zielwert, entsteht nicht durch Stürze — er ist auch in Läufen
  ohne jeden Vorfall da. Es fehlt eine Kennzahl, die den Zeitverlust *eines
  gestürzten Fahrers* isoliert.
- **Wetter erreicht die Simulation nicht.** `mapStage` existiert zweimal: einmal in
  `backend/src/db/mappers.ts` (vollständig) und einmal als eigene Fassung in
  `backend/src/db/GameRepository_actual.js` — der kompilierten Brücke, die
  `GameRepository` tatsächlich re-exportiert und über die der Bootstrap läuft. Die
  zweite Fassung war stehengeblieben und ließ neun Felder aus. `profileScore` ist
  ergänzt (die Quick Simulation braucht ihn für die Schwierigkeit je Kilometer, die
  Instant-Simulation liest ihn nicht — der Referenzdatensatz bleibt gültig). Die
  sechs Wetterfelder sind **bewusst noch nicht** ergänzt: sie einzuschalten ändert
  das Verhalten der Instant-Simulation und macht damit den Referenzdatensatz und
  alle daraus gefitteten Parameter ungültig.
- **`time_trial_slope` und `time_trial_noise` ruhen auf je fünf Etappen.** Für ITT
  und TTT gibt es im Spielstand nicht mehr. Die Streuung zwischen den Etappen ist
  entsprechend groß (TTT-Steigung 0,0032 bis 0,0123 in der Sonde).
- **Cobble ruht auf zwei Etappen.** Der Achsenabschnitt −4,03 ist plausibel, aber
  dünn belegt.
- **19 der 82 ausgewählten Etappen lieferten keine Startliste.** Die Stichprobe ist
  dadurch auf Etappen verschoben, für die das Rennprogramm ein Feld stellt.
