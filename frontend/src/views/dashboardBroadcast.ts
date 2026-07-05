/**
 * BROADCAST DASHBOARD (Screen 2A) — Produktions-Port
 * ---------------------------------------------------
 * Rendert den Body von #view-dashboard als HTML-String (innerHTML).
 * Styling bewusst als Inline-Styles (1:1 aus dem Broadcast-Design), einzige
 * globale Ergaenzung in main.css: @keyframes velopulse.
 *
 * Datenquellen: globaler `state`, plus Team-Aggregation aus state.riders
 * (Team hat selbst keine seasonPoints/seasonWins/worldRank-Felder).
 */
import { state, renderMiniJersey, resolveRaceCategoryBadgeStyle } from '../state';
import type { Race, Team } from '../../../shared/types';

const MONO = "font-family:'JetBrains Mono',monospace";
const MONTHS = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];

// ---- kleine Helfer ---------------------------------------------------------
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function playerTeam(): Team | null {
  return state.teams.find((t) => t.isPlayerTeam)
    ?? state.teams.find((t) => t.name === state.currentSave?.teamName)
    ?? null;
}

function raceTotalKm(race: Race): number {
  return race.isStageRace
    ? (race.stages ?? []).reduce((s, st) => s + (st.distanceKm ?? 0), 0)
    : (race.upcomingStage?.distanceKm ?? 0);
}

function catColor(race: Race): string {
  return resolveRaceCategoryBadgeStyle(race.category?.name).border;
}

// ---- Team-Aggregation aus den Fahrern --------------------------------------
interface TeamAgg { points: number; wins: number; }

function aggregateTeamStandings(): Map<number, TeamAgg> {
  const byTeam = new Map<number, TeamAgg>();
  for (const rider of state.riders) {
    const teamId = rider.activeTeamId;
    if (teamId == null) continue;
    const agg = byTeam.get(teamId) ?? { points: 0, wins: 0 };
    agg.points += rider.seasonPoints ?? 0;
    agg.wins += rider.seasonWins ?? 0;
    byTeam.set(teamId, agg);
  }
  return byTeam;
}

interface PlayerTeamKpis { worldRank: string; seasonPoints: string; seasonWins: string; }

function playerTeamKpis(team: Team | null): PlayerTeamKpis {
  const byTeam = aggregateTeamStandings();
  const ranked = [...byTeam.entries()].sort((a, b) => b[1].points - a[1].points);
  const totalTeams = ranked.length;

  if (team == null) {
    return { worldRank: '–', seasonPoints: '0', seasonWins: '0' };
  }

  const agg = byTeam.get(team.id) ?? { points: 0, wins: 0 };
  const rankIndex = ranked.findIndex(([id]) => id === team.id);
  const worldRank = rankIndex >= 0 ? `#${rankIndex + 1}` : '–';
  return {
    worldRank: totalTeams > 0 ? worldRank : '–',
    seasonPoints: agg.points.toLocaleString('de-DE'),
    seasonWins: String(agg.wins),
  };
}

// ---- KPI-Strip -------------------------------------------------------------
function kpiCard(label: string, value: string, sub: string, valueColor = '#f1f5f9', accent = true): string {
  return `
    <div style="background:linear-gradient(180deg,#111c34,#0d1628);border:1px solid #1e2c49;border-radius:12px;padding:15px 17px;position:relative;overflow:hidden;">
      ${accent ? '<div style="position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,#22d3ee,transparent);"></div>' : ''}
      <div style="${MONO};font-size:10px;letter-spacing:.14em;color:#6a7a95;text-transform:uppercase;">${label}</div>
      <div style="font-size:32px;font-weight:800;color:${valueColor};${MONO};margin-top:8px;letter-spacing:-.03em;">${value}</div>
      <div style="font-size:10px;color:#6a7a95;margin-top:5px;${MONO};">${sub}</div>
    </div>`;
}

// ---- Renn-Radar (Datumsblock + Farbbalken + Status), klickbar --------------
function radarRow(race: Race): string {
  const gs = state.gameState;
  const live = gs != null && race.startDate <= gs.currentDate && race.endDate >= gs.currentDate;
  const [, mm, dd] = race.startDate.split('-');
  const mon = MONTHS[Number(mm) - 1] ?? '';
  const status = live
    ? '<span style="font-size:10px;font-weight:700;color:#fca5a5;background:rgba(239,68,68,.12);padding:4px 10px;border-radius:99px;letter-spacing:.04em;">LÄUFT</span>'
    : '<span style="font-size:10px;font-weight:700;color:#93a3bd;border:1px solid #2b3a55;padding:4px 10px;border-radius:99px;letter-spacing:.04em;">GEPLANT</span>';
  const country = race.country?.name ?? '';
  const km = raceTotalKm(race);
  return `
    <button type="button" data-dashboard-race-id="${race.id}" style="width:100%;text-align:left;background:none;cursor:pointer;display:flex;align-items:center;gap:14px;padding:11px 16px;border:none;border-top:1px solid #14203a;${live ? 'box-shadow:inset 3px 0 0 #ef4444;background:linear-gradient(90deg,rgba(239,68,68,.10),transparent 55%);' : ''}">
      <span style="text-align:center;min-width:38px;"><span style="display:block;font-size:19px;font-weight:800;color:${live ? '#f1f5f9' : '#e2e8f0'};line-height:1;">${dd}</span><span style="display:block;font-size:9px;color:#7c8aa3;letter-spacing:.1em;">${mon}</span></span>
      <span style="width:5px;height:34px;border-radius:3px;background:${catColor(race)};flex:0 0 auto;" title="${race.category?.name ?? ''}"></span>
      <span style="flex:1;min-width:0;"><span style="display:block;font-size:14px;font-weight:700;color:${live ? '#f1f5f9' : '#e2e8f0'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${race.name}</span><span style="display:block;${MONO};font-size:11px;color:#8494ad;">${country}${km ? ' · ' + km.toFixed(0) + ' km' : ''}</span></span>
      ${status}
    </button>`;
}

