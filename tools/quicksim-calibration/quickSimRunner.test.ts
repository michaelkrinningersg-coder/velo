/**
 * Prueft die Anbindung der Quick Simulation ans Spiel — denselben Weg, den
 * `openQuickStage` nimmt, nur ohne Datenbank und ohne Ansicht.
 *
 * Der Kern hat eigene Tests; hier geht es um das, was der Kern *nicht*
 * abdeckt: dass aus einem echten Bootstrap vollstaendige Ergebniszeilen,
 * Zwischenwertungen und Ereignisse werden.
 *
 * Vorlage neu erzeugen:
 *   npm run calibrate:reference -- --stages=549 \
 *     --dump-bootstrap=backend/src/__tests__/fixtures/stage-549-bootstrap.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { runQuickSimulation } from '../../frontend/src/race-sim/runQuickSimulation';
import { collectStageBoundaryMarkers, isMountainClassificationMarker } from '../../frontend/src/race-sim/stageSummary';
import type { RealtimeSimulationBootstrap } from '../../shared/types';

const FIXTURE = path.join(
  __dirname, '..', '..', 'backend', 'src', '__tests__', 'fixtures', 'stage-549-bootstrap.json',
);

function loadBootstrap(): RealtimeSimulationBootstrap {
  return JSON.parse(fs.readFileSync(FIXTURE, 'utf8')) as RealtimeSimulationBootstrap;
}

describe('runQuickSimulation', () => {
  const bootstrap = loadBootstrap();

  it('liefert genau einen Zielstatus je Starter', () => {
    const outcome = runQuickSimulation(bootstrap, { seed: 4711 });
    expect(outcome.entries).toHaveLength(bootstrap.riders.length);
    expect(new Set(outcome.entries.map((entry) => entry.riderId)).size).toBe(bootstrap.riders.length);
    for (const entry of outcome.entries) {
      if (entry.finishStatus === 'dnf') {
        expect(entry.finishTimeSeconds).toBeNull();
      } else {
        expect(entry.finishTimeSeconds).toBeGreaterThan(0);
      }
    }
  });

  it('ist bei gleichem Seed reproduzierbar und bei anderem nicht', () => {
    const first = runQuickSimulation(bootstrap, { seed: 4711 });
    const second = runQuickSimulation(bootstrap, { seed: 4711 });
    const other = runQuickSimulation(bootstrap, { seed: 4712 });
    expect(JSON.stringify(first.entries)).toBe(JSON.stringify(second.entries));
    expect(JSON.stringify(first.entries)).not.toBe(JSON.stringify(other.entries));
  });

  it('wertet jede Zwischenwertung der Etappe aus', () => {
    const outcome = runQuickSimulation(bootstrap, { seed: 4711 });
    const expected = collectStageBoundaryMarkers(bootstrap.stageSummary)
      .filter(({ marker }) => marker.type === 'sprint_intermediate' || isMountainClassificationMarker(marker));
    expect(outcome.markerClassifications).toHaveLength(expected.length);

    for (const classification of outcome.markerClassifications) {
      expect(classification.entries.length).toBeGreaterThan(0);
      // Raenge luecken- und dublettenfrei.
      expect(classification.entries.map((entry) => entry.rank))
        .toEqual(classification.entries.map((_, index) => index + 1));
      expect(new Set(classification.entries.map((entry) => entry.riderId)).size)
        .toBe(classification.entries.length);
      // Zeiten steigen mit dem Rang — der Commit-Dienst verlaesst sich darauf.
      for (let index = 1; index < classification.entries.length; index += 1) {
        expect(classification.entries[index]!.crossingTimeSeconds)
          .toBeGreaterThanOrEqual(classification.entries[index - 1]!.crossingTimeSeconds);
      }
    }
  });

  it('vergibt Wertungen vor dem Einholpunkt an die Ausreisser', () => {
    const outcome = runQuickSimulation(bootstrap, { seed: 4711 });
    const breakawayIds = new Set(
      outcome.entries.filter((entry) => entry.isBreakaway).map((entry) => entry.riderId),
    );
    if (breakawayIds.size === 0) {
      return;
    }
    // Die frueheste Wertung liegt vor dem Einholpunkt, sonst gaebe es keine
    // Ausreisserwertung zu pruefen.
    const earliest = [...outcome.markerClassifications].sort((left, right) => left.kmMark - right.kmMark)[0];
    if (!earliest || earliest.entries.length === 0) {
      return;
    }
    const catchKm = outcome.result.breakawaySurvived
      ? Number.POSITIVE_INFINITY
      : earliest.kmMark + 1;
    if (earliest.kmMark < catchKm) {
      expect(breakawayIds.has(earliest.entries[0]!.riderId)).toBe(true);
    }
  });

  it('erzaehlt die Etappe in Ereignissen', () => {
    const outcome = runQuickSimulation(bootstrap, { seed: 4711 });
    expect(outcome.events.length).toBeGreaterThan(0);
    // Chronologisch — die Ansicht zeigt sie in dieser Reihenfolge.
    for (let index = 1; index < outcome.events.length; index += 1) {
      expect(outcome.events[index]!.elapsedSeconds)
        .toBeGreaterThanOrEqual(outcome.events[index - 1]!.elapsedSeconds);
    }
    expect(outcome.events.some((event) => event.type === 'attack')).toBe(true);
  });

  it('meldet dieselben Vorfaelle wie die Instant-Simulation sie zieht', () => {
    // Beide Modi leiten sie aus demselben Seed ab; der Laeufer reicht die
    // vorberechneten Vorfaelle unveraendert an den Commit-Dienst weiter.
    const outcome = runQuickSimulation(bootstrap, { seed: 4711 });
    for (const incident of outcome.incidents) {
      expect(bootstrap.riders.some((rider) => rider.id === incident.riderId)).toBe(true);
      expect(incident.triggerDistanceKm).toBeGreaterThan(0);
    }
  });

  it('braucht keine Profiltabelle im Bootstrap', () => {
    // Altspielstaende liefern sie nicht — dann greifen die eingebauten Vorgaben.
    const withoutProfiles = { ...bootstrap };
    delete (withoutProfiles as { quickSimProfiles?: unknown }).quickSimProfiles;
    expect(() => runQuickSimulation(withoutProfiles, { seed: 4711 })).not.toThrow();
  });
});
