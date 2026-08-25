import { describe, expect, it } from 'vitest';
import {
  buildIndividualTimeTrialGaps,
  buildTeamTimeTrialGaps,
  resolveTeamTimeTrialScore,
  type TimeTrialRider,
} from '../../../shared/quickSim/timeTrial';
import { simulateQuickStage } from '../../../shared/quickSim/simulateStage';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../../shared/quickSimProfiles';
import { createSeededRandom } from '../../../shared/rng';

const ITT = DEFAULT_QUICK_SIM_PROFILES.ITT;
const TTT = DEFAULT_QUICK_SIM_PROFILES.TTT;

/** Feld aus `teamCount` Mannschaften zu je `teamSize` Fahrern, Score fallend. */
function teams(teamCount: number, teamSize: number): TimeTrialRider[] {
  const riders: TimeTrialRider[] = [];
  for (let team = 0; team < teamCount; team += 1) {
    for (let member = 0; member < teamSize; member += 1) {
      riders.push({
        riderId: (team * 100) + member,
        score: 90 - (team * 2) - (member * 0.5),
        teamId: team + 1,
      });
    }
  }
  return riders;
}

describe('resolveTeamTimeTrialScore', () => {
  it('mittelt die besten fuenf', () => {
    // Die drei schwaechsten zaehlen nicht mit.
    const scores = [90, 88, 86, 84, 82, 40, 30, 20];
    expect(resolveTeamTimeTrialScore(scores)).toBeCloseTo((90 + 88 + 86 + 84 + 82) / 5, 10);
  });

  it('bestraft fehlende Fahrer mit einem Punkt je Platz', () => {
    const full = resolveTeamTimeTrialScore([90, 90, 90, 90, 90, 90, 90, 90]);
    const short = resolveTeamTimeTrialScore([90, 90, 90, 90, 90]);
    expect(full).toBe(90);
    // Drei fehlende Fahrer, dieselben besten fuenf.
    expect(short).toBe(87);
  });

  it('faellt nicht unter eins und vertraegt eine leere Mannschaft', () => {
    expect(resolveTeamTimeTrialScore([2])).toBe(1);
    expect(resolveTeamTimeTrialScore([])).toBe(1);
  });
});

describe('buildIndividualTimeTrialGaps', () => {
  const riders: TimeTrialRider[] = Array.from({ length: 120 }, (_, index) => ({
    riderId: index + 1,
    score: 90 - (index * 0.2),
  }));

  it('setzt den Schnellsten auf null und alle anderen dahinter', () => {
    const gaps = buildIndividualTimeTrialGaps(createSeededRandom(1), riders, ITT, 1800);
    const values = [...gaps.values()];
    expect(Math.min(...values)).toBe(0);
    expect(values.filter((gap) => gap === 0)).toHaveLength(1);
    expect(Math.max(...values)).toBeGreaterThan(0);
  });

  it('laesst den staerkeren Fahrer im Mittel vorne liegen', () => {
    // Nicht in jedem Lauf — die Tagesform darf das drehen. Im Mittel nicht.
    let strongAhead = 0;
    for (let run = 0; run < 200; run += 1) {
      const gaps = buildIndividualTimeTrialGaps(createSeededRandom(run), riders, ITT, 1800);
      if ((gaps.get(1) as number) < (gaps.get(120) as number)) {
        strongAhead += 1;
      }
    }
    expect(strongAhead).toBeGreaterThan(190);
  });

  it('spreizt das Feld staerker, wenn die Steigung groesser ist', () => {
    const spread = (timeTrialSlope: number) => {
      const gaps = buildIndividualTimeTrialGaps(
        createSeededRandom(9), riders, { ...ITT, timeTrialSlope, timeTrialNoise: 0 }, 1800,
      );
      return Math.max(...gaps.values());
    };
    expect(spread(0.012)).toBeGreaterThan(spread(0.006) * 1.8);
  });

  it('ist bei gleichem Seed reproduzierbar', () => {
    const build = () => [...buildIndividualTimeTrialGaps(createSeededRandom(4711), riders, ITT, 1800).entries()];
    expect(build()).toEqual(build());
  });
});

