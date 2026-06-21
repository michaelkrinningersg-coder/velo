import Database from 'better-sqlite3';
import { GameStateRepository } from "../db/repositories/GameStateRepository";
import { RaceRepository } from "../db/repositories/RaceRepository";
import { ResultRepository } from "../db/repositories/ResultRepository";
import { RiderRepository } from "../db/repositories/RiderRepository";
import { TeamRepository } from "../db/repositories/TeamRepository";


export class RiderDraftService {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public executeDraft(season: number): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS draft_picks_pool (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        pick_number INTEGER NOT NULL,
        rider_id INTEGER NOT NULL,
        weight REAL NOT NULL,
        probability REAL NOT NULL
      )
    `).run();
    this.db.prepare('DELETE FROM draft_picks_pool WHERE season = ?').run(season);

    const resultRepo = new ResultRepository(this.db);
    
    // 1. Teams nach Vorjahres-Standings holen (bestes Team auf Platz 1)
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
        r.country_id,
        (
          SELECT c.team_id 
          FROM contracts c 
          WHERE c.rider_id = r.id AND c.status = 'expired' AND c.end_season = ? 
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
      country_id: number | null;
      old_team_id: number | null;
    }>;

    if (freeAgentsRaw.length === 0) return;

    // Draft Value berechnen und sortieren (beste zuerst)
    const freeAgents = freeAgentsRaw.map((r: any) => {
      const age = season - r.birth_year;
      let draftValue = r.overall_rating;
      if (age < 25) {
        draftValue = (r.overall_rating * 0.85) + (r.pot_overall * 0.15);
      }
      return { ...r, draftValue };
    }).sort((a: any, b: any) => b.draftValue - a.draftValue);

    // 4. Team Kadergrößen und AI Focus Details ermitteln
    const teamCountsMap = new Map<number, number>();
    const teamLimitsMap = new Map<number, number>();
    const teamDetailsMap = new Map<number, { ai_focus_1: number | null, ai_focus_2: number | null, ai_focus_3: number | null }>();

    const limits = this.db.prepare(`
      SELECT t.id, dt.max_roster_size, t.ai_focus_1, t.ai_focus_2, t.ai_focus_3
      FROM teams t 
      JOIN division_teams dt ON t.division_id = dt.id
    `).all() as Array<{ id: number; max_roster_size: number; ai_focus_1: number | null; ai_focus_2: number | null; ai_focus_3: number | null }>;
    for (const limit of limits) {
      teamLimitsMap.set(limit.id, limit.max_roster_size);
      teamDetailsMap.set(limit.id, {
        ai_focus_1: limit.ai_focus_1,
        ai_focus_2: limit.ai_focus_2,
        ai_focus_3: limit.ai_focus_3
      });
    }

    for (const teamId of rankedTeamIds) {
      const count = (this.db.prepare(`
        SELECT COUNT(*) as c FROM contracts 
        WHERE team_id = ? AND status IN ('active', 'future')
      `).get(teamId) as { c: number }).c;
      teamCountsMap.set(teamId, count);
    }

    // 5. Draft Loop Setup
    
    // Draft Sequenzen (0-basiert, bezogen auf das Array rankedTeamIds)
    // Runde 1-15 (danach im Loop)
    const draftSequenceChunks = [
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

    let draftRound = 1;
    let pickNumber = 1;
    let top1PassedOverCount = 0;

    const insertPoolCandidate = this.db.prepare(`
      INSERT INTO draft_picks_pool (season, pick_number, rider_id, weight, probability)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const insertContract = this.db.prepare(`
      INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
      VALUES (?, ?, ?, ?, 'active')
    `);

