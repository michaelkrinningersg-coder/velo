import Database from 'better-sqlite3';
import { GameRepository } from '../db/GameRepository';

export class RiderDraftService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public executeDraft(season: number): void {
    const repo = new GameRepository(this.db);
    
    // 1. Teams nach Vorjahres-Standings holen (bestes Team auf Platz 1)
    const standings = repo.getSeasonStandings(season - 1);
    const rankedTeamIds = standings.teamStandings.map(t => t.teamId).filter((id): id is number => id !== null);
    
    // Falls keine Teams da sind, abbrechen
    if (rankedTeamIds.length === 0) return;

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
    `).all(season - 1) as Array<{
      id: number;
      birth_year: number;
      overall_rating: number;
      pot_overall: number;
      old_team_id: number | null;
    }>;

    if (freeAgentsRaw.length === 0) return;

    // Draft Value berechnen und sortieren (beste zuerst)
    const freeAgents = freeAgentsRaw.map(r => {
      const age = season - r.birth_year;
      let draftValue = r.overall_rating;
      if (age < 25) {
        draftValue = (r.overall_rating * 0.75) + (r.pot_overall * 0.25);
      }
      return { ...r, draftValue };
    }).sort((a, b) => b.draftValue - a.draftValue);

    // 4. Team Kadergrößen ermitteln
    const teamCountsMap = new Map<number, number>();
    for (const teamId of rankedTeamIds) {
      const count = (this.db.prepare(`
        SELECT COUNT(*) as c FROM contracts 
        WHERE team_id = ? AND status IN ('active', 'future')
      `).get(teamId) as { c: number }).c;
      teamCountsMap.set(teamId, count);
    }

    // 5. Draft Loop Setup
    const maxRosterSize = 30;
    
    // Draft Sequenzen (0-basiert, bezogen auf das Array rankedTeamIds)
    const draftSequenceChunks = [
      [0, 4],
      [0, 4],
      [5, 9],
      [0, 4],
      [5, 9],
      [10, 14],
      [0, 19],
      [0, 24]
    ];
    
    const draftLoopChunks = [
      [0, 4],
      [0, 9],
      [0, 14],
      [0, 19],
      [0, 24]
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
      // Bestimme den aktuellen Chunk
      let currentChunk: number[];
      if (sequenceIndex < draftSequenceChunks.length) {
        currentChunk = draftSequenceChunks[sequenceIndex];
      } else {
        const loopIndex = (sequenceIndex - draftSequenceChunks.length) % draftLoopChunks.length;
        currentChunk = draftLoopChunks[loopIndex];
      }
      
      const startRank = currentChunk[0];
      const endRank = currentChunk[1];
      
      let pickMadeInChunk = false;
      
      // Jeder Team im Chunk darf genau 1 mal ziehen
      for (let i = startRank; i <= endRank; i++) {
        if (i >= rankedTeamIds.length) break;
        const teamId = rankedTeamIds[i];
        
        const currentCount = teamCountsMap.get(teamId) || 0;
        if (currentCount >= maxRosterSize) {
          continue; // Team voll
        }
        
        // Bester verfügbarer Free Agent
        if (freeAgents.length === 0) break;
        const draftedRider = freeAgents.shift()!;
        
        // Vertragslaufzeit 1 bis 3 Jahre (zufällig)
        const contractLength = Math.floor(Math.random() * 3) + 1;
        const endSeason = season + contractLength - 1;
        
        // Vertrag eintragen
        insertContract.run(draftedRider.id, teamId, season, endSeason);
        
        // Historie eintragen
        insertHistory.run(
          season, draftRound, pickNumber, teamId, draftedRider.id,
          draftedRider.old_team_id, contractLength, draftedRider.overall_rating,
          draftedRider.pot_overall, draftedRider.draftValue
        );
        
        // Kadergröße aktualisieren
        teamCountsMap.set(teamId, currentCount + 1);
        
        pickNumber++;
        pickMadeInChunk = true;
      }
      
      if (!pickMadeInChunk) {
        // Niemand hat mehr gepickt (alle Teams voll), wir brechen den gesamten Draft ab
        break;
      }
      
      draftRound++;
      sequenceIndex++;
    }
  }
}