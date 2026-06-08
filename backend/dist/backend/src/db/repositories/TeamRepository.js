"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRepository = void 0;
const mappers_1 = require("../mappers");
class TeamRepository {
    constructor(db) {
        this.db = db;
    }
    getTeams() {
        const rows = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             main.id AS main_team_id,
             t.is_player_team, t.country_id,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name,
             main.name AS main_team_name,
             dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      JOIN sta_country country ON country.id = t.country_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      LEFT JOIN teams main ON main.u23_team = t.id
      ORDER BY dt.tier ASC, t.name ASC
    `).all();
        return rows.map(mappers_1.mapTeam);
    }
    getTeamById(id) {
        const row = this.db.prepare(`
      SELECT t.id, t.name, t.abbreviation, t.division_id, t.u23_team,
             main.id AS main_team_id,
             t.is_player_team, t.country_id,
             country.name AS country_name,
             country.code_3 AS country_code_3,
             country.continent AS country_continent,
             country.regen_rating AS country_regen_rating,
             country.number_regen_min AS country_number_regen_min,
             country.number_regen_max AS country_number_regen_max,
             t.color_primary, t.color_secondary,
             t.ai_focus_1, t.ai_focus_2, t.ai_focus_3,
             u23.name AS u23_team_name,
             main.name AS main_team_name,
             dt.name AS division_name
      FROM teams t
      JOIN division_teams dt ON dt.id = t.division_id
      JOIN sta_country country ON country.id = t.country_id
      LEFT JOIN teams u23 ON u23.id = t.u23_team
      LEFT JOIN teams main ON main.u23_team = t.id
      WHERE t.id = ?
    `).get(id);
        return row ? (0, mappers_1.mapTeam)(row) : null;
    }
}
exports.TeamRepository = TeamRepository;
