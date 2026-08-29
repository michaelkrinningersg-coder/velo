import type Database from 'better-sqlite3';
import {
  POT_PRESET_SKILL_COLUMNS,
  resolveNewgenPresetTier,
  resolvePresetMidOverall,
} from '../../../shared/newgenPresetTiers';
import {
  OHNE_VERTRAG_NEIGUNG,
  istPresetVertraeglich,
  waehlePreset,
  ziehePotenziale,
  type PresetSpanne,
} from '../../../shared/potentialAssignment';
import { calcRiderOverall } from '../../../shared/riderOverall';
import { tableExists, columnExists, RIDER_SKILL_COLUMNS } from '../db/mappers';

/** Marke des einmaligen Laufs, siehe `one_time_migrations`. */
export const POTENTIAL_ASSIGNMENT_MARK = 'bestandsfahrer-potenziale-aus-presets';

export interface PotentialAssignmentReport {
  /** Fahrer, deren Potenzial auf ihr Koennen gesetzt wurde (Zielalter erreicht). */
  amZiel: number;
  /** Fahrer, die ein Preset bekommen haben. */
  zugeordnet: number;
  /** Fahrer vor dem Zielalter, fuer die kein freies Preset passte. */
  ohnePreset: number;
}

/**
 * Ordnet Bestandsfahrern Potenziale aus den Newgen-Presets zu.
 *
 * Betroffen ist, wer keinen Preset-Schluessel traegt — die Fahrer aus
 * `riders.csv` und die Newgens, deren alter Verweis sich nicht bestaetigen
 * liess. Genau diese Fahrer sind fuer den Deckel je Spitzen-Preset unsichtbar.
 *
 * Der Lauf findet genau einmal je Spielstand statt. Er zieht Zufallszahlen; ein
 * zweiter Lauf wuerde dieselben Fahrer neu wuerfeln und ihre Entwicklung
 * ruckartig verschieben.
 */
