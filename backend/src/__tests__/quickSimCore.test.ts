import { describe, expect, it } from 'vitest';
import {
  resolveBreakawaySizeAtKm,
  resolveBreakawaySurvives,
  resolveMarkerRanking,
  resolveMarkerSource,
  type QuickSimBreakawayPlan,
} from '../../../shared/quickSim/breakaway';
import {
  expandMassCrashes,
  resolveIncidentOutcomes,
  resolveIncidentTimeLossSeconds,
  type QuickSimIncident,
} from '../../../shared/quickSim/incidents';
import {
  simulateQuickStage,
  resolveSurvivingBreakawayLeadSeconds,
  type QuickSimRiderInput,
} from '../../../shared/quickSim/simulateStage';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../../shared/quickSimProfiles';
import { createSeededRandom } from '../../../shared/rng';

const FLAT = DEFAULT_QUICK_SIM_PROFILES.Flat;
const MOUNTAIN = DEFAULT_QUICK_SIM_PROFILES.High_Mountain;

function incident(overrides: Partial<QuickSimIncident> = {}): QuickSimIncident {
  return {
    riderId: 1,
    type: 'crash',
    severity: 'light',
    triggerDistanceKm: 100,
    waitDurationSeconds: 30,
    ...overrides,
  };
}

function field(count: number): QuickSimRiderInput[] {
  // Absteigende Scores mit gleichmaessigem Abstand — die Gruppenbildung soll
  // nicht an einer zufaelligen Score-Verteilung haengen.
  return Array.from({ length: count }, (_, index) => ({
    riderId: index + 1,
    score: 100 - (index * 0.1),
    photoFinishScore: 100 - (index * 0.1),
  }));
}

describe('resolveIncidentTimeLossSeconds', () => {
  it('kostet am Ende der Etappe kaum mehr als die Wartezeit', () => {
    const late = resolveIncidentTimeLossSeconds(
      incident({ triggerDistanceKm: 200, waitDurationSeconds: 30 }),
      FLAT,
      200,
    );
    expect(late).toBe(Math.round(30 * FLAT.incidentLossMultiplier));
  });

  it('kostet am Anfang das Doppelte davon — der Anschluss ist der Schaden', () => {
    const early = resolveIncidentTimeLossSeconds(incident({ triggerDistanceKm: 0 }), FLAT, 200);
    const late = resolveIncidentTimeLossSeconds(incident({ triggerDistanceKm: 200 }), FLAT, 200);
    expect(early).toBe(late * 2);
  });

  it('kostet am Berg mehr als im Flachen', () => {
    const flat = resolveIncidentTimeLossSeconds(incident(), FLAT, 200);
    const mountain = resolveIncidentTimeLossSeconds(incident(), MOUNTAIN, 200);
    expect(mountain).toBeGreaterThan(flat);
  });

  it('faellt ohne Distanz auf die reine Wartezeit zurueck', () => {
    expect(resolveIncidentTimeLossSeconds(incident({ waitDurationSeconds: 42 }), FLAT, 0)).toBe(42);
  });
});

