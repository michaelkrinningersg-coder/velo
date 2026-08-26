import { describe, expect, it } from 'vitest';
import {
  STAGE_RACER_WEIGHTS,
  TEAM_STAGING_FLOOR_ROLES,
  TEAM_STAGING_LEADER_FLOOR,
  TEAM_STAGING_ROLE_FLOOR,
  TEAM_STAGING_STEPS,
  buildTeamStagingDeltas,
  resolveStageRacerValue,
  resolveTeamStagingDelta,
} from '../../../shared/quickSim/teamStaging';
import {
  HOME_SCORE_DELTA,
  WEATHER_SCORE_DELTA_RANGE,
  applyPreRaceRiderModifiers,
  getWeatherRelation,
} from '../../../frontend/src/race-sim/preRaceModifiers';
import { calculateStageFavoriteRiderRanking } from '../../../frontend/src/race-sim/stageFavorites';
import { createSeededRandom } from '../../../shared/rng';
import { buildTeamTimeTrialGaps } from '../../../shared/quickSim/timeTrial';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../../shared/quickSimProfiles';
import type { Race, Rider, StageProfile, Team } from '../../../shared/types';

describe('Abstufung innerhalb der Mannschaft', () => {
  it('haelt die vorgegebene Staffel ein', () => {
    expect(TEAM_STAGING_STEPS).toEqual([1, 0, -0.5, -1, -1.5, -2, -2.5, -3]);
    [1, 0, -0.5, -1, -1.5, -2, -2.5, -3].forEach((soll, position) => {
      expect(resolveTeamStagingDelta(position)).toBe(soll);
    });
  });

  it('bleibt hinter dem achten Fahrer konstant', () => {
    for (let position = 8; position < 20; position += 1) {
      expect(resolveTeamStagingDelta(position)).toBe(-3);
    }
    // Bis dahin faellt sie in jedem Schritt.
    for (let position = 1; position < 8; position += 1) {
      expect(resolveTeamStagingDelta(position)).toBeLessThan(resolveTeamStagingDelta(position - 1));
    }
  });

  it('laesst Kapitaene, Co-Kapitaene und Sprinter nie unter minus eins fallen', () => {
    expect(TEAM_STAGING_ROLE_FLOOR).toBe(-1);
    expect([...TEAM_STAGING_FLOOR_ROLES].sort()).toEqual(['co-kapitaen', 'kapitaen', 'sprinter']);
    for (const rolle of ['Kapitaen', 'Co-Kapitaen', 'Sprinter', 'Kapitän', 'Co-Kapitän']) {
      for (let position = 0; position < 15; position += 1) {
        const wert = resolveTeamStagingDelta(position, rolle);
        expect(wert).toBeGreaterThanOrEqual(-1);
        // Oberhalb der Grenze bleibt die Staffel unveraendert.
        expect(wert).toBe(Math.max(-1, TEAM_STAGING_STEPS[position] ?? -3));
      }
    }
  });

  it('laesst Helferrollen die volle Staffel tragen', () => {
    for (const rolle of ['Edelhelfer', 'Starke Helfer', 'Wassertraeger', 'Wasserträger', '', undefined]) {
      expect(resolveTeamStagingDelta(7, rolle)).toBe(-3);
      expect(resolveTeamStagingDelta(4, rolle)).toBe(-1.5);
    }
  });

  it('greift die Untergrenze auch im ganzen Team', () => {
    // Eine Mannschaft aus acht Kapitaenen: keiner faellt unter -1.
    const deltas = buildTeamStagingDeltas(Array.from({ length: 8 }, (_, i) => ({
      riderId: i + 1, teamId: 1, score: 90 - i, roleName: 'Kapitaen',
    })));
    expect([...deltas.values()]).toEqual([1, 0, -0.5, -1, -1, -1, -1, -1]);
    // Dieselbe Mannschaft aus Wassertraegern traegt die volle Staffel.
    const helfer = buildTeamStagingDeltas(Array.from({ length: 8 }, (_, i) => ({
      riderId: i + 1, teamId: 1, score: 90 - i, roleName: 'Wassertraeger',
    })));
    expect([...helfer.values()]).toEqual([1, 0, -0.5, -1, -1.5, -2, -2.5, -3]);
  });

  it('vergibt die Staffel nach dem Score, nicht nach der Eingabereihenfolge', () => {
    const fahrer = [
      { riderId: 3, teamId: 1, score: 70 },
      { riderId: 1, teamId: 1, score: 90 },
      { riderId: 2, teamId: 1, score: 80 },
      { riderId: 4, teamId: 1, score: 60 },
    ];
    const deltas = buildTeamStagingDeltas(fahrer);
    expect(deltas.get(1)).toBe(1);
    expect(deltas.get(2)).toBe(0);
    expect(deltas.get(3)).toBe(-0.5);
    expect(deltas.get(4)).toBe(-1);
    // Umgekehrte Eingabe, gleiches Ergebnis.
    expect(buildTeamStagingDeltas([...fahrer].reverse())).toEqual(deltas);
  });

  it('rechnet jede Mannschaft fuer sich', () => {
    const deltas = buildTeamStagingDeltas([
      { riderId: 1, teamId: 1, score: 90 }, { riderId: 2, teamId: 1, score: 50 },
      { riderId: 3, teamId: 2, score: 70 }, { riderId: 4, teamId: 2, score: 60 },
    ]);
    // Der 50er ist im Feld der Schlechteste, in seiner Mannschaft aber Zweiter.
    expect(deltas.get(2)).toBe(0);
    expect(deltas.get(3)).toBe(1);
  });

  it('gibt Fahrern ohne Mannschaft den Zuschlag des Besten', () => {
    const deltas = buildTeamStagingDeltas([
      { riderId: 1, teamId: null, score: 90 },
      { riderId: 2, teamId: undefined, score: 80 },
    ]);
    expect(deltas.get(1)).toBe(1);
    expect(deltas.get(2)).toBe(1);
  });

  it('entscheidet Gleichstand nach der Fahrer-Id', () => {
    const deltas = buildTeamStagingDeltas([
      { riderId: 7, teamId: 1, score: 80 }, { riderId: 2, teamId: 1, score: 80 },
    ]);
    expect(deltas.get(2)).toBe(1);
    expect(deltas.get(7)).toBe(0);
  });

  it('drueckt den zweiten Mann einer Mannschaft hinter einen gleich starken Einzelnen', () => {
    // Zwei gleich starke Fahrer: der eine ist der Kopf seiner Mannschaft, der
    // andere steht im Schatten eines staerkeren Kollegen.
    const deltas = buildTeamStagingDeltas([
      { riderId: 1, teamId: 1, score: 95 },
      { riderId: 2, teamId: 1, score: 80 },
      { riderId: 3, teamId: 2, score: 80 },
    ]);
    expect((80 + deltas.get(3)!) - (80 + deltas.get(2)!)).toBe(1);
  });
});

