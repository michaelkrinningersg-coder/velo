"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderDraftService = void 0;
const ResultRepository_1 = require("../db/repositories/ResultRepository");
function hasMetQuota(specId, counts) {
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
const draftSequenceChunks = [
    [0, 4], // Runde 0: Plätze 1-5
    [0, 4], // Runde 1: Plätze 1-5
    [0, 4], // Runde 2: Plätze 1-5
    [5, 9], // Runde 3: Plätze 6-10
    [0, 4], // Runde 4: Plätze 1-5
    [5, 9], // Runde 5: Plätze 6-10
    [10, 14], // Runde 6: Plätze 11-15
    [0, 4], // Runde 7: Plätze 1-5
    [5, 9], // Runde 8: Plätze 6-10
    [10, 14], // Runde 9: Plätze 11-15
    [15, 19], // Runde 10: Plätze 16-20
    [0, 4], // Runde 11: Plätze 1-5
    [5, 9], // Runde 12: Plätze 6-10
    [10, 14], // Runde 13: Plätze 11-15
    [15, 19], // Runde 14: Plätze 16-20
    [20, 24] // Runde 15: Plätze 21-25
];
class RiderDraftService {
    constructor(db) {
        this.db = db;
    }
    prepareDraft(season) {
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
    executeDraft(season) {
        this.prepareDraft(season);
        this.executeNextPicksUntilPlayer(season, true);
    }
    getRankedTeamIds(season) {
        const resultRepo = new ResultRepository_1.ResultRepository(this.db);
        const standings = resultRepo.getSeasonStandings(season - 1);
        let rankedTeamIds = standings.teamStandings.map((t) => t.teamId).filter((id) => id !== null);
        // Falls keine Teams da sind, Fallback auf alle Division-1 Teams (WorldTour)
        if (rankedTeamIds.length === 0) {
            const wtTeams = this.db.prepare('SELECT id FROM teams WHERE division_id = 1 ORDER BY id ASC').all();
            if (wtTeams.length > 0) {
                rankedTeamIds = wtTeams.map(t => t.id);
            }
            else {
                const allTeams = this.db.prepare('SELECT id FROM teams ORDER BY id ASC').all();
                rankedTeamIds = allTeams.map(t => t.id);
            }
        }
        return rankedTeamIds;
    }
    getNextPickState(season) {
        const rankedTeamIds = this.getRankedTeamIds(season);
        const playerTeamId = this.db.prepare('SELECT id FROM teams WHERE is_player_team = 1').get().id;
        // Load max roster sizes
        const teamLimitsMap = new Map();
        const limits = this.db.prepare(`
      SELECT t.id, dt.max_roster_size
      FROM teams t 
      JOIN division_teams dt ON t.division_id = dt.id
    `).all();
        for (const limit of limits) {
            teamLimitsMap.set(limit.id, limit.max_roster_size);
        }
        // Reconstruct current roster sizes based on contracts + history
        const teamCountsMap = new Map();
        for (const teamId of rankedTeamIds) {
            const activeContracts = this.db.prepare(`
        SELECT COUNT(*) as c FROM contracts 
        WHERE team_id = ? AND status IN ('active', 'future')
      `).get(teamId).c;
            const draftedCount = this.db.prepare(`
        SELECT COUNT(*) as c FROM draft_history
        WHERE team_id = ? AND season = ?
      `).get(teamId, season).c;
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
    `).all(season);
        if (freeAgentsRaw.length === 0) {
            return { nextTeamId: null, isPlayerTeam: false, currentRound: 0, currentPickNumber: 0, finished: true };
        }
        // Load draft history to know which picks have already been made
        const draftHistory = this.db.prepare(`
      SELECT draft_round, team_id, rider_id FROM draft_history
      WHERE season = ?
      ORDER BY pick_number ASC
    `).all(season);
        let simulatedPicksCount = 0;
        let sequenceIndex = 0;
        let currentRound = 0;
        let nextTeamId = null;
        let historyIndex = 0;
        let allTeamsFull = false;
        while (true) {
            const currentChunk = draftSequenceChunks[sequenceIndex % draftSequenceChunks.length];
            const startRank = currentChunk[0];
            const endRank = currentChunk[1];
            let anyTeamCanPick = false;
            for (let i = startRank; i <= endRank; i++) {
                if (i >= rankedTeamIds.length)
                    break;
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
                }
                else {
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
    executeNextPicksUntilPlayer(season, autoPlayer = false) {
        const playerTeamId = this.db.prepare('SELECT id FROM teams WHERE is_player_team = 1').get().id;
        while (true) {
            const nextPickState = this.getNextPickState(season);
            if (nextPickState.finished) {
                return { finished: true, playerTurn: false };
            }
            const { nextTeamId, currentRound, currentPickNumber } = nextPickState;
            if (nextTeamId === playerTeamId && !autoPlayer) {
                return { finished: false, playerTurn: true };
            }
            this.executeSingleDraftPick(season, nextTeamId, currentRound, currentPickNumber);
        }
    }
    executeSingleDraftPick(season, teamId, draftRound, pickNumber, selectedRiderId) {
        const rankedTeamIds = this.getRankedTeamIds(season);
        const i = rankedTeamIds.indexOf(teamId);
        // AI Focus Details
        const teamRow = this.db.prepare('SELECT ai_focus_1, ai_focus_2, ai_focus_3 FROM teams WHERE id = ?').get(teamId);
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
    `).all(season - 1, season);
        if (freeAgentsRaw.length === 0)
            return;
        // Calculate draft value and sort
        const freeAgents = freeAgentsRaw.map((r) => {
            const age = season - r.birth_year;
            let draftValue = r.overall_rating;
            if (age < 25) {
                draftValue = (r.overall_rating * 0.85) + (r.pot_overall * 0.15);
            }
            return { ...r, draftValue };
        }).sort((a, b) => b.draftValue - a.draftValue);
        const poolSize = Math.min(30, freeAgents.length);
        const pool = freeAgents.slice(0, poolSize);
        const top1RiderId = freeAgents[0].id;
        // Calculate top1PassedOverCount dynamically
        const history = this.db.prepare('SELECT rider_id FROM draft_history WHERE season = ? ORDER BY pick_number ASC').all(season);
        const freeAgentsForTop1 = [...freeAgents];
        let top1PassedOverCount = 0;
        for (const pick of history) {
            const currentTop1Id = freeAgentsForTop1[0]?.id;
            if (pick.rider_id === currentTop1Id) {
                top1PassedOverCount = 0;
            }
            else {
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
    `).all(teamId);
        // Spec counts for quotas
        const teamMap = this.getTeamSpecCounts(season, teamId);
        // Compute weights
        const poolDetails = pool.map((rider) => {
            let weight = 1.0;
            const factors = [];
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
                }
                else if (rider.specialization_1_id === aiFocus2) {
                    weight += 2.0;
                    factors.push(`AI Focus 2 (+2)`);
                }
                else if (rider.specialization_1_id === aiFocus3) {
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
                const counts = teamMap.get(sId);
                const quotaMet = hasMetQuota(sId, counts);
                if (!quotaMet) {
                    let helps = false;
                    if (sId === 4 || sId === 5) {
                        helps = (rider.specialization_1_id === sId || rider.specialization_2_id === sId || rider.specialization_3_id === sId);
                    }
                    else {
                        helps = (rider.specialization_1_id === sId);
                    }
                    if (helps) {
                        weight += 15.0;
                        const specLabel = sId === 1 ? 'Berg' : sId === 2 ? 'Hügel' : sId === 3 ? 'Sprint' : sId === 4 ? 'ZF' : 'Cobble';
                        factors.push(`${specLabel} Quota (+15)`);
                    }
                }
            }
            return { rider, weight, factors };
        });
        const weights = poolDetails.map(p => p.weight);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let selectedIdx = -1;
        if (selectedRiderId !== undefined) {
            selectedIdx = poolDetails.findIndex(p => p.rider.id === selectedRiderId);
        }
        if (selectedIdx === -1) {
            // Automatic KI selection
            selectedIdx = 0;
            if (totalWeight > 0) {
                const randomVal = Math.random() * totalWeight;
                let cumulative = 0;
                for (let idx = 0; idx < pool.length; idx++) {
                    cumulative += weights[idx];
                    if (randomVal <= cumulative) {
                        selectedIdx = idx;
                        break;
                    }
                }
            }
        }
        const selected = poolDetails[selectedIdx];
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
        }
        else {
            insertContract.run(draftedRider.id, teamId, season, endSeason);
        }
        insertHistory.run(season, draftRound, pickNumber, teamId, draftedRider.id, draftedRider.old_team_id, contractLength, draftedRider.overall_rating, draftedRider.pot_overall, draftedRider.draftValue);
        for (const p of poolDetails) {
            const prob = totalWeight > 0 ? (p.weight / totalWeight * 100) : 0;
            insertPoolCandidate.run(season, pickNumber, p.rider.id, p.weight, prob, p.rider.old_team_id);
        }
        // Update game_state current pick number
        this.db.prepare('UPDATE game_state SET draft_current_pick_number = ? WHERE id = 1').run(pickNumber + 1);
    }
    getTeamSpecCounts(season, teamId) {
        const map = new Map();
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
    `).all(teamId);
        for (const r of activeRiders) {
            if (r.specialization_1_id && r.specialization_1_id >= 1 && r.specialization_1_id <= 5) {
                map.get(r.specialization_1_id).spec1++;
            }
            if (r.specialization_2_id && r.specialization_2_id >= 1 && r.specialization_2_id <= 5) {
                map.get(r.specialization_2_id).spec23++;
            }
            if (r.specialization_3_id && r.specialization_3_id >= 1 && r.specialization_3_id <= 5) {
                map.get(r.specialization_3_id).spec23++;
            }
        }
        return map;
    }
    getDraftCandidatesForNextPick(season) {
        const nextPickState = this.getNextPickState(season);
        if (nextPickState.finished || nextPickState.nextTeamId === null) {
            return [];
        }
        const teamId = nextPickState.nextTeamId;
        const rankedTeamIds = this.getRankedTeamIds(season);
        const i = rankedTeamIds.indexOf(teamId);
        // AI Focus Details
        const teamRow = this.db.prepare('SELECT ai_focus_1, ai_focus_2, ai_focus_3 FROM teams WHERE id = ?').get(teamId);
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
    `).all(season - 1, season);
        if (freeAgentsRaw.length === 0)
            return [];
        // Calculate draft value and sort
        const freeAgents = freeAgentsRaw.map((r) => {
            const age = season - r.birth_year;
            let draftValue = r.overall_rating;
            if (age < 25) {
                draftValue = (r.overall_rating * 0.85) + (r.pot_overall * 0.15);
            }
            return { ...r, draftValue };
        }).sort((a, b) => b.draftValue - a.draftValue);
        const poolSize = Math.min(30, freeAgents.length);
        const pool = freeAgents.slice(0, poolSize);
        const top1RiderId = pool[0].id;
        // Calculate top1PassedOverCount dynamically
        const history = this.db.prepare('SELECT rider_id FROM draft_history WHERE season = ? ORDER BY pick_number ASC').all(season);
        const freeAgentsForTop1 = [...freeAgents];
        let top1PassedOverCount = 0;
        for (const pick of history) {
            const currentTop1Id = freeAgentsForTop1[0]?.id;
            if (pick.rider_id === currentTop1Id) {
                top1PassedOverCount = 0;
            }
            else {
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
    `).all(teamId);
        // Spec counts for quotas
        const teamMap = this.getTeamSpecCounts(season, teamId);
        // Compute weights
        const poolDetails = pool.map((rider) => {
            let weight = 1.0;
            const factors = [];
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
                }
                else if (rider.specialization_1_id === aiFocus2) {
                    weight += 2.0;
                    factors.push(`AI Focus 2 (+2)`);
                }
                else if (rider.specialization_1_id === aiFocus3) {
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
                const counts = teamMap.get(sId);
                const quotaMet = hasMetQuota(sId, counts);
                if (!quotaMet) {
                    let helps = false;
                    if (sId === 4 || sId === 5) {
                        helps = (rider.specialization_1_id === sId || rider.specialization_2_id === sId || rider.specialization_3_id === sId);
                    }
                    else {
                        helps = (rider.specialization_1_id === sId);
                    }
                    if (helps) {
                        weight += 15.0;
                        const specLabel = sId === 1 ? 'Berg' : sId === 2 ? 'Hügel' : sId === 3 ? 'Sprint' : sId === 4 ? 'ZF' : 'Cobble';
                        factors.push(`${specLabel} Quota (+15)`);
                    }
                }
            }
            return { rider, weight, factors };
        });
        const totalWeight = poolDetails.map(p => p.weight).reduce((sum, w) => sum + w, 0);
        // Get old team names, specialization names, country code, uci ranks, and wins
        const uciPointsRows = this.db.prepare(`
      SELECT rider_id, SUM(points_awarded) AS points
      FROM season_point_events
      WHERE season = ?
      GROUP BY rider_id
      ORDER BY points DESC
    `).all(season - 1);
        const uciRanks = new Map();
        uciPointsRows.forEach((row, index) => {
            uciRanks.set(row.rider_id, index + 1);
        });
        const winsMap = new Map();
        const riderIds = poolDetails.map(p => p.rider.id);
        if (riderIds.length > 0) {
            const placeholders = riderIds.map(() => '?').join(',');
            const winsRows = this.db.prepare(`
        SELECT rider_id, SUM(gc_wins + stage_wins + one_day_wins) AS wins
        FROM rider_career_category_stats
        WHERE rider_id IN (${placeholders})
        GROUP BY rider_id
      `).all(...riderIds);
            for (const row of winsRows) {
                winsMap.set(row.rider_id, row.wins);
            }
        }
        const typeRiderRows = this.db.prepare('SELECT id, display_name FROM type_rider').all();
        const typeRiderMap = new Map();
        typeRiderRows.forEach(row => typeRiderMap.set(row.id, row.display_name));
        const countryRows = this.db.prepare('SELECT id, code_3 FROM sta_country').all();
        const countryMap = new Map();
        countryRows.forEach(row => countryMap.set(row.id, row.code_3));
        const teamNamesRows = this.db.prepare('SELECT id, name FROM teams').all();
        const teamNamesMap = new Map();
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
                factors: p.factors
            };
        });
    }
}
exports.RiderDraftService = RiderDraftService;
