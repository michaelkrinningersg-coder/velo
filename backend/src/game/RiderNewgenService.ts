import { Database } from 'better-sqlite3';

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
          weather_profile_id,
          ${skillColumns},
          ${potColumns}
        ) VALUES (
          ?, ?, ?, ?,
          0, ?, ?,
          ?, ?,
          ?,
          ${valuePlaceholders},
          ${valuePlaceholders}
        )
      `);

      for (const country of countries) {
        const numToGenerate = this.getRandomInt(country.number_regen_min, country.number_regen_max);
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

          // Potenzial-Presets filtern, die logisch zu den Startwerten passen
          let validPotPresets = potPresets.filter(p => {
            return skillKeys.every(key => p[`max_${key}`] >= startValues[key]);
          });

          let potPreset: any;
          if (validPotPresets.length === 0) {
            // Backoff: Notfall-Preset nehmen, wenn keines perfekt passt
            potPreset = potPresets[Math.floor(Math.random() * potPresets.length)];
          } else {
            const totalPotWeight = validPotPresets.reduce((sum, p) => sum + (p.weight || 1), 0);
            potPreset = this.pickWeighted(validPotPresets, totalPotWeight);
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

          const calcOverall = (vals: Record<string, number>) => {
            const sum = (vals['flat'] || 50) + (vals['mountain'] || 50) + (vals['medium_mountain'] || 50) +
                        (vals['hill'] || 50) + (vals['time_trial'] || 50) + (vals['cobble'] || 50) +
                        ((vals['sprint'] || 50) * 1.2) + (vals['stamina'] || 50) + (vals['resistance'] || 50) +
                        (vals['recuperation'] || 50) + (vals['acceleration'] || 50);
            return sum / 11.2;
          };

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
            weatherProfileId
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