const skills = {
  flat: 75, hill: 75, mediumMountain: 75, mountain: 75, timeTrial: 75, prologue: 75, cobble: 75,
  sprint: 75, acceleration: 75, downhill: 75, attack: 75, stamina: 75, resistance: 75,
  recuperation: 75, bikeHandling: 75,
};
const baueFahrer = (id: number, nation: string, weatherProfileId = 1): Rider => ({
  id, firstName: 'F', lastName: `${id}`, activeTeamId: 1, nationality: nation,
  role: { id: 1, name: 'Kapitaen' }, skills: { ...skills }, weatherProfileId,
} as unknown as Rider);

const race = (code: string) => ({ id: 1, name: 'R', isStageRace: true, country: { code3: code } } as unknown as Race);
const stage = (profile: StageProfile, weatherId: number) => ({ id: 1, stageNumber: 1, profile, profileScore: 120, rolledWeatherId: weatherId } as never);

describe('Heimvorteil und Wetter als Score-Zuschlag', () => {
  it('laesst die Faehigkeiten unangetastet', () => {
    const fahrer = [baueFahrer(1, 'FRA'), baueFahrer(2, 'ITA')];
    const raus = applyPreRaceRiderModifiers({
      riders: fahrer, race: race('FRA'), stage: stage('Hilly', 1),
      random: createSeededRandom(3), effectsAsScoreDelta: true,
    });
    for (const rider of raus.riders) {
      expect(rider.skills).toEqual(skills);
    }
    // Der Franzose faehrt zu Hause und bekommt einen Zuschlag.
    expect(raus.scoreDeltaByRiderId.has(1)).toBe(true);
  });

  it('vergibt genau die vorgegebenen Heimwerte', () => {
    const erlaubt = new Set<number>([HOME_SCORE_DELTA.pressure, HOME_SCORE_DELTA.normal, HOME_SCORE_DELTA.super]);
    const gezaehlt = new Map<number, number>();
    for (let seed = 0; seed < 3000; seed += 1) {
      const raus = applyPreRaceRiderModifiers({
        // Wetterprofil 1 auf Wetter 6 ist neutral, damit nur der Heimwert steht.
        riders: [baueFahrer(1, 'FRA', 1)], race: race('FRA'), stage: stage('Hilly', 6),
        random: createSeededRandom(seed), effectsAsScoreDelta: true,
      });
      expect(getWeatherRelation(1, 6)).toBe('neutral');
      const delta = raus.scoreDeltaByRiderId.get(1) as number;
      expect(erlaubt.has(delta)).toBe(true);
      gezaehlt.set(delta, (gezaehlt.get(delta) ?? 0) + 1);
    }
    // 5 % Heimdruck, 5 % Super, 90 % normal.
    expect((gezaehlt.get(HOME_SCORE_DELTA.pressure) ?? 0) / 3000).toBeCloseTo(0.05, 1);
    expect((gezaehlt.get(HOME_SCORE_DELTA.super) ?? 0) / 3000).toBeCloseTo(0.05, 1);
    expect((gezaehlt.get(HOME_SCORE_DELTA.normal) ?? 0) / 3000).toBeGreaterThan(0.85);
  });

  it('gibt Fahrern aus anderen Laendern nichts', () => {
    for (let seed = 0; seed < 200; seed += 1) {
      const raus = applyPreRaceRiderModifiers({
        riders: [baueFahrer(2, 'ITA', 1)], race: race('FRA'), stage: stage('Hilly', 6),
        random: createSeededRandom(seed), effectsAsScoreDelta: true,
      });
      expect(raus.scoreDeltaByRiderId.get(2) ?? 0).toBe(0);
    }
  });

  it('haelt den Wetterzuschlag in seiner Spanne, in beide Richtungen', () => {
    const { min, max } = WEATHER_SCORE_DELTA_RANGE;
    expect(min).toBeCloseTo(0.2, 10);
    expect(max).toBeCloseTo(1.5, 10);
    for (const [profileId, weatherId, richtung] of [[1, 1, 'pref'], [1, 4, 'malus']] as Array<[number, number, string]>) {
      expect(getWeatherRelation(profileId, weatherId)).toBe(richtung);
      for (let seed = 0; seed < 300; seed += 1) {
        const raus = applyPreRaceRiderModifiers({
          // Italiener in Frankreich: kein Heimwert, nur Wetter.
          riders: [baueFahrer(2, 'ITA', profileId)], race: race('FRA'), stage: stage('Hilly', weatherId),
          random: createSeededRandom(seed), effectsAsScoreDelta: true,
        });
        const delta = raus.scoreDeltaByRiderId.get(2) as number;
        if (richtung === 'pref') {
          expect(delta).toBeGreaterThanOrEqual(min);
          expect(delta).toBeLessThanOrEqual(max);
        } else {
          expect(delta).toBeLessThanOrEqual(-min);
          expect(delta).toBeGreaterThanOrEqual(-max);
        }
      }
    }
  });

  it('bleibt ohne die Option beim Faehigkeitsweg', () => {
    const raus = applyPreRaceRiderModifiers({
      riders: [baueFahrer(1, 'FRA', 1)], race: race('FRA'), stage: stage('Hilly', 1),
      random: createSeededRandom(3),
    });
    expect(raus.scoreDeltaByRiderId.size).toBe(0);
    expect(raus.riders[0]!.skills).not.toEqual(skills);
  });

  it('wirkt im Ranking eins zu eins, auf jedem Terrain gleich', () => {
    const teams = [{ id: 1, name: 'Team' }] as unknown as Team[];
    for (const profile of ['Flat', 'Hilly', 'Hilly_Difficult', 'Mountain', 'High_Mountain'] as StageProfile[]) {
      const rang = calculateStageFavoriteRiderRanking(
        [baueFahrer(1, 'FRA'), baueFahrer(2, 'ITA')], teams,
        { id: 1, stageNumber: 1, profile, profileScore: 120 } as never,
        { distanceKm: 180, isStageRace: true, scoreDeltaByRiderId: new Map([[1, 2.5]]) },
      );
      const wert = (id: number) => rang.find((r) => r.rider.id === id)!.effectiveSkill;
      // Kein Terrainfaktor darauf — 2,5 bleiben 2,5.
      expect(wert(1) - wert(2)).toBeCloseTo(2.5, 6);
    }
  });
});

