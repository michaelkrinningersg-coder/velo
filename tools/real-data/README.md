# Echte Renndaten

Vergleichsdaten aus echten Rennen, um das Gruppen- und Abstandsmodell der
Quick Simulation gegen die Wirklichkeit zu halten statt nur gegen den
eigenen Referenzlauf.

## Was hier liegt

| Datei | Inhalt |
|---|---|
| `gt_stages_2020_2024.csv` | 283 Strassenetappen der Grand Tours 2020–2024, mit Distanz, Hoehenmetern, `profile_score`, Siegerschnitt, `won_how` — und dem von uns zugeordneten Terrain |
| `tdf_gc_2020_2026.csv` | Gesamtwertung der Tour de France 2020–2026, 1.031 Zeilen, mit Rueckstand in Sekunden |
| `eigene_etappen.json` | Distanz, Hoehenmeter und `stage_score` unserer 359 eigenen Etappen — die Lerngrundlage der Zuordnung |
| `sammle_eigene_etappen.ts` + `run.js` | erzeugt `eigene_etappen.json` |
| `klassifiziere_etappen.py` | laedt die echten Etappen und ordnet sie ein |

## Quellen

Beides ueber GitHub, weil procyclingstats.com und firstcycling.com vom
Egress-Proxy dieser Umgebung geblockt werden (403 auf CONNECT).

- Etappen: [jenslemb/cyclingdata](https://github.com/jenslemb/cyclingdata) —
  Etappen-Metadaten aus procyclingstats, 1903 bis 2024. Fuer Grand Tours ab
  2020 sind Distanz, Hoehenmeter und `profile_score` zu 100 % besetzt.
- Gesamtwertung: [thomascamminady/LeTourDataSet](https://github.com/thomascamminady/LeTourDataSet)
  — bis einschliesslich 2026.

## Wie das Terrain zugeordnet wird

Nicht ueber eine feste Hoehenmeterregel, sondern gelernt aus unseren eigenen
Etappen. Die 324 eigenen Strassenetappen tragen bereits ein Profil; ein
Random Forest lernt daraus, welche Kombination aus

    D      = stage_score / km        Schwierigkeit je Kilometer
    hm_km  = Hoehenmeter / km        Steigung je Kilometer
    km, hm                           Distanz und Hoehenmeter absolut

zu welchem Terrain gehoert. Kreuzvalidiert liegt er zu 86 % genau richtig,
9 % landen eine Stufe daneben, 5 % weiter weg.

Eine reine Hoehenmeterregel reicht nicht. Auf unsere eigenen Etappen
angewandt macht `> 4000 hm = High_Mountain, 3000–4000 = Mountain` aus

- 13 von 16 `Mountain`-Etappen ein `High_Mountain`,
- 20 von 55 `Hilly_Difficult` ein `Mountain`,
- 25 von 36 `Medium_Mountain` ein `Mountain`.

Die Hoehenmeter allein trennen also nur die Spitze sauber ab. `D` ist das
staerkste Einzelmerkmal (Gewicht 0,31), gefolgt von den absoluten
Hoehenmetern (0,27).

Pflaster steht bewusst weder als Lern- noch als Zielklasse darin: ob eine
Etappe ueber Pflaster fuehrt, laesst sich aus Hoehenprofil und Score nicht
ablesen. Pflasteretappen bekommen hier das Terrain ihrer Hoehenform.

## Was fehlt

Ergebnislisten je Fahrer und Etappe. Ohne sie sind Gruppengroessen,
Gruppenanzahl und Rueckstaende je Rang nicht messbar — und genau die sollen
kalibriert werden. Die Quellen dafuer (PCS, FirstCycling) sind von hier aus
nicht erreichbar; die Daten muessen von aussen hereingereicht werden.

Ebenfalls offen: 2025 und 2026, die in `cyclingdata` noch nicht stehen.
