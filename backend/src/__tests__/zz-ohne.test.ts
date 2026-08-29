import { it } from 'vitest';
import Database from 'better-sqlite3';
import { POT_PRESET_SKILL_COLUMNS } from '../../../shared/newgenPresetTiers';
const SP = [...POT_PRESET_SKILL_COLUMNS];
it('Wer blieb ohne Preset?', () => {
  const db = new Database('/tmp/claude-0/-home-user-velo/962b2332-6597-53ec-8df3-2d808d570eb9/scratchpad/zuw.db', { readonly: true });
  const presets = db.prepare('SELECT display_name, ' + SP.flatMap((s) => ['min_pot_' + s, 'max_pot_' + s]).join(', ') + ' FROM newgen_potential_presets').all() as any[];
  const fahrer = db.prepare(`
    SELECT r.id, r.first_name fn, r.last_name ln, 2027 - r.birth_year AS alt, r.peak_age,
           r.overall_rating ovr, r.pot_overall pot, land.code_3 land, t.name team, tr.display_name spez,
           ${SP.map((s) => 'r.skill_' + s).join(', ')}
    FROM riders r
    LEFT JOIN sta_country land ON land.id = r.country_id
    LEFT JOIN type_rider tr ON tr.id = r.specialization_1_id
    LEFT JOIN contracts c ON c.rider_id = r.id AND c.status IN ('active','future') AND c.end_season >= 2027
    LEFT JOIN teams t ON t.id = c.team_id
    WHERE r.is_retired = 0 AND r.pot_preset_key IS NULL AND 2027 - r.birth_year < r.peak_age
  `).all() as any[];
  console.log('ZEILE ' + fahrer.length + ' Fahrer vor dem Zielalter ohne Preset');
  for (const f of fahrer) {
    const vertraeglich = presets.filter((p) => SP.every((s) => p['max_pot_' + s] >= f['skill_' + s]));
    console.log('ZEILE #' + f.id + ' ' + f.fn + ' ' + f.ln + ' (' + f.land + ', ' + f.alt + 'J, Zenit ' + f.peak_age + ', OVR ' + f.ovr.toFixed(1) + ', ' + (f.spez ?? '?') + ', ' + (f.team ?? 'ohne Team') + ')');
    console.log('ZEILE     vertraegliche Presets: ' + vertraeglich.length + (vertraeglich.length ? ' (alle gedeckelt und voll)' : ' — kein Preset deckt ihn ab'));
    console.log('ZEILE     Skills: ' + SP.map((s) => s + ' ' + f['skill_' + s].toFixed(0)).join(', '));
  }
  db.close();
});
