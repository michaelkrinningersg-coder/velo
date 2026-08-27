import { describe, expect, it } from 'vitest';
import {
  AUTO_SELECT_AFTER_MS,
  AUTO_SELECT_MAX_AGE,
  AUTO_SELECT_SHARE,
  resolveAutoSelection,
} from '../../../shared/contractRenewalAutoSelect';

const kandidat = (riderId: number, age: number, overallRating: number) => ({ riderId, age, overallRating });

describe('Automatische Auswahl der Verlaengerungsziele', () => {
  it('haelt die vorgegebenen Groessen', () => {
    expect(AUTO_SELECT_AFTER_MS).toBe(5 * 60 * 1000);
    expect(AUTO_SELECT_MAX_AGE).toBe(32);
    expect(AUTO_SELECT_SHARE).toBe(0.75);
  });

  it('waehlt keinen Fahrer ab dem Alterslimit', () => {
    const liste = [
      kandidat(1, 31, 80), kandidat(2, 32, 90), kandidat(3, 35, 95), kandidat(4, 24, 70),
    ];
    const raus = resolveAutoSelection(liste);
    expect(raus).not.toContain(2);
    expect(raus).not.toContain(3);
    // Von den beiden Jungen bleiben drei Viertel, aufgerundet also zwei.
    expect(raus.sort()).toEqual([1, 4]);
  });

  it('nimmt von den uebrigen die besten drei Viertel', () => {
    const liste = Array.from({ length: 12 }, (_, i) => kandidat(i + 1, 25, 90 - i));
    const raus = resolveAutoSelection(liste);
    expect(raus).toHaveLength(9);
    // Die neun besten, in absteigender Wertung.
    expect(raus).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('entscheidet Gleichstand nach der Fahrer-Id und haengt nicht an der Eingabereihenfolge', () => {
    const liste = [kandidat(9, 26, 75), kandidat(3, 26, 75), kandidat(7, 26, 75), kandidat(5, 26, 75)];
    const raus = resolveAutoSelection(liste);
    expect(raus).toEqual([3, 5, 7]);
    expect(resolveAutoSelection([...liste].reverse())).toEqual(raus);
  });

  it('kommt mit leeren und mit lauter alten Listen zurecht', () => {
    expect(resolveAutoSelection([])).toEqual([]);
    expect(resolveAutoSelection([kandidat(1, 33, 90), kandidat(2, 40, 88)])).toEqual([]);
  });

  it('waehlt aus einem einzelnen jungen Fahrer diesen einen', () => {
    expect(resolveAutoSelection([kandidat(1, 22, 70)])).toEqual([1]);
  });
});
