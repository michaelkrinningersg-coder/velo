# Echte Renndaten

Vergleichsdaten aus echten Rennen, um das Gruppen- und Abstandsmodell der
Quick Simulation gegen die Wirklichkeit zu halten statt nur gegen den
eigenen Referenzlauf.

## Was hier liegt

| Datei | Inhalt |
|---|---|
| `gt_stages_2010_2024.csv` | 843 Strassenetappen der Grand Tours 2010–2024, mit Distanz, Hoehenmetern, `profile_score`, Siegerschnitt, `won_how` — und dem von uns zugeordneten Terrain |
| `tdf_gc_2010_2026.csv` | Gesamtwertung der Tour de France 2010–2026, 2.647 Zeilen, mit Rueckstand in Sekunden |
| `eigene_etappen.json` | Distanz, Hoehenmeter und `stage_score` unserer 359 eigenen Etappen — die Lerngrundlage der Zuordnung |
| `sammle_eigene_etappen.ts` + `run.js` | erzeugt `eigene_etappen.json` |
| `klassifiziere_etappen.py` | laedt die echten Etappen und ordnet sie ein |
| `hole_ergebnisse.py` | holt die Ergebnislisten (muss von aussen laufen, siehe unten) |
| `werte_ergebnisse_aus.py` | rechnet daraus die Zielgroessen: Gruppengroessen, Gruppenanzahl, Rueckstaende je Kilometer |

## Quellen

Beides ueber GitHub, weil procyclingstats.com und firstcycling.com vom
Egress-Proxy dieser Umgebung geblockt werden (403 auf CONNECT).

