"""Echte Grand-Tour-Etappen einsammeln und in unsere Terrains einsortieren.

Quellen (beide ueber GitHub erreichbar, PCS und FirstCycling sind es nicht):

  jenslemb/cyclingdata      Etappen-Metadaten aus procyclingstats, 1903-2024.
                            Fuer Grand Tours ab 2010: Distanz, Hoehenmeter,
                            profile_score, parcours_type, won_how - alle 942
                            Etappen vollstaendig.
  thomascamminady/LeTourDataSet   Gesamtwertung der Tour de France je Jahr,
                            bis 2026, mit Rueckstand in Sekunden.

Die Einsortierung nach Terrain kommt nicht aus einer festen Hoehenmeterregel,
sondern aus unseren eigenen Etappen: die 324 Strassenetappen in data/stages
tragen bereits ein Profil, und aus ihnen lernt ein Random Forest, welche
Kombination aus Schwierigkeit je Kilometer, Hoehenmetern je Kilometer, Distanz
und Hoehenmetern zu welchem Terrain gehoert. Kreuzvalidiert trifft er 86 %
genau, 9 % landen eine Stufe daneben.

Eine reine Hoehenmeterregel reicht nicht: auf unsere eigenen Etappen
angewandt wuerde "> 4000 hm = High_Mountain" 13 von 16 Mountain-Etappen ins
Hochgebirge schieben und 20 von 55 Hilly_Difficult zu Mountain machen.

Pflaster laesst sich aus Hoehenprofil und Score nicht ableiten und ist
deshalb weder Trainings- noch Zielklasse - Pflasteretappen bekommen das
Terrain ihrer Hoehenform.

Aufruf:  python3 tools/real-data/klassifiziere_etappen.py
Braucht: pandas, scikit-learn, pyreadr  (pip install)
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import pandas as pd
import pyreadr
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score

WURZEL = Path(__file__).resolve().parents[2]
HIER = Path(__file__).resolve().parent
QUELLE_ETAPPEN = 'https://raw.githubusercontent.com/jenslemb/cyclingdata/master/data/cyclingdata.rda'
MERKMALE = ['D', 'hm_km', 'km', 'hm']
GRAND_TOURS = {'Tour de France': 'TdF', "Giro d'Italia": 'Giro', 'La Vuelta ciclista a España': 'Vuelta'}
# Ab 2010 sind Distanz, Hoehenmeter und profile_score zu 100 % besetzt; davor
# wird es lueckig. `cyclingdata` endet 2024.
AB_JAHR = 2010
# Pflaster braucht ein Merkmal, das in den Daten nicht steht.
NICHT_LERNBAR = {'ITT', 'TTT', 'Cobble', 'Cobble_Hill'}


def eigene_etappen() -> pd.DataFrame:
    """Distanz, Hoehenmeter und stage_score unserer eigenen Etappen.

    Rechnet ueber den TypeScript-Pfad, damit derselbe stage_score herauskommt
    wie im Spiel - nicht ueber eine nachgebaute Formel.
    """
    ziel = HIER / 'eigene_etappen.json'
    if not ziel.exists():
        raise SystemExit(f'{ziel} fehlt - erst tools/real-data/sammle_eigene_etappen.ts laufen lassen.')
    df = pd.DataFrame(json.loads(ziel.read_text()))
    df['D'] = df['score'] / df['km']
    df['hm_km'] = df['hm'] / df['km']
    return df


def echte_etappen() -> pd.DataFrame:
    roh = HIER / 'cyclingdata.rda'
    if not roh.exists():
        subprocess.run(['curl', '-sSfL', '-o', str(roh), QUELLE_ETAPPEN], check=True)
    df = pyreadr.read_r(str(roh))['cyclingdata']
    df = df[df['race'].isin(GRAND_TOURS) & (df['year'].astype(float) >= AB_JAHR)].copy()
    for quelle, ziel in [('distance', 'km'), ('vertical_meters', 'hm'), ('profile_score', 'ps')]:
        df[ziel] = pd.to_numeric(df[quelle], errors='coerce')
    df['rennen'] = df['race'].map(GRAND_TOURS)
    df['jahr'] = df['year'].astype(int)
    strasse = df[(df['stage_type'] == 'Road race') & df[['km', 'hm', 'ps']].notna().all(axis=1)].copy()
    strasse['D'] = strasse['ps'] / strasse['km']
    strasse['hm_km'] = strasse['hm'] / strasse['km']
    return strasse


def main() -> None:
    eigene = eigene_etappen()
    lern = eigene[~eigene['profile'].isin(NICHT_LERNBAR)]
    wald = RandomForestClassifier(n_estimators=400, min_samples_leaf=2, random_state=0, class_weight='balanced')
    guete = cross_val_score(wald, lern[MERKMALE].values, lern['profile'].values,
                            cv=StratifiedKFold(5, shuffle=True, random_state=0))
    print(f'Gelernt auf {len(lern)} eigenen Etappen, kreuzvalidiert {guete.mean() * 100:.1f} %', file=sys.stderr)
    wald.fit(lern[MERKMALE].values, lern['profile'].values)

    echte = echte_etappen()
    wahrscheinlichkeit = wald.predict_proba(echte[MERKMALE].values)
    echte['terrain'] = wald.classes_[wahrscheinlichkeit.argmax(axis=1)]
    echte['sicherheit'] = wahrscheinlichkeit.max(axis=1)

    spalten = ['rennen', 'jahr', 'stage_id', 'stage_num', 'km', 'hm', 'ps', 'D', 'parcours_type',
               'terrain', 'sicherheit', 'avg_speed_winner', 'won_how', 'win_type', 'startlist_quality']
    ziel = HIER / 'gt_stages_2010_2024.csv'
    echte[spalten].to_csv(ziel, index=False)
    print(f'{len(echte)} Etappen geschrieben nach {ziel.relative_to(WURZEL)}', file=sys.stderr)
    print(echte['terrain'].value_counts().to_string(), file=sys.stderr)


if __name__ == '__main__':
    main()
