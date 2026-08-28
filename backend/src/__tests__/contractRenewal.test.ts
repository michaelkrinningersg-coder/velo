import { describe, expect, it } from 'vitest';
import {
  RENEWAL_BEST_FLOOR,
  RENEWAL_CAPTAIN_FLOOR,
  RENEWAL_TALENT_FLOOR,
  resolveRenewalFloor,
  resolveRenewalValue,
  selectRenewalCandidates,
  type RenewalCandidate,
} from '../../../shared/contractRenewal';

const fahrer = (teil: Partial<RenewalCandidate> & { riderId: number }): RenewalCandidate => ({
  contractId: teil.riderId, overall: 70, potential: 72, age: 27, declineAge: 30, isCaptain: false, ...teil,
});

/** Deterministischer Zufall in [0,1) fuer wiederholbare Ziehungen. */
function rng(saat: number): () => number {
  let zustand = saat;
  return () => {
    zustand = (zustand * 1103515245 + 12345) & 0x7fffffff;
    return zustand / 0x7fffffff;
  };
}

describe('Verlaengerungswert', () => {
  it('rechnet bei jungen Fahrern das Potenzial mit', () => {
    const jung = fahrer({ riderId: 1, age: 22, overall: 68, potential: 78 });
    const alt = fahrer({ riderId: 2, age: 27, overall: 68, potential: 78 });
    expect(resolveRenewalValue(jung)).toBeGreaterThan(resolveRenewalValue(alt));
    expect(resolveRenewalValue(alt)).toBe(68);
  });

  it('zieht nach dem Zenit ab', () => {
    const imZenit = fahrer({ riderId: 1, age: 30, overall: 74, declineAge: 30 });
    const darueber = fahrer({ riderId: 2, age: 34, overall: 74, declineAge: 30 });
    expect(resolveRenewalValue(darueber)).toBeLessThan(resolveRenewalValue(imZenit));
    // 0,8 je Jahr ueber dem Decline Age.
    expect(resolveRenewalValue(imZenit) - resolveRenewalValue(darueber)).toBeCloseTo(3.2, 6);
  });

  it('stellt einen 22-Jaehrigen ueber einen gleich starken 33-Jaehrigen', () => {
    // Genau das kann die blanke Gesamtwertung nicht — sie waehlt den Alten.
    const jung = fahrer({ riderId: 1, age: 22, overall: 69, potential: 76, declineAge: 30 });
    const veteran = fahrer({ riderId: 2, age: 33, overall: 71, potential: 71, declineAge: 30 });
    expect(veteran.overall).toBeGreaterThan(jung.overall);
    expect(resolveRenewalValue(jung)).toBeGreaterThan(resolveRenewalValue(veteran));
  });
});

describe('Mindestwahrscheinlichkeiten', () => {
  it('sichert den wertvollsten auslaufenden Fahrer vor allem anderen', () => {
    const bester = fahrer({ riderId: 1, overall: 78 });
    expect(resolveRenewalFloor(bester, 70, true)).toBe(RENEWAL_BEST_FLOOR);
    expect(resolveRenewalFloor(bester, 70, false)).toBe(0);
  });

  it('sichert Kapitaene ueber dem Teammedian', () => {
    const kapitaen = fahrer({ riderId: 1, overall: 76, isCaptain: true });
    expect(resolveRenewalFloor(kapitaen, 70)).toBe(RENEWAL_CAPTAIN_FLOOR);
    expect(resolveRenewalFloor(kapitaen, 80)).toBe(0);
  });

  it('sichert junge Talente', () => {
    expect(resolveRenewalFloor(fahrer({ riderId: 1, age: 20, potential: 76 }), 70)).toBe(RENEWAL_TALENT_FLOOR);
    expect(resolveRenewalFloor(fahrer({ riderId: 2, age: 24, potential: 76 }), 70)).toBe(0);
    expect(resolveRenewalFloor(fahrer({ riderId: 3, age: 20, potential: 70 }), 70)).toBe(0);
  });
});

describe('Auswahl der Verlaengerungen', () => {
  const kader = (n: number): RenewalCandidate[] => Array.from({ length: n }, (_, index) => fahrer({
    riderId: index + 1,
    // Absteigend stark: Fahrer 1 ist der beste.
    overall: 76 - (index * 0.5),
  }));

  it('haelt die Zahl der Verlaengerungen exakt ein', () => {
    for (const n of [1, 5, 21, 40]) {
      for (const anteil of [0, 0.35, 1]) {
        const ziel = Math.round(n * anteil);
        expect(selectRenewalCandidates(kader(n), ziel, rng(7)).length).toBe(ziel);
      }
    }
  });

  it('gibt nie einen Fahrer doppelt zurueck', () => {
    const gewaehlt = selectRenewalCandidates(kader(21), 7, rng(3));
    expect(new Set(gewaehlt.map((c) => c.riderId)).size).toBe(gewaehlt.length);
  });

  it('behaelt den besten Fahrer weit haeufiger als der Zufall', () => {
    // Auch bei knappem Kontingent: vier Plaetze auf zwoelf Kandidaten ist die
    // Lage in den spaeteren Saisons, dort brachen die Werte vorher ein.
    for (const [n, ziel] of [[21, 7], [12, 4]] as const) {
      let mitWert = 0;
      const LAEUFE = 400;
      for (let lauf = 0; lauf < LAEUFE; lauf += 1) {
        const gewaehlt = selectRenewalCandidates(kader(n), ziel, rng(lauf * 31 + 5));
        if (gewaehlt.some((c) => c.riderId === 1)) mitWert += 1;
      }
      // Reiner Zufall waere ein Drittel.
      expect(mitWert / LAEUFE, `${n} Kandidaten`).toBeGreaterThan(0.85);
    }
  });

  it('bevorzugt Talente vor gleich starken Veteranen', () => {
    const gemischt = [
      ...Array.from({ length: 10 }, (_, i) => fahrer({ riderId: 100 + i, age: 21, overall: 68, potential: 78 })),
      ...Array.from({ length: 10 }, (_, i) => fahrer({ riderId: 200 + i, age: 33, overall: 70, potential: 70 })),
    ];
    let talente = 0, veteranen = 0;
    for (let lauf = 0; lauf < 200; lauf += 1) {
      for (const c of selectRenewalCandidates(gemischt, 7, rng(lauf * 17 + 1))) {
        if (c.riderId < 200) talente += 1; else veteranen += 1;
      }
    }
    expect(talente).toBeGreaterThan(veteranen * 2);
  });

  it('gibt bei Ziel gleich Kadergroesse alle zurueck', () => {
    const alle = kader(6);
    expect(selectRenewalCandidates(alle, 6, rng(1))).toHaveLength(6);
    expect(selectRenewalCandidates(alle, 99, rng(1))).toHaveLength(6);
  });

  it('kommt mit leerem Kader klar', () => {
    expect(selectRenewalCandidates([], 3, rng(1))).toEqual([]);
  });

  it('kappt bei mehr gesetzten Faellen als Plaetzen auf die wertvollsten', () => {
    const nurKapitaene = Array.from({ length: 8 }, (_, i) => fahrer({
      riderId: i + 1, overall: 78 - i, isCaptain: true,
    }));
    const gewaehlt = selectRenewalCandidates(nurKapitaene, 3, () => 0);
    expect(gewaehlt).toHaveLength(3);
    expect(gewaehlt.map((c) => c.riderId).sort()).toEqual([1, 2, 3]);
  });
});