- Etappen: [jenslemb/cyclingdata](https://github.com/jenslemb/cyclingdata) —
  Etappen-Metadaten aus procyclingstats, 1903 bis 2024. Fuer Grand Tours ab
  2010 sind Distanz, Hoehenmeter und `profile_score` in jedem einzelnen Jahr
  zu 100 % besetzt; davor wird es lueckig.
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

## Haengt die Rennstruktur an der Etappennummer?

Roh sieht es stark danach aus. Ueber alle 843 Etappen:

| | Woche 1 | Woche 2 | Woche 3 |
|---|---|---|---|
| Solo-Sieg | 26 % | 47 % | 54 % |
| Massensprint | 52 % | 25 % | 22 % |

Je Terrain getrennt bleibt davon fast nichts uebrig:

| Terrain | Massensprint W1 / W2 / W3 | Spearman Etappennr. ↔ Solo |
|---|---|---|
| Flat | 89 % / 82 % / 82 % | −0,03 (p 0,74) |
| Rolling | 73 % / 66 % / 65 % | +0,03 (p 0,79) |
| Hilly_Difficult | 31 % / 11 % / 11 % | +0,07 (p 0,37) |
| Medium_Mountain | 15 % / 1 % / 7 % | +0,15 (p 0,05) |
| Mountain | 0 % / 0 % / 1 % | +0,04 (p 0,65) |
| High_Mountain | 0 % / 0 % | +0,18 (p 0,20) |

Der Wocheneffekt ist also fast vollstaendig ein Artefakt der Streckenplanung:
Woche 1 hat 74 Flach- und 17 Bergetappen, Woche 3 hat 45 Flach- und 70
Bergetappen. Innerhalb eines Terrains zerfaellt das Feld in Woche 3 kaum
anders als in Woche 1.

Einzige Ausnahme mit erkennbarem Rest: `Medium_Mountain` und
`High_Mountain`, beide schwach und keiner sauber signifikant.

Das gilt fuer die Zielankunft. Fuer die *Ausreissergruppe* ist der Effekt
eine andere Frage — dort haengt die Tabelle in `breakawaySurvival.ts` bewusst
an der Etappennummer, und `win_type` misst, wer gewinnt, nicht wie gross die
erste Gruppe war.

## Ausreisser

`won_how` und `win_type` sagen, *wie* eine Etappe gewonnen wurde, aber nicht,
ob die Gruppe eine Ausreissergruppe war: ein Solosieg kann eine
durchgekommene Gruppe sein oder ein Angriff aus dem Favoritenfeld heraus.

Was sich sauber ableiten laesst, ist eine Obergrenze. Ein Massensprint
schliesst eine durchgekommene Gruppe sicher aus, also gilt

    Anteil Ausreisser  <=  1 - Anteil Massensprints

| Terrain | n | Massensprint | Obergrenze |
|---|---|---|---|
| Flat | 157 | 85,4 % | 14,6 % |
| Rolling | 109 | 68,8 % | 31,2 % |
| Hilly | 46 | 52,2 % | 47,8 % |
| Hilly_Difficult | 154 | 18,8 % | 81,2 % |
| Medium_Mountain | 178 | 7,3 % | 92,7 % |
| Mountain | 147 | 0,7 % | 99,3 % |
| High_Mountain | 52 | 0,0 % | 100 % |

Ab `Hilly_Difficult` ist die Grenze zu locker, um irgendetwas zu binden. Auf
leichtem Terrain bindet sie, und dort steigt sie ueber das Rennen —
Woche 1 19,4 %, Woche 2 28,3 %, Woche 3 32,9 % — was die Abhaengigkeit von
der Etappennummer in `breakawaySurvival.ts` stuetzt. Unsere Tabelle liegt im
Mittel bei 2,5 / 6,7 / 10,6 % und damit deutlich unter der Grenze; ob sie zu
niedrig steht, entscheiden erst die Ergebnislisten.

## Was nicht kalibriert wird

Festgelegt, bevor die Daten da sind, damit die Messung die Entscheidung
nicht rueckwirkend aufweicht:

| | bleibt stehen, weil |
|---|---|
| `RANK_NOISE_FACTOR`, `TIE_BREAK_NOISE_FACTOR` | Spielentscheidung — wie stark der Zufall die Reihenfolge verschiebt, ist keine Frage an die Wirklichkeit |
| `BREAKAWAY_SURVIVAL_*` in `breakawaySurvival.ts` | eingestellte Werte; die Daten liefern dafuer ohnehin nur eine Obergrenze, keinen Messwert |
| Profil `Flat` und `Rolling`, vollstaendig | eingestellte Werte |

`Flat` und `Rolling` werden trotzdem mitgemessen. Der Vergleich zeigt, ob
das Modell dort in einer plausiblen Groessenordnung liegt — nachgezogen wird
er nicht. `werte_ergebnisse_aus.py` markiert die beiden Zeilen als
"nur Kontrolle", damit das beim Lesen der Delta-Tabelle nicht untergeht.

Nachgezogen werden also: `Hilly`, `Hilly_Difficult`, `Medium_Mountain`,
`Mountain`, `High_Mountain`.

## Was fehlt

Ergebnislisten je Fahrer und Etappe. Ohne sie sind Gruppengroessen,
Gruppenanzahl und Rueckstaende je Rang nicht messbar — und genau die sollen
kalibriert werden. Auch der wahre Ausreisseranteil braucht sie: erst am
Rueckstand des Feldes sieht man, ob eine Gruppe durchgekommen ist.

`hole_ergebnisse.py` holt sie, `werte_ergebnisse_aus.py` rechnet daraus die
Zielgroessen. Das Abholen muss von aussen laufen: beide Datenbanken
verbieten automatisierten Zugriff ausdruecklich.

    procyclingstats.com/robots.txt   User-agent: ClaudeBot  Disallow: /
    firstcycling.com/robots.txt      User-agent: ClaudeBot  Disallow: /
                                     User-agent: *          Disallow: /

Dazu steht vor beiden eine Cloudflare-Pruefung, die auf jede Etappenseite
mit 403 antwortet. Die offiziellen Veranstalterseiten (letour.fr,
lavuelta.es, giroditalia.it) erlauben den Zugriff, veroeffentlichen aber
nur die jeweils laufende Austragung.

Rund sieben Minuten fuer die 199 Bergetappen, 28 Minuten fuer alle 843.

### In GitHub Codespaces

Der schnellste Weg, weil dort schon alles liegt und der Ordner danach
direkt commitet werden kann.

1. Auf GitHub im Repository **Code → Codespaces → Create codespace on
   `claude/game-review-suggestions-gqf6en`**. Der Devcontainer laeuft
   automatisch hoch.
2. Im Terminal des Codespace:

       pip install procyclingstats
       python3 tools/real-data/hole_ergebnisse.py --alle

   Falls `pip` fehlt: `sudo apt-get update && sudo apt-get install -y python3-pip`.
   Falls `pip` in eine andere Umgebung installiert als das Skript laeuft,
   nennt die Fehlermeldung den passenden Aufruf.
3. Danach:

       git add tools/real-data/ergebnisse
       git commit -m "Ergebnislisten der Grand Tours 2010-2024"
       git push

Die Dateien sind gepackt und auf das Noetige eingedampft — alle 843
Etappen zusammen rund 2 MB.

**Achtung:** procyclingstats steht hinter einer Cloudflare-Pruefung, und
die schlaegt bei Rechenzentrums-Adressen oefter zu als bei einem
Heimanschluss. Wenn der Codespace geblockt wird, bricht das Skript nach
zehn Fehlschlaegen in Folge ab — dann bleibt der Lauf auf dem eigenen
Rechner.

Ebenfalls offen: 2025 und 2026, die in `cyclingdata` noch nicht stehen.
