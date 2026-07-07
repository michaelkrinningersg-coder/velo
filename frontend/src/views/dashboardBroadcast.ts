/**
 * BROADCAST DASHBOARD (Screen 2A) — Produktions-Port (1:1 zum Design #2a)
 * ----------------------------------------------------------------------
 * Rendert den Body von #view-dashboard als HTML-String (innerHTML).
 * Bauteile: KPI-Strip · Live-Spotlight · Renn-Radar · Fahrer im Fokus
 * (rotierend, Radar + Siegliste) · Top-10 Fahrer · Top-10 Teams.
 *
 * Styling: Inline-Styles 1:1 aus dem Broadcast-Design.
 * Datenquellen: globaler `state` + Team-Aggregation aus state.riders.
 * Siegliste der Fokus-Karte wird per api.getRiderStats lazy nachgeladen.
 */
import { api } from '../api';
import { state, resolveRaceCategoryBadgeStyle } from '../state';
import type { Race, Rider, Team, RiderStatsPayload } from '../../../shared/types';

const MONO = "font-family:'JetBrains Mono',monospace";
const MONTHS = ['JAN', 'FEB', 'MRZ', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];

// ---- Fokus-Fahrer (1 zufaelliger Sieger, stabil) + Siegliste-Cache ---------
let spotlightRiderId: number | null = null;
interface SpotlightWin { race: string; detail: string; color: string; isGc: boolean; }
const spotlightWinsCache = new Map<number, SpotlightWin[]>();
const spotlightWinsInFlight = new Set<number>();

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

function raceTotalElevation(race: Race): number {
  return race.isStageRace
    ? (race.stages ?? []).reduce((s, st) => s + (st.elevationGainMeters ?? 0), 0)
    : (race.upcomingStage?.elevationGainMeters ?? 0);
}

function catColor(race: Race): string {
  return resolveRaceCategoryBadgeStyle(race.category?.name).border;
}

function ovrColor(ovr: number): string {
  if (ovr >= 75) return '#4ade80';
  if (ovr >= 70) return '#a3e635';
  if (ovr >= 65) return '#facc15';
  if (ovr >= 60) return '#fb923c';
  return '#f87171';
}

// ---- Team-Aggregation aus den Fahrern --------------------------------------
interface TeamAgg { points: number; wins: number; tttWins: number; }

function aggregateTeamStandings(): Map<number, TeamAgg> {
  const byTeam = new Map<number, TeamAgg>();
  for (const rider of state.riders) {
    const teamId = rider.activeTeamId;
    if (teamId == null) continue;
    const agg = byTeam.get(teamId) ?? { points: 0, wins: 0, tttWins: 0 };
    agg.points += rider.seasonPoints ?? 0;
    agg.wins += rider.seasonWins ?? 0;
    agg.tttWins += rider.seasonTttWins ?? 0;
    byTeam.set(teamId, agg);
  }
  return byTeam;
}

/**
 * Effektive Team-Siege: Ein TTT-Sieg gibt jedem gefinishten Fahrer einen
 * Saisonsieg — auf Team-Ebene soll er aber nur 1x zaehlen. Die individuellen
 * TTT-Siege werden daher herausgerechnet und pro ~8 Finisher als 1 Team-Sieg
 * wieder addiert.
 */
function effectiveTeamWins(agg: TeamAgg): number {
  return agg.wins - agg.tttWins + Math.round(agg.tttWins / 8);
}

interface PlayerTeamKpis { worldRank: string; seasonPoints: string; seasonWins: string; totalTeams: number; }