export class PotentialAssignmentService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public wurdeAusgefuehrt(): boolean {
    if (!tableExists(this.db, 'one_time_migrations')) return false;
    return this.db.prepare('SELECT 1 FROM one_time_migrations WHERE key = ?')
      .get(POTENTIAL_ASSIGNMENT_MARK) != null;
  }

  public weiseZu(currentSeason: number, zufall: () => number = Math.random): PotentialAssignmentReport | null {
    const leer: PotentialAssignmentReport = { amZiel: 0, zugeordnet: 0, ohnePreset: 0 };
    if (!tableExists(this.db, 'riders') || !tableExists(this.db, 'newgen_potential_presets')) return null;
    if (!columnExists(this.db, 'riders', 'pot_preset_key')) return null;

    const spalten = [...POT_PRESET_SKILL_COLUMNS];
    const presetZeilen = this.db.prepare(`
      SELECT display_name, weight,
             ${spalten.flatMap((s) => [`min_pot_${s}`, `max_pot_${s}`]).join(', ')}
      FROM newgen_potential_presets
    `).all() as Array<Record<string, number | string>>;
    if (presetZeilen.length === 0) return null;

    const presets: PresetSpanne[] = presetZeilen.map((zeile) => ({
      displayName: String(zeile['display_name']),
      weight: Number(zeile['weight'] ?? 1),
      midOverall: resolvePresetMidOverall(zeile),
      min: Object.fromEntries(spalten.map((s) => [s, Number(zeile[`min_pot_${s}`] ?? 0)])),
      max: Object.fromEntries(spalten.map((s) => [s, Number(zeile[`max_pot_${s}`] ?? 0)])),
    }));

    // Deckel je Spitzen-Preset — dieselbe Regel wie bei den Newgens, aber
    // strenger: dieser Lauf darf hoechstens EINEN Fahrer je Spitzen-Preset
    // setzen, nicht den vollen Deckel.
    //
    // Der Grund steckt im Zeitverlauf. Ein volles Preset ist fuer Newgens
    // gesperrt. Mit dem vollen Deckel belegte dieser Lauf auf einen Schlag 86
    // von 281 gedeckelten Presets vollstaendig (465 Fahrer) — und sperrte
    // damit den Nachwuchs an der Spitze fuer Jahrzehnte aus, bis diese Kohorte
    // ausgelaufen war. Im 45-Jahres-Lauf gemessen stieg die Zahl der Fahrer mit
    // einem Potenzial ueber 77 dadurch langsam von 60 auf ueber 100, statt zu
    // stehen. Der Rest des Deckels bleibt jetzt fuer kuenftige Jahrgaenge frei.
    const deckel = new Map<string, number>();
    for (const zeile of presetZeilen) {
      const stufe = resolveNewgenPresetTier(resolvePresetMidOverall(zeile)).deckel;
      if (stufe !== null) deckel.set(String(zeile['display_name']), Math.min(1, stufe));
    }
    const bestand = new Map<string, number>();
    for (const zeile of this.db.prepare(`
      SELECT pot_preset_key AS k, COUNT(*) AS n FROM riders
      WHERE is_retired = 0 AND pot_preset_key IS NOT NULL GROUP BY pot_preset_key
    `).all() as Array<{ k: string; n: number }>) bestand.set(zeile.k, zeile.n);
    const istFrei = (preset: PresetSpanne): boolean => {
      const grenze = deckel.get(preset.displayName);
      return grenze === undefined || (bestand.get(preset.displayName) ?? 0) < grenze;
    };

    const fahrer = this.db.prepare(`
      SELECT r.id, r.birth_year, r.peak_age, r.overall_rating,
             EXISTS (
               SELECT 1 FROM contracts c
               WHERE c.rider_id = r.id AND c.status IN ('active', 'future')
                 AND c.end_season >= ${currentSeason}
             ) AS imTeam,
             ${spalten.map((s) => `r.skill_${s}`).join(', ')}
      FROM riders r
      WHERE r.is_retired = 0 AND r.pot_preset_key IS NULL
    `).all() as Array<Record<string, number>>;

    const setzePotenziale = this.db.prepare(`
      UPDATE riders SET pot_overall = ?, pot_preset_key = ?,
        ${spalten.map((s) => `pot_${s} = ?`).join(', ')}
      WHERE id = ?
    `);

    const bericht = { ...leer };
    this.db.transaction(() => {
      for (const zeile of fahrer) {
        const skills = Object.fromEntries(spalten.map((s) => [s, Number(zeile[`skill_${s}`] ?? 0)]));
        const alter = currentSeason - Number(zeile['birth_year']);
        const zielAlter = Number(zeile['peak_age'] ?? 0);

        // Am Zielalter waechst nichts mehr. Das Potenzial ist dann das Koennen,
        // und ein Preset waere eine Behauptung ueber eine Entwicklung, die nicht
        // mehr stattfindet — deshalb bleibt der Schluessel hier leer.
        if (zielAlter > 0 && alter >= zielAlter) {
          setzePotenziale.run(
            this.gesamt(skills), null, ...spalten.map((s) => skills[s]!), zeile['id'],
          );
          bericht.amZiel += 1;
          continue;
        }

        const kandidaten = presets.filter((p) => istPresetVertraeglich(p, skills, spalten) && istFrei(p));
        // Ein Fahrer ohne Vertrag ist der, den kein Team wollte. Seine Auswahl
        // zieht zu Presets nahe seinem heutigen Koennen, und innerhalb der
        // Spanne zum unteren Rand — statt gleichverteilt ueber den halben
        // Katalog samt Spitze.
        const imTeam = zeile['imTeam'] === 1;
        const preset = waehlePreset(
          kandidaten, zufall, imTeam ? undefined : Number(zeile['overall_rating'] ?? 0),
        );
        if (preset == null) {
          // Kein freies, vertraegliches Preset — der Fahrer behaelt, was er hat.
          bericht.ohnePreset += 1;
          continue;
        }

        const potenziale = ziehePotenziale(
          preset, skills, spalten, zufall, imTeam ? 1 : OHNE_VERTRAG_NEIGUNG,
        );
        setzePotenziale.run(
          this.gesamt(potenziale), preset.displayName,
          ...spalten.map((s) => potenziale[s]!), zeile['id'],
        );
        bestand.set(preset.displayName, (bestand.get(preset.displayName) ?? 0) + 1);
        bericht.zugeordnet += 1;
      }
      this.db.prepare(`
        INSERT OR IGNORE INTO one_time_migrations (key, applied_at) VALUES (?, datetime('now'))
      `).run(POTENTIAL_ASSIGNMENT_MARK);
    })();

    return bericht;
  }

  /** Gesamtwertung aus einem Satz Werte, mit derselben Formel wie ueberall. */
  private gesamt(werte: Record<string, number>): number {
    const nachSchluessel: Record<string, number> = {};
    for (const [key, spalte] of RIDER_SKILL_COLUMNS) nachSchluessel[key] = werte[spalte] ?? 0;
    return calcRiderOverall(nachSchluessel as never);
  }
}
