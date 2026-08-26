"""Aus den Ergebnislisten die Zielgroessen des Gruppenmodells ausrechnen.

Liest, was `hole_ergebnisse.py` nach `ergebnisse/` geschrieben hat, und
erzeugt `ziele_real.csv` — je Terrain die gemessenen Korridore, gegen die
das Modell kalibriert wird.

`Flat` und `Rolling` werden mitgemessen, aber nicht nachgezogen — siehe
`NICHT_KALIBRIEREN`. Die Messung dient dort nur der Kontrolle.

Zwei Dinge sind bewusst so und nicht anders gerechnet:

Rueckstaende an *relativen* Positionen, nicht an festen Raengen. Ein echtes
Grand-Tour-Feld schrumpft von 176 auf 140 Fahrer; Rang 100 heisst am Anfang
etwas anderes als am Ende. Das Modell parametrisiert die Kurve ohnehin ueber
die Position hinter der Spitzengruppe, also passt das zusammen. Feste Raenge
stehen trotzdem mit drin, weil sie sich leichter lesen lassen.

Rueckstaende je Kilometer, nicht absolut. `tail_gap_per_km` ist so definiert,
und eine 120-km-Bergetappe ist mit einer 220-km-Bergetappe sonst nicht
vergleichbar.

Aufruf:  python3 tools/real-data/werte_ergebnisse_aus.py
"""
from __future__ import annotations

import gzip
import json
import re
import statistics
import sys
from pathlib import Path

HIER = Path(__file__).resolve().parent
QUELLE = HIER / 'ergebnisse'
ZIEL = HIER / 'ziele_real.csv'

# Dieselbe Regel wie im Spiel: wer hoechstens eine Sekunde hinter dem
# Vordermann liegt, steht in derselben Zeitgruppe.
ZEITGLEICH_SEKUNDEN = 1
# Anteile der Finisher, an denen der Rueckstand abgelesen wird.
ANTEILE = [0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 1.00]
RAENGE = [10, 20, 30, 50, 75, 100, 150]
# Aus shared/stageResultRules.ts — nur zur Kontrolle, wie viele echte Fahrer
# unser Zeitlimit reissen wuerden.
ZEITLIMIT_PROZENT = {
    'Flat': 16, 'Rolling': 17, 'Hilly': 18, 'Hilly_Difficult': 19,
    'Medium_Mountain': 20, 'Mountain': 31, 'High_Mountain': 40,
}
# Diese Terrains werden gemessen, aber nicht nachgezogen — die eingestellten
# Werte bleiben stehen. Die Messung ist trotzdem nuetzlich: sie zeigt, ob das
# Modell dort in einer plausiblen Groessenordnung liegt.
NICHT_KALIBRIEREN = {'Flat', 'Rolling'}


def sekunden(text: str) -> int | None:
    """'5:28:17' oder '38:46' in Sekunden. Alles andere ergibt None."""
    if not isinstance(text, str) or not re.fullmatch(r'\d+(:\d\d){1,2}', text.strip()):
        return None
    teile = [int(t) for t in text.strip().split(':')]
    while len(teile) < 3:
        teile.insert(0, 0)
    return (teile[0] * 3600) + (teile[1] * 60) + teile[2]


def zeitgruppen(rueckstaende: list[int]) -> list[int]:
    """Groessen der Zeitgruppen, in Reihenfolge."""
    groessen = [1]
    for vorher, jetzt in zip(rueckstaende, rueckstaende[1:]):
        if jetzt - vorher <= ZEITGLEICH_SEKUNDEN:
            groessen[-1] += 1
        else:
            groessen.append(1)
    return groessen


