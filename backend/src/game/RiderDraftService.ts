import Database from 'better-sqlite3';
import {
  DRAFT_VALUE_FALLOFF,
  STRONG_RIDER_OVERALL,
  resolveDraftWeight,
  type DraftRiderInput,
  type DraftTeamInput,
  type NationPreferenceKind,
} from '../../../shared/draftWeights';
import { resolveContractYears } from '../../../shared/contractTerms';
import { NATIONAL_SELECTION_TEAM_ID } from '../simulation/championships';
import {
  TARGET_SPEC_IDS,
  SPEC_QUALITY_THRESHOLD,
  resolveActualShares,
  resolveCoveredSpecIds,
  resolveGoalSpecIds,
  type TeamSpecState,
} from '../../../shared/teamSpecTargets';
import { TeamPrestigeService, resolveTopRiderCaps } from './TeamPrestigeService';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";

function hasMetQuota(specId: number, counts: { spec1: number; spec23: number }): boolean {
  const s1 = counts.spec1;
  const s23 = counts.spec23;
  if (specId === 4) { // Zeitfahren
    return s1 >= 4 || (s1 >= 2 && s23 >= 2);
  }
  if (specId === 5) { // Cobble
    return s1 >= 4 || (s1 >= 3 && s23 >= 2);
  }
  // Other specializations only count the rider's primary specialization
  return s1 >= 4;
}

// --- Top-Fahrer-Kappe im Draft ------------------------------------------------
// Verhindert die Akkumulation sehr starker Fahrer bei einzelnen Teams.
// Zwei Baender (strikt groesser): >77 und >74. Die Kappen sind seit dem
// Prestige-System nicht mehr fuer alle Teams gleich, sondern kommen aus
// `TOP_RIDER_CAPS_BY_PRESTIGE` — ein Spitzenteam darf 6 Fahrer ueber 77
// halten, ein Ausbildungsteam 2. Prestige 3 traegt die alten Werte (4 und 10).
//
// "Weiche Rampe + hartes Deckel-Limit": je naeher ein Team an seiner Kappe,
// desto kleiner der Gewichtsfaktor; bei Erreichen der (ggf. eskalierten) Kappe
// ist der Fahrer fuer dieses Team hart gesperrt. Eskalation paritaetsgesteuert:
// erst wenn JEDES Team seine Kappe erreicht hat, steigen alle um 1, damit der
// Draft nie blockiert.
/** Wie viele Free Agents je Pick nach reiner Qualitaet zur Auswahl stehen. */
export const DRAFT_POOL_SIZE = 100;
/**
 * Aus so vielen Kandidaten zieht die KI tatsaechlich — den nach Gewicht besten
 * des Pools. Die Liste, die der Spieler sieht, bleibt vollstaendig.
 *
 * Ohne diese Grenze verteilt sich die Wahrscheinlichkeit ueber den ganzen Pool.
 * Ein einzelner schwacher Kandidat hat wenig Gewicht, achtzig davon zusammen
 * aber mehr als die Spitze — gemessen ging ein Fahrer ueber 74 im Schnitt erst
 * beim 81. Pick weg, der letzte erst beim 258. Die Faktoren fuer Nation,
 * Zielanteil und Loyalitaet bleiben unangetastet: sie entscheiden, wer in
 * diesen Lostopf kommt, und wirken damit sogar staerker als vorher.
 */
export const DRAFT_LOTTERY_SIZE = 20;
/**
 * Wie viele zusaetzliche Fahrer je bevorzugter Nation und je
 * Fokusspezialisierung in den Pool kommen.
 *
 * Ohne diese Erweiterung koennen Nationenbindung und Teamfokus gar nicht
 * wirken: der Pool waren die 60 global besten Vertragslosen, und darin sind
 * von 121 Deutschen unter 3164 Fahrern rechnerisch zwei. Ein Faktor von 2,5
 * auf zwei Kandidaten aendert nichts. Gemessen blieb der Anteil der Fahrer aus
 * einer bevorzugten Nation deshalb bei 26 %, obwohl die Bindung schon stand.
 *
 * Der Pool ist damit nicht mehr "die 60 besten", sondern "wen dieses Team
 * ueberhaupt auf dem Zettel hat" — und das ist auch die ehrlichere Metapher.
 */
export const DRAFT_POOL_PER_NATION = 12;
export const DRAFT_POOL_PER_FOCUS = 8;

const TOP_THRESHOLD_77 = 77; // strikt groesser
const TOP_THRESHOLD_74 = 74; // strikt groesser
const TOP77_RAMP = 0.5;      // Daempfung je bereits vorhandenem >77-Fahrer
const TOP74_SOFT_START = 7;  // ab so vielen >74-Fahrern beginnt die weiche Rampe
const TOP74_RAMP = 0.25;     // Daempfung je >74-Fahrer oberhalb TOP74_SOFT_START

// Draft-Muster (zyklisch wiederholt). Rang 0 = bestes Team der Vorsaison.
// Pro 6-Runden-Zyklus: Ränge 0-9 dreimal, 10-19 zweimal, 20-24 einmal —
// dämpft die Pick-Dominanz der starken Teams (Verhältnis Top-5:Schwächste-5
// = 3:1 statt zuvor 6:1). Die frühere Extra-Runde 0 entfällt.
const draftSequenceChunks = [
  [0, 9],   // Runde 1: Plätze 1-10
  [0, 9],   // Runde 2: Plätze 1-10
  [10, 19], // Runde 3: Plätze 11-20
  [0, 9],   // Runde 4: Plätze 1-10
  [10, 19], // Runde 5: Plätze 11-20
  [20, 24], // Runde 6: Plätze 21-25
];