describe('buildTeamTimeTrialGaps', () => {
  it('gibt jeder Mannschaft genau eine Zeit', () => {
    const gaps = buildTeamTimeTrialGaps(createSeededRandom(2), teams(22, 8), TTT, 2400);
    const perTeam = new Map<number, Set<number>>();
    for (const rider of teams(22, 8)) {
      const bucket = perTeam.get(rider.teamId as number) ?? new Set<number>();
      bucket.add(gaps.get(rider.riderId) as number);
      perTeam.set(rider.teamId as number, bucket);
    }
    // Spanne innerhalb jeder Mannschaft exakt null — so macht es die
    // Instant-Simulation auch (gemessen ueber zwei Etappen, 51 Mannschaften).
    for (const bucket of perTeam.values()) {
      expect(bucket.size).toBe(1);
    }
    expect(new Set([...gaps.values()]).size).toBe(22);
  });

  it('setzt die staerkste Mannschaft an die Spitze', () => {
    const field = teams(10, 8);
    const gaps = buildTeamTimeTrialGaps(createSeededRandom(3), field, { ...TTT, timeTrialNoise: 0 }, 2400);
    expect(gaps.get(0)).toBe(0);
    expect(gaps.get(900) as number).toBeGreaterThan(0);
  });

  it('verliert Zeit mit jedem fehlenden Fahrer', () => {
    // Zwei gleich starke Mannschaften, eine unvollzaehlig.
    const field: TimeTrialRider[] = [
      ...Array.from({ length: 8 }, (_, index) => ({ riderId: index, score: 80, teamId: 1 })),
      ...Array.from({ length: 4 }, (_, index) => ({ riderId: 100 + index, score: 80, teamId: 2 })),
    ];
    const gaps = buildTeamTimeTrialGaps(createSeededRandom(5), field, { ...TTT, timeTrialNoise: 0 }, 2400);
    expect(gaps.get(0)).toBe(0);
    expect(gaps.get(100) as number).toBeGreaterThan(0);
  });

  it('laesst Fahrer ohne Mannschaft nicht zu einem Phantomteam verschmelzen', () => {
    const field: TimeTrialRider[] = [
      ...Array.from({ length: 8 }, (_, index) => ({ riderId: index, score: 80, teamId: 1 })),
      { riderId: 200, score: 60 },
      { riderId: 201, score: 40 },
    ];
    const gaps = buildTeamTimeTrialGaps(createSeededRandom(6), field, { ...TTT, timeTrialNoise: 0 }, 2400);
    expect(gaps.get(200)).not.toBe(gaps.get(201));
  });
});

describe('simulateQuickStage bei Zeitfahren', () => {
  const field = (count: number) => Array.from({ length: count }, (_, index) => ({
    riderId: index + 1,
    score: 90 - (index * 0.2),
    photoFinishScore: 90 - (index * 0.2),
  }));

  it('bildet beim ITT keine Spitzengruppe', () => {
    const result = simulateQuickStage({
      profile: 'ITT', distanceKm: 23, stageScore: 10, parameters: ITT,
      riders: field(150), random: createSeededRandom(11),
    });
    // Jeder faehrt allein — die erste Zeitgruppe ist der Sieger, hoechstens mit
    // einem zufaellig gleich schnellen Fahrer.
    expect(result.firstGroupSize).toBeLessThan(4);
    expect(result.timeGroupCount).toBeGreaterThan(20);
  });

  it('macht beim TTT jede Mannschaft zu einer Zeitgruppe', () => {
    const riders = teams(22, 8).map((rider) => ({
      riderId: rider.riderId,
      score: rider.score,
      photoFinishScore: rider.score,
      teamId: rider.teamId,
    }));
    const result = simulateQuickStage({
      profile: 'TTT', distanceKm: 24, stageScore: 10, parameters: TTT,
      riders, random: createSeededRandom(12),
    });
    expect(result.timeGroupCount).toBe(22);
    expect(result.firstGroupSize).toBe(8);
  });

  it('zieht beim Zeitfahren weder Regime noch Ausreissergruppe', () => {
    const result = simulateQuickStage({
      profile: 'ITT', distanceKm: 23, stageScore: 10, parameters: ITT,
      riders: field(80),
      // Ein Plan, der auf der Strasse ueberleben wuerde: beim Zeitfahren
      // darf er wirkungslos bleiben.
      breakaway: {
        riderIds: [79, 80],
        phaseEndDistanceMeters: 30_000,
        triggerDistanceMeters: 1_000,
        skillBonus: 100,
        malusValue: 0,
      },
      random: createSeededRandom(13),
    });
    const winner = result.entries[0];
    expect([79, 80]).not.toContain(winner?.riderId);
  });

  it('setzt das Zeitlimit auch beim Zeitfahren', () => {
    const result = simulateQuickStage({
      profile: 'ITT', distanceKm: 23, stageScore: 10, parameters: ITT,
      riders: field(150), random: createSeededRandom(14),
    });
    expect(result.timeLimitSeconds).not.toBeNull();
    for (const entry of result.entries) {
      expect(entry.isOutsideTimeLimit).toBe((entry.stageTimeSeconds as number) > (result.timeLimitSeconds as number));
    }
  });

  it('liefert bei gleichem Seed exakt dasselbe Ergebnis', () => {
    const build = () => simulateQuickStage({
      profile: 'TTT', distanceKm: 24, stageScore: 10, parameters: TTT,
      riders: teams(22, 8).map((rider) => ({
        riderId: rider.riderId, score: rider.score, photoFinishScore: rider.score, teamId: rider.teamId,
      })),
      random: createSeededRandom(15),
    });
    expect(JSON.stringify(build().entries)).toBe(JSON.stringify(build().entries));
  });
});
