import { describe, expect, it } from 'vitest';
import {
  createSeededRandom,
  deriveSeed,
  pickRandom,
  randomBetween,
  randomInteger,
  shuffled,
} from '../../../shared/rng';

describe('createSeededRandom', () => {
  it('liefert bei gleichem Seed dieselbe Folge', () => {
    const first = createSeededRandom(12345);
    const second = createSeededRandom(12345);
    const a = Array.from({ length: 200 }, () => first());
    const b = Array.from({ length: 200 }, () => second());
    expect(a).toEqual(b);
  });

  it('liefert bei anderem Seed eine andere Folge', () => {
    const a = Array.from({ length: 50 }, createSeededRandom(1));
    const b = Array.from({ length: 50 }, createSeededRandom(2));
    expect(a).not.toEqual(b);
  });

  it('bleibt im Bereich [0, 1)', () => {
    const random = createSeededRandom(987654321);
    for (let index = 0; index < 10_000; index += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('ist grob gleichverteilt', () => {
    const random = createSeededRandom(4242);
    const buckets = new Array<number>(10).fill(0);
    const draws = 100_000;
    for (let index = 0; index < draws; index += 1) {
      buckets[Math.floor(random() * 10)] += 1;
    }
    // Erwartung je Eimer 10 000; grosszuegige Schranke, die einen kaputten
    // Generator sicher faengt, aber nicht bei normaler Streuung ausschlaegt.
    for (const count of buckets) {
      expect(count).toBeGreaterThan(draws / 10 * 0.9);
      expect(count).toBeLessThan(draws / 10 * 1.1);
    }
  });

  it('verkraftet Seed 0 und sehr grosse Seeds', () => {
    expect(() => Array.from({ length: 10 }, createSeededRandom(0))).not.toThrow();
    const values = Array.from({ length: 10 }, createSeededRandom(0));
    expect(new Set(values).size).toBeGreaterThan(1);
    expect(Array.from({ length: 5 }, createSeededRandom(0xFFFFFFFF)).every((v) => v >= 0 && v < 1)).toBe(true);
  });
});

describe('deriveSeed', () => {
  it('ist stabil fuer dieselbe Kombination', () => {
    expect(deriveSeed(777, 'incidents')).toBe(deriveSeed(777, 'incidents'));
  });

  it('trennt Teilsysteme voneinander', () => {
    const seed = 777;
    const labels = ['incidents', 'breakaway', 'attacks', 'special-form', 'engine'];
    const derived = labels.map((label) => deriveSeed(seed, label));
    expect(new Set(derived).size).toBe(labels.length);
  });

  it('trennt Etappen voneinander', () => {
    expect(deriveSeed(1, 'engine')).not.toBe(deriveSeed(2, 'engine'));
  });

  it('liefert eine vorzeichenlose 32-Bit-Zahl', () => {
    for (const seed of [0, 1, 999_999, 0xFFFFFFFF]) {
      const value = deriveSeed(seed, 'engine');
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(0xFFFFFFFF);
    }
  });
});

describe('Hilfsfunktionen', () => {
  it('randomBetween bleibt in den Grenzen', () => {
    const random = createSeededRandom(5);
    for (let index = 0; index < 1000; index += 1) {
      const value = randomBetween(random, 3, 9);
      expect(value).toBeGreaterThanOrEqual(3);
      expect(value).toBeLessThan(9);
    }
  });

  it('randomInteger schliesst beide Grenzen ein', () => {
    const random = createSeededRandom(6);
    const seen = new Set<number>();
    for (let index = 0; index < 2000; index += 1) {
      seen.add(randomInteger(random, 2, 5));
    }
    expect([...seen].sort()).toEqual([2, 3, 4, 5]);
  });

  it('pickRandom liefert undefined bei leerer Liste', () => {
    expect(pickRandom(createSeededRandom(7), [])).toBeUndefined();
  });

  it('shuffled behaelt alle Elemente und laesst das Original unberuehrt', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = shuffled(createSeededRandom(8), original);
    expect(result).toHaveLength(original.length);
    expect([...result].sort((a, b) => a - b)).toEqual(original);
    expect(original).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('shuffled ist bei gleichem Seed reproduzierbar', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(shuffled(createSeededRandom(9), values)).toEqual(shuffled(createSeededRandom(9), values));
  });

  it('shuffled verteilt Positionen ungefaehr gleichmaessig', () => {
    // Fisher-Yates muss jedes Element etwa gleich haeufig auf Position 0 legen.
    // Ein sort(() => rng() - 0.5) wuerde hier durchfallen.
    const random = createSeededRandom(10);
    const counts = new Map<number, number>();
    const draws = 20_000;
    for (let index = 0; index < draws; index += 1) {
      const first = shuffled(random, [1, 2, 3, 4])[0] as number;
      counts.set(first, (counts.get(first) ?? 0) + 1);
    }
    for (const value of [1, 2, 3, 4]) {
      const count = counts.get(value) ?? 0;
      expect(count).toBeGreaterThan(draws / 4 * 0.9);
      expect(count).toBeLessThan(draws / 4 * 1.1);
    }
  });
});
