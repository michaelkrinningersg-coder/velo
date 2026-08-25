import { describe, expect, it } from 'vitest';
import { simulateQuickStage } from '../../../shared/quickSim/simulateStage';
import { DEFAULT_QUICK_SIM_PROFILES } from '../../../shared/quickSimProfiles';
import { createSeededRandom } from '../../../shared/rng';
import type { StageProfile } from '../../../shared/types';

const riders = (count: number, protectedIds: number[] = []) =>
  Array.from({ length: count }, (_, index) => ({
    riderId: index + 1,
    score: 90 - (index * 0.1),
    photoFinishScore: 90 - (index * 0.1),
    isProtected: protectedIds.includes(index + 1),
  }));

const laufe = (profile: StageProfile, seed: number, protectedIds: number[] = []) => simulateQuickStage({
  profile,
  distanceKm: 190,
  stageScore: 20,
  parameters: DEFAULT_QUICK_SIM_PROFILES[profile],
  riders: riders(150, protectedIds),
  random: createSeededRandom(seed),
});

describe('groupDiagnostics', () => {
  it('liegt auf Strassenetappen vor und fehlt beim Zeitfahren', () => {
    expect(laufe('Flat', 1).groupDiagnostics).toBeDefined();
    expect(laufe('Mountain', 1).groupDiagnostics).toBeDefined();
    expect(laufe('ITT', 1).groupDiagnostics).toBeUndefined();
    expect(laufe('TTT', 1).groupDiagnostics).toBeUndefined();
  });

  it('haelt die Zwischenschritte in sich stimmig', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      const d = laufe('Flat', seed).groupDiagnostics!;
      expect(d.bunchProbability).toBeGreaterThanOrEqual(0);
      expect(d.bunchProbability).toBeLessThanOrEqual(1);
      expect(d.drawnShare).toBeGreaterThanOrEqual(0);
      expect(d.drawnShare).toBeLessThanOrEqual(1);
      // Die erste Gruppe folgt aus dem gezogenen Anteil.
      expect(d.firstGroupSize).toBe(
        Math.min(d.finisherCount, Math.max(1, Math.round(d.drawnShare * d.finisherCount))),
      );
      // Kein Fahrer geht beim Gruppenbau verloren.
      expect(d.drawnGroups.reduce((sum, g) => sum + g.size, 0)).toBe(d.finisherCount);
      expect(d.protectedGroups.reduce((sum, g) => sum + g.size, 0)).toBe(d.finisherCount);
      // Rueckstaende steigen von Gruppe zu Gruppe.
      for (let index = 1; index < d.drawnGroups.length; index += 1) {
        expect(d.drawnGroups[index]!.gapSeconds).toBeGreaterThan(d.drawnGroups[index - 1]!.gapSeconds);
      }
    }
  });

  it('weist den Zuwachs durch den Kapitaensschutz aus', () => {
    // Geschuetzte Fahrer am Feldende: der Schutz muss sie nach vorne holen.
    const protectedIds = [140, 141, 142, 143, 144, 145];
    let mitZuwachs = 0;
    for (let seed = 0; seed < 40; seed += 1) {
      const d = laufe('Flat', seed, protectedIds).groupDiagnostics!;
      expect(d.protectionStrength).toBe(1);
      expect(d.protectedPromotions).toBe(
        Math.max(0, (d.protectedGroups[0]?.size ?? 0) - (d.drawnGroups[0]?.size ?? 0)),
      );
      if (d.protectedPromotions > 0) {
        mitZuwachs += 1;
      }
    }
    expect(mitZuwachs).toBeGreaterThan(0);
  });

  it('meldet am Berg keinen Schutz', () => {
    const d = laufe('Mountain', 3, [140, 141, 142]).groupDiagnostics!;
    expect(d.protectionStrength).toBe(0);
    expect(d.protectedPromotions).toBe(0);
  });

  it('gibt das Rangrauschen je Fahrer heraus', () => {
    const ergebnis = laufe('Flat', 5);
    const d = ergebnis.groupDiagnostics!;
    expect(d.rankNoiseSigma).toBeCloseTo(DEFAULT_QUICK_SIM_PROFILES.Flat.rankNoise * 0.5, 10);
    expect(d.tieBreakNoiseFactor).toBe(0.25);
    expect(d.rankNoiseByRiderId.size).toBe(150);
    // Ohne das Rauschen laesst sich der photoFinishScore nicht nachrechnen:
    // Eingabewert plus Rauschen muss den Ausgabewert ergeben.
    for (const entry of ergebnis.entries.filter((e) => !e.isAbandon).slice(0, 20)) {
      const eingabe = 90 - ((entry.riderId - 1) * 0.1);
      const rauschen = (d.rankNoiseByRiderId.get(entry.riderId) ?? 0) * d.tieBreakNoiseFactor;
      expect(entry.photoFinishScore).toBeCloseTo(eingabe + rauschen, 6);
    }
  });
});

describe('Terrainfaktoren auf das Rangrauschen', () => {
  it('zieht ueberall mit der halben Streuung', () => {
    for (const profile of ['Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Mountain', 'High_Mountain', 'Medium_Mountain'] as StageProfile[]) {
      const d = laufe(profile, 11).groupDiagnostics!;
      expect(d.rankNoiseSigma).toBeCloseTo(DEFAULT_QUICK_SIM_PROFILES[profile].rankNoise * 0.5, 10);
    }
  });

  it('daempft den Tie-Break nur flach, rollend und huegelig', () => {
    for (const profile of ['Flat', 'Rolling', 'Hilly'] as StageProfile[]) {
      expect(laufe(profile, 12).groupDiagnostics!.tieBreakNoiseFactor).toBe(0.25);
    }
    for (const profile of ['Hilly_Difficult', 'Mountain', 'Cobble'] as StageProfile[]) {
      expect(laufe(profile, 12).groupDiagnostics!.tieBreakNoiseFactor).toBe(1);
    }
  });

  it('laesst die Reihenfolge des Feldes vom vollen Rauschen bestimmen', () => {
    // Der Tie-Break-Faktor darf die Gruppenreihenfolge nicht beruehren: die
    // Streuung der gezogenen Werte entspricht weiter dem Sigma.
    const d = laufe('Flat', 13).groupDiagnostics!;
    const werte = [...d.rankNoiseByRiderId.values()];
    const mittel = werte.reduce((sum, value) => sum + value, 0) / werte.length;
    const sd = Math.sqrt(werte.reduce((sum, value) => sum + ((value - mittel) ** 2), 0) / (werte.length - 1));
    // Score-Streuung des Feldes: 150 Fahrer im Abstand 0,1 -> rund 4,33.
    const feldStreuung = 4.33;
    expect(sd / feldStreuung).toBeGreaterThan(d.rankNoiseSigma * 0.6);
    expect(sd / feldStreuung).toBeLessThan(d.rankNoiseSigma * 1.6);
  });
});