describe('Mannschaftszeitfahren nach der Neukalibrierung', () => {
  it('haelt die neuen Parameter', () => {
    expect(DEFAULT_QUICK_SIM_PROFILES.TTT.timeTrialSlope).toBeCloseTo(0.0082, 10);
    expect(DEFAULT_QUICK_SIM_PROFILES.TTT.timeTrialNoise).toBeCloseTo(0.0046, 10);
  });

  it('bringt das Feld auf rund ein Drittel der bisherigen Abstaende', () => {
    // Fuenfundzwanzig Mannschaften, Teamwertung gleichmaessig ueber zehn
    // Punkte verteilt — so sah es in den beiden gemessenen Etappen aus.
    const fahrer = Array.from({ length: 25 }, (_, team) =>
      Array.from({ length: 8 }, (_, j) => ({ riderId: (team * 10) + j, score: 100 - (team * (10.3 / 24)), teamId: team })))
      .flat();
    const siegerzeit = 24 * 60;
    const spanne = (slope: number, noise: number): { mitte: number; letzter: number } => {
      const par = { ...DEFAULT_QUICK_SIM_PROFILES.TTT, timeTrialSlope: slope, timeTrialNoise: noise };
      const m: number[] = [], l: number[] = [];
      for (let seed = 0; seed < 600; seed += 1) {
        const gaps = buildTeamTimeTrialGaps(createSeededRandom(seed), fahrer, par, siegerzeit);
        const pro = new Map<number, number>();
        for (const f of fahrer) pro.set(f.teamId, gaps.get(f.riderId)!);
        const w = [...pro.values()].sort((a, b) => a - b);
        m.push(w[12]! / siegerzeit); l.push(w[24]! / siegerzeit);
      }
      const med = (a: number[]) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)]!;
      return { mitte: med(m), letzter: med(l) };
    };
    const alt = spanne(0.013, 0.035);
    const neu = spanne(DEFAULT_QUICK_SIM_PROFILES.TTT.timeTrialSlope, DEFAULT_QUICK_SIM_PROFILES.TTT.timeTrialNoise);
    expect(neu.mitte).toBeLessThan(alt.mitte * 0.5);
    expect(neu.letzter).toBeLessThan(alt.letzter * 0.5);
    // Gemessen an der vollen Simulation: Mitte 3,3 %, Letzter 6,5 % —
    // das Modell soll rund 1,3-mal so weit auseinanderliegen.
    expect(neu.mitte).toBeGreaterThan(0.030);
    expect(neu.mitte).toBeLessThan(0.055);
    expect(neu.letzter).toBeGreaterThan(0.065);
    expect(neu.letzter).toBeLessThan(0.100);
  });
});