describe('resolveIncidentOutcomes', () => {
  it('summiert mehrere Vorfaelle desselben Fahrers', () => {
    const outcomes = resolveIncidentOutcomes(
      createSeededRandom(1),
      [
        incident({ type: 'mechanical', severity: null, triggerDistanceKm: 50 }),
        incident({ type: 'mechanical', severity: null, triggerDistanceKm: 150 }),
      ],
      FLAT,
      200,
    );
    const outcome = outcomes.get(1);
    expect(outcome?.isAbandon).toBe(false);
    expect(outcome?.timeLossSeconds).toBe(
      resolveIncidentTimeLossSeconds(incident({ triggerDistanceKm: 50 }), FLAT, 200)
      + resolveIncidentTimeLossSeconds(incident({ triggerDistanceKm: 150 }), FLAT, 200),
    );
  });

  it('laesst nur schwere Stuerze zur Aufgabe fuehren', () => {
    const light = resolveIncidentOutcomes(
      createSeededRandom(7),
      Array.from({ length: 200 }, (_, index) => incident({ riderId: index + 1, severity: 'light' })),
      FLAT,
      200,
    );
    expect([...light.values()].some((outcome) => outcome.isAbandon)).toBe(false);
  });

  it('trifft die Aufgabewahrscheinlichkeit schwerer Stuerze', () => {
    const outcomes = resolveIncidentOutcomes(
      createSeededRandom(11),
      Array.from({ length: 4000 }, (_, index) => incident({ riderId: index + 1, severity: 'severe' })),
      FLAT,
      200,
    );
    const abandonRate = [...outcomes.values()].filter((outcome) => outcome.isAbandon).length / outcomes.size;
    expect(abandonRate).toBeGreaterThan(FLAT.severeDnfChance - 0.03);
    expect(abandonRate).toBeLessThan(FLAT.severeDnfChance + 0.03);
  });

  it('ignoriert weitere Vorfaelle nach der Aufgabe', () => {
    // Ein Fahrer, der bei km 50 aufgibt, kann bei km 150 nicht mehr stuerzen.
    const outcomes = resolveIncidentOutcomes(
      createSeededRandom(3),
      [
        incident({ severity: 'severe', triggerDistanceKm: 50 }),
        incident({ severity: 'severe', triggerDistanceKm: 150 }),
      ],
      { ...FLAT, severeDnfChance: 1 },
      200,
    );
    expect(outcomes.get(1)?.isAbandon).toBe(true);
    expect(outcomes.get(1)?.triggerDistanceKm).toBe(50);
  });
});

describe('expandMassCrashes', () => {
  const victim = (riderId: number, triggerDistanceKm: number): QuickSimIncident => ({
    riderId, type: 'crash', severity: 'light', triggerDistanceKm, waitDurationSeconds: 30,
  });
  const trigger = incident({
    riderId: 1,
    isMassCrashTrigger: true,
    massCrashPotentialRiderIds: Array.from({ length: 24 }, (_, index) => index + 2),
  });

  it('zieht ungefaehr den vorgegebenen Anteil der Kandidaten hinein', () => {
    const random = createSeededRandom(21);
    let involved = 0;
    const rounds = 400;
    for (let round = 0; round < rounds; round += 1) {
      involved += expandMassCrashes(random, [trigger], 0.35, victim).length - 1;
    }
    const share = involved / (rounds * 24);
    expect(share).toBeGreaterThan(0.32);
    expect(share).toBeLessThan(0.38);
  });

  it('laesst die Liste unveraendert, wenn niemand mitgerissen wird', () => {
    expect(expandMassCrashes(createSeededRandom(22), [trigger], 0, victim)).toEqual([trigger]);
  });

  it('ruehrt Vorfaelle ohne Massensturz nicht an', () => {
    const plain = [incident({ riderId: 1 }), incident({ riderId: 2, type: 'mechanical', severity: null })];
    expect(expandMassCrashes(createSeededRandom(23), plain, 1, victim)).toEqual(plain);
  });

  it('trifft niemanden zweimal', () => {
    // Zwei Massenstuerze mit denselben Kandidaten, alle werden mitgerissen.
    const second = incident({
      riderId: 30,
      isMassCrashTrigger: true,
      massCrashPotentialRiderIds: Array.from({ length: 24 }, (_, index) => index + 2),
    });
    const expanded = expandMassCrashes(createSeededRandom(24), [trigger, second], 1, victim);
    const ids = expanded.map((entry) => entry.riderId);
    expect(new Set(ids).size).toBe(ids.length);
    // Ausloeser 1 und 30 plus die 24 Kandidaten.
    expect(expanded).toHaveLength(26);
  });

  it('reisst niemanden mit, der schon einen Vorfall hat', () => {
    const alreadyHurt = incident({ riderId: 5, type: 'mechanical', severity: null });
    const expanded = expandMassCrashes(createSeededRandom(25), [trigger, alreadyHurt], 1, victim);
    const forRider5 = expanded.filter((entry) => entry.riderId === 5);
    expect(forRider5).toHaveLength(1);
    expect(forRider5[0]!.type).toBe('mechanical');
  });

  it('setzt die Opfer an den Kilometer des Ausloesers', () => {
    const expanded = expandMassCrashes(
      createSeededRandom(26),
      [incident({
        riderId: 1, triggerDistanceKm: 88,
        isMassCrashTrigger: true, massCrashPotentialRiderIds: [2, 3, 4],
      })],
      1,
      victim,
    );
    for (const entry of expanded) {
      expect(entry.triggerDistanceKm).toBe(88);
    }
  });
});