function playerTeamKpis(team: Team | null): PlayerTeamKpis {
  const byTeam = aggregateTeamStandings();
  const ranked = [...byTeam.entries()].sort((a, b) => b[1].points - a[1].points);
  const totalTeams = ranked.length;
  if (team == null) return { worldRank: '–', seasonPoints: '0', seasonWins: '0', totalTeams };
  const agg = byTeam.get(team.id) ?? { points: 0, wins: 0, tttWins: 0 };
  const rankIndex = ranked.findIndex(([id]) => id === team.id);
  return {
    worldRank: totalTeams > 0 && rankIndex >= 0 ? `#${rankIndex + 1}` : '–',
    seasonPoints: agg.points.toLocaleString('de-DE'),
    seasonWins: String(effectiveTeamWins(agg)),
    totalTeams,
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

// ---- Renn-Radar-Zeile ------------------------------------------------------
// Rennen mit heute offener Etappe bekommen je Zeile eigene Instant-/Live-
// Buttons (wichtig bei den ~38 nationalen Meisterschaften am selben Tag, die
// so einzeln direkt aus dem Radar heraus simuliert werden koennen). Rennen
// ohne offene Etappe zeigen nur den Status (LÄUFT/GEPLANT).
function radarRow(race: Race): string {
  const gs = state.gameState;
  const live = gs != null && race.startDate <= gs.currentDate && race.endDate >= gs.currentDate;
  const [, mm, dd] = race.startDate.split('-');
  const mon = MONTHS[Number(mm) - 1] ?? '';
  const pendingStage = (state.gameStatus?.pendingStages ?? []).find((p) => p.raceId === race.id) ?? null;
  let actions: string;
  if (pendingStage) {
    actions = `
      <span style="display:flex;gap:6px;flex:0 0 auto;">
        <button type="button" data-instant-stage="${pendingStage.stageId}" title="Instant-Simulation" style="border:none;cursor:pointer;background:linear-gradient(135deg,#22d3ee,#0891b2);color:#061019;font-weight:700;font-size:11px;padding:6px 11px;border-radius:7px;white-space:nowrap;">Instant ▸</button>
        <button type="button" data-live-stage="${pendingStage.stageId}" title="Live-Simulation" style="border:1px solid #2b3a55;cursor:pointer;background:transparent;color:#9fb0c9;font-weight:700;font-size:11px;padding:6px 10px;border-radius:7px;white-space:nowrap;">Live</button>
      </span>`;
  } else if (live) {
    actions = '<span style="font-size:10px;font-weight:700;color:#fca5a5;background:rgba(239,68,68,.12);padding:4px 10px;border-radius:99px;letter-spacing:.04em;flex:0 0 auto;">LÄUFT</span>';
  } else {
    actions = '<span style="font-size:10px;font-weight:700;color:#93a3bd;border:1px solid #2b3a55;padding:4px 10px;border-radius:99px;letter-spacing:.04em;flex:0 0 auto;">GEPLANT</span>';
  }
  const country = race.country?.name ?? '';
  const km = raceTotalKm(race);
  return `
    <div style="display:flex;align-items:center;gap:14px;padding:11px 16px;border-top:1px solid #14203a;${live ? 'box-shadow:inset 3px 0 0 #ef4444;background:linear-gradient(90deg,rgba(239,68,68,.10),transparent 55%);' : ''}">
      <button type="button" data-dashboard-race-id="${race.id}" style="flex:1;min-width:0;text-align:left;background:none;cursor:pointer;display:flex;align-items:center;gap:14px;border:none;padding:0;">
        <span style="text-align:center;min-width:38px;"><span style="display:block;font-size:19px;font-weight:800;color:${live ? '#f1f5f9' : '#e2e8f0'};line-height:1;">${dd}</span><span style="display:block;font-size:9px;color:#7c8aa3;letter-spacing:.1em;">${mon}</span></span>
        <span style="width:5px;height:34px;border-radius:3px;background:${catColor(race)};flex:0 0 auto;" title="${race.category?.name ?? ''}"></span>
        <span style="flex:1;min-width:0;"><span style="display:block;font-size:14px;font-weight:700;color:${live ? '#f1f5f9' : '#e2e8f0'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${race.name}</span><span style="display:block;${MONO};font-size:11px;color:#8494ad;">${country}${km ? ' · ' + km.toFixed(0) + ' km' : ''}</span></span>
      </button>
      ${actions}
    </div>`;
}

// ---- Live-Spotlight (aktuelles laufendes Rennen) ---------------------------
function renderLiveSpotlight(): string {
  const gs = state.gameState;
  if (!gs) return '';
  const today = gs.currentDate;
  const liveRaces = state.races
    .filter((r) => r.startDate <= today && r.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (liveRaces.length === 0) return '';

  const pending = state.gameStatus?.pendingStages ?? [];
  // Bevorzugt ein Rennen mit heute offener Etappe
  const race = liveRaces.find((r) => pending.some((p) => p.raceId === r.id)) ?? liveRaces[0];
  const pendingStage = pending.find((p) => p.raceId === race.id) ?? null;

  const catStyle = resolveRaceCategoryBadgeStyle(race.category?.name);
  const country = race.country?.code3 ?? race.country?.name ?? '';
  const km = raceTotalKm(race);
  const hm = raceTotalElevation(race);
  const stageInfo = race.isStageRace
    ? `Etappe ${pendingStage?.stageNumber ?? race.upcomingStage?.stageNumber ?? '?'} / ${race.numberOfStages} · ${country}`
    : country;
  const profileLabel = pendingStage?.profile ?? race.upcomingStage?.profile ?? '';

  // stilisiertes Höhenprofil (repräsentativ, kein km-genaues Profil auf dem Dashboard)
  const elevationSvg = `
    <svg viewBox="0 0 600 90" preserveAspectRatio="none" style="width:100%;height:70px;display:block;margin-top:6px;">
      <defs><linearGradient id="dash-elev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(34,211,238,.4)"/><stop offset="100%" stop-color="rgba(34,211,238,0)"/></linearGradient></defs>
      <polygon points="0,80 0,66 60,60 110,64 170,48 230,55 300,36 360,44 420,20 470,30 520,8 560,22 600,10 600,80" fill="url(#dash-elev)"/>
      <polyline points="0,66 60,60 110,64 170,48 230,55 300,36 360,44 420,20 470,30 520,8 560,22 600,10" fill="none" stroke="#22d3ee" stroke-width="2"/>
    </svg>`;

  const buttons = pendingStage
    ? `
      <div style="display:flex;gap:9px;margin-top:12px;">
        <button type="button" data-instant-stage="${pendingStage.stageId}" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#22d3ee,#0891b2);color:#061019;font-weight:700;font-size:13px;padding:10px;border-radius:9px;">Instant ▸</button>
        <button type="button" data-edit-stage-roster="${pendingStage.stageId}" style="border:1px solid #2b3a55;cursor:pointer;background:transparent;color:#9fb0c9;font-weight:700;font-size:13px;padding:10px 16px;border-radius:9px;">Starterfeld</button>
      </div>`
    : `<div style="${MONO};font-size:11px;color:#7c8aa3;margin-top:12px;">Heutige Etappe abgeschlossen – Tageswechsel freigegeben.</div>`;

  return `
    <div style="border-radius:14px;overflow:hidden;border:1px solid #223354;background:linear-gradient(135deg,#0f2036,#0c1526);">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid #1c2b47;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <span style="font-size:12px;font-weight:700;color:${catStyle.color};background:${catStyle.background};border:1px solid ${catStyle.border};padding:3px 9px;border-radius:6px;text-transform:uppercase;white-space:nowrap;">${race.category?.name?.replace(/^world\s*tour\s*-\s*/i, '') ?? 'Rennen'}</span>
          <span style="font-size:15px;font-weight:800;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${race.name}</span>
        </div>
        <span style="${MONO};font-size:11px;color:#7c8aa3;flex:0 0 auto;">${stageInfo}</span>
      </div>
      <div style="padding:14px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;">
          <div style="min-width:0;">
            <div style="font-size:16px;font-weight:800;color:#e8edf5;">${race.name}</div>
            <div style="${MONO};font-size:12px;color:#8494ad;margin-top:3px;">${km ? km.toFixed(0) + ' km' : ''}${hm ? ' · ' + Math.round(hm).toLocaleString('de-DE') + ' hm' : ''}</div>
          </div>
          ${profileLabel ? `<span style="font-size:11px;font-weight:700;color:#c4b5fd;background:rgba(139,92,246,.16);border:1px solid rgba(139,92,246,.34);padding:4px 10px;border-radius:6px;flex:0 0 auto;">${profileLabel}</span>` : ''}
        </div>
        ${elevationSvg}
        ${buttons}
      </div>
    </div>`;
}

// ---- 6-Achsen-Mini-Radar für die Fokus-Karte -------------------------------
function renderSpotlightRadar(rider: Rider): string {
  const skills = rider.skills ?? ({} as any);
  const keys = ['mountain', 'hill', 'sprint', 'timeTrial', 'cobble', 'attack'];
  const labels = ['MTN', 'HIL', 'SPR', 'TT', 'COB', 'ATT'];
  const W = 260, H = 190, CX = W / 2, CY = H / 2 + 4, R = 66, minV = 60, maxV = 85, range = maxV - minV;
  const pt = (radius: number, i: number): [number, number] => {
    const a = (i * Math.PI / 3) - (Math.PI / 2);
    return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
  };
  let grid = '';
  for (let lvl = minV; lvl <= maxV; lvl += 5) {
    const r = R * ((lvl - minV) / range);
    if (r < 1) continue;
    const pts = keys.map((_, i) => pt(r, i).join(',')).join(' ');
    grid += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="1"/>`;
  }
  let spokes = '';
  let labelEls = '';
  keys.forEach((_, i) => {
    const [ox, oy] = pt(R, i);
    spokes += `<line x1="${CX}" y1="${CY}" x2="${ox}" y2="${oy}" stroke="rgba(255,255,255,.12)" stroke-width="1"/>`;
    const [lx, ly] = pt(R + 15, i);
    const anchor = Math.cos((i * Math.PI / 3) - (Math.PI / 2)) > 0.15 ? 'start' : (Math.cos((i * Math.PI / 3) - (Math.PI / 2)) < -0.15 ? 'end' : 'middle');
    labelEls += `<text x="${lx}" y="${ly}" fill="#8494ad" font-size="9" font-family="'JetBrains Mono',monospace" text-anchor="${anchor}" dominant-baseline="middle">${labels[i]}</text>`;
  });
  const poly = keys.map((k, i) => {
    const v = Math.max(minV, Math.min(maxV, (skills as any)[k] ?? minV));
    const r = R * ((v - minV) / range);
    return pt(r, i).join(',');
  }).join(' ');
  return `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:280px;height:auto;display:block;margin:2px auto;">
      ${grid}${spokes}
      <polygon points="${poly}" fill="rgba(34,211,238,.22)" stroke="#22d3ee" stroke-width="2" stroke-linejoin="round"/>
      ${labelEls}
    </svg>`;
}

// ---- Fahrer im Fokus -------------------------------------------------------
// Bevorzugt den Sieger der zuletzt simulierten Etappe / des letzten Rennens
// (bei TTT: bestplatzierter Fahrer des Siegerteams, vom Backend hinterlegt).
// Fallback: stabiler Zufallsfahrer aus allen mit mindestens einem Saisonsieg.
function spotlightRider(): Rider | null {
  const lastWinner = state.gameStatus?.lastStageWinner ?? null;
  if (lastWinner != null) {
    const rider = state.riders.find((r) => r.id === lastWinner.riderId);
    if (rider) {
      spotlightRiderId = rider.id;
      return rider;
    }
  }

  const winners = state.riders.filter((r) => (r.seasonWins ?? 0) > 0);
  if (winners.length === 0) return null;
  const current = spotlightRiderId != null ? winners.find((r) => r.id === spotlightRiderId) : undefined;
  if (current) return current;
  const pick = winners[Math.floor(Math.random() * winners.length)];
  spotlightRiderId = pick.id;
  return pick;
}

function renderRiderSpotlight(): string {
  const rider = spotlightRider();
  if (rider == null) {
    return `<div style="border-radius:14px;border:1px solid #223354;background:linear-gradient(160deg,#101d33,#0b1424);padding:16px;color:#6a7a95;font-size:13px;">Noch kein Siegfahrer in dieser Saison.</div>`;
  }
  const team = state.teams.find((t) => t.id === rider.activeTeamId) ?? null;
  const teamColor = team?.colorPrimary ?? '#22d3ee';
  const ovr = rider.overallRating ?? 0;
  const form = rider.formBonus ?? 0;
  const winCount = rider.seasonWins ?? 0;
  const country = rider.country?.code3 ?? rider.nationality ?? '';
  const role = rider.role?.name ?? '';

  // Kontext-Label, wenn der fokussierte Fahrer der Sieger der zuletzt
  // simulierten Etappe ist (bei TTT: bester Fahrer des Siegerteams).
  const lastWinner = state.gameStatus?.lastStageWinner ?? null;
  const lastWinnerLabel = lastWinner != null && lastWinner.riderId === rider.id
    ? `${lastWinner.isTeamTimeTrial ? 'TTT-Sieg' : 'Sieger'} · ${lastWinner.raceName}${lastWinner.stageNumber != null ? ` · E${lastWinner.stageNumber}` : ''}`
    : null;

  const cachedWins = spotlightWinsCache.get(rider.id);
  let winsHtml: string;
  if (cachedWins == null) {
    winsHtml = `<div style="${MONO};font-size:11px;color:#7c8aa3;padding:6px 2px;">Lade Siege…</div>`;
  } else if (cachedWins.length === 0) {
    winsHtml = `<div style="${MONO};font-size:11px;color:#7c8aa3;padding:6px 2px;">Keine Einzelsiege in dieser Saison.</div>`;
  } else {
    winsHtml = cachedWins.map((w) => `
      <div style="display:flex;align-items:stretch;background:#0c1729;border:1px solid #1c2b47;border-radius:8px;overflow:hidden;">
        ${w.isGc ? '<span style="width:3px;background:#fbbf24;flex:0 0 auto;"></span>' : ''}
        <span style="width:4px;background:${w.color};flex:0 0 auto;"></span>
        <div style="flex:1;min-width:0;padding:8px 11px;"><div style="font-size:13px;font-weight:700;color:#e8edf5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${w.race}</div><div style="${MONO};font-size:10px;color:#8494ad;">${w.detail}</div></div>
      </div>`).join('');
  }

  return `
    <div style="border-radius:14px;border:1px solid #223354;background:linear-gradient(160deg,#101d33,#0b1424);padding:15px 16px;display:flex;flex-direction:column;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px;">
        <span style="${MONO};font-size:10px;letter-spacing:.14em;color:#5f6f8a;text-transform:uppercase;">Siegfahrer im Fokus</span>
        ${lastWinnerLabel ? `<span style="${MONO};font-size:10px;color:#fbbf24;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lastWinnerLabel}</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:11px;margin:10px 0 4px;">
        <span style="width:5px;height:40px;border-radius:3px;background:${teamColor};flex:0 0 auto;"></span>
        <button type="button" data-dashboard-rider-id="${rider.id}" style="flex:1;min-width:0;text-align:left;background:none;border:none;padding:0;cursor:pointer;">
          <div style="font-size:16px;font-weight:800;color:#f1f5f9;">${rider.firstName ?? ''} <span style="font-weight:900;">${rider.lastName ?? ''}</span></div>
          <div style="${MONO};font-size:11px;color:#7c8aa3;">${country}${role ? ' · ' + role : ''}${team ? ' · ' + team.name : ''}</div>
        </button>
        <div style="text-align:right;flex:0 0 auto;">
          <div style="${MONO};font-size:22px;font-weight:800;color:${ovrColor(ovr)};line-height:1;">${Math.round(ovr)}</div>
          <div style="${MONO};font-size:10px;color:#22d3ee;">Form ${form >= 0 ? '+' : ''}${form}</div>
        </div>
      </div>
      ${renderSpotlightRadar(rider)}
      <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0 8px;padding-top:10px;border-top:1px solid #1c2b47;">
        <span style="${MONO};font-size:10px;letter-spacing:.12em;color:#7c8aa3;text-transform:uppercase;">Siege · nach UCI-Punkten</span>
        <span style="${MONO};font-size:11px;font-weight:700;color:#fbbf24;">${winCount} ${winCount === 1 ? 'Sieg' : 'Siege'}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">${winsHtml}</div>
    </div>`;
}

// ---- Haupt-Render ----------------------------------------------------------
export function renderDashboardBroadcast(): string {
  const gs = state.gameState;
  const team = playerTeam();
  const today = gs?.currentDate ?? '';
  const maxDate = today ? addDays(today, 10) : '';
  // Rennen mit heute offener Etappe zuerst (z. B. die ~38 nationalen
  // Meisterschaften am selben Tag), damit sie direkt oben im scrollbaren
  // Radar mit ihren Instant-Buttons stehen; danach chronologisch.
  const pendingRaceIds = new Set((state.gameStatus?.pendingStages ?? []).map((p) => p.raceId));
  const upcoming = state.races
    .filter((r) => (r.startDate <= today && r.endDate >= today) || (r.startDate > today && r.startDate <= maxDate))
    .sort((a, b) => {
      const ap = pendingRaceIds.has(a.id) ? 0 : 1;
      const bp = pendingRaceIds.has(b.id) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate);
      return a.name.localeCompare(b.name);
    });
  const pendingCount = upcoming.filter((r) => pendingRaceIds.has(r.id)).length;

  const kpis = playerTeamKpis(team);
  const liveSpotlight = renderLiveSpotlight();

  return `
  <div class="view-header"><h2>Dashboard</h2></div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <!-- KPI-Strip: nur Weltrang / Punkte / Siege -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
      ${kpiCard('Team-Weltrangliste', kpis.worldRank, kpis.totalTeams > 0 ? `WorldTour · ${kpis.totalTeams} Teams` : 'WorldTour', '#f1f5f9')}
      ${kpiCard('Saisonpunkte', kpis.seasonPoints, `Team ${team?.name ?? '–'}`, '#f1f5f9', false)}
      ${kpiCard('Saisonsiege', kpis.seasonWins, 'diese Saison', '#fbbf24', false)}
    </div>

    <!-- Mittleres Grid: (Live-Spotlight + Renn-Radar) | Fahrer im Fokus -->
    <div style="display:grid;grid-template-columns:1.55fr 1fr;gap:16px;">
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${liveSpotlight}
        <div style="border-radius:14px;overflow:hidden;border:1px solid #1e2c49;background:#0c1526;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #1c2b47;">
            <span style="font-size:13px;font-weight:800;color:#e2e8f0;">Renn-Radar</span>
            <span style="${MONO};font-size:10px;letter-spacing:.12em;color:#5f6f8a;text-transform:uppercase;">${pendingCount > 0 ? `${pendingCount} offen · ` : ''}Nächste 10 Tage</span>
          </div>
          <div style="max-height:360px;overflow-y:auto;">
            ${upcoming.map(radarRow).join('') || '<div style="padding:16px;color:#6a7a95;font-size:13px;">Keine Rennen im Zeitraum.</div>'}
          </div>
        </div>
      </div>

      ${renderRiderSpotlight()}
    </div>
  </div>`;
}

// ---- Lazy-Siegliste (von dashboard.ts aufgerufen) --------------------------
export function focusedSpotlightRiderId(): number | null {
  return spotlightRider()?.id ?? null;
}

// Laedt die Siegliste des fokussierten Fahrers nach (einmal je Fahrer, gecacht).
// Gibt true zurueck, wenn danach neu gerendert werden sollte.
export async function ensureSpotlightWinsLoaded(): Promise<boolean> {
  const riderId = focusedSpotlightRiderId();
  if (riderId == null) return false;
  if (spotlightWinsCache.has(riderId) || spotlightWinsInFlight.has(riderId)) return false;
  spotlightWinsInFlight.add(riderId);
  try {
    const res = await api.getRiderStats(riderId, true);
    if (!res.success || !res.data) {
      spotlightWinsCache.set(riderId, []);
      return true;
    }
    spotlightWinsCache.set(riderId, extractSeasonWins(res.data, state.gameState?.season ?? null));
    return true;
  } catch {
    spotlightWinsCache.set(riderId, []);
    return true;
  } finally {
    spotlightWinsInFlight.delete(riderId);
  }
}

function extractSeasonWins(payload: RiderStatsPayload, season: number | null): SpotlightWin[] {
  const seasons = payload.seasons ?? [];
  const target = season != null
    ? seasons.find((s) => s.season === season) ?? seasons[seasons.length - 1]
    : seasons[seasons.length - 1];
  if (!target) return [];
  const wins: Array<SpotlightWin & { points: number }> = [];
  for (const block of target.raceBlocks ?? []) {
    for (const row of block.rows ?? []) {
      // Siege: Etappensieg / One-Day-Sieg (stage_result rank 1) oder GC-Sieg (gc_final rank 1)
      const isStageOrOneDayWin = row.rowType === 'stage_result' && row.resultRank === 1;
      const isGcWin = row.rowType === 'gc_final' && row.resultRank === 1;
      if (!isStageOrOneDayWin && !isGcWin) continue;
      const color = resolveRaceCategoryBadgeStyle(row.raceCategoryName).border;
      const detail = isGcWin
        ? 'Gesamtwertung'
        : (row.isStageRace ? (row.stageNumber != null ? `Etappe ${row.stageNumber}` : 'Etappe') : 'Eintagesrennen');
      wins.push({ race: row.raceName, detail, color, isGc: isGcWin, points: row.seasonPoints ?? 0 });
    }
  }
  wins.sort((a, b) => b.points - a.points);
  return wins.slice(0, 4).map(({ race, detail, color, isGc }) => ({ race, detail, color, isGc }));
}
