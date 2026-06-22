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
class RiderDraftService {
    constructor(db) {
        this.db = db;
    }
    executeDraft(season) {
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
        const resultRepo = new ResultRepository_1.ResultRepository(this.db);
        // 1. Teams nach Vorjahres-Standings holen (bestes Team auf Platz 1)
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
        // 2. Rider in Rente schicken (die noch keinen neuen Vertrag haben) - now handled in ContractService before roles are cleared
        // 3. Alle Free Agents sammeln (ohne active/future vertrag) und nicht retired
        // Wir ermitteln gleichzeitig das "alte" Team (falls es einen abgelaufenen Vertrag im Vorjahr gab)
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
        // Draft Value berechnen und sortieren (beste zuerst)
        const freeAgents = freeAgentsRaw.map((r) => {
            const age = season - r.birth_year;
            let draftValue = r.overall_rating;
            if (age < 25) {
                draftValue = (r.overall_rating * 0.85) + (r.pot_overall * 0.15);
            }
            return { ...r, draftValue };
        }).sort((a, b) => b.draftValue - a.draftValue);
        // 4. Team Kadergrößen und AI Focus Details ermitteln
        const teamCountsMap = new Map();
        const teamLimitsMap = new Map();
        const teamDetailsMap = new Map();
        const limits = this.db.prepare(`
      SELECT t.id, dt.max_roster_size, t.ai_focus_1, t.ai_focus_2, t.ai_focus_3
      FROM teams t 
      JOIN division_teams dt ON t.division_id = dt.id
    `).all();
        for (const limit of limits) {
            teamLimitsMap.set(limit.id, limit.max_roster_size);
            teamDetailsMap.set(limit.id, {
                ai_focus_1: limit.ai_focus_1,
                ai_focus_2: limit.ai_focus_2,
                ai_focus_3: limit.ai_focus_3
            });
        }
        for (const teamId of rankedTeamIds) {
            const count = this.db.prepare(`
        SELECT COUNT(*) as c FROM contracts 
        WHERE team_id = ? AND status IN ('active', 'future')
      `).get(teamId).c;
            teamCountsMap.set(teamId, count);
        }
        // 4b. Initialisierung der teamSpecCounts für Quota-Prüfungen
        const teamSpecCounts = new Map();
        const initTeamCounts = (teamId) => {
            const map = new Map();
            for (let sId = 1; sId <= 5; sId++) {
                map.set(sId, { spec1: 0, spec23: 0 });
            }
            teamSpecCounts.set(teamId, map);
            return map;
        };
        const initialRosters = this.db.prepare(`
      SELECT 
        c.team_id,
        r.specialization_1_id,
        r.specialization_2_id,
        r.specialization_3_id
      FROM contracts c
      JOIN riders r ON c.rider_id = r.id
      WHERE c.status IN ('active', 'future')
    `).all();
        for (const r of initialRosters) {
            let teamMap = teamSpecCounts.get(r.team_id);
            if (!teamMap) {
                teamMap = initTeamCounts(r.team_id);
            }
            if (r.specialization_1_id && r.specialization_1_id >= 1 && r.specialization_1_id <= 5) {
                teamMap.get(r.specialization_1_id).spec1++;
            }
            if (r.specialization_2_id && r.specialization_2_id >= 1 && r.specialization_2_id <= 5) {
                teamMap.get(r.specialization_2_id).spec23++;
            }
            if (r.specialization_3_id && r.specialization_3_id >= 1 && r.specialization_3_id <= 5) {
                teamMap.get(r.specialization_3_id).spec23++;
            }
        }
        for (const teamId of rankedTeamIds) {
            if (!teamSpecCounts.has(teamId)) {
                initTeamCounts(teamId);
            }
        }
        // 5. Draft Loop Setup
        // Draft Sequenzen (0-basiert, bezogen auf das Array rankedTeamIds)
        // Runde 1-15 (danach im Loop)
        const draftSequenceChunks = [
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
        let draftRound = 1;
        let pickNumber = 1;
        let top1PassedOverCount = 0;
        const insertPoolCandidate = this.db.prepare(`
      INSERT INTO draft_picks_pool (season, pick_number, rider_id, weight, probability, old_team_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const insertContract = this.db.prepare(`
      INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
      VALUES (?, ?, ?, ?, 'active')
    `);
        const extendContract = this.db.prepare(`
      UPDATE contracts 
      SET end_season = end_season + ?, status = 'active'
      WHERE rider_id = ? AND team_id = ? AND end_season = ?
    `);
        const insertHistory = this.db.prepare(`
      INSERT INTO draft_history (
        season, draft_round, pick_number, team_id, rider_id, 
        old_team_id, contract_length, overall_at_draft, 
        pot_overall_at_draft, draft_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        let sequenceIndex = 0;
        while (freeAgents.length > 0) {
            // Bestimme den aktuellen Chunk (looped alle 15 Runden)
            const currentChunk = draftSequenceChunks[sequenceIndex % draftSequenceChunks.length];
            const startRank = currentChunk[0];
            const endRank = currentChunk[1];
            let pickMadeInChunk = false;
            let allTeamsFull = true;
            // Jeder Team im Chunk darf genau 1 mal ziehen
            for (let i = startRank; i <= endRank; i++) {
                if (i >= rankedTeamIds.length)
                    break;
                const teamId = rankedTeamIds[i];
                const currentCount = teamCountsMap.get(teamId) || 0;
                const maxRosterSize = teamLimitsMap.get(teamId) ?? 30;
                if (currentCount >= maxRosterSize) {
                    continue; // Team voll
                }
                allTeamsFull = false; // Mindestens ein Team hat noch Platz
                // Bester verfügbarer Free Agent
                if (freeAgents.length === 0)
                    break;
                // Poolgröße auf 20 erweitern
                const poolSize = Math.min(20, freeAgents.length);
                const pool = freeAgents.slice(0, poolSize);
                const top1RiderId = freeAgents[0].id;
                // Nationalitäten-Präferenzen des Teams abfragen
                const preferences = this.db.prepare(`
          SELECT country_id, weight
          FROM team_preferences
          WHERE team_id = ?
        `).all(teamId);
                // AI Focus des Teams holen
                const teamDetails = teamDetailsMap.get(teamId);
                const aiFocus1 = teamDetails?.ai_focus_1 ?? null;
                const aiFocus2 = teamDetails?.ai_focus_2 ?? null;
                const aiFocus3 = teamDetails?.ai_focus_3 ?? null;
                // Spec Counts des Teams holen
                let teamMap = teamSpecCounts.get(teamId);
                if (!teamMap) {
                    teamMap = initTeamCounts(teamId);
                }
                // Gewichte berechnen und Faktoren tracken (additiv statt multiplikativ)
                const poolDetails = pool.map((rider) => {
                    let weight = 1.0;
                    const factors = [];
                    // AI Focus Additive Gewichte (Spec 1 des Fahrers prüfen)
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
                    // Nationalitäten-Präferenzen Additive Gewichte
                    if (rider.country_id !== null) {
                        const pref = preferences.find(p => p.country_id === rider.country_id);
                        if (pref) {
                            weight += pref.weight;
                            factors.push(`Nation Pref (+${pref.weight})`);
                        }
                    }
                    // Loyalitäts Additives Gewicht
                    if (rider.old_team_id === teamId) {
                        weight += 9.0;
                        factors.push(`Loyalty (+9)`);
                    }
                    // Top-1 Schutz Additives Gewicht (nun 0.05 statt 0.1)
                    if (rider.id === top1RiderId) {
                        if (top1PassedOverCount > 0) {
                            const bonus = top1PassedOverCount * 0.05;
                            weight += bonus;
                            factors.push(`Top1 Protect (+${bonus.toFixed(2)})`);
                        }
                    }
                    // Quota Spec Quota Additive Bonus (+15.0)
                    for (let sId = 1; sId <= 5; sId++) {
                        const counts = teamMap.get(sId);
                        const quotaMet = hasMetQuota(sId, counts);
                        if (!quotaMet) {
                            let helps = false;
                            if (sId === 4 || sId === 5) { // Zeitfahren or Cobble
                                helps = (rider.specialization_1_id === sId || rider.specialization_2_id === sId || rider.specialization_3_id === sId);
                            }
                            else { // Berg, Hügel, Sprint
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
                let selectedIdx = 0;
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
                const selected = poolDetails[selectedIdx];
                const draftedRider = selected.rider;
                // Debugging-Logs für Zielteams ausgeben
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
                // Entfernen aus der globalen Liste
                const globalIdx = freeAgents.findIndex(f => f.id === draftedRider.id);
                if (globalIdx !== -1) {
                    freeAgents.splice(globalIdx, 1);
                }
                // Vertragslaufzeit 1 bis 3 Jahre (zufällig)
                const contractLength = Math.floor(Math.random() * 3) + 1;
                const endSeason = season + contractLength - 1;
                // Prüfen, ob es eine Verlängerung (altes Team = neues Team) oder Transfer ist
                if (draftedRider.old_team_id === teamId) {
                    // Vertrag verlängern
                    extendContract.run(contractLength, draftedRider.id, teamId, season - 1);
                }
                else {
                    // Neuer Vertrag
                    insertContract.run(draftedRider.id, teamId, season, endSeason);
                }
                // Historie eintragen
                insertHistory.run(season, draftRound, pickNumber, teamId, draftedRider.id, draftedRider.old_team_id, contractLength, draftedRider.overall_rating, draftedRider.pot_overall, draftedRider.draftValue);
                // Kandidaten-Pool in DB speichern
                for (const p of poolDetails) {
                    const prob = totalWeight > 0 ? (p.weight / totalWeight * 100) : 0;
                    insertPoolCandidate.run(season, pickNumber, p.rider.id, p.weight, prob, p.rider.old_team_id);
                }
                // Kadergröße aktualisieren
                teamCountsMap.set(teamId, currentCount + 1);
                // teamSpecCounts für Quotas aktualisieren
                if (draftedRider.specialization_1_id && draftedRider.specialization_1_id >= 1 && draftedRider.specialization_1_id <= 5) {
                    teamMap.get(draftedRider.specialization_1_id).spec1++;
                }
                if (draftedRider.specialization_2_id && draftedRider.specialization_2_id >= 1 && draftedRider.specialization_2_id <= 5) {
                    teamMap.get(draftedRider.specialization_2_id).spec23++;
                }
                if (draftedRider.specialization_3_id && draftedRider.specialization_3_id >= 1 && draftedRider.specialization_3_id <= 5) {
                    teamMap.get(draftedRider.specialization_3_id).spec23++;
                }
                // Top-1 Schutz-Zähler aktualisieren
                if (draftedRider.id === top1RiderId) {
                    top1PassedOverCount = 0; // Reset
                }
                else {
                    top1PassedOverCount++; // Inkrementieren
                }
                pickNumber++;
                pickMadeInChunk = true;
            }
            // Prüfen ob wirklich alle Teams voll sind, die am Draft teilnehmen können (die ersten 25 Teams)
            let globalAllFull = true;
            const maxAllowedRank = Math.max(...draftSequenceChunks.map(chunk => chunk[1]));
            for (let idx = 0; idx < Math.min(rankedTeamIds.length, maxAllowedRank + 1); idx++) {
                const tId = rankedTeamIds[idx];
                const maxRosterSize = teamLimitsMap.get(tId) ?? 30;
                if ((teamCountsMap.get(tId) || 0) < maxRosterSize) {
                    globalAllFull = false;
                    break;
                }
            }
            if (globalAllFull) {
                break; // Alle am Draft teilnehmenden Teams sind voll
            }
            draftRound++;
            sequenceIndex++;
        }
    }
}
exports.RiderDraftService = RiderDraftService;
