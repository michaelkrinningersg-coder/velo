"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = void 0;
function mapRider(row, currentYear) {
    const attrs = {
        timeTrial: row.attr_time_trial,
        climbing: row.attr_climbing,
        sprint: row.attr_sprint,
        flatEndurance: row.attr_flat_endur,
        stamina: row.attr_stamina,
        descending: row.attr_descending,
        positioning: row.attr_positioning,
        recovery: row.attr_recovery,
    };
    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        nationality: row.nationality,
        birthYear: row.birth_year,
        age: currentYear - row.birth_year,
        potential: row.potential,
        overallRating: row.overall_rating,
        attributes: attrs,
        teamId: row.team_id,
    };
}
function mapTeam(row) {
    return {
        id: row.id,
        name: row.name,
        abbreviation: row.abbreviation,
        divisionId: row.division_id,
        u23TeamId: row.u23_team,
        isPlayerTeam: row.is_player_team === 1,
        countryCode: row.country_code,
        colorPrimary: row.color_primary,
        colorSecondary: row.color_secondary,
        aiFocus1: row.ai_focus_1,
        aiFocus2: row.ai_focus_2,
        aiFocus3: row.ai_focus_3,
        u23TeamName: row.u23_team_name ?? undefined,
        divisionName: row.division_name,
        shortName: row.abbreviation,
        nationality: row.country_code,
        division: row.division_name,
    };
}
function mapRace(row) {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        season: row.season,
        date: row.date,
        isCompleted: row.is_completed === 1,
        profile: {
            distanceKm: row.distance_km,
            elevationGain: row.elevation_gain,
            avgGradientKey: row.avg_gradient,
            ttType: row.tt_type,
        },
        participatingTeamIds: [],
    };
}
class GameRepository {
    constructor(db) {
        this.db = db;
    }
    getCurrentSeason() {
        const row = this.db
            .prepare('SELECT season FROM game_state WHERE id = 1')
            .get();
        if (row)
            return row.season;
        const legacy = this.db
            .prepare(`SELECT value FROM career_meta WHERE key = 'current_season'`)
            .get();
        return legacy ? Number(legacy.value) : 2026;
    }
    getRiders(teamId) {
        const season = this.getCurrentSeason();
        const rows = teamId != null
            ? this.db.prepare('SELECT * FROM riders WHERE team_id = ? AND is_retired = 0 ORDER BY overall_rating DESC').all(teamId)
            : this.db.prepare('SELECT * FROM riders WHERE is_retired = 0 ORDER BY overall_rating DESC').all();
        return rows.map(r => mapRider(r, season));
    }
    getRiderById(id) {
        const season = this.getCurrentSeason();
        const row = this.db.prepare('SELECT * FROM riders WHERE id = ?').get(id);
        return row ? mapRider(row, season) : null;
    }
    getTeams() {
        const rows = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             t.is_player_team, t.country_code, t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name, dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      ORDER BY dt.tier, t.name
    `).all();
        return rows.map(mapTeam);
    }
    getTeamById(id) {
        const row = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             t.is_player_team, t.country_code, t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name, dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      WHERE t.id = ?
    `).get(id);
        return row ? mapTeam(row) : null;
    }
    getRaces(season) {
        const s = season ?? this.getCurrentSeason();
        const rows = this.db.prepare('SELECT * FROM races WHERE season = ? ORDER BY date ASC').all(s);
        return rows.map(row => {
            const race = mapRace(row);
            const teamIds = this.db.prepare('SELECT DISTINCT team_id FROM race_entries WHERE race_id = ?').all(row.id);
            race.participatingTeamIds = teamIds.map(t => t.team_id);
            return race;
        });
    }
    getRaceById(id) {
        const row = this.db.prepare('SELECT * FROM races WHERE id = ?').get(id);
        if (!row)
            return null;
        const race = mapRace(row);
        const teamIds = this.db.prepare('SELECT DISTINCT team_id FROM race_entries WHERE race_id = ?').all(id);
        race.participatingTeamIds = teamIds.map(t => t.team_id);
        return race;
    }
    getRaceRiders(raceId) {
        const season = this.getCurrentSeason();
        const rows = this.db.prepare(`
      SELECT r.* FROM riders r
      INNER JOIN race_entries re ON re.rider_id = r.id
      WHERE re.race_id = ? AND r.is_retired = 0
      ORDER BY r.overall_rating DESC
    `).all(raceId);
        return rows.map(r => mapRider(r, season));
    }
    saveRaceResults(raceId, results) {
        const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO race_results
        (race_id, rider_id, finish_position, finish_time_sec, gap_sec, day_form_factor)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const markDone = this.db.prepare('UPDATE races SET is_completed = 1 WHERE id = ?');
        this.db.transaction(() => {
            for (const r of results) {
                stmt.run(raceId, r.riderId, r.position, r.timeSec, r.gapSec, r.dayForm);
            }
            markDone.run(raceId);
        })();
    }
    getRaceResults(raceId) {
        const raceRow = this.db.prepare('SELECT * FROM races WHERE id = ?').get(raceId);
        if (!raceRow)
            return null;
        const resultRows = this.db.prepare(`
      SELECT rr.finish_position, rr.finish_time_sec, rr.gap_sec, rr.day_form_factor, r.*
      FROM race_results rr
      JOIN riders r ON r.id = rr.rider_id
      WHERE rr.race_id = ?
      ORDER BY rr.finish_position ASC
    `).all(raceId);
        if (resultRows.length === 0)
            return null;
        const season = this.getCurrentSeason();
        const entries = resultRows.map(row => ({
            rider: mapRider(row, season),
            dayFormFactor: row.day_form_factor,
            finishTimeSeconds: row.finish_time_sec,
            gapSeconds: row.gap_sec,
            finishTimeFormatted: formatTimeSec(row.finish_time_sec),
            gapFormatted: row.gap_sec === 0 ? 'Führend' : '+' + formatGapSec(row.gap_sec),
        }));
        return { raceId: raceRow.id, raceName: raceRow.name, distanceKm: raceRow.distance_km, season: raceRow.season, date: raceRow.date, entries };
    }
}
exports.GameRepository = GameRepository;
function formatTimeSec(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.floor(totalSec % 60);
    const ms = Math.round((totalSec % 1) * 10);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}.${ms}` : `${mm}:${ss}.${ms}`;
}
function formatGapSec(gapSec) {
    const m = Math.floor(gapSec / 60);
    const s = Math.floor(gapSec % 60);
    const ms = Math.round((gapSec % 1) * 10);
    const ss = String(s).padStart(2, '0');
    return `${m}:${ss}.${ms}`;
}
