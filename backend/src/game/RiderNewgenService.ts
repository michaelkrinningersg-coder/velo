import { Database } from 'better-sqlite3';
import {
  resolveNewgenPresetTier,
  resolvePresetMidOverall,
} from '../../../shared/newgenPresetTiers';
import { calcRiderOverall } from '../../../shared/riderOverall';

export class RiderNewgenService {
  constructor(private db: Database) {}

  public createYearStartNewgens(season: number) {
    this.db.transaction(() => {
      // 1. LÃ¤nder mit aktiven Regen-Raten (Limits) abrufen
      const countries = this.db.prepare(`
        SELECT id, number_regen_min, number_regen_max
        FROM sta_country
        WHERE number_regen_max > 0
      `).all() as any[];

      // 2. Presets aus der DB laden
      const startPresets = this.db.prepare(`SELECT * FROM newgen_start_presets`).all() as any[];
      const potPresets = this.db.prepare(`SELECT * FROM newgen_potential_presets`).all() as any[];

      if (startPresets.length === 0 || potPresets.length === 0) {
        console.warn('Keine Newgen-Presets in der Datenbank gefunden. Ãœberspringe Newgen-Generierung.');
        return;
      }

      // Skills dynamisch aus den Spaltennamen der Presets extrahieren (z. B. "min_flat" -> "flat")
      const presetCols = Object.keys(startPresets[0]);
      const skillKeys = presetCols
        .filter(c => c.startsWith('min_'))
        .map(c => c.replace('min_', ''));

      // Gesamte Start-Gewichtung vorberechnen
      const totalStartWeight = startPresets.reduce((sum, p) => sum + (p.weight || 1), 0);

      // Deckel je Spitzen-Preset: aus einem starken Preset duerfen hoechstens
      // so viele Fahrer gleichzeitig aktiv sein, wie seine Stufe erlaubt.
      // Fahrer in Rente zaehlen nicht mit, ihr Platz wird wieder frei.
      //
      // Gezaehlt wird ueber den Preset-NAMEN, nicht ueber die Zeilen-ID: die
      // Preset-Tabelle wird bei jedem Laden aus der CSV neu befuellt, eine
      // gespeicherte ID zeigt nach einem Umbau der CSV auf eine andere Zeile.
      // Der Deckel haette dann auf die falschen Toepfe gezaehlt.
      const deckelJePreset = new Map<string, number>();
      for (const preset of potPresets) {
        const deckel = resolveNewgenPresetTier(resolvePresetMidOverall(preset)).deckel;
        if (deckel !== null) deckelJePreset.set(String(preset.display_name), deckel);
      }
      const bestandJePreset = new Map<string, number>();
      if (deckelJePreset.size > 0 && this.columnExists('riders', 'pot_preset_key')) {
        const rows = this.db.prepare(`
          SELECT pot_preset_key AS presetKey, COUNT(*) AS anzahl
          FROM riders
          WHERE is_retired = 0 AND pot_preset_key IS NOT NULL
          GROUP BY pot_preset_key
        `).all() as Array<{ presetKey: string; anzahl: number }>;
        for (const row of rows) bestandJePreset.set(String(row.presetKey), Number(row.anzahl));
      }
      const istVoll = (preset: any): boolean => {
        const deckel = deckelJePreset.get(String(preset.display_name));
        if (deckel === undefined) return false;
        return (bestandJePreset.get(String(preset.display_name)) ?? 0) >= deckel;
      };

      const typeRows = this.db.prepare(`SELECT id, type_key FROM type_rider`).all() as any[];
        const typeMap = new Map<string, number>();
        for (const t of typeRows) typeMap.set(t.type_key, t.id);

        let newgenCount = 0;

      // Dynamisches Insert-Statement vorbereiten
      const skillColumns = skillKeys.map(k => `skill_${k}`).join(', ');
      const potColumns = skillKeys.map(k => `pot_${k}`).join(', ');
      const valuePlaceholders = skillKeys.map(() => '?').join(', ');

      const insertRider = this.db.prepare(`
        INSERT INTO riders (
          first_name, last_name, country_id, birth_year,
          is_retired, skill_development, rider_type_id,
          overall_rating, pot_overall,
          weather_profile_id, pot_preset_id, pot_preset_key,
          ${skillColumns},
          ${potColumns}
        ) VALUES (
          ?, ?, ?, ?,
          0, ?, ?,
          ?, ?,
          ?, ?, ?,
          ${valuePlaceholders},
          ${valuePlaceholders}
        )
      `);

      // Anzahl je Land vorab ziehen: der Jahrgang muss seine Groesse kennen,
      // bevor die Stufenziele daraus folgen.
      const anzahlJeLand = new Map<number, number>();
      let jahrgangsgroesse = 0;
      for (const country of countries) {
        const anzahl = this.getRandomInt(country.number_regen_min, country.number_regen_max);
        anzahlJeLand.set(country.id, anzahl);
        if (anzahl > 0) jahrgangsgroesse += anzahl;
      }

      // Quote je Stufe statt unabhaengiger Ziehung.
      //
      // Bisher zog jeder Newgen sein Preset einzeln nach Gewicht. Die
      // Stufenanteile stimmten dann nur im Erwartungswert: bei 160 Newgens und
      // 21 Prozent starken sind das 34 plus/minus 5 je Jahrgang. Fuer das
      // Potenzial mittelt sich das ueber alle Jahrgaenge im Feld weg, fuer die
      // Gesamtwertung nicht — ueber 74 kommt nur, wer gerade nahe seinem Zenit
      // ist, also vier bis sechs Jahrgaenge gleichzeitig. Gemessen schwankte
      // die Zahl der Fahrer ueber 74 dadurch um zwoelf Prozent.
      //
      // Jetzt fuehrt der Jahrgang Buch: das Gewicht einer Stufe faellt, sobald
      // ihr Soll erreicht ist. Weich, nicht als harte Sperre — die
      // vertraeglichen Presets eines Fahrers haengen an seinen Startwerten, ein
      // starres Kontingent waere nicht immer erfuellbar.
      const stufeJePreset = new Map<number, string>();
      const sollJeStufe = new Map<string, number>();
      const istJeStufe = new Map<string, number>();
      for (const preset of potPresets) {
        const stufe = resolveNewgenPresetTier(resolvePresetMidOverall(preset));
        stufeJePreset.set(Number(preset.preset_id), stufe.key);
        if (!sollJeStufe.has(stufe.key)) {
          sollJeStufe.set(stufe.key, jahrgangsgroesse * stufe.zielanteil);
          istJeStufe.set(stufe.key, 0);
        }
      }
      const quotenFaktor = (preset: any): number => {
        const stufe = stufeJePreset.get(Number(preset.preset_id));
        if (stufe == null) return 1;
        const soll = sollJeStufe.get(stufe) ?? 0;
        const ist = istJeStufe.get(stufe) ?? 0;
        return (Math.max(0, soll - ist) + 1) / (soll + 1);
      };

      for (const country of countries) {
        const numToGenerate = anzahlJeLand.get(country.id) ?? 0;
        if (numToGenerate <= 0) continue;

        // Namen fÃ¼r das aktuelle Land abrufen
        const firstNames = this.db.prepare(`
          SELECT value, weight
          FROM rider_names
          WHERE country_id = ? AND type = 'first'
        `).all(country.id) as any[];

        const lastNames = this.db.prepare(`
          SELECT value, weight
          FROM rider_names
          WHERE country_id = ? AND type = 'last'
        `).all(country.id) as any[];

        const fallbackFirstNames = firstNames.length > 0 ? firstNames : [{ value: 'New' }];
        const fallbackLastNames = lastNames.length > 0 ? lastNames : [{ value: 'Gen' }];

        for (let i = 0; i < numToGenerate; i++) {
          // Start-Werte auswÃ¼rfeln
          const startPreset = this.pickWeighted(startPresets, totalStartWeight);
          const startValues: Record<string, number> = {};

          for (const key of skillKeys) {
            startValues[key] = this.getRandomInt(startPreset[`min_${key}`], startPreset[`max_${key}`]);
          }

          // Potenzial-Presets filtern, die logisch zu den Startwerten passen.
          //
          // Der Filter hiess frueher `max_${key}` — so heissen die Spalten der
          // Startwert-Presets, nicht die der Potenzial-Presets. Der Vergleich
          // war damit immer `undefined >= x`, also falsch; die Liste blieb leer
          // und der Backoff darunter griff jedes Mal. Faktisch wurde
          // gleichverteilt aus allen Presets gezogen und das Gewicht ignoriert.
          const validPotPresets = potPresets.filter((preset) => (
            skillKeys.every((key) => Number(preset[`max_pot_${key}`] ?? 0) >= startValues[key])
          ));

          // Presets, deren Deckel erreicht ist, fallen fuer diesen Zug weg.
          // Bleibt dadurch nichts uebrig, gilt der Deckel fuer diesen einen Zug
          // nicht: ein Newgen-Jahrgang darf nie ausfallen, weil der Pool klemmt.
          const freiePotPresets = validPotPresets.filter((preset) => !istVoll(preset));
          const auswahl = freiePotPresets.length > 0 ? freiePotPresets : validPotPresets;

          let potPreset: any;
          if (auswahl.length === 0) {
            // Backoff: Notfall-Preset nehmen, wenn keines perfekt passt
            potPreset = potPresets[Math.floor(Math.random() * potPresets.length)];
          } else {
            const gewichtet = auswahl.map((p) => ({ ...p, weight: (p.weight || 1) * quotenFaktor(p) }));
            const totalPotWeight = gewichtet.reduce((sum, p) => sum + p.weight, 0);
            const gewaehlt = this.pickWeighted(gewichtet, totalPotWeight);
            // pickWeighted liefert die Kopie — das Original tragen wir weiter.
            potPreset = auswahl.find((p) => p.preset_id === gewaehlt.preset_id) ?? gewaehlt;
          }
          const potPresetId = Number(potPreset.preset_id);
          const potPresetKey = String(potPreset.display_name);
          bestandJePreset.set(potPresetKey, (bestandJePreset.get(potPresetKey) ?? 0) + 1);
          const gezogeneStufe = stufeJePreset.get(potPresetId);
          if (gezogeneStufe != null) {
            istJeStufe.set(gezogeneStufe, (istJeStufe.get(gezogeneStufe) ?? 0) + 1);
          }

          const potValues: Record<string, number> = {};
          for (const key of skillKeys) {
            // Potenzial muss zwingend Ã¼ber oder gleich dem Startwert liegen
            const minPot = Math.max(startValues[key] + 1, potPreset[`min_pot_${key}`] || startValues[key] + 1);
            const maxPot = Math.max(minPot, potPreset[`max_pot_${key}`] || minPot);
            potValues[key] = this.getRandomInt(minPot, maxPot);
            
            // Max-Cap bei 85 gemÃ¤ÃŸ Plan
            potValues[key] = Math.min(85, potValues[key]);
          }

          // Namen, Alter und Skill-Development setzen
          let firstNameObj, lastNameObj;
          
          if (fallbackFirstNames[0].value === 'New') {
            firstNameObj = fallbackFirstNames[0];
          } else {
            const totalFirstWeight = fallbackFirstNames.reduce((sum, n) => sum + (n.weight || 1), 0);
            firstNameObj = this.pickWeighted(fallbackFirstNames, totalFirstWeight);
          }

          if (fallbackLastNames[0].value === 'Gen') {
            lastNameObj = fallbackLastNames[0];
          } else {
            const totalLastWeight = fallbackLastNames.reduce((sum, n) => sum + (n.weight || 1), 0);
            lastNameObj = this.pickWeighted(fallbackLastNames, totalLastWeight);
          }

          const birthYear = season - 16;
          const skillDev = this.getRandomInt(1, 20);

          // Dieselbe Formel wie im RiderDevelopmentService. Sie standen frueher
          // zweimal im Code und rechneten verschieden — die Gesamtwertung eines
          // Newgens sprang deshalb beim ersten Entwicklungsschritt.
          const calcOverall = (vals: Record<string, number>) => calcRiderOverall({
            flat: vals['flat'] ?? 50,
            mountain: vals['mountain'] ?? 50,
            mediumMountain: vals['medium_mountain'] ?? 50,
            hill: vals['hill'] ?? 50,
            timeTrial: vals['time_trial'] ?? 50,
            cobble: vals['cobble'] ?? 50,
            sprint: vals['sprint'] ?? 50,
            stamina: vals['stamina'] ?? 50,
            resistance: vals['resistance'] ?? 50,
            recuperation: vals['recuperation'] ?? 50,
            acceleration: vals['acceleration'] ?? 50,
          });

          const overallRating = calcOverall(startValues);
          const potOverall = calcOverall(potValues);
          const weatherProfileId = this.getRandomInt(1, 7);

          const insertParams = [
            firstNameObj.value,
            lastNameObj.value,
            country.id,
            birthYear,
            skillDev,
            typeMap.get(startPreset.type_key) || 1,
            overallRating,
            potOverall,
            weatherProfileId,
            // Die ID bleibt als Spur der Erzeugung stehen, massgeblich ist der Name.
            potPresetId,
            potPresetKey
          ];

          for (const key of skillKeys) insertParams.push(startValues[key]);
          for (const key of skillKeys) insertParams.push(potValues[key]);

          insertRider.run(...insertParams);
          newgenCount++;
        }
      }

      console.log(`[RiderNewgenService] ${newgenCount} neue Newgen-Fahrer fÃ¼r Saison ${season} generiert.`);
    })();
  }

  private columnExists(table: string, column: string): boolean {
    const rows = this.db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
    return rows.some((row) => row.name === column);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private pickWeighted(items: any[], totalWeight: number): any {
    let r = Math.random() * totalWeight;
    for (const item of items) {
      r -= (item.weight || 1);
      if (r <= 0) return item;
    }
    return items[items.length - 1];
  }
}