describe('Bester Etappenfahrer einer Mannschaft', () => {
  const wert = (mountain: number, mediumMountain: number, timeTrial: number) =>
    resolveStageRacerValue({ mountain, mediumMountain, timeTrial });

  it('gewichtet Berg, Mittelgebirge und Zeitfahren wie vorgegeben', () => {
    expect(STAGE_RACER_WEIGHTS).toEqual({ mountain: 0.6, mediumMountain: 0.25, timeTrial: 0.15 });
    expect(Object.values(STAGE_RACER_WEIGHTS).reduce((s, x) => s + x, 0)).toBeCloseTo(1, 10);
    expect(wert(80, 80, 80)).toBeCloseTo(80, 10);
    expect(wert(80, 70, 60)).toBeCloseTo((80 * 0.6) + (70 * 0.25) + (60 * 0.15), 10);
    // Sprint, Flach und Huegel spielen keine Rolle — sie stehen gar nicht drin.
    expect(wert(70, 70, 70)).toBeCloseTo(70, 10);
  });

  it('haelt ihn in der Rundfahrt bei null oder darueber', () => {
    expect(TEAM_STAGING_LEADER_FLOOR).toBe(0);
    // Acht Wassertraeger; der schwaechste im Tagesscore ist der beste
    // Etappenfahrer — er faellt trotzdem nicht ins Minus.
    const mannschaft = Array.from({ length: 8 }, (_, i) => ({
      riderId: i + 1, teamId: 1, score: 90 - i, roleName: 'Wassertraeger',
      stageRacerValue: wert(60 + i, 60, 60),
    }));
    const deltas = buildTeamStagingDeltas(mannschaft, true);
    expect(deltas.get(8)).toBe(0);
    // Alle anderen tragen die volle Staffel.
    expect([1, 2, 3, 4, 5, 6, 7].map((id) => deltas.get(id))).toEqual([1, 0, -0.5, -1, -1.5, -2, -2.5]);
  });

  it('greift im Eintagesrennen nicht', () => {
    const mannschaft = Array.from({ length: 8 }, (_, i) => ({
      riderId: i + 1, teamId: 1, score: 90 - i, roleName: 'Wassertraeger',
      stageRacerValue: wert(60 + i, 60, 60),
    }));
    expect(buildTeamStagingDeltas(mannschaft, false).get(8)).toBe(-3);
    // Ohne Angabe gilt dieselbe Vorgabe wie fuer ein Eintagesrennen.
    expect(buildTeamStagingDeltas(mannschaft).get(8)).toBe(-3);
  });

  it('nimmt den Besseren, nicht den mit dem hoeheren Bergwert allein', () => {
    // Kletterer ohne Zeitfahren gegen den ausgeglichenen Fahrer.
    const kletterer = wert(82, 70, 55);
    const allrounder = wert(78, 78, 78);
    expect(allrounder).toBeGreaterThan(kletterer);
    const deltas = buildTeamStagingDeltas([
      { riderId: 1, teamId: 1, score: 95, roleName: 'Wassertraeger', stageRacerValue: kletterer },
      { riderId: 2, teamId: 1, score: 60, roleName: 'Wassertraeger', stageRacerValue: allrounder },
    ], true);
    expect(deltas.get(1)).toBe(1);
    expect(deltas.get(2)).toBe(0);
  });

  it('entscheidet Gleichstand nach der Fahrer-Id, unabhaengig von der Eingabereihenfolge', () => {
    const mannschaft = [
      { riderId: 9, teamId: 1, score: 90, roleName: 'Wassertraeger', stageRacerValue: 75 },
      { riderId: 4, teamId: 1, score: 80, roleName: 'Wassertraeger', stageRacerValue: 75 },
      { riderId: 7, teamId: 1, score: 70, roleName: 'Wassertraeger', stageRacerValue: 75 },
    ];
    const a = buildTeamStagingDeltas(mannschaft, true);
    const b = buildTeamStagingDeltas([...mannschaft].reverse(), true);
    expect(a).toEqual(b);
    // Fahrer 4 ist der Etappenfahrer; als Dritter im Tagesscore bekaeme er
    // -0,5, durch die Untergrenze steht er bei 0.
    expect(a.get(4)).toBe(0);
    expect(a.get(7)).toBe(-0.5);
  });

  it('gilt je Mannschaft, nicht fuers ganze Feld', () => {
    const deltas = buildTeamStagingDeltas([
      { riderId: 1, teamId: 1, score: 95, roleName: 'Wassertraeger', stageRacerValue: 90 },
      { riderId: 2, teamId: 1, score: 60, roleName: 'Wassertraeger', stageRacerValue: 95 },
      { riderId: 3, teamId: 2, score: 90, roleName: 'Wassertraeger', stageRacerValue: 50 },
      { riderId: 4, teamId: 2, score: 55, roleName: 'Wassertraeger', stageRacerValue: 60 },
    ], true);
    // In jeder Mannschaft steht ihr eigener Bester bei null, auch der
    // schwaechere aus Mannschaft 2.
    expect(deltas.get(2)).toBe(0);
    expect(deltas.get(4)).toBe(0);
  });

  it('vertraegt sich mit der Rollenuntergrenze — es gilt die guenstigere', () => {
    const deltas = buildTeamStagingDeltas([
      ...Array.from({ length: 7 }, (_, i) => ({
        riderId: i + 1, teamId: 1, score: 90 - i, roleName: 'Wassertraeger', stageRacerValue: 60,
      })),
      { riderId: 8, teamId: 1, score: 50, roleName: 'Kapitaen', stageRacerValue: 90 },
    ], true);
    // Als Achter waere es -3, als Kapitaen -1, als Etappenfahrer 0.
    expect(deltas.get(8)).toBe(TEAM_STAGING_LEADER_FLOOR);
  });

  it('bleibt ohne Etappenfahrerwerte unveraendert', () => {
    const ohne = Array.from({ length: 8 }, (_, i) => ({
      riderId: i + 1, teamId: 1, score: 90 - i, roleName: 'Wassertraeger',
    }));
    expect([...buildTeamStagingDeltas(ohne, true).values()]).toEqual([1, 0, -0.5, -1, -1.5, -2, -2.5, -3]);
  });
});