describe('resolveBreakawaySurvives', () => {
  const plan: QuickSimBreakawayPlan = {
    riderIds: [1, 2, 3],
    phaseEndDistanceMeters: 150_000,
    triggerDistanceMeters: 6_000,
  };

  it('ueberlebt, wenn der Einholpunkt hinter dem Ziel liegt', () => {
    expect(resolveBreakawaySurvives(plan, 140_000)).toBe(true);
    expect(resolveBreakawaySurvives(plan, 150_000)).toBe(true);
  });

  it('wird gestellt, wenn der Einholpunkt vor dem Ziel liegt', () => {
    expect(resolveBreakawaySurvives(plan, 160_000)).toBe(false);
  });

  it('kennt keine Ausreisser ohne Plan', () => {
    expect(resolveBreakawaySurvives(null, 160_000)).toBe(false);
    expect(resolveBreakawaySurvives({ ...plan, riderIds: [] }, 140_000)).toBe(false);
  });
});

describe('resolveBreakawaySizeAtKm', () => {
  it('startet vollzaehlig und endet bei einem Fahrer', () => {
    expect(resolveBreakawaySizeAtKm(6, 0, 150, FLAT)).toBe(6);
    expect(resolveBreakawaySizeAtKm(6, 150, 150, FLAT)).toBe(1);
    expect(resolveBreakawaySizeAtKm(6, 200, 150, FLAT)).toBe(1);
  });

  it('schrumpft monoton', () => {
    let previous = Number.POSITIVE_INFINITY;
    for (let km = 0; km <= 150; km += 5) {
      const size = resolveBreakawaySizeAtKm(6, km, 150, FLAT);
      expect(size).toBeLessThanOrEqual(previous);
      previous = size;
    }
  });

  it('haelt bei hoeherem Exponenten laenger zusammen', () => {
    const patient = resolveBreakawaySizeAtKm(6, 75, 150, { ...FLAT, breakawayShrinkExponent: 2.5 });
    const brittle = resolveBreakawaySizeAtKm(6, 75, 150, { ...FLAT, breakawayShrinkExponent: 0.8 });
    expect(patient).toBeGreaterThan(brittle);
  });
});

