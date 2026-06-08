"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderDraftService = void 0;
const ResultRepository_1 = require("../db/repositories/ResultRepository");
class RiderDraftService {
    constructor(db) {
        this.db = db;
    }
    executeDraft(season) {
        const resultRepo = new ResultRepository_1.ResultRepository(this.db);
        // 1. Teams nach Vorjahres-Standings holen (bestes Team auf Platz 1)
        const standings = resultRepo.getSeasonStandings(season - 1);
        const rankedTeamIds = standings.teamStandings.map((t) => t.teamId).filter((id) => id !== null);
        // Falls keine Teams da sind, abbrechen
        if (rankedTeamIds.length === 0)
            return;
        // 2. Rider ab 36 in Rente schicken (die noch keinen neuen Vertrag haben)
        this.db.prepare(`
      UPDATE riders
      SET is_retired = 1
      WHERE is_retired = 0
        AND (? - birth_year) >= 36
        AND id NOT IN (
          SELECT rider_id FROM contracts WHERE status IN ('active', 'future')
        )
    `).run(season);
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
        (
          SELECT c.team_id 
          FROM contracts c 
          WHERE c.rider_id = r.id AND c.status = 'expired' AND c.end_season = ? 
          ORDER BY c.end_season DESC LIMIT 1
        ) AS old_team_id
      FROM riders r
      WHERE r.is_retired = 0
        AND r.id NOT IN (
          SELECT rider_id FROM contracts WHERE status IN ('active', 'future')
        )
    `).all(season - 1);
        if (freeAgentsRaw.length === 0)
            return;
        // Draft Value berechnen und sortieren (beste zuerst)
        const freeAgents = freeAgentsRaw.map((r) => {
            const age = season - r.birth_year;
            let draftValue = r.overall_rating;
            if (age < 25) {
                draftValue = (r.overall_rating * 0.75) + (r.pot_overall * 0.25);
            }
            return { ...r, draftValue };
        }).sort((a, b) => b.draftValue - a.draftValue);
        // 4. Team Kadergrößen ermitteln
        const teamCountsMap = new Map();
        for (const teamId of rankedTeamIds) {
            const count = this.db.prepare(`
        SELECT COUNT(*) as c FROM contracts 
        WHERE team_id = ? AND status IN ('active', 'future')
      `).get(teamId).c;
            teamCountsMap.set(teamId, count);
        }
        // 5. Draft Loop Setup
        const maxRosterSize = 30;
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
                if (currentCount >= maxRosterSize) {
                    continue; // Team voll
                }
                allTeamsFull = false; // Mindestens ein Team hat noch Platz
                // Bester verfügbarer Free Agent
                if (freeAgents.length === 0)
                    break;
                const draftedRider = freeAgents.shift();
                // Vertragslaufzeit 1 bis 3 Jahre (zufällig)
                const contractLength = Math.floor(Math.random() * 3) + 1;
                const endSeason = season + contractLength - 1;
                // Vertrag eintragen
                insertContract.run(draftedRider.id, teamId, season, endSeason);
                // Historie eintragen
                insertHistory.run(season, draftRound, pickNumber, teamId, draftedRider.id, draftedRider.old_team_id, contractLength, draftedRider.overall_rating, draftedRider.pot_overall, draftedRider.draftValue);
                // Kadergröße aktualisieren
                teamCountsMap.set(teamId, currentCount + 1);
                pickNumber++;
                pickMadeInChunk = true;
            }
            // Prüfen ob wirklich alle Teams voll sind (nicht nur in diesem Chunk)
            let globalAllFull = true;
            for (const tId of rankedTeamIds) {
                if ((teamCountsMap.get(tId) || 0) < maxRosterSize) {
                    globalAllFull = false;
                    break;
                }
            }
            if (globalAllFull) {
                break; // Alle Teams der Liga sind voll
            }
            draftRound++;
            sequenceIndex++;
        }
    }
}
exports.RiderDraftService = RiderDraftService;
