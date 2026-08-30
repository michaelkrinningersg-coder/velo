# Fortschritt messen

Wo bleibt die Zeit, wenn ein Spielstand mit dem Auto-Weiter voranschreitet?

Das Werkzeug stellt serverseitig genau die Aufrufkette nach, die die Oberfläche
je Schritt macht, und misst sie zweifach: die Wanduhr je Phase und jede einzelne
ausgeführte SQL-Anweisung, der Phase zugeordnet.

Die Phasen eines Schritts:

| Phase        | Was                                                            |
|--------------|----------------------------------------------------------------|
| `loadStatus` | `loadStatus()` — gibt die nächste offene Etappe frei            |
| `startliste` | `ensureRaceEntries` — baut den Kader, nur vor der 1. Etappe     |
| `aufbau`     | `assembleStageBootstrap` — vor jeder Etappe                     |
| `quicksim`   | `runQuickSimulation`, im Spiel im Browser                       |
| `commit`     | `commitRealtimeStage` samt Abrechnung und Kompaktierung         |
| `advanceDay` | `advanceDay()`                                                  |
| `draft`      | die restlichen Draft-Picks plus Saisonstart                     |

Die Tabelle *Kosten je Schritt-Art* trennt zusätzlich nach Eintagesrennen,
erster, mittlerer und letzter Etappe. Erst damit lässt sich beantworten, warum
sich die erste Etappe eines Rennens zäher anfühlt als die zweite.

## Zwei Monate messen

```
NODE_PATH=backend/node_modules \
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}' \
  node -r ./backend/node_modules/ts-node/register/transpile-only \
  tools/fortschritt/messung.ts savegames/mein.db 2
```

Der Spielstand wird kopiert, nicht verändert.

## Einen Spielstand vorrechnen

Ein frischer Spielstand sagt wenig darüber, wie sich das Spiel nach Jahren
anfühlt. `vorlauf.ts` rechnet ihn vor und schreibt dabei mit, was jeder Monat
gekostet hat — das ist zugleich die Skalierungskurve.

```
... tools/fortschritt/vorlauf.ts savegames/mein.db /tmp/weit.db 2033-06-01
```

## Eine teure Abfrage ihrem Verursacher zuordnen

`SPUR` nimmt den Anfang einer SQL-Anweisung und zählt mit, aus welcher Stelle im
Code sie kommt. Ohne das rät man, welcher der vielen Aufrufer gemeint ist.

```
SPUR="SELECT riders.*" ... tools/fortschritt/messung.ts savegames/mein.db 2
```

Mehrere Anfänge lassen sich mit `;;` trennen; die Zählung nennt dann je Zeile,
welche Abfrage gemeint war.

## Wanduhr: messung oder vorlauf?

`messung.ts` legt eine Messhülle um **jede** SQL-Ausführung. Das kostet — in
einem Profil entfielen knapp 40 % der Laufzeit auf die Hülle selbst. Die
Aufteilung nach Phasen und die Rangliste der Abfragen stimmen trotzdem, die
absolute Wanduhr ist aber zu hoch.

Für ein ehrliches Vorher/Nachher deshalb `vorlauf.ts` nehmen: es misst nur die
Phasen, ohne Hülle. Zwei Monate ab 2033-06 auf demselben Spielstand kosteten so
15,96 s vorher und 10,16 s nachher — 79,8 gegen 50,8 ms je Schritt.

## Schalter

- `STUMM=0` — die Protokollausgabe der Simulation stehen lassen. Sie kostet
  Zeit und macht die Tabellen unlesbar, deshalb ist sie sonst aus.