// ---- Top-10 Fahrer (Punkte/Siege) ------------------------------------------
export function dashboardRiderRows(byWins: boolean): string {
  const list = [...state.riders]
    .sort((a, b) => byWins
      ? (b.seasonWins ?? 0) - (a.seasonWins ?? 0)
      : (b.seasonPoints ?? 0) - (a.seasonPoints ?? 0))
    .slice(0, 10);
  return list.map((r, i) => {
    const val = byWins ? String(r.seasonWins ?? 0) : (r.seasonPoints ?? 0).toLocaleString('de-DE');
    const rankColor = i < 3 ? ['#fbbf24', '#cbd5e1', '#d08b5b'][i] : '#5f6f8a';
    return `
      <div style="display:grid;grid-template-columns:26px 24px 1fr 54px;gap:9px;align-items:center;padding:8px 16px;border-top:1px solid #14203a;">
        <span style="${MONO};font-size:12px;font-weight:700;color:${rankColor};">${i + 1}</span>
        ${renderMiniJersey(r.activeTeamId, undefined)}
        <span style="font-size:13px;font-weight:600;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.firstName?.[0] ?? ''}. ${r.lastName}</span>
        <span style="${MONO};font-size:13px;font-weight:700;text-align:right;color:${byWins ? '#fbbf24' : '#e2e8f0'};">${val}</span>
      </div>`;
  }).join('');
}

// ---- Team-Toggle-Button-Style ----------------------------------------------
function toggleButton(metric: 'points' | 'wins', label: string, active: boolean): string {
  return `<button type="button" data-top10-metric="${metric}" style="${MONO};font-size:11px;font-weight:700;padding:5px 13px;border-radius:6px;border:none;background:${active ? '#22d3ee' : 'transparent'};color:${active ? '#061019' : '#7c8aa3'};cursor:pointer;">${label}</button>`;
}

// ---- Haupt-Render ----------------------------------------------------------
export function renderDashboardBroadcast(): string {
  const gs = state.gameState;
  const team = playerTeam();
  const today = gs?.currentDate ?? '';
  const maxDate = today ? addDays(today, 10) : '';
  const upcoming = state.races
    .filter((r) => (r.startDate <= today && r.endDate >= today) || (r.startDate > today && r.startDate <= maxDate))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 8);

  const kpis = playerTeamKpis(team);
  const teamCount = aggregateTeamStandings().size;

  return `
  <div class="view-header"><h2>Dashboard</h2></div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <!-- KPI-Strip: nur Weltrang / Punkte / Siege -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
      ${kpiCard('Team-Weltrangliste', kpis.worldRank, teamCount > 0 ? `${teamCount} Teams` : 'WorldTour', '#f1f5f9')}
      ${kpiCard('Saisonpunkte', kpis.seasonPoints, `Team ${team?.name ?? '–'}`, '#f1f5f9', false)}
      ${kpiCard('Saisonsiege', kpis.seasonWins, 'diese Saison', '#fbbf24', false)}
    </div>

    <div style="display:grid;grid-template-columns:1.55fr 1fr;gap:16px;">
      <!-- Renn-Radar -->
      <div style="border-radius:14px;overflow:hidden;border:1px solid #1e2c49;background:#0c1526;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #1c2b47;">
          <span style="font-size:13px;font-weight:800;color:#e2e8f0;">Renn-Radar</span>
          <span style="${MONO};font-size:10px;letter-spacing:.12em;color:#5f6f8a;text-transform:uppercase;">Nächste 10 Tage</span>
        </div>
        ${upcoming.map(radarRow).join('') || '<div style="padding:16px;color:#6a7a95;font-size:13px;">Keine Rennen im Zeitraum.</div>'}
      </div>

      <!-- Top-10 Fahrer (Punkte/Siege-Toggle) -->
      <div style="border-radius:14px;overflow:hidden;border:1px solid #1e2c49;background:#0c1526;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid #1c2b47;">
          <span style="font-size:13px;font-weight:800;color:#e2e8f0;">Top 10 Fahrer</span>
          <div style="display:flex;gap:4px;background:#0a1122;border:1px solid #1c2b47;padding:3px;border-radius:8px;">
            ${toggleButton('points', 'Punkte', true)}
            ${toggleButton('wins', 'Siege', false)}
          </div>
        </div>
        <div id="dashboard-top10-riders">${dashboardRiderRows(false)}</div>
      </div>
    </div>
  </div>`;
}
