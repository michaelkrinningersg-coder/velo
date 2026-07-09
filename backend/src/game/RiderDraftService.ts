import Database from 'better-sqlite3';
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
// Zwei Baender (strikt groesser): >77 (Basiskappe 4) und >74 (Basiskappe 10).
// "Weiche Rampe + hartes Deckel-Limit": je naeher ein Team an der Kappe, desto
// staerker die Gewichts-Strafe; bei Erreichen der (ggf. eskalierten) Kappe ist
// der Fahrer fuer dieses Team hart gesperrt. Eskalation paritaetsgesteuert:
// erst wenn JEDES Team die aktuelle Kappe erreicht hat, steigt sie um 1
// (4->5->6 …, 10->11->12 …), damit der Draft nie blockiert.
const TOP_CAP_77_BASE = 4;
const TOP_CAP_74_BASE = 10;
const TOP_THRESHOLD_77 = 77; // strikt groesser
const TOP_THRESHOLD_74 = 74; // strikt groesser
const TOP77_RAMP = 3.0;      // Strafe je bereits vorhandenem >77-Fahrer
const TOP74_SOFT_START = 7;  // ab so vielen >74-Fahrern beginnt die weiche Rampe
const TOP74_RAMP = 1.5;      // Strafe je >74-Fahrer oberhalb TOP74_SOFT_START

