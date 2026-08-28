import { describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { createTestDb, seedReferenceData, seedTeams, seedRider, seedGameState } from './helpers/testDb';
import { RiderDraftService } from '../game/RiderDraftService';
import { NATIONAL_SELECTION_TEAM_ID } from '../simulation/championships';

/**
 * Die Landesmeisterschaften legen ein Pseudo-Team "Nationalauswahl" an, damit
 * teamlose Fahrer ein Team in der Ergebnisliste haben. Ab der ersten
 * Meisterschaft steht es in der Saisonwertung - und rutschte damit in die
 * Draft-Reihenfolge, mit leerem Kader und 40 freien Plaetzen.
 *
 * Die Reihenfolge adressiert nur die Plaetze 1 bis 25. Das Pseudo-Team stand
 * dahinter, konnte also nie ziehen, seine freien Plaetze verhinderten aber die
 * Abbruchbedingung: der Draft lief endlos und liess sich nicht abschliessen.
 */

const SAISON = 2027;

function aufbau(mitNationalauswahl: boolean): Database.Database {
  const db = createTestDb();
  seedReferenceData(db);
  seedTeams(db, { count: 25, playerTeamId: 1 });
  if (mitNationalauswahl) {
    db.prepare(`
      INSERT INTO teams (id, name, abbreviation, division_id, is_player_team, country_id,
        color_primary, color_secondary, ai_focus_1, ai_focus_2, ai_focus_3)
      VALUES (?, 'Nationalauswahl', 'NAT', 1, 0, 1, '#334155', '#e2e8f0', 1, 2, 3)
    `).run(NATIONAL_SELECTION_TEAM_ID);
  }
  seedGameState(db, { date: `${SAISON}-11-01`, season: SAISON, draftStatus: 'active', draftSeason: SAISON });

  // Alle 25 Teams randvoll: der Draft ist damit sachlich zu Ende.
  const maxKader = (db.prepare('SELECT max_roster_size m FROM division_teams WHERE id = 1').get() as any).m;
  const vertrag = db.prepare(`
    INSERT INTO contracts (rider_id, team_id, start_season, end_season, status)
    VALUES (?, ?, ?, ?, 'active')
  `);
  for (let team = 1; team <= 25; team++) {
    for (let i = 0; i < maxKader; i++) {
      const riderId = seedRider(db, { birthYear: SAISON - 26 });
      vertrag.run(riderId, team, SAISON, SAISON + 1);
    }
  }
  // Freie Fahrer muss es geben, sonst greift schon die fruehe Abkuerzung.
  for (let i = 0; i < 30; i++) seedRider(db, { birthYear: SAISON - 22 });
  return db;
}

describe('Draft mit Nationalauswahl-Pseudoteam', () => {
  it('haelt das Pseudo-Team aus der Draft-Reihenfolge heraus', () => {
    const db = aufbau(true);
    const reihenfolge = new RiderDraftService(db).getRankedTeamIds(SAISON);
    expect(reihenfolge).not.toContain(NATIONAL_SELECTION_TEAM_ID);
    expect(reihenfolge.length).toBe(25);
    db.close();
  });

  it('schliesst den Draft ab, obwohl das Pseudo-Team freie Plaetze hat', () => {
    const db = aufbau(true);
    const svc = new RiderDraftService(db);
    const start = Date.now();
    const zustand = svc.getNextPickState(SAISON);
    expect(Date.now() - start).toBeLessThan(5000);
    expect(zustand.finished).toBe(true);
    expect(zustand.nextTeamId).toBeNull();
    db.close();
  });

  it('kommt auch beim Fortsetzen zum Ende', () => {
    const db = aufbau(true);
    const svc = new RiderDraftService(db);
    const start = Date.now();
    expect(svc.executeNextPicksUntilPlayer(SAISON, true)).toEqual({ finished: true, playerTurn: false });
    expect(Date.now() - start).toBeLessThan(5000);
    db.close();
  });

  it('verhaelt sich ohne Pseudo-Team unveraendert', () => {
    const db = aufbau(false);
    const zustand = new RiderDraftService(db).getNextPickState(SAISON);
    expect(zustand.finished).toBe(true);
    db.close();
  });

  it('laesst noch offene Plaetze weiter ziehen', () => {
    const db = aufbau(true);
    // Bei Team 7 zwei Plaetze freiraeumen - dort muss der Draft weitergehen.
    const zuLoeschen = db.prepare('SELECT rider_id FROM contracts WHERE team_id = 7 LIMIT 2').all() as Array<{ rider_id: number }>;
    for (const r of zuLoeschen) db.prepare('DELETE FROM contracts WHERE rider_id = ?').run(r.rider_id);
    const zustand = new RiderDraftService(db).getNextPickState(SAISON);
    expect(zustand.finished).toBe(false);
    expect(zustand.nextTeamId).toBe(7);
    db.close();
  });
});
