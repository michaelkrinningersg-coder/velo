import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FLAG_CODE_BY_CODE3 } from '../../../shared/flagCodes';

/**
 * Jedes Land aus country.csv braucht eine Flaggen-Zuordnung.
 *
 * renderFlag liefert fuer unbekannte Codes einen leeren String — die Flagge
 * fehlt dann wortlos. So blieben 92 der 138 Laender ohne Flagge, darunter
 * Andorra und Liechtenstein, bis es jemandem im Spiel auffiel. Dieser Test
 * schlaegt an, sobald ein Land ohne Zuordnung dazukommt.
 */
describe('Flaggen-Tabelle', () => {
  const csv = readFileSync(join(__dirname, '../../../data/csv/country.csv'), 'utf8');
  const zeilen = csv.trim().split(/\r?\n/);
  const spalten = zeilen[0]!.split(',');
  const spalteCode = spalten.indexOf('code_3');
  const laender = zeilen.slice(1).map((zeile) => {
    const felder = zeile.split(',');
    return { code: felder[spalteCode]!.trim(), name: felder[spalten.indexOf('name')]!.trim() };
  });

  it('liest die Laenderliste ueberhaupt ein', () => {
    expect(spalteCode).toBeGreaterThanOrEqual(0);
    expect(laender.length).toBeGreaterThan(100);
  });

  it('kennt jedes Land aus country.csv', () => {
    const ohne = laender.filter((l) => !FLAG_CODE_BY_CODE3[l.code]).map((l) => `${l.code} (${l.name})`);
    expect(ohne).toEqual([]);
  });

  it('nutzt durchweg zweistellige Kleinbuchstaben-Codes', () => {
    const falsch = Object.entries(FLAG_CODE_BY_CODE3)
      .filter(([, alpha2]) => !/^[a-z]{2}$/.test(alpha2))
      .map(([code3, alpha2]) => `${code3} -> ${alpha2}`);
    expect(falsch).toEqual([]);
  });
});
