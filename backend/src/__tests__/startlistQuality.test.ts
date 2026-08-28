import { describe, expect, it } from 'vitest';
import { computeStartlistQuality } from '../../../shared/startlistQuality';

/**
 * Der Wert misst den Anteil am staerkstmoeglichen Feld *derselben* Saison.
 * Ein roher Punktesumme taugt nicht: Karrierepunkte wachsen monoton, sie
 * stiege damit jedes Jahr unabhaengig davon, wer am Start steht.
 */
describe('Qualitaet der Startliste', () => {
  it('gibt 100, wenn die Besten des Feldes alle am Start sind', () => {
    const e = computeStartlistQuality({ starterPoints: [500, 300, 200], fieldPoints: [500, 300, 200, 100, 50] });
    expect(e.score).toBe(100);
    expect(e.rawPoints).toBe(1000);
    expect(e.maxPoints).toBe(1000);
    expect(e.starters).toBe(3);
  });

  it('misst gegen die Starterzahl, nicht gegen eine feste Feldgroesse', () => {
    // Drei Starter mit zusammen 300 gegen die besten drei des Feldes (1000).
    const e = computeStartlistQuality({ starterPoints: [100, 100, 100], fieldPoints: [500, 300, 200, 100, 100, 100] });
    expect(e.maxPoints).toBe(1000);
    expect(e.score).toBe(30);
  });

  it('bestraft ein grosses schwaches Feld nicht doppelt', () => {
    // Doppelt so viele Starter, dieselbe relative Staerke -> derselbe Wert.
    const klein = computeStartlistQuality({ starterPoints: [50, 50], fieldPoints: [100, 100, 50, 50] });
    const gross = computeStartlistQuality({ starterPoints: [50, 50, 50, 50], fieldPoints: [100, 100, 100, 100, 50, 50, 50, 50] });
    expect(klein.score).toBe(50);
    expect(gross.score).toBe(50);
  });

  it('liefert keinen Wert, solange niemand Punkte hat', () => {
    const e = computeStartlistQuality({ starterPoints: [0, 0, 0], fieldPoints: [0, 0, 0, 0] });
    expect(e.score).toBeNull();
    expect(e.rawPoints).toBe(0);
    expect(e.maxPoints).toBe(0);
  });

  it('liefert keinen Wert ohne Starter', () => {
    expect(computeStartlistQuality({ starterPoints: [], fieldPoints: [100, 50] }).score).toBeNull();
  });

  it('bleibt bei 100, wenn das Feld kleiner ist als die Starterliste', () => {
    // Kann in der Praxis nicht vorkommen - die Starter sind Teil des Feldes -
    // darf aber nie ueber 100 laufen.
    const e = computeStartlistQuality({ starterPoints: [100, 100, 100], fieldPoints: [100, 100] });
    expect(e.score).toBe(100);
  });

  it('zaehlt negative Punkte als null', () => {
    const e = computeStartlistQuality({ starterPoints: [-10, 100], fieldPoints: [100, 100] });
    expect(e.rawPoints).toBe(100);
    expect(e.score).toBe(50);
  });

  it('rundet auf eine Nachkommastelle', () => {
    const e = computeStartlistQuality({ starterPoints: [1], fieldPoints: [3] });
    expect(e.score).toBe(33.3);
  });
});