export class RiderDraftService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public prepareDraft(season: number): void {
    // 1. Recreate table draft_picks_pool
    this.db.prepare(`DROP TABLE IF EXISTS draft_picks_pool`).run();
    this.db.prepare(`
      CREATE TABLE draft_picks_pool (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        pick_number INTEGER NOT NULL,
        rider_id INTEGER NOT NULL,
        weight REAL NOT NULL,
        probability REAL NOT NULL,
        old_team_id INTEGER
      )
    `).run();

    // 2. Clear old draft history for this season to be clean
    this.db.prepare(`DELETE FROM draft_history WHERE season = ?`).run(season);
  }

  public executeDraft(season: number): void {
    this.prepareDraft(season);
    this.executeNextPicksUntilPlayer(season, true);
  }

  public getRankedTeamIds(season: number): number[] {
    const resultRepo = new ResultRepository(this.db);
    const standings = resultRepo.getSeasonStandings(season - 1);
    let rankedTeamIds = standings.teamStandings.map((t: any) => t.teamId).filter((id: any): id is number => id !== null);

    // Falls keine Teams da sind, Fallback auf alle Division-1 Teams (WorldTour)
    if (rankedTeamIds.length === 0) {
      const wtTeams = this.db.prepare('SELECT id FROM teams WHERE division_id = 1 ORDER BY id ASC').all() as Array<{ id: number }>;
      if (wtTeams.length > 0) {
        rankedTeamIds = wtTeams.map(t => t.id);
      } else {
        const allTeams = this.db.prepare('SELECT id FROM teams ORDER BY id ASC').all() as Array<{ id: number }>;
        rankedTeamIds = allTeams.map(t => t.id);
      }
    }
    // Die Nationalauswahl ist ein Pseudo-Team fuer die Landesmeisterschaften.
    // Sie steht ab der ersten Meisterschaft in der Saisonwertung und rutscht
    // damit in die Draft-Reihenfolge - mit leerem Kader und 40 freien Plaetzen.
    return rankedTeamIds.filter((id) => id !== NATIONAL_SELECTION_TEAM_ID);
  }

  public getNextPickState(season: number): { nextTeamId: number | null; isPlayerTeam: boolean; currentRound: number; currentPickNumber: number; finished: boolean } {
    const rankedTeamIds = this.getRankedTeamIds(season);
    const playerTeamId = (this.db.prepare('SELECT id FROM teams WHERE is_player_team = 1').get() as { id: number }).id;

    // Load max roster sizes
    const teamLimitsMap = new Map<number, number>();
    const limits = this.db.prepare(`
      SELECT t.id, dt.max_roster_size
      FROM teams t 
      JOIN division_teams dt ON t.division_id = dt.id
    `).all() as Array<{ id: number; max_roster_size: number }>;
    for (const limit of limits) {
      teamLimitsMap.set(limit.id, limit.max_roster_size);
    }

    // Reconstruct current roster sizes based on contracts + history
    const teamCountsMap = new Map<number, number>();
    for (const teamId of rankedTeamIds) {
      const activeContracts = (this.db.prepare(`
        SELECT COUNT(*) as c FROM contracts 
        WHERE team_id = ? AND status IN ('active', 'future')
      `).get(teamId) as { c: number }).c;
      
      const draftedCount = (this.db.prepare(`
        SELECT COUNT(*) as c FROM draft_history
        WHERE team_id = ? AND season = ?
      `).get(teamId, season) as { c: number }).c;
      
      const initialCount = activeContracts - draftedCount;
      teamCountsMap.set(teamId, initialCount);
    }

    // Load undrafted free agents to check if any exist
    const freeAgentsRaw = this.db.prepare(`
      SELECT r.id
      FROM riders r
      WHERE r.is_retired = 0
        AND (? - r.birth_year) < CASE WHEN r.retirement_age > 0 THEN r.retirement_age ELSE 36 END
        AND r.id NOT IN (
          SELECT rider_id FROM contracts WHERE status IN ('active', 'future')
        )
    `).all(season) as Array<{ id: number }>;

    if (freeAgentsRaw.length === 0) {
      return { nextTeamId: null, isPlayerTeam: false, currentRound: 0, currentPickNumber: 0, finished: true };
    }

    // Load draft history to know which picks have already been made
    const draftHistory = this.db.prepare(`
      SELECT draft_round, team_id, rider_id FROM draft_history
      WHERE season = ?
      ORDER BY pick_number ASC
    `).all(season) as Array<{ draft_round: number; team_id: number; rider_id: number }>;

    let simulatedPicksCount = 0;
    let sequenceIndex = 0;
    let currentRound = 0;
    let nextTeamId: number | null = null;
    let historyIndex = 0;
    let allTeamsFull = false;
    let leerlaufAbschnitte = 0;

    while (true) {
      const currentChunk = draftSequenceChunks[sequenceIndex % draftSequenceChunks.length];
      const startRank = currentChunk[0];
      const endRank = currentChunk[1];
      
      let anyTeamCanPick = false;

      for (let i = startRank; i <= endRank; i++) {
        if (i >= rankedTeamIds.length) break;
        const teamId = rankedTeamIds[i];
        
        const count = teamCountsMap.get(teamId) || 0;
        const maxRosterSize = teamLimitsMap.get(teamId) ?? 30;
        if (count >= maxRosterSize) {
          continue; // Team voll
        }
        
        anyTeamCanPick = true;
        simulatedPicksCount++;

        // Have we already made this pick?
        if (historyIndex < draftHistory.length) {
          teamCountsMap.set(teamId, count + 1);
          historyIndex++;
        } else {
          // This is the next pick!
          nextTeamId = teamId;
          break;
        }
      }

      if (nextTeamId !== null) {
        break;
      }

      if (!anyTeamCanPick) {
        // Ein vollstaendiger Umlauf durch die Reihenfolge, ohne dass irgendein
        // Team ziehen konnte: der Draft ist zu Ende. Frueher wurde stattdessen
        // die Summe der freien Plaetze ueber *alle* Teams geprueft - freie
        // Plaetze bei einem Team, das die Reihenfolge gar nicht adressiert,
        // liessen die Schleife dann ewig laufen.
        leerlaufAbschnitte++;
        if (leerlaufAbschnitte >= draftSequenceChunks.length) {
          allTeamsFull = true;
          break;
        }
      } else {
        leerlaufAbschnitte = 0;
      }

      sequenceIndex++;
      currentRound++;
    }

    if (nextTeamId === null || allTeamsFull) {
      return { nextTeamId: null, isPlayerTeam: false, currentRound: 0, currentPickNumber: 0, finished: true };
    }

    return {
      nextTeamId,
      isPlayerTeam: nextTeamId === playerTeamId,
      currentRound,
      currentPickNumber: simulatedPicksCount,
      finished: false
    };
  }

  public executeNextPicksUntilPlayer(season: number, autoPlayer = false): { finished: boolean; playerTurn: boolean } {
    const playerTeamId = (this.db.prepare('SELECT id FROM teams WHERE is_player_team = 1').get() as { id: number }).id;

    while (true) {
      const nextPickState = this.getNextPickState(season);
      if (nextPickState.finished) {
        return { finished: true, playerTurn: false };
      }

      const { nextTeamId, currentRound, currentPickNumber } = nextPickState;
      if (nextTeamId === playerTeamId && !autoPlayer) {
        return { finished: false, playerTurn: true };
      }

      this.executeSingleDraftPick(season, nextTeamId!, currentRound, currentPickNumber);
    }
  }

  public executeSingleDraftPick(season: number, teamId: number, draftRound: number, pickNumber: number, selectedRiderId?: number): void {
    const aufbau = this.buildWeightedPool(season, teamId);
    if (!aufbau) return;
    const { poolDetails, freeAgents, top1RiderId, teamTop, caps } = aufbau;

    const weights = poolDetails.map(p => p.weight);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let selectedIdx = -1;
    if (selectedRiderId !== undefined) {
      selectedIdx = poolDetails.findIndex(p => p.rider.id === selectedRiderId);
      // Harte Sperre: ein gesperrter Fahrer darf nicht gewaehlt werden, solange
      // es nicht-gesperrte Alternativen im Pool gibt.
      if (selectedIdx !== -1 && poolDetails[selectedIdx].blocked && poolDetails.some(p => !p.blocked)) {
        throw new Error('Dieser Fahrer ist im Draft gesperrt: Das Team hat sein Limit an Top-Fahrern erreicht.');
      }
    }

    let selectedOverride: { rider: any; weight: number; factors: string[] } | null = null;
    if (selectedIdx === -1) {
      // Automatische KI-Auswahl unter den nicht-gesperrten Pool-Kandidaten.
      const waehlbar = poolDetails.map((p, idx) => (p.blocked ? -1 : idx)).filter(idx => idx >= 0);
      // Nur die schwersten Kandidaten kommen in den Topf, siehe DRAFT_LOTTERY_SIZE.
      const eligibleIdx = waehlbar.length > DRAFT_LOTTERY_SIZE
        ? [...waehlbar].sort((a, b) => weights[b] - weights[a]).slice(0, DRAFT_LOTTERY_SIZE)
        : waehlbar;
      if (eligibleIdx.length > 0) {
        const candTotal = eligibleIdx.reduce((sum, idx) => sum + weights[idx], 0);
        selectedIdx = eligibleIdx[0];
        if (candTotal > 0) {
          const randomVal = Math.random() * candTotal;
          let cumulative = 0;
          for (const idx of eligibleIdx) {
            cumulative += weights[idx];
            if (randomVal <= cumulative) {
              selectedIdx = idx;
              break;
            }
          }
        }
      } else {
        // Der Pool (beste 30 nach Wert) ist komplett gesperrt (Team am Top-Limit,
        // nur noch Top-Fahrer verfuegbar). Statt das Limit zu verletzen, den besten
        // WAEHLBAREN Free Agent ausserhalb des Pools nehmen. Nur wenn es gar keinen
        // waehlbaren Fahrer gibt, dient der Pool als letztes Ventil.
        selectedOverride = (() => {
          const alt = freeAgents.find((r: any) =>
            r.old_team_id === teamId ||
            !this.topCapOutcome(r.overall_rating, teamTop.c77, teamTop.c74, caps.cap77, caps.cap74).blocked);
          return alt ? { rider: alt, weight: 0.01, factors: ['Ausweich: Team am Top-Limit'] } : null;
        })();
        if (!selectedOverride) selectedIdx = 0;
      }
    }

    const selected = selectedOverride ?? poolDetails[selectedIdx];
    const draftedRider = selected.rider;

    // Logging fuer drei Beispielteams — zeigt die Faktoren des Picks.
    if ([25, 7, 2].includes(teamId)) {
      console.log(`[DRAFT DEBUG] Team ${teamId} pickt in Runde ${draftRound}, Pick #${pickNumber}, Poolgroesse ${poolDetails.length}, Top-1 ${top1RiderId}:`);
      poolDetails.slice(0, 12).forEach((p, idx) => {
        const marke = p === selected ? '==>' : '   ';
        const prob = totalWeight > 0 ? (p.weight / totalWeight * 100) : 0;
        console.log(`    ${marke} ${p.rider.first_name} ${p.rider.last_name} (OVR ${p.rider.overall_rating.toFixed(1)}, Spez ${p.rider.specialization_1_id}, Nation ${p.rider.country_id}) Gewicht ${p.weight.toFixed(3)} [${p.factors.join(', ')}] ${prob.toFixed(1)} %`);
      });
    }

    // Vertragslaenge nach Alter, Potenzial und Prestige des Teams statt
    // gleichverteilt 1 bis 3. Siehe shared/contractTerms.ts — das ist die
    // Stellschraube, die die Kaderfluktuation von 15 auf 6 bis 10 senkt.
    const prestige = new TeamPrestigeService(this.db).loadPrestigeByTeamId().get(teamId) ?? 3;
    const contractLength = resolveContractYears({
      age: season - draftedRider.birth_year,
      potential: draftedRider.pot_overall,
      retirementAge: draftedRider.retirement_age ?? 0,
      teamPrestige: prestige,
    }, Math.random);
    const endSeason = season + contractLength - 1;

    const extendContract = this.db.prepare(`
      UPDATE contracts 
      SET end_season = end_season + ?, status = 'active'
      WHERE rider_id = ? AND team_id = ? AND end_season = ?
    `);

    const insertContract = this.db.prepare(`
      INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
      VALUES (?, ?, ?, ?, 'active')
    `);

    const insertHistory = this.db.prepare(`
      INSERT INTO draft_history (
        season, draft_round, pick_number, team_id, rider_id, 
        old_team_id, contract_length, overall_at_draft, 
        pot_overall_at_draft, draft_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertPoolCandidate = this.db.prepare(`
      INSERT INTO draft_picks_pool (season, pick_number, rider_id, weight, probability, old_team_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    if (draftedRider.old_team_id === teamId) {
      extendContract.run(contractLength, draftedRider.id, teamId, season - 1);
    } else {
      insertContract.run(draftedRider.id, teamId, season, endSeason);
    }

    insertHistory.run(
      season, draftRound, pickNumber, teamId, draftedRider.id,
      draftedRider.old_team_id, contractLength, draftedRider.overall_rating,
      draftedRider.pot_overall, draftedRider.draftValue
    );

    for (const p of poolDetails) {
      const prob = totalWeight > 0 ? (p.weight / totalWeight * 100) : 0;
      insertPoolCandidate.run(season, pickNumber, p.rider.id, p.weight, prob, p.rider.old_team_id);
    }

    // Update game_state current pick number
    this.db.prepare('UPDATE game_state SET draft_current_pick_number = ? WHERE id = 1').run(pickNumber + 1);
  }

  // Aktuelle >77/>74-Zaehlung je Draft-Team (aktive + zukuenftige Vertraege) plus
  // die daraus abgeleiteten, paritaetsgesteuert eskalierten Kappen.
  /**
   * Stellt den Kandidatenpool eines Picks zusammen und gewichtet ihn.
   *
   * Stand frueher zweimal im Dienst — einmal fuer den echten Pick, einmal fuer
   * die Kandidatenanzeige. Die beiden Kopien waren schon auseinandergelaufen
   * (unterschiedliche Herleitung von `top1RiderId`).
   *
   * Der Pool sind die 60 global besten Free Agents PLUS alle eigenen
   * auslaufenden Fahrer. Das zweite ist neu und behebt einen Fehler: der
   * Loyalitaetsbonus konnte einen Fahrer bisher gar nicht erreichen, wenn er
   * nicht zufaellig zu den besten von rund 2000 Vertragslosen gehoerte.
   * Gemessen waren deshalb nur 23 von 400 Picks Verlaengerungen.
   */
  private buildWeightedPool(season: number, teamId: number): {
    poolDetails: Array<{ rider: any; weight: number; factors: string[]; blocked: boolean }>;
    freeAgents: any[];
    top1RiderId: number;
    teamTop: { c77: number; c74: number };
    caps: { cap77: number; cap74: number };
  } | null {
    const rankedTeamIds = this.getRankedTeamIds(season);
    const rankIndex = rankedTeamIds.indexOf(teamId);

    const teamRow = this.db.prepare(
      'SELECT ai_focus_1, ai_focus_2, ai_focus_3, country_id FROM teams WHERE id = ?',
    ).get(teamId) as {
      ai_focus_1: number | null; ai_focus_2: number | null; ai_focus_3: number | null; country_id: number | null;
    } | undefined;
    const focusSpecIds = [teamRow?.ai_focus_1 ?? null, teamRow?.ai_focus_2 ?? null, teamRow?.ai_focus_3 ?? null];

    const freeAgentsRaw = this.db.prepare(`
      SELECT
        r.id, r.first_name, r.last_name, r.birth_year,
        r.overall_rating, r.pot_overall, r.peak_age, r.decline_age, r.retirement_age,
        r.specialization_1_id, r.specialization_2_id, r.specialization_3_id,
        r.country_id,
        (
          SELECT c.team_id FROM contracts c
          WHERE c.rider_id = r.id AND c.end_season = ?
          ORDER BY c.end_season DESC LIMIT 1
        ) AS old_team_id
      FROM riders r
      WHERE r.is_retired = 0
        AND (? - r.birth_year) < CASE WHEN r.retirement_age > 0 THEN r.retirement_age ELSE 36 END
        AND r.id NOT IN (SELECT rider_id FROM contracts WHERE status IN ('active', 'future'))
    `).all(season - 1, season) as any[];
    if (freeAgentsRaw.length === 0) return null;

    const freeAgents = freeAgentsRaw.map((r: any) => {
      const age = season - r.birth_year;
      const draftValue = age < 25 ? (r.overall_rating * 0.85) + (r.pot_overall * 0.15) : r.overall_rating;
      return { ...r, draftValue };
    }).sort((a: any, b: any) => b.draftValue - a.draftValue);

    const preferences = this.db.prepare(
      "SELECT country_id, weight, COALESCE(pref_kind, 'neighbour') AS kind FROM team_preferences WHERE team_id = ?",
    ).all(teamId) as Array<{ country_id: number; weight: number; kind: string }>;
    const nationKindByCountryId = new Map<number, NationPreferenceKind>();
    for (const pref of preferences) {
      const art = (pref.kind === 'home' || pref.kind === 'scouting') ? pref.kind : 'neighbour';
      nationKindByCountryId.set(pref.country_id, art as NationPreferenceKind);
    }
    // Die Heimatnation gilt immer, auch wenn sie nicht in der Tabelle steht.
    // Gemessen hatten sechs Teams keinen einzigen Landsmann im Kader.
    if (teamRow?.country_id != null) nationKindByCountryId.set(teamRow.country_id, 'home');

    // Zielverteilung der Spezialisierungen. Fehlt sie (alter Spielstand ohne
    // Tabelle), tragen die drei Fokusplaetze die alten Anteile nach.
    const targetShares = new Map<number, number>();
    for (const row of this.db.prepare(
      'SELECT spec_id, target_share FROM team_spec_targets WHERE team_id = ?',
    ).all(teamId) as Array<{ spec_id: number; target_share: number }>) {
      targetShares.set(row.spec_id, row.target_share);
    }
    if (targetShares.size === 0) {
      for (const specId of TARGET_SPEC_IDS) targetShares.set(specId, 10);
      const bonus = [18, 13, 9];
      focusSpecIds.forEach((specId, i) => {
        if (specId != null && targetShares.has(specId)) {
          targetShares.set(specId, (targetShares.get(specId) ?? 10) + bonus[i]);
        }
      });
    }

    // Pool: global beste 60, die eigenen auslaufenden Fahrer, dazu die besten
    // je bevorzugter Nation und je Fokusspezialisierung. Siehe die Konstanten
    // oben — ohne die beiden letzten Gruppen haetten Nation und Fokus nichts,
    // worauf sie wirken koennten.
    const pool = freeAgents.slice(0, Math.min(DRAFT_POOL_SIZE, freeAgents.length));
    const imPool = new Set(pool.map((r: any) => r.id));
    const dazu = (r: any) => { if (!imPool.has(r.id)) { pool.push(r); imPool.add(r.id); } };
    for (const r of freeAgents) {
      if (r.old_team_id === teamId) dazu(r);
    }
    const zielSpecs = resolveGoalSpecIds(targetShares);
    for (const specId of focusSpecIds) if (specId != null) zielSpecs.add(specId);
    const proNation = new Map<number, number>();
    const proFokus = new Map<number, number>();
    for (const r of freeAgents) {
      if (r.country_id != null && nationKindByCountryId.has(r.country_id)) {
        const n = proNation.get(r.country_id) ?? 0;
        if (n < DRAFT_POOL_PER_NATION) { proNation.set(r.country_id, n + 1); dazu(r); }
      }
      // Nicht nur die Fokusspezialisierungen: der Pool muss fuer *jede*
      // angestrebte Spezialisierung Kandidaten enthalten, sonst hat der
      // Zielanteil nichts, worauf er wirken koennte.
      if (r.specialization_1_id != null && zielSpecs.has(r.specialization_1_id)) {
        const n = proFokus.get(r.specialization_1_id) ?? 0;
        if (n < DRAFT_POOL_PER_FOCUS) { proFokus.set(r.specialization_1_id, n + 1); dazu(r); }
      }
    }
    const top1RiderId = freeAgents[0].id;
    const bestDraftValue = freeAgents[0].draftValue as number;

    // Zugehoerigkeit der eigenen Fahrer, fuer die abgestufte Loyalitaet.
    const tenure = new Map<number, number>();
    for (const row of this.db.prepare(`
      SELECT rider_id AS riderId, MIN(start_season) AS ersteSaison
      FROM contracts WHERE team_id = ? GROUP BY rider_id
    `).all(teamId) as Array<{ riderId: number; ersteSaison: number }>) {
      tenure.set(row.riderId, Math.max(0, season - row.ersteSaison));
    }


    const specCounts = this.getTeamSpecCounts(season, teamId);
    const openQuotaSpecIds = new Set<number>();
    for (const [specId, counts] of specCounts) {
      if (!hasMetQuota(specId, counts)) openQuotaSpecIds.add(specId);
    }

    const kader = this.db.prepare(`
      SELECT r.specialization_1_id AS specId, r.overall_rating AS overall,
             r.pot_overall AS potential, r.birth_year AS birthYear, r.peak_age AS peakAge
      FROM contracts c JOIN riders r ON r.id = c.rider_id
      WHERE c.team_id = ? AND c.status IN ('active', 'future')
    `).all(teamId) as Array<{ specId: number | null; overall: number; potential: number; birthYear: number; peakAge: number | null }>;
    const strongCountBySpecId = new Map<number, number>();
    let imFokus = 0;
    for (const r of kader) {
      if (r.specId == null) continue;
      if (focusSpecIds.includes(r.specId)) imFokus += 1;
      if (r.overall >= STRONG_RIDER_OVERALL) strongCountBySpecId.set(r.specId, (strongCountBySpecId.get(r.specId) ?? 0) + 1);
    }
    const focusShare = kader.length > 0 ? imFokus / kader.length : 0;

    const specState: TeamSpecState = {
      targetShares,
      actualShares: resolveActualShares(kader.map((r) => ({ specId: r.specId }))),
      coveredSpecIds: resolveCoveredSpecIds(kader.map((r) => ({
        specId: r.specId,
        overall: r.overall,
        potential: r.potential,
        age: season - r.birthYear,
        peakAge: r.peakAge,
      }))),
    };

    // Zielwert starker Fahrer je Spezialisierung aus der tatsaechlichen
    // Knappheit: bei 10 starken Pflasterfahrern und 25 Teams ist er 1.
    const teamCount = Math.max(1, rankedTeamIds.length);
    const strongTargetBySpecId = new Map<number, number>();
    for (const row of this.db.prepare(`
      SELECT specialization_1_id AS specId, COUNT(*) AS anzahl
      FROM riders WHERE is_retired = 0 AND overall_rating >= ${STRONG_RIDER_OVERALL} AND specialization_1_id IS NOT NULL
      GROUP BY specialization_1_id
    `).all() as Array<{ specId: number; anzahl: number }>) {
      strongTargetBySpecId.set(row.specId, Math.max(1, Math.ceil(row.anzahl / teamCount)));
    }

    const { capsByTeam, countsByTeam } = this.computeTopRiderCaps(season);
    const teamTop = countsByTeam.get(teamId) ?? { c77: 0, c74: 0 };
    const caps = capsByTeam.get(teamId) ?? resolveTopRiderCaps(3);

    const team: DraftTeamInput = {
      teamId,
      focusSpecIds,
      nationKindByCountryId,
      openQuotaSpecIds,
      quotaSpecIdsCountingSecondary: new Set<number>([4, 5]),
      strongCountBySpecId,
      strongTargetBySpecId,
      focusShare,
      specState,
      rankIndex,
    };

    const poolDetails = pool.map((rider: any) => {
      const age = season - rider.birth_year;
      const eingabe: DraftRiderInput = {
        riderId: rider.id,
        overall: rider.overall_rating,
        potential: rider.pot_overall,
        age,
        draftValue: rider.draftValue,
        specialization1Id: rider.specialization_1_id,
        specialization2Id: rider.specialization_2_id,
        specialization3Id: rider.specialization_3_id,
        countryId: rider.country_id,
        oldTeamId: rider.old_team_id,
        tenureSeasons: tenure.get(rider.id) ?? 0,
        isDeclining: rider.decline_age > 0 && age >= rider.decline_age,
        peakAge: rider.peak_age ?? null,
      };
      // Der eigene Fahrer zaehlt schon fuer das Team — die Kappe gilt fuer ihn nicht.
      const kappe = rider.old_team_id === teamId
        ? { blocked: false, factor: 1, label: null }
        : this.topCapOutcome(rider.overall_rating, teamTop.c77, teamTop.c74, caps.cap77, caps.cap74);
      const ergebnis = resolveDraftWeight(eingabe, team, bestDraftValue, kappe);
      return { rider, weight: ergebnis.weight, factors: ergebnis.factors, blocked: ergebnis.blocked };
    });

    return { poolDetails, freeAgents, top1RiderId, teamTop, caps };
  }

  private computeTopRiderCaps(season: number): {
    capsByTeam: Map<number, { cap77: number; cap74: number }>;
    countsByTeam: Map<number, { c77: number; c74: number }>;
  } {
    const teamIds = this.getRankedTeamIds(season);
    const countsByTeam = new Map<number, { c77: number; c74: number }>();
    for (const id of teamIds) countsByTeam.set(id, { c77: 0, c74: 0 });

    const rows = this.db.prepare(`
      SELECT c.team_id AS teamId,
             SUM(CASE WHEN r.overall_rating > ${TOP_THRESHOLD_77} THEN 1 ELSE 0 END) AS c77,
             SUM(CASE WHEN r.overall_rating > ${TOP_THRESHOLD_74} THEN 1 ELSE 0 END) AS c74
      FROM contracts c
      JOIN riders r ON r.id = c.rider_id
      WHERE c.status IN ('active', 'future') AND r.is_retired = 0
      GROUP BY c.team_id
    `).all() as Array<{ teamId: number; c77: number; c74: number }>;
    for (const row of rows) {
      if (countsByTeam.has(row.teamId)) countsByTeam.set(row.teamId, { c77: row.c77, c74: row.c74 });
    }

    // Kaderbelegung je Team + Maximalgroesse — nur Teams MIT freiem Kaderplatz
    // gaten die Eskalation (ein volles Team kann ohnehin nicht mehr picken und
    // darf die Kappe nicht dauerhaft blockieren).
    const rosterRows = this.db.prepare(`
      SELECT t.id AS teamId, dt.max_roster_size AS maxSize,
             (SELECT COUNT(*) FROM contracts c WHERE c.team_id = t.id AND c.status IN ('active','future')) AS rosterSize
      FROM teams t JOIN division_teams dt ON dt.id = t.division_id
    `).all() as Array<{ teamId: number; maxSize: number; rosterSize: number }>;
    const hasSpace = new Map<number, boolean>();
    for (const r of rosterRows) hasSpace.set(r.teamId, r.rosterSize < r.maxSize);

    // Die Grundkappe haengt jetzt am Prestige des Teams.
    const prestige = new TeamPrestigeService(this.db).loadPrestigeByTeamId();
    const basis = new Map<number, { cap77: number; cap74: number }>();
    for (const id of teamIds) basis.set(id, resolveTopRiderCaps(prestige.get(id) ?? 3));

    // Eskalation: erst wenn ALLE noch pickenden Teams ihre eigene Kappe
    // ausgereizt haben, steigt sie fuer alle. Massstab ist deshalb das Team
    // mit der GROESSTEN verbleibenden Luft — solange irgendwo noch Platz ist,
    // bleibt die Kappe stehen. Und wenn niemand mehr Platz hat, steigt sie um
    // so viel, dass wieder jeder greifen kann: kein Team soll leer ausgehen,
    // nur weil die Top-Fahrer uebrig sind.
    //
    // Gemessen wird der Abstand zur EIGENEN Kappe, nicht die absolute Zahl —
    // sonst haette ein Prestige-1-Team mit Kappe 2 die Eskalation ausgeloest,
    // waehrend Spitzenteams noch vier Plaetze frei hatten.
    let luft77 = -Infinity, luft74 = -Infinity;
    for (const [id, v] of countsByTeam.entries()) {
      if (hasSpace.get(id) === false) continue;
      const b = basis.get(id) ?? resolveTopRiderCaps(3);
      luft77 = Math.max(luft77, b.cap77 - v.c77);
      luft74 = Math.max(luft74, b.cap74 - v.c74);
    }
    const stufe77 = isFinite(luft77) ? Math.max(0, 1 - luft77) : 0;
    const stufe74 = isFinite(luft74) ? Math.max(0, 1 - luft74) : 0;

    const capsByTeam = new Map<number, { cap77: number; cap74: number }>();
    for (const [id, b] of basis) capsByTeam.set(id, { cap77: b.cap77 + stufe77, cap74: b.cap74 + stufe74 });
    return { capsByTeam, countsByTeam };
  }

  // Wirkung der Top-Kappe auf einen Kandidaten fuer ein Team: harte Sperre bei
  // Erreichen der Kappe, sonst weiche Gewichts-Strafe (Rampe).
  private topCapOutcome(
    overall: number, c77: number, c74: number, cap77: number, cap74: number,
  ): { blocked: boolean; factor: number; label: string | null } {
    const is77 = overall > TOP_THRESHOLD_77;
    const is74 = overall > TOP_THRESHOLD_74;
    if (is77 && c77 >= cap77) return { blocked: true, factor: 0, label: `Sperre: ${cap77} Fahrer >${TOP_THRESHOLD_77} erreicht` };
    if (is74 && c74 >= cap74) return { blocked: true, factor: 0, label: `Sperre: ${cap74} Fahrer >${TOP_THRESHOLD_74} erreicht` };
    let factor = 1;
    const parts: string[] = [];
    if (is77 && c77 > 0) {
      factor /= 1 + (TOP77_RAMP * c77);
      parts.push(`>${TOP_THRESHOLD_77}-Stacking`);
    }
    if (is74 && c74 >= TOP74_SOFT_START) {
      factor /= 1 + (TOP74_RAMP * (c74 - TOP74_SOFT_START + 1));
      parts.push(`>${TOP_THRESHOLD_74}-Stacking`);
    }
    return { blocked: false, factor, label: parts.length ? parts.join(', ') : null };
  }

  private getTeamSpecCounts(season: number, teamId: number): Map<number, { spec1: number; spec23: number }> {
    const map = new Map<number, { spec1: number; spec23: number }>();
    for (let sId = 1; sId <= 5; sId++) {
      map.set(sId, { spec1: 0, spec23: 0 });
    }

    const activeRiders = this.db.prepare(`
      SELECT 
        r.specialization_1_id,
        r.specialization_2_id,
        r.specialization_3_id
      FROM contracts c
      JOIN riders r ON c.rider_id = r.id
      WHERE c.team_id = ? AND c.status IN ('active', 'future')
    `).all(teamId) as Array<{
      specialization_1_id: number | null;
      specialization_2_id: number | null;
      specialization_3_id: number | null;
    }>;

    for (const r of activeRiders) {
      if (r.specialization_1_id && r.specialization_1_id >= 1 && r.specialization_1_id <= 5) {
        map.get(r.specialization_1_id)!.spec1++;
      }
      if (r.specialization_2_id && r.specialization_2_id >= 1 && r.specialization_2_id <= 5) {
        map.get(r.specialization_2_id)!.spec23++;
      }
      if (r.specialization_3_id && r.specialization_3_id >= 1 && r.specialization_3_id <= 5) {
        map.get(r.specialization_3_id)!.spec23++;
      }
    }
    return map;
  }

  public getDraftCandidatesForNextPick(season: number): any[] {
    const nextPickState = this.getNextPickState(season);
    if (nextPickState.finished || nextPickState.nextTeamId === null) {
      return [];
    }

    const teamId = nextPickState.nextTeamId;
    const rankedTeamIds = this.getRankedTeamIds(season);
    const i = rankedTeamIds.indexOf(teamId);

    // AI Focus Details
    const teamRow = this.db.prepare('SELECT ai_focus_1, ai_focus_2, ai_focus_3 FROM teams WHERE id = ?').get(teamId) as {
      ai_focus_1: number | null;
      ai_focus_2: number | null;
      ai_focus_3: number | null;
    } | undefined;
    const aiFocus1 = teamRow?.ai_focus_1 ?? null;
    const aiFocus2 = teamRow?.ai_focus_2 ?? null;
    const aiFocus3 = teamRow?.ai_focus_3 ?? null;

    const aufbau = this.buildWeightedPool(season, teamId);
    if (!aufbau) return [];
    const { poolDetails } = aufbau;

    const totalWeight = poolDetails.map(p => p.weight).reduce((sum, w) => sum + w, 0);

    // Get old team names, specialization names, country code, uci ranks, and wins
    const uciPointsRows = this.db.prepare(`
      SELECT rider_id, SUM(points_awarded) AS points
      FROM season_point_events
      WHERE season = ?
      GROUP BY rider_id
      ORDER BY points DESC
    `).all(season - 1) as Array<{ rider_id: number, points: number }>;
    
    const uciRanks = new Map<number, number>();
    uciPointsRows.forEach((row, index) => {
      uciRanks.set(row.rider_id, index + 1);
    });

    const winsMap = new Map<number, number>();
    const riderIds = poolDetails.map(p => p.rider.id);
    if (riderIds.length > 0) {
      const placeholders = riderIds.map(() => '?').join(',');
      const winsRows = this.db.prepare(`
        SELECT rider_id, SUM(gc_wins + stage_wins + one_day_wins) AS wins
        FROM rider_career_category_stats
        WHERE rider_id IN (${placeholders})
        GROUP BY rider_id
      `).all(...riderIds) as Array<{ rider_id: number; wins: number }>;

      for (const row of winsRows) {
        winsMap.set(row.rider_id, row.wins);
      }
    }

    const typeRiderRows = this.db.prepare('SELECT id, display_name FROM type_rider').all() as Array<{ id: number; display_name: string }>;
    const typeRiderMap = new Map<number, string>();
    typeRiderRows.forEach(row => typeRiderMap.set(row.id, row.display_name));

    const countryRows = this.db.prepare('SELECT id, code_3 FROM sta_country').all() as Array<{ id: number; code_3: string }>;
    const countryMap = new Map<number, string>();
    countryRows.forEach(row => countryMap.set(row.id, row.code_3));

    const teamNamesRows = this.db.prepare('SELECT id, name FROM teams').all() as Array<{ id: number; name: string }>;
    const teamNamesMap = new Map<number, string>();
    teamNamesRows.forEach(row => teamNamesMap.set(row.id, row.name));

    return poolDetails.map(p => {
      const prob = totalWeight > 0 ? (p.weight / totalWeight * 100) : 0;
      return {
        riderId: p.rider.id,
        firstName: p.rider.first_name,
        lastName: p.rider.last_name,
        countryCode: countryMap.get(p.rider.country_id ?? 0) ?? '',
        specialization1: typeRiderMap.get(p.rider.specialization_1_id ?? 0) ?? null,
        specialization2: typeRiderMap.get(p.rider.specialization_2_id ?? 0) ?? null,
        specialization3: typeRiderMap.get(p.rider.specialization_3_id ?? 0) ?? null,
        overallRating: p.rider.overall_rating,
        potential: p.rider.pot_overall,
        probability: prob,
        oldTeamId: p.rider.old_team_id,
        oldTeamName: p.rider.old_team_id ? teamNamesMap.get(p.rider.old_team_id) : null,
        birthYear: p.rider.birth_year,
        uciRank: uciRanks.get(p.rider.id) ?? null,
        wins: winsMap.get(p.rider.id) ?? 0,
        factors: p.factors,
        // Top-Fahrer-Kappe: gesperrte Kandidaten werden in der UI ausgegraut.
        blocked: (p as any).blocked === true,
        blockReason: (p as any).blocked
          ? (p.rider.overall_rating > TOP_THRESHOLD_77
            ? `Team-Limit erreicht: ${aufbau.caps.cap77} Fahrer >${TOP_THRESHOLD_77}`
            : `Team-Limit erreicht: ${aufbau.caps.cap74} Fahrer >${TOP_THRESHOLD_74}`)
          : null,
      };
    });
  }
}