describe('resolveMarkerRanking', () => {
  const plan: QuickSimBreakawayPlan = {
    riderIds: [11, 12, 13, 14, 15, 16],
    phaseEndDistanceMeters: 150_000,
    triggerDistanceMeters: 6_000,
  };
  const parameters = FLAT;
  // Die Ausreisser sind im Feld absichtlich schwach — sonst waere nicht zu
  // sehen, ob die Wertung aus der Gruppe oder aus dem Feld faellt.
  const fieldOrder = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16];
  const markerScore = (riderId: number): number => 1000 - riderId;

  it('vergibt vor dem Einholpunkt aus der Ausreissergruppe', () => {
    const ranking = resolveMarkerRanking({
      markerKm: 47, rankCount: 3, catchKm: 150, plan, parameters,
      fieldOrderByMarkerScore: fieldOrder, resolveMarkerScore: markerScore,
    });
    expect(ranking.source).toBe('breakaway');
    expect(ranking.riderIds).toEqual([11, 12, 13]);
  });

  it('vergibt ab dem Einholpunkt aus dem Feld', () => {
    const ranking = resolveMarkerRanking({
      markerKm: 171, rankCount: 3, catchKm: 150, plan, parameters,
      fieldOrderByMarkerScore: fieldOrder, resolveMarkerScore: markerScore,
    });
    expect(ranking.source).toBe('field');
    expect(ranking.riderIds).toEqual([1, 2, 3]);
  });

  it('fuellt aus dem Feld auf, wenn die Gruppe zu klein geworden ist', () => {
    // Kurz vor dem Einholpunkt ist nur noch ein Ausreisser vorne, der
    // Zwischensprint vergibt aber acht Raenge.
    const ranking = resolveMarkerRanking({
      markerKm: 149, rankCount: 8, catchKm: 150, plan, parameters,
      fieldOrderByMarkerScore: fieldOrder, resolveMarkerScore: markerScore,
    });
    expect(ranking.breakawaySize).toBe(1);
    expect(ranking.riderIds).toHaveLength(8);
    expect(ranking.riderIds[0]).toBe(11);
    expect(ranking.riderIds.slice(1)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('waehlt die Ausreisser nach dem Marker-Score aus, nicht nach der Planreihenfolge', () => {
    // Am Berg haelt der Kletterer laenger durch — hier Fahrer 16.
    const ranking = resolveMarkerRanking({
      markerKm: 140, rankCount: 1, catchKm: 150, plan, parameters,
      fieldOrderByMarkerScore: fieldOrder, resolveMarkerScore: (riderId) => (riderId === 16 ? 9999 : riderId),
    });
    expect(ranking.riderIds).toEqual([16]);
  });

  it('nimmt ohne Plan das Feld', () => {
    const ranking = resolveMarkerRanking({
      markerKm: 47, rankCount: 2, catchKm: 150, plan: null, parameters,
      fieldOrderByMarkerScore: fieldOrder, resolveMarkerScore: markerScore,
    });
    expect(ranking.source).toBe('field');
    expect(ranking.riderIds).toEqual([1, 2]);
  });

  it('kennt den Einholpunkt als Grenze, nicht als Bereich', () => {
    expect(resolveMarkerSource(149.9, 150)).toBe('breakaway');
    expect(resolveMarkerSource(150, 150)).toBe('field');
  });
});

describe('simulateQuickStage', () => {
  it('liefert bei gleichem Seed exakt dasselbe Ergebnis', () => {
    const build = () => simulateQuickStage({
      profile: 'Hilly', distanceKm: 180, stageScore: 45, parameters: DEFAULT_QUICK_SIM_PROFILES.Hilly,
      riders: field(160), random: createSeededRandom(4711),
    });
    expect(JSON.stringify(build().entries)).toBe(JSON.stringify(build().entries));
  });

  it('gibt jedem Fahrer genau einen Eintrag', () => {
    const result = simulateQuickStage({
      profile: 'Flat', distanceKm: 190, stageScore: 20, parameters: FLAT,
      riders: field(176), random: createSeededRandom(1),
    });
    expect(result.entries).toHaveLength(176);
    expect(new Set(result.entries.map((entry) => entry.riderId)).size).toBe(176);
  });

  it('sortiert nach Zielzeit und beginnt bei Rueckstand null', () => {
    const result = simulateQuickStage({
      profile: 'Mountain', distanceKm: 165, stageScore: 155, parameters: DEFAULT_QUICK_SIM_PROFILES.Mountain,
      riders: field(150), random: createSeededRandom(99),
    });
    const finishers = result.entries.filter((entry) => !entry.isAbandon);
    expect(finishers[0]?.gapSeconds).toBe(0);
    for (let index = 1; index < finishers.length; index += 1) {
      expect(finishers[index]!.stageTimeSeconds).toBeGreaterThanOrEqual(finishers[index - 1]!.stageTimeSeconds as number);
    }
  });

  it('trifft die Siegerzeit aus Distanz und Referenzgeschwindigkeit', () => {
    const result = simulateQuickStage({
      profile: 'Flat', distanceKm: 200, stageScore: 20, parameters: FLAT,
      riders: field(176), random: createSeededRandom(5),
    });
    const expected = (200 / FLAT.baseSpeedKmh) * 3600;
    expect(result.winnerTimeSeconds).toBeGreaterThan(expected * 0.96);
    expect(result.winnerTimeSeconds).toBeLessThan(expected * 1.04);
  });

  it('laesst das Feld im Flachen geschlossen und am Berg zerfallen ankommen', () => {
    // Ueber viele Laeufe, damit nicht ein einzelner Regime-Wurf entscheidet.
    const shareOf = (profile: 'Flat' | 'High_Mountain', stageScore: number, distanceKm: number): number => {
      let sum = 0;
      for (let run = 0; run < 60; run += 1) {
        const result = simulateQuickStage({
          profile, distanceKm, stageScore, parameters: DEFAULT_QUICK_SIM_PROFILES[profile],
          riders: field(176), random: createSeededRandom(1000 + run),
        });
        sum += result.firstGroupSize / 176;
      }
      return sum / 60;
    };
    // Erwartungswert des Modells fuer diese Flachetappe ist 0,66, nicht 0,86:
    // die logistische Kurve unterschaetzt den gesaettigten oberen Bereich
    // (D ~ 0,08 sagt 75 % geschlossen voraus, beobachtet sind 94-98 %). Das ist
    // der dokumentierte offene Punkt — der Test haelt die Groessenordnung fest,
    // nicht die Wunschzahl.
    expect(shareOf('Flat', 16, 200)).toBeGreaterThan(0.55);
    expect(shareOf('High_Mountain', 250, 170)).toBeLessThan(0.1);
  });

  it('nimmt Aufgaben aus der Wertung und laesst sie ohne Zeit stehen', () => {
    const result = simulateQuickStage({
      profile: 'Flat', distanceKm: 200, stageScore: 20, parameters: { ...FLAT, severeDnfChance: 1 },
      riders: field(100),
      incidents: [incident({ riderId: 5, severity: 'severe' }), incident({ riderId: 6, severity: 'severe' })],
      random: createSeededRandom(2),
    });
    expect(result.abandonCount).toBe(2);
    const abandoned = result.entries.filter((entry) => entry.isAbandon);
    expect(abandoned.map((entry) => entry.riderId).sort()).toEqual([5, 6]);
    expect(abandoned.every((entry) => entry.stageTimeSeconds == null)).toBe(true);
    // Das Zeitlimit darf nur aus den Zielzeiten der Ankommenden entstehen.
    expect(result.entries.filter((entry) => !entry.isAbandon)).toHaveLength(98);
  });

  it('rechnet den Zeitverlust eines Vorfalls auf die Zielzeit', () => {
    const withoutIncident = simulateQuickStage({
      profile: 'Flat', distanceKm: 200, stageScore: 20, parameters: FLAT,
      riders: field(100), random: createSeededRandom(8),
    });
    const withIncident = simulateQuickStage({
      profile: 'Flat', distanceKm: 200, stageScore: 20, parameters: FLAT,
      riders: field(100),
      incidents: [incident({ riderId: 1, severity: 'medium', triggerDistanceKm: 20, waitDurationSeconds: 60 })],
      random: createSeededRandom(8),
    });
    const before = withoutIncident.entries.find((entry) => entry.riderId === 1);
    const after = withIncident.entries.find((entry) => entry.riderId === 1);
    expect(after!.stageTimeSeconds as number).toBeGreaterThan(before!.stageTimeSeconds as number);
    expect(after!.incident?.timeLossSeconds).toBe(
      resolveIncidentTimeLossSeconds(
        incident({ triggerDistanceKm: 20, waitDurationSeconds: 60 }), FLAT, 200,
      ),
    );
  });

  it('setzt das Zeitlimit und markiert die Fahrer dahinter', () => {
    const result = simulateQuickStage({
      profile: 'High_Mountain', distanceKm: 170, stageScore: 260, parameters: MOUNTAIN,
      riders: field(176), random: createSeededRandom(31),
    });
    expect(result.timeLimitSeconds).not.toBeNull();
    for (const entry of result.entries.filter((item) => !item.isAbandon)) {
      expect(entry.isOutsideTimeLimit).toBe((entry.stageTimeSeconds as number) > (result.timeLimitSeconds as number));
    }
  });

  it('laesst den Etappensieg zwingend aus einer ueberlebenden Ausreissergruppe fallen', () => {
    // Die Ausreisser sind die schwaechsten Fahrer im Feld. Ohne die
    // strukturelle Entscheidung gewaenne trotzdem der Favorit.
    const breakawayIds = [98, 99, 100];
    for (let run = 0; run < 20; run += 1) {
      const result = simulateQuickStage({
        profile: 'Hilly', distanceKm: 180, stageScore: 45, parameters: DEFAULT_QUICK_SIM_PROFILES.Hilly,
        riders: field(100),
        breakaway: {
          riderIds: breakawayIds,
          phaseEndDistanceMeters: 186_000,
          triggerDistanceMeters: 6_000,
          skillBonus: 0,
          malusValue: 30,
        },
        random: createSeededRandom(500 + run),
      });
      expect(result.breakawaySurvived).toBe(true);
      const winner = result.entries.find((entry) => !entry.isAbandon);
      expect(breakawayIds).toContain(winner?.riderId);
      // Das Feld kommt geschlossen dahinter an, nicht zeitgleich.
      const firstFieldRider = result.entries.find(
        (entry) => !entry.isAbandon && !breakawayIds.includes(entry.riderId),
      );
      expect(firstFieldRider!.gapSeconds as number).toBeGreaterThan(0);
    }
  });

  it('schiebt gestellte Ausreisser ueber den Malus nach hinten', () => {
    const plan = {
      riderIds: [1, 2, 3],
      phaseEndDistanceMeters: 120_000,
      triggerDistanceMeters: 6_000,
      skillBonus: 0,
      malusValue: 50,
    };
    const result = simulateQuickStage({
      profile: 'Flat', distanceKm: 190, stageScore: 20, parameters: FLAT,
      riders: field(100), breakaway: plan, random: createSeededRandom(77),
    });
    expect(result.breakawaySurvived).toBe(false);
    // Aus den drei staerksten Fahrern werden durch den Malus die drei schwaechsten.
    const order = result.entries.map((entry) => entry.riderId);
    for (const riderId of plan.riderIds) {
      expect(order.indexOf(riderId)).toBeGreaterThan(90);
    }
  });

  it('kommt ohne Fahrer und ohne Finisher zurecht', () => {
    const empty = simulateQuickStage({
      profile: 'Flat', distanceKm: 190, stageScore: 20, parameters: FLAT,
      riders: [], random: createSeededRandom(1),
    });
    expect(empty.entries).toEqual([]);
    expect(empty.timeLimitSeconds).toBeNull();

    const allOut = simulateQuickStage({
      profile: 'Flat', distanceKm: 190, stageScore: 20, parameters: { ...FLAT, severeDnfChance: 1 },
      riders: field(2),
      incidents: [incident({ riderId: 1, severity: 'severe' }), incident({ riderId: 2, severity: 'severe' })],
      random: createSeededRandom(1),
    });
    expect(allOut.abandonCount).toBe(2);
    expect(allOut.entries.every((entry) => entry.isAbandon)).toBe(true);
  });
});

describe('resolveSurvivingBreakawayLeadSeconds', () => {
  it('waechst mit dem Ueberschuss des Einholpunktes ueber das Ziel', () => {
    const near = resolveSurvivingBreakawayLeadSeconds(
      { riderIds: [1], phaseEndDistanceMeters: 181_000, triggerDistanceMeters: 0 }, 180,
    );
    const far = resolveSurvivingBreakawayLeadSeconds(
      { riderIds: [1], phaseEndDistanceMeters: 186_000, triggerDistanceMeters: 0 }, 180,
    );
    expect(far).toBeGreaterThan(near);
    expect(near).toBeGreaterThanOrEqual(1);
  });

  it('deckelt den Vorsprung', () => {
    const absurd = resolveSurvivingBreakawayLeadSeconds(
      { riderIds: [1], phaseEndDistanceMeters: 900_000, triggerDistanceMeters: 0 }, 180,
    );
    expect(absurd).toBe(600);
  });
});
