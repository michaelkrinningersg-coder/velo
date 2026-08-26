"""Ergebnislisten der echten Etappen holen.

Muss dort laufen, wo procyclingstats.com erreichbar ist — der Egress-Proxy
der Remote-Umgebung blockt die Domain, deshalb ist das ein lokales Skript.

    pip install procyclingstats
    python3 tools/real-data/hole_ergebnisse.py                 # nur Bergetappen (199)
    python3 tools/real-data/hole_ergebnisse.py --alle          # alle 843 Strassenetappen
    python3 tools/real-data/hole_ergebnisse.py --pause 3       # laengere Pause zwischen Abrufen

Schreibt je Etappe eine JSON-Datei nach tools/real-data/ergebnisse/. Bereits
geholte Etappen werden uebersprungen, der Lauf ist also jederzeit
abbrechbar und fortsetzbar.

Gebraucht wird aus jeder Seite nur `results` (Rang, Zeit, Status je Fahrer)
und die Etappenkopfdaten. Daraus lassen sich Zeitgruppen, Gruppengroessen,
Gruppenanzahl und Rueckstaende je Rang ausrechnen — genau die Zielgroessen
des Gruppenmodells.

Bitte hoeflich bleiben: die Voreinstellung von zwei Sekunden Pause ergibt
fuer die 199 Bergetappen rund sieben Minuten Laufzeit. Nicht parallelisieren.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import csv

HIER = Path(__file__).resolve().parent
ZIEL = HIER / 'ergebnisse'
ETAPPEN = HIER / 'gt_stages_2010_2024.csv'
# PCS-Kuerzel je Rennen.
SLUG = {'TdF': 'tour-de-france', 'Giro': 'giro-d-italia', 'Vuelta': 'vuelta-a-espana'}
BERGE = {'Mountain', 'High_Mountain'}
# Nur diese Felder werden behalten — der Rest der Seite wird nicht gebraucht.
KOPFFELDER = ['distance', 'vertical_meters', 'profile_score', 'profile_icon', 'stage_type',
              'won_how', 'avg_speed_winner', 'date', 'departure', 'arrival',
              'race_startlist_quality_score']


def zeilen(nur_berge: bool) -> list[dict]:
    with ETAPPEN.open() as datei:
        alle = list(csv.DictReader(datei))
    return [z for z in alle if not nur_berge or z['terrain'] in BERGE]


def pruefe_paket() -> None:
    """Einmal vorab pruefen statt 843-mal an derselben Stelle zu scheitern."""
    try:
        import procyclingstats  # noqa: F401
    except ImportError:
        print('Das Paket `procyclingstats` fehlt. Installieren mit:\n'
              '    pip install procyclingstats\n'
              'Falls pip in eine andere Umgebung installiert als die, die dieses Skript\n'
              'ausfuehrt, hilft:\n'
              f'    {sys.executable} -m pip install procyclingstats', file=sys.stderr)
        raise SystemExit(2)


def hole(slug: str, jahr: str, nummer: str) -> dict:
    from procyclingstats import Stage

    seite = Stage(f'race/{slug}/{jahr}/stage-{nummer}')
    daten = {feld: getattr(seite, feld)() for feld in KOPFFELDER}
    daten['results'] = seite.results()
    return daten


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--alle', action='store_true', help='alle Strassenetappen statt nur der Bergetappen')
    parser.add_argument('--pause', type=float, default=2.0, help='Sekunden zwischen zwei Abrufen (Vorgabe 2)')
    args = parser.parse_args()

    pruefe_paket()
    ZIEL.mkdir(exist_ok=True)
    aufgaben = zeilen(nur_berge=not args.alle)
    print(f'{len(aufgaben)} Etappen, Pause {args.pause} s -> geschaetzt {len(aufgaben) * args.pause / 60:.0f} Minuten')

    geholt = uebersprungen = fehler = 0
    # Wenn zehnmal hintereinander nichts kommt, liegt es nicht an der einzelnen
    # Etappe — dann lieber abbrechen als eine halbe Stunde ins Leere laufen.
    ohne_erfolg = 0
    for nr, zeile in enumerate(aufgaben, start=1):
        name = f"{zeile['rennen']}_{zeile['jahr']}_{zeile['stage_id']}.json"
        datei = ZIEL / name
        if datei.exists():
            uebersprungen += 1
            continue
        try:
            daten = hole(SLUG[zeile['rennen']], zeile['jahr'], zeile['stage_id'])
        except Exception as fehlschlag:  # noqa: BLE001 — jede Ursache soll den Lauf ueberleben
            print(f'  [{nr}/{len(aufgaben)}] {name}: {type(fehlschlag).__name__}: {fehlschlag}', file=sys.stderr)
            fehler += 1
            ohne_erfolg += 1
            if ohne_erfolg >= 10:
                print(f'Zehn Fehlschlaege hintereinander — abgebrochen nach {geholt} geholten Etappen.',
                      file=sys.stderr)
                break
            time.sleep(args.pause)
            continue
        ohne_erfolg = 0
        daten['terrain'] = zeile['terrain']
        daten['rennen'] = zeile['rennen']
        daten['jahr'] = int(zeile['jahr'])
        daten['etappe'] = zeile['stage_id']
        datei.write_text(json.dumps(daten, ensure_ascii=False))
        geholt += 1
        if geholt % 20 == 0:
            print(f'  [{nr}/{len(aufgaben)}] {geholt} geholt')
        time.sleep(args.pause)

    print(f'Fertig: {geholt} geholt, {uebersprungen} schon vorhanden, {fehler} fehlgeschlagen.')
    print(f'Ordner: {ZIEL}')
    return 1 if fehler and not geholt else 0


if __name__ == '__main__':
    raise SystemExit(main())
