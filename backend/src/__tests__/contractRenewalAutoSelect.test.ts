import { describe, expect, it } from 'vitest';
import {
  AUTO_SELECT_AFTER_MS,
  AUTO_SELECT_MAX_AGE,
  AUTO_SELECT_SHARE,
  resolveAutoSelection,
} from '../../../shared/contractRenewalAutoSelect';

const kandidat = (riderId: number, age: number, potential: number) => ({ riderId, age, potential });

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

  it('nimmt von den uebrigen drei Viertel, nach Potenzial', () => {
    const liste = Array.from({ length: 12 }, (_, i) => kandidat(i + 1, 25, 90 - i));
    const raus = resolveAutoSelection(liste);
    expect(raus).toHaveLength(9);
    // Die neun mit dem hoechsten Potenzial, absteigend.
    expect(raus).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('entscheidet nach dem Potenzial, nicht nach der Gesamtwertung', () => {
    // Der Junge faehrt heute schwaecher, hat aber die groessere Zukunft.
    const liste = [
      { riderId: 1, age: 30, potential: 74 },
      { riderId: 2, age: 22, potential: 82 },
      { riderId: 3, age: 29, potential: 73 },
      { riderId: 4, age: 24, potential: 79 },
    ];
    expect(resolveAutoSelection(liste)).toEqual([2, 4, 1]);
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