def auswerten(daten: dict) -> dict | None:
    km = daten.get('distance')
    if not km:
        return None
    ergebnisse = [e for e in daten.get('results', []) if e.get('status') == 'DF']
    zeiten = []
    for eintrag in ergebnisse:
        wert = sekunden(eintrag.get('time', ''))
        if wert is not None:
            zeiten.append(wert)
    if len(zeiten) < 20:
        return None
    zeiten.sort()
    sieger = zeiten[0]
    rueckstaende = [z - sieger for z in zeiten]
    n = len(rueckstaende)
    gruppen = zeitgruppen(rueckstaende)

    zeile: dict[str, object] = {
        'rennen': daten.get('rennen'), 'jahr': daten.get('jahr'), 'etappe': daten.get('etappe'),
        'terrain': daten.get('terrain'), 'km': km, 'hm': daten.get('vertical_meters'),
        'ps': daten.get('profile_score'), 'finisher': n,
        'erste_gruppe': gruppen[0], 'erste_gruppe_anteil': gruppen[0] / n,
        'zeitgruppen': len(gruppen),
        # Mittlere Groesse der Gruppen *hinter* der Spitze — das ist, was
        # `tailGroupSize` im Modell beschreibt.
        'gruppengroesse_hinten': (n - gruppen[0]) / max(1, len(gruppen) - 1),
        'letzter_je_km': rueckstaende[-1] / km,
    }
    for anteil in ANTEILE:
        index = min(n - 1, max(0, round(anteil * n) - 1))
        zeile[f'p{int(anteil * 100)}_je_km'] = rueckstaende[index] / km
    for rang in RAENGE:
        zeile[f'rang{rang}_je_km'] = rueckstaende[rang - 1] / km if rang <= n else ''
    grenze = ZEITLIMIT_PROZENT.get(str(daten.get('terrain')), 20)
    zeile['ueber_zeitlimit'] = sum(1 for r in rueckstaende if r > sieger * grenze / 100)
    return zeile


def main() -> int:
    if not QUELLE.exists():
        print(f'{QUELLE} fehlt — erst hole_ergebnisse.py laufen lassen.', file=sys.stderr)
        return 1
    zeilen = []
    unbrauchbar = 0
    dateien = sorted([*QUELLE.glob('*.json'), *QUELLE.glob('*.json.gz')])
    for datei in dateien:
        roh = gzip.decompress(datei.read_bytes()) if datei.suffix == '.gz' else datei.read_bytes()
        zeile = auswerten(json.loads(roh))
        if zeile is None:
            unbrauchbar += 1
        else:
            zeilen.append(zeile)
    if not zeilen:
        print('Keine auswertbare Etappe gefunden.', file=sys.stderr)
        return 1

    import csv
    with ZIEL.open('w', newline='') as datei:
        schreiber = csv.DictWriter(datei, fieldnames=list(zeilen[0].keys()))
        schreiber.writeheader()
        schreiber.writerows(zeilen)
    print(f'{len(zeilen)} Etappen ausgewertet ({unbrauchbar} ohne brauchbare Zeiten) -> {ZIEL.name}', file=sys.stderr)

    print('\nGemessene Korridore je Terrain (Median, in Klammern p10 und p90)')
    print('  Terrain            n   erste Gruppe    Zeitgruppen   Gruppe hinten   Rueckstand des Letzten je km')
    nach_terrain: dict[str, list[dict]] = {}
    for zeile in zeilen:
        nach_terrain.setdefault(str(zeile['terrain']), []).append(zeile)
    ordnung = ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain']
    for terrain in [t for t in ordnung if t in nach_terrain] + [t for t in nach_terrain if t not in ordnung]:
        gruppe = nach_terrain[terrain]

        def band(feld: str, nachkomma: int = 2) -> str:
            werte = sorted(float(z[feld]) for z in gruppe)  # type: ignore[arg-type]
            hole = lambda p: werte[min(len(werte) - 1, int(len(werte) * p))]  # noqa: E731
            return f'{statistics.median(werte):.{nachkomma}f} ({hole(0.1):.{nachkomma}f}–{hole(0.9):.{nachkomma}f})'

        vermerk = '   nur Kontrolle' if terrain in NICHT_KALIBRIEREN else ''
        print(f'  {terrain:17}{len(gruppe):4}  {band("erste_gruppe", 0):>14}'
              f'  {band("zeitgruppen", 0):>13}  {band("gruppengroesse_hinten", 1):>14}'
              f'  {band("letzter_je_km"):>18}{vermerk}')
    if NICHT_KALIBRIEREN & set(nach_terrain):
        print(f'\n  Nicht nachgezogen: {", ".join(sorted(NICHT_KALIBRIEREN))} — dort bleiben die'
              ' eingestellten Werte stehen.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
