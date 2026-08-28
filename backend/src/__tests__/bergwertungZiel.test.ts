import { describe, expect, it } from 'vitest';
import { summarizeStageProfile } from '../simulation/StageParser';
import { StageResultCommitService } from '../simulation/StageResultCommitService';
import {
  collectStageBoundaryMarkers,
  isMountainClassificationMarker,
} from '../../../frontend/src/race-sim/stageSummary';

/**
 * Ein Zielsprint kann zugleich Bergwertung sein - dann traegt der Zielmarker
 * eine Kategorie. Diese Tests sichern beide Haelften der Kette: dass ein
 * solcher Marker ueberhaupt als Bergwertung eingesammelt wird, und dass die
 * Punkte danach aus der Tabelle seiner Kategorie kommen.
 */

function zielmarker(datei: string, startHoehe: number) {
  const summary = summarizeStageProfile(datei, startHoehe);
  const marker = collectStageBoundaryMarkers(summary)
    .filter(({ marker: m }) => m.type.startsWith('finish'));
  expect(marker.length).toBeGreaterThan(0);
  return marker[marker.length - 1].marker;
}

describe('Bergwertung am Ziel', () => {
  it('sammelt einen kategorisierten Zielanstieg als Bergwertung ein', () => {
    const marker = zielmarker('dummy_high_mountain_c.csv', 200);
    expect(marker.type).toBe('finish_mountain');
    expect(marker.cat).toBe('HC');
    expect(isMountainClassificationMarker(marker)).toBe(true);
  });

  it('behandelt einen Zielanstieg ohne Kategorie nicht als Bergwertung', () => {
    expect(isMountainClassificationMarker({ type: 'finish_mountain', name: 'Ziel', cat: null })).toBe(false);
    expect(isMountainClassificationMarker({ type: 'finish_hill', name: 'Ziel', cat: null })).toBe(false);
    expect(isMountainClassificationMarker({ type: 'finish_flat', name: 'Ziel', cat: null })).toBe(false);
  });

  it('zaehlt einen kategorisierten Zielanstieg zu den Bergwertungen der Etappe', () => {
    const summary = summarizeStageProfile('dummy_high_mountain_c.csv', 200);
    const bergwertungen = collectStageBoundaryMarkers(summary)
      .filter(({ marker }) => isMountainClassificationMarker(marker));
    // Der letzte Anstieg endet im Ziel und taucht deshalb als finish_mountain auf,
    // nicht als climb_top - er muss trotzdem mitgezaehlt werden.
    expect(bergwertungen.some(({ marker }) => marker.type === 'finish_mountain')).toBe(true);
  });

  const bonusSystem = {
    pointsSprintIntermediate: '20|17|15',
    bonusSecondsIntermediate: '6|4|2',
    pointsMountainHc: '20|15|12',
    pointsMountainCat1: '10|8|6',
    pointsMountainCat2: '5|3|2',
    pointsMountainCat3: '2|1',
    pointsMountainCat4: '1',
  } as any;

  function vergib(markerType: string, markerCategory: string | null) {
    // applyMarkerClassificationAwards greift nicht auf die Instanz zu.
    const service = Object.create(StageResultCommitService.prototype) as any;
    const performance = [
      { rider: { id: 1 }, points: 0, mountainPoints: 0, gcBonusSeconds: 0 },
      { rider: { id: 2 }, points: 0, mountainPoints: 0, gcBonusSeconds: 0 },
    ];
    const klassifikation = [{
      markerKey: 'k', markerLabel: 'Zielanstieg', markerType, markerCategory, kmMark: 120,
      entries: [{ riderId: 1, rank: 1 }, { riderId: 2, rank: 2 }],
    }];
    const ausgabe = service.applyMarkerClassificationAwards(
      { isStageRace: true, category: { bonusSystem } },
      { profile: 'High_Mountain' },
      performance,
      klassifikation,
    );
    return { performance, ausgabe };
  }

  it('vergibt am Ziel die Punkte der HC-Tabelle', () => {
    const { performance, ausgabe } = vergib('finish_mountain', 'HC');
    expect(ausgabe[0].entries.map((e: any) => e.pointsAwarded)).toEqual([20, 15]);
    expect(performance[0].mountainPoints).toBe(20);
    expect(performance[1].mountainPoints).toBe(15);
    // Bergpunkte duerfen nicht zusaetzlich in die Punktewertung laufen.
    expect(performance[0].points).toBe(0);
  });

  it('vergibt am Ziel die Punkte der jeweiligen Kategorie, auch bei finish_hill', () => {
    expect(vergib('finish_hill', '2').ausgabe[0].entries.map((e: any) => e.pointsAwarded)).toEqual([5, 3]);
    expect(vergib('finish_mountain', '1').ausgabe[0].entries.map((e: any) => e.pointsAwarded)).toEqual([10, 8]);
  });

  it('vergibt ohne Kategorie am Ziel keine Bergpunkte', () => {
    const { performance, ausgabe } = vergib('finish_mountain', null);
    expect(ausgabe[0].entries.map((e: any) => e.pointsAwarded)).toEqual([0, 0]);
    expect(performance[0].mountainPoints).toBe(0);
  });

  it('vergibt am selben Marker keine Sprintpunkte', () => {
    const { performance } = vergib('finish_mountain', 'HC');
    expect(performance[0].gcBonusSeconds).toBe(0);
  });
});