    const extendContract = this.db.prepare(`
      UPDATE contracts 
      SET end_season = end_season + ?, status = 'active'
      WHERE rider_id = ? AND team_id = ? AND status = 'expired' AND end_season = ?
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
      const numTeamsInChunk = endRank - startRank + 1;
      const xPoolSize = numTeamsInChunk * 2;
      
      let pickMadeInChunk = false;
      let allTeamsFull = true;
      
      // Jeder Team im Chunk darf genau 1 mal ziehen
      for (let i = startRank; i <= endRank; i++) {
        if (i >= rankedTeamIds.length) break;
        const teamId = rankedTeamIds[i];
        
        const currentCount = teamCountsMap.get(teamId) || 0;
        const maxRosterSize = teamLimitsMap.get(teamId) ?? 30;
        if (currentCount >= maxRosterSize) {
          continue; // Team voll
        }
        
        allTeamsFull = false; // Mindestens ein Team hat noch Platz
        
        // Bester verfügbarer Free Agent
        if (freeAgents.length === 0) break;
        
        // Poolgröße x ermitteln und Kandidaten heraussuchen
        const poolSize = Math.min(xPoolSize, freeAgents.length);
        const pool = freeAgents.slice(0, poolSize);
        const top1RiderId = freeAgents[0].id;
        
        // Nationalitäten des Teams aus Roster abfragen
        const rosterCountries = this.db.prepare(`
          SELECT r.country_id, COUNT(*) as count
          FROM riders r
          JOIN contracts c ON c.rider_id = r.id
          WHERE c.team_id = ? AND c.status IN ('active', 'future')
          GROUP BY r.country_id
          ORDER BY count DESC
        `).all(teamId) as Array<{ country_id: number; count: number }>;
        
        const top1Country = rosterCountries[0]?.country_id ?? null;
        const top2Country = rosterCountries[1]?.country_id ?? null;
        const top3Country = rosterCountries[2]?.country_id ?? null;
        
        // AI Focus des Teams holen
        const teamDetails = teamDetailsMap.get(teamId);
        const aiFocus1 = teamDetails?.ai_focus_1 ?? null;
        const aiFocus2 = teamDetails?.ai_focus_2 ?? null;
        const aiFocus3 = teamDetails?.ai_focus_3 ?? null;
        
        // Gewichte berechnen und Faktoren tracken (additiv statt multiplikativ)
        const poolDetails = pool.map((rider) => {
          let weight = 1.0;
          const factors: string[] = [];
          
          // AI Focus Additive Gewichte (Spec 1 des Fahrers prüfen)
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
          
          // Nationalitäten Additive Gewichte
          if (rider.country_id !== null) {
            if (rider.country_id === top1Country) {
              weight += 4.0;
              factors.push(`Nation 1 (+4)`);
            } else if (rider.country_id === top2Country) {
              weight += 2.0;
              factors.push(`Nation 2 (+2)`);
            } else if (rider.country_id === top3Country) {
              weight += 1.0;
              factors.push(`Nation 3 (+1)`);
            }
          }
          
          // Loyalitäts Additives Gewicht
          if (rider.old_team_id === teamId) {
            weight += 9.0;
            factors.push(`Loyalty (+9)`);
          }
          
          // Top-1 Schutz Additives Gewicht
          if (rider.id === top1RiderId) {
            if (top1PassedOverCount > 0) {
              const bonus = top1PassedOverCount * 0.1;
              weight += bonus;
              factors.push(`Top1 Protect (+${bonus.toFixed(1)})`);
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
          console.log(`  Team Top Nations: 1=${top1Country}, 2=${top2Country}, 3=${top3Country}`);
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
        } else {
          // Neuer Vertrag
          insertContract.run(draftedRider.id, teamId, season, endSeason);
        }
        
        // Historie eintragen
        insertHistory.run(
          season, draftRound, pickNumber, teamId, draftedRider.id,
          draftedRider.old_team_id, contractLength, draftedRider.overall_rating,
          draftedRider.pot_overall, draftedRider.draftValue
        );

        // Kandidaten-Pool in DB speichern
        for (const p of poolDetails) {
          const prob = totalWeight > 0 ? (p.weight / totalWeight * 100) : 0;
          insertPoolCandidate.run(season, pickNumber, p.rider.id, p.weight, prob);
        }
        
        // Kadergröße aktualisieren
        teamCountsMap.set(teamId, currentCount + 1);
        
        // Top-1 Schutz-Zähler aktualisieren
        if (draftedRider.id === top1RiderId) {
          top1PassedOverCount = 0; // Reset
        } else {
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