const draftSequenceChunks = [
  [0, 4],   // Runde 0: Plätze 1-5
  [0, 4],   // Runde 1: Plätze 1-5
  [0, 4],   // Runde 2: Plätze 1-5
  [5, 9],   // Runde 3: Plätze 6-10
  [0, 4],   // Runde 4: Plätze 1-5
  [5, 9],   // Runde 5: Plätze 6-10
  [10, 14], // Runde 6: Plätze 11-15
  [0, 4],   // Runde 7: Plätze 1-5
  [5, 9],   // Runde 8: Plätze 6-10
  [10, 14], // Runde 9: Plätze 11-15
  [15, 19], // Runde 10: Plätze 16-20
  [0, 4],   // Runde 11: Plätze 1-5
  [5, 9],   // Runde 12: Plätze 6-10
  [10, 14], // Runde 13: Plätze 11-15
  [15, 19], // Runde 14: Plätze 16-20
  [20, 24]  // Runde 15: Plätze 21-25
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
    return rankedTeamIds;
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
        let totalFreeSlots = 0;
        for (const teamId of rankedTeamIds) {
          const count = teamCountsMap.get(teamId) || 0;
          const maxRosterSize = teamLimitsMap.get(teamId) ?? 30;
          if (count < maxRosterSize) {
            totalFreeSlots += (maxRosterSize - count);
          }
        }
        if (totalFreeSlots === 0) {
          allTeamsFull = true;
          break;
        }
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

    // Load undrafted free agents
    const freeAgentsRaw = this.db.prepare(`
      SELECT 
        r.id, 
        r.first_name, 
        r.last_name, 
        r.birth_year,
        r.overall_rating, 
        r.pot_overall,
        r.specialization_1_id,
        r.specialization_2_id,
        r.specialization_3_id,
        r.country_id,
        (
          SELECT c.team_id 
          FROM contracts c 
          WHERE c.rider_id = r.id AND c.end_season = ? 
          ORDER BY c.end_season DESC LIMIT 1
        ) AS old_team_id
      FROM riders r
      WHERE r.is_retired = 0
        AND (? - r.birth_year) < CASE WHEN r.retirement_age > 0 THEN r.retirement_age ELSE 36 END
        AND r.id NOT IN (
          SELECT rider_id FROM contracts WHERE status IN ('active', 'future')
        )
    `).all(season - 1, season) as Array<{
      id: number;
      first_name: string;
      last_name: string;
      birth_year: number;
      overall_rating: number;
      pot_overall: number;
      specialization_1_id: number | null;
      specialization_2_id: number | null;
      specialization_3_id: number | null;
      country_id: number | null;
      old_team_id: number | null;
    }>;

    if (freeAgentsRaw.length === 0) return;

    // Calculate draft value and sort
    const freeAgents = freeAgentsRaw.map((r: any) => {
      const age = season - r.birth_year;
      let draftValue = r.overall_rating;
      if (age < 25) {
        draftValue = (r.overall_rating * 0.85) + (r.pot_overall * 0.15);
      }
      return { ...r, draftValue };
    }).sort((a: any, b: any) => b.draftValue - a.draftValue);

    const poolSize = Math.min(30, freeAgents.length);
    const pool = freeAgents.slice(0, poolSize);
    const top1RiderId = freeAgents[0].id;

    // Calculate top1PassedOverCount dynamically
    const history = this.db.prepare('SELECT rider_id FROM draft_history WHERE season = ? ORDER BY pick_number ASC').all(season) as Array<{ rider_id: number }>;
    const freeAgentsForTop1 = [...freeAgents];
    let top1PassedOverCount = 0;
    for (const pick of history) {
      const currentTop1Id = freeAgentsForTop1[0]?.id;
      if (pick.rider_id === currentTop1Id) {
        top1PassedOverCount = 0;
      } else {
        top1PassedOverCount++;
      }
      const idx = freeAgentsForTop1.findIndex(f => f.id === pick.rider_id);
      if (idx !== -1) {
        freeAgentsForTop1.splice(idx, 1);
      }
    }

    // Team preferences
    const preferences = this.db.prepare(`
      SELECT country_id, weight
      FROM team_preferences
      WHERE team_id = ?
    `).all(teamId) as Array<{ country_id: number; weight: number }>;

    // Spec counts for quotas
    const teamMap = this.getTeamSpecCounts(season, teamId);

    // Top-Fahrer-Kappe: aktuelle (eskalierte) Kappen + Zaehlung dieses Teams.
    const { cap77, cap74, countsByTeam } = this.computeTopRiderCaps(season);
    const teamTop = countsByTeam.get(teamId) ?? { c77: 0, c74: 0 };

    // Count active strong riders (OVR >= 75) in each specialization for this team
    const strongRiders = this.db.prepare(`
      SELECT r.specialization_1_id AS spec1Id, COUNT(*) AS count
      FROM contracts c
      JOIN riders r ON c.rider_id = r.id
      WHERE c.team_id = ? AND c.status IN ('active', 'future') AND r.overall_rating >= 75
      GROUP BY r.specialization_1_id
    `).all(teamId) as Array<{ spec1Id: number | null; count: number }>;

    const strongSpecsCount = new Map<number, number>();
    for (const row of strongRiders) {
      if (row.spec1Id !== null) {
        strongSpecsCount.set(row.spec1Id, row.count);
      }
    }

    // Compute weights
    const poolDetails = pool.map((rider) => {
      let weight = 1.0;
      const factors: string[] = [];

      const age = season - rider.birth_year;
      const isRank21to25 = (i >= 20 && i <= 24);

      if (isRank21to25) {
        let baseVal = (rider.overall_rating * 0.65) + (rider.pot_overall * 0.35);
        if (age < 25) {
          baseVal *= 4.0;
          factors.push(`U25 Bias (x4)`);
        }
        weight = baseVal / 70.0;
        factors.push(`Base Quality (65% Skill, 35% Pot): ${weight.toFixed(2)}`);
      }

      // AI Focus weights
      if (rider.specialization_1_id !== null) {
        if (rider.specialization_1_id === aiFocus1) {
          weight += 4.0;
          factors.push(`AI Focus 1 (+4)`);
        } else if (rider.specialization_1_id === aiFocus2) {
          weight += 2.0;
          factors.push(`AI Focus 2 (+2)`);
        } else if (rider.specialization_1_id === aiFocus3) {
          weight += 1.0;
          factors.push(`AI Focus 3 (+1)`);
        }
      }

      // Nationality weights
      if (rider.country_id !== null) {
        const pref = preferences.find(p => p.country_id === rider.country_id);
        if (pref) {
          weight += pref.weight;
          factors.push(`Nation Pref (+${pref.weight})`);
        }
      }

      // Loyalty weight
      if (rider.old_team_id === teamId) {
        weight += 9.0;
        factors.push(`Loyalty (+9)`);
      }

      // Top 1 Protection
      if (rider.id === top1RiderId) {
        if (top1PassedOverCount > 0) {
          const bonus = top1PassedOverCount * 0.05;
          weight += bonus;
          factors.push(`Top1 Protect (+${bonus.toFixed(2)})`);
        }
      }

      // Quota spec checks
      for (let sId = 1; sId <= 5; sId++) {
        const counts = teamMap.get(sId)!;
        const quotaMet = hasMetQuota(sId, counts);
        if (!quotaMet) {
          let helps = false;
          if (sId === 4 || sId === 5) {
            helps = (rider.specialization_1_id === sId || rider.specialization_2_id === sId || rider.specialization_3_id === sId);
          } else {
            helps = (rider.specialization_1_id === sId);
          }

          if (helps) {
            weight += 15.0;
            const specLabel = sId === 1 ? 'Berg' : sId === 2 ? 'Hügel' : sId === 3 ? 'Sprint' : sId === 4 ? 'ZF' : 'Cobble';
            factors.push(`${specLabel} Quota (+15)`);
          }
        }
      }

      // Concept 1 & 2: Diversification of strong riders (OVR >= 75)
      const isStrong = rider.overall_rating >= 75;
      const isRenewal = rider.old_team_id === teamId;

      if (isStrong && !isRenewal && rider.specialization_1_id !== null) {
        const existingStrongCount = strongSpecsCount.get(rider.specialization_1_id) ?? 0;
        if (existingStrongCount >= 2) {
          const penalty = 15.0;
          weight -= penalty;
          const specLabel = rider.specialization_1_id === 1 ? 'Berg' : rider.specialization_1_id === 2 ? 'Hügel' : rider.specialization_1_id === 3 ? 'Sprint' : rider.specialization_1_id === 4 ? 'ZF' : 'Cobble';
          factors.push(`Spitzen-Diversifizierung: Bereits ${existingStrongCount} starke ${specLabel}fahrer (-${penalty})`);
        }
      }

      // Top-Fahrer-Kappe: weiche Rampe unterhalb der Kappe, harte Sperre bei
      // Erreichen der (eskalierten) Kappe. Renewals des eigenen Fahrers sind
      // ausgenommen (der Fahrer zaehlt bereits fuer das Team).
      const capOut = this.topCapOutcome(rider.overall_rating, teamTop.c77, teamTop.c74, cap77, cap74);
      let blocked = false;
      if (rider.old_team_id !== teamId) {
        if (capOut.blocked) {
          blocked = true;
          if (capOut.factor) factors.push(capOut.factor);
        } else if (capOut.penalty > 0) {
          weight -= capOut.penalty;
          if (capOut.factor) factors.push(capOut.factor);
        }
      }

      if (weight < 0.01) {
        weight = 0.01;
      }

      return { rider, weight, factors, blocked };
    });

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
      const eligibleIdx = poolDetails.map((p, idx) => (p.blocked ? -1 : idx)).filter(idx => idx >= 0);
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
            !this.topCapOutcome(r.overall_rating, teamTop.c77, teamTop.c74, cap77, cap74).blocked);
          return alt ? { rider: alt, weight: 0.01, factors: ['Ausweich: Team am Top-Limit'] } : null;
        })();
        if (!selectedOverride) selectedIdx = 0;
      }
    }

    const selected = selectedOverride ?? poolDetails[selectedIdx];
    const draftedRider = selected.rider;

    // Logging
    if ([25, 7, 2].includes(teamId)) {
      const teamName = teamId === 25 ? 'Falke - Scott' : teamId === 7 ? 'Philips - Santander' : 'Decathlon - Renault';
      console.log(`[DRAFT DEBUG] ${teamName} (ID ${teamId}) picks in Round ${draftRound}, Pick #${pickNumber}:`);
      console.log(`  Team AI Focus: 1=${aiFocus1}, 2=${aiFocus2}, 3=${aiFocus3}`);
      console.log(`  Team National Prefs: ${preferences.map(p => `${p.country_id}(+${p.weight})`).join(', ') || 'None'}`);
      console.log(`  Candidate Pool (Pool Size: ${pool.length}, Top 1 ID: ${top1RiderId}):`);
      poolDetails.forEach((p, idx) => {
        const isSelected = idx === selectedIdx ? '==>' : '   ';
        const prob = totalWeight > 0 ? (p.weight / totalWeight * 100) : 0;
        console.log(`    ${isSelected} [#${idx + 1}] Rider ID ${p.rider.id}: ${p.rider.first_name} ${p.rider.last_name} (OVR: ${p.rider.overall_rating.toFixed(1)}, Spec: ${p.rider.specialization_1_id}, Nation: ${p.rider.country_id}) - DraftValue: ${p.rider.draftValue.toFixed(1)} - Weight: ${p.weight.toFixed(2)} [${p.factors.join(', ') || 'None'}] - Prob: ${prob.toFixed(1)}%`);
      });
    }

    // contract years 1 to 3
    const contractLength = Math.floor(Math.random() * 3) + 1;
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
  private computeTopRiderCaps(season: number): {
    cap77: number; cap74: number; countsByTeam: Map<number, { c77: number; c74: number }>;
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

    let min77 = Infinity, min74 = Infinity;
    for (const [id, v] of countsByTeam.entries()) {
      if (hasSpace.get(id) === false) continue; // volle Teams ausklammern
      min77 = Math.min(min77, v.c77); min74 = Math.min(min74, v.c74);
    }
    if (!isFinite(min77)) { min77 = 0; min74 = 0; }

    // Kappe steigt erst, wenn ALLE noch pickenden Teams die aktuelle Kappe erreicht haben.
    const cap77 = Math.max(TOP_CAP_77_BASE, min77 + 1);
    const cap74 = Math.max(TOP_CAP_74_BASE, min74 + 1);
    return { cap77, cap74, countsByTeam };
  }

  // Wirkung der Top-Kappe auf einen Kandidaten fuer ein Team: harte Sperre bei
  // Erreichen der Kappe, sonst weiche Gewichts-Strafe (Rampe).
  private topCapOutcome(
    overall: number, c77: number, c74: number, cap77: number, cap74: number,
  ): { blocked: boolean; penalty: number; factor: string | null } {
    const is77 = overall > TOP_THRESHOLD_77;
    const is74 = overall > TOP_THRESHOLD_74;
    if (is77 && c77 >= cap77) return { blocked: true, penalty: 0, factor: `Sperre: ${cap77} Fahrer >${TOP_THRESHOLD_77} erreicht` };
    if (is74 && c74 >= cap74) return { blocked: true, penalty: 0, factor: `Sperre: ${cap74} Fahrer >${TOP_THRESHOLD_74} erreicht` };
    let penalty = 0;
    const parts: string[] = [];
    if (is77 && c77 > 0) {
      const p = TOP77_RAMP * c77;
      penalty += p;
      parts.push(`>${TOP_THRESHOLD_77}-Stacking (-${p.toFixed(1)})`);
    }
    if (is74 && c74 >= TOP74_SOFT_START) {
      const p = TOP74_RAMP * (c74 - TOP74_SOFT_START + 1);
      penalty += p;
      parts.push(`>${TOP_THRESHOLD_74}-Stacking (-${p.toFixed(1)})`);
    }
    return { blocked: false, penalty, factor: parts.length ? parts.join(', ') : null };
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

    // Load undrafted free agents
    const freeAgentsRaw = this.db.prepare(`
      SELECT 
        r.id, 
        r.first_name, 
        r.last_name, 
        r.birth_year,
        r.overall_rating, 
        r.pot_overall,
        r.specialization_1_id,
        r.specialization_2_id,
        r.specialization_3_id,
        r.country_id,
        (
          SELECT c.team_id 
          FROM contracts c 
          WHERE c.rider_id = r.id AND c.end_season = ? 
          ORDER BY c.end_season DESC LIMIT 1
        ) AS old_team_id
      FROM riders r
      WHERE r.is_retired = 0
        AND (? - r.birth_year) < CASE WHEN r.retirement_age > 0 THEN r.retirement_age ELSE 36 END
        AND r.id NOT IN (
          SELECT rider_id FROM contracts WHERE status IN ('active', 'future')
        )
    `).all(season - 1, season) as Array<{
      id: number;
      first_name: string;
      last_name: string;
      birth_year: number;
      overall_rating: number;
      pot_overall: number;
      specialization_1_id: number | null;
      specialization_2_id: number | null;
      specialization_3_id: number | null;
      country_id: number | null;
      old_team_id: number | null;
    }>;

    if (freeAgentsRaw.length === 0) return [];

    // Calculate draft value and sort
    const freeAgents = freeAgentsRaw.map((r: any) => {
      const age = season - r.birth_year;
      let draftValue = r.overall_rating;
      if (age < 25) {
        draftValue = (r.overall_rating * 0.85) + (r.pot_overall * 0.15);
      }
      return { ...r, draftValue };
    }).sort((a: any, b: any) => b.draftValue - a.draftValue);

    const poolSize = Math.min(30, freeAgents.length);
    const pool = freeAgents.slice(0, poolSize);
    const top1RiderId = pool[0].id;

    // Calculate top1PassedOverCount dynamically
    const history = this.db.prepare('SELECT rider_id FROM draft_history WHERE season = ? ORDER BY pick_number ASC').all(season) as Array<{ rider_id: number }>;
    const freeAgentsForTop1 = [...freeAgents];
    let top1PassedOverCount = 0;
    for (const pick of history) {
      const currentTop1Id = freeAgentsForTop1[0]?.id;
      if (pick.rider_id === currentTop1Id) {
        top1PassedOverCount = 0;
      } else {
        top1PassedOverCount++;
      }
      const idx = freeAgentsForTop1.findIndex(f => f.id === pick.rider_id);
      if (idx !== -1) {
        freeAgentsForTop1.splice(idx, 1);
      }
    }

    // Team preferences
    const preferences = this.db.prepare(`
      SELECT country_id, weight
      FROM team_preferences
      WHERE team_id = ?
    `).all(teamId) as Array<{ country_id: number; weight: number }>;

    // Spec counts for quotas
    const teamMap = this.getTeamSpecCounts(season, teamId);

    // Top-Fahrer-Kappe: aktuelle (eskalierte) Kappen + Zaehlung dieses Teams.
    const { cap77, cap74, countsByTeam } = this.computeTopRiderCaps(season);
    const teamTop = countsByTeam.get(teamId) ?? { c77: 0, c74: 0 };

    // Count active strong riders (OVR >= 75) in each specialization for this team
    const strongRiders = this.db.prepare(`
      SELECT r.specialization_1_id AS spec1Id, COUNT(*) AS count
      FROM contracts c
      JOIN riders r ON c.rider_id = r.id
      WHERE c.team_id = ? AND c.status IN ('active', 'future') AND r.overall_rating >= 75
      GROUP BY r.specialization_1_id
    `).all(teamId) as Array<{ spec1Id: number | null; count: number }>;

    const strongSpecsCount = new Map<number, number>();
    for (const row of strongRiders) {
      if (row.spec1Id !== null) {
        strongSpecsCount.set(row.spec1Id, row.count);
      }
    }

    // Compute weights
    const poolDetails = pool.map((rider) => {
      let weight = 1.0;
      const factors: string[] = [];

      const age = season - rider.birth_year;
      const isRank21to25 = (i >= 20 && i <= 24);

      if (isRank21to25) {
        let baseVal = (rider.overall_rating * 0.65) + (rider.pot_overall * 0.35);
        if (age < 25) {
          baseVal *= 4.0;
          factors.push(`U25 Bias (x4)`);
        }
        weight = baseVal / 70.0;
        factors.push(`Base Quality (65% Skill, 35% Pot): ${weight.toFixed(2)}`);
      }

      // AI Focus weights
      if (rider.specialization_1_id !== null) {
        if (rider.specialization_1_id === aiFocus1) {
          weight += 4.0;
          factors.push(`AI Focus 1 (+4)`);
        } else if (rider.specialization_1_id === aiFocus2) {
          weight += 2.0;
          factors.push(`AI Focus 2 (+2)`);
        } else if (rider.specialization_1_id === aiFocus3) {
          weight += 1.0;
          factors.push(`AI Focus 3 (+1)`);
        }
      }

      // Nationality weights
      if (rider.country_id !== null) {
        const pref = preferences.find(p => p.country_id === rider.country_id);
        if (pref) {
          weight += pref.weight;
          factors.push(`Nation Pref (+${pref.weight})`);
        }
      }

      // Loyalty weight
      if (rider.old_team_id === teamId) {
        weight += 9.0;
        factors.push(`Loyalty (+9)`);
      }

      // Top 1 Protection
      if (rider.id === top1RiderId) {
        if (top1PassedOverCount > 0) {
          const bonus = top1PassedOverCount * 0.05;
          weight += bonus;
          factors.push(`Top1 Protect (+${bonus.toFixed(2)})`);
        }
      }

      // Quota spec checks
      for (let sId = 1; sId <= 5; sId++) {
        const counts = teamMap.get(sId)!;
        const quotaMet = hasMetQuota(sId, counts);
        if (!quotaMet) {
          let helps = false;
          if (sId === 4 || sId === 5) {
            helps = (rider.specialization_1_id === sId || rider.specialization_2_id === sId || rider.specialization_3_id === sId);
          } else {
            helps = (rider.specialization_1_id === sId);
          }

          if (helps) {
            weight += 15.0;
            const specLabel = sId === 1 ? 'Berg' : sId === 2 ? 'Hügel' : sId === 3 ? 'Sprint' : sId === 4 ? 'ZF' : 'Cobble';
            factors.push(`${specLabel} Quota (+15)`);
          }
        }
      }

      // Concept 1 & 2: Diversification of strong riders (OVR >= 75)
      const isStrong = rider.overall_rating >= 75;
      const isRenewal = rider.old_team_id === teamId;

      if (isStrong && !isRenewal && rider.specialization_1_id !== null) {
        const existingStrongCount = strongSpecsCount.get(rider.specialization_1_id) ?? 0;
        if (existingStrongCount >= 2) {
          const penalty = 15.0;
          weight -= penalty;
          const specLabel = rider.specialization_1_id === 1 ? 'Berg' : rider.specialization_1_id === 2 ? 'Hügel' : rider.specialization_1_id === 3 ? 'Sprint' : rider.specialization_1_id === 4 ? 'ZF' : 'Cobble';
          factors.push(`Spitzen-Diversifizierung: Bereits ${existingStrongCount} starke ${specLabel}fahrer (-${penalty})`);
        }
      }

      // Top-Fahrer-Kappe: weiche Rampe unterhalb der Kappe, harte Sperre bei
      // Erreichen der (eskalierten) Kappe. Renewals des eigenen Fahrers sind
      // ausgenommen (der Fahrer zaehlt bereits fuer das Team).
      const capOut = this.topCapOutcome(rider.overall_rating, teamTop.c77, teamTop.c74, cap77, cap74);
      let blocked = false;
      if (rider.old_team_id !== teamId) {
        if (capOut.blocked) {
          blocked = true;
          if (capOut.factor) factors.push(capOut.factor);
        } else if (capOut.penalty > 0) {
          weight -= capOut.penalty;
          if (capOut.factor) factors.push(capOut.factor);
        }
      }

      if (weight < 0.01) {
        weight = 0.01;
      }

      return { rider, weight, factors, blocked };
    });

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
            ? `Team-Limit erreicht: ${cap77} Fahrer >${TOP_THRESHOLD_77}`
            : `Team-Limit erreicht: ${cap74} Fahrer >${TOP_THRESHOLD_74}`)
          : null,
      };
    });
  }
}