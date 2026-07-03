"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateRepository = void 0;
const mappers_1 = require("../mappers");
const ResultRepository_1 = require("./ResultRepository");
class GameStateRepository {
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
    getCurrentDate() {
        const row = this.db
            .prepare('SELECT "current_date" AS current_date FROM game_state WHERE id = 1')
            .get();
        if (row?.current_date)
            return row.current_date;
        return `${new GameStateRepository(this.db).getCurrentSeason()}-01-01`;
    }
    prepareStageRaceFatigue(raceId, stageNumber, riderIds) {
        if (stageNumber < 1 || riderIds.length === 0) {
            return;
        }
        new GameStateRepository(this.db).ensureStageRaceStateSchema();
        const insertState = this.db.prepare(`
      INSERT OR IGNORE INTO rider_stage_race_state (
        race_id, rider_id, accumulated_random_fatigue, last_applied_stage_number,
        incident_day_form_penalty, incident_micro_form_penalty, incident_stamina_penalty,
        incident_day_form_cap, race_recuperation_penalty, current_recovery_penalty,
        pending_recovery_penalty_1, pending_recovery_penalty_2, pending_recovery_penalty_3
      ) VALUES (?, ?, 0, 0, 0, 0, 0, NULL, 0, 0, 0, 0, 0)
    `);
        const selectState = this.db.prepare(`
      SELECT rider_id,
             accumulated_random_fatigue,
             last_applied_stage_number,
             current_recovery_penalty,
             pending_recovery_penalty_1,
             pending_recovery_penalty_2,
             pending_recovery_penalty_3
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);
        const updateState = this.db.prepare(`
      UPDATE rider_stage_race_state
      SET accumulated_random_fatigue = ?,
          last_applied_stage_number = ?,
          current_recovery_penalty = ?,
          pending_recovery_penalty_1 = ?,
          pending_recovery_penalty_2 = ?,
          pending_recovery_penalty_3 = ?
      WHERE race_id = ? AND rider_id = ?
    `);
        this.db.transaction(() => {
            for (const riderId of riderIds) {
                insertState.run(raceId, riderId);
                const existing = selectState.get(raceId, riderId);
                if (!existing || existing.last_applied_stage_number >= stageNumber) {
                    continue;
                }
                let accumulatedRandomFatigue = existing.accumulated_random_fatigue;
                let currentRecoveryPenalty = existing.current_recovery_penalty;
                let pendingRecoveryPenalty1 = existing.pending_recovery_penalty_1;
                let pendingRecoveryPenalty2 = existing.pending_recovery_penalty_2;
                let pendingRecoveryPenalty3 = existing.pending_recovery_penalty_3;
                for (let nextStageNumber = existing.last_applied_stage_number + 1; nextStageNumber <= stageNumber; nextStageNumber += 1) {
                    currentRecoveryPenalty = pendingRecoveryPenalty1;
                    pendingRecoveryPenalty1 = pendingRecoveryPenalty2;
                    pendingRecoveryPenalty2 = pendingRecoveryPenalty3;
                    pendingRecoveryPenalty3 = 0;
                }
                if (Math.random() < 0.005) {
                    accumulatedRandomFatigue = (0, mappers_1.roundToTwoDecimals)(accumulatedRandomFatigue + (0, mappers_1.randomBetween)(0.1, 0.3));
                }
                updateState.run(accumulatedRandomFatigue, stageNumber, currentRecoveryPenalty, pendingRecoveryPenalty1, pendingRecoveryPenalty2, pendingRecoveryPenalty3, raceId, riderId);
            }
        })();
    }
    ensureStageEntries(stage) {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries (
        stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        team_id        INTEGER NOT NULL REFERENCES teams(id),
        rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
        status_reason  TEXT,
        PRIMARY KEY (stage_id, rider_id)
      )
    `).run();
        this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_race_stage_status ON stage_entries(race_id, stage_id, status)').run();
        this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stage_entries_rider_status ON stage_entries(rider_id, status)').run();
        if ((0, mappers_1.tableExists)(this.db, 'rider_daily_state')) {
            this.db.prepare(`
        DELETE FROM stage_entries
        WHERE stage_id = ?
          AND status = 'scheduled'
          AND rider_id IN (
            SELECT rider_id
            FROM rider_daily_state
            WHERE unavailable_days_remaining > 0
          )
      `).run(stage.id);
        }
        const inactiveRiderIds = new Set(this.db.prepare(`
      SELECT DISTINCT stage_entries.rider_id AS rider_id
      FROM stage_entries
      JOIN stages ON stages.id = stage_entries.stage_id
      WHERE stage_entries.race_id = ?
        AND stages.stage_number < ?
        AND stage_entries.status IN ('dns', 'dnf')
    `).all(stage.raceId, stage.stageNumber).map((row) => row.rider_id));
        const raceEntries = ((0, mappers_1.tableExists)(this.db, 'rider_daily_state')
            ? this.db.prepare(`
          SELECT re.race_id, re.team_id, re.rider_id
          FROM race_entries re
          LEFT JOIN rider_daily_state rider_state ON rider_state.rider_id = re.rider_id
          WHERE re.race_id = ?
          ORDER BY re.rider_id ASC
        `).all(stage.raceId)
            : this.db.prepare(`
          SELECT race_id, team_id, rider_id
          FROM race_entries
          WHERE race_id = ?
          ORDER BY rider_id ASC
        `).all(stage.raceId));
        const insertStageEntry = this.db.prepare(`
      INSERT OR IGNORE INTO stage_entries (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (?, ?, ?, ?, 'scheduled', NULL)
    `);
        this.db.transaction(() => {
            for (const entry of raceEntries) {
                if (inactiveRiderIds.has(entry.rider_id)) {
                    continue;
                }
                insertStageEntry.run(stage.id, stage.raceId, entry.team_id, entry.rider_id);
            }
        })();
        if ((0, mappers_1.tableExists)(this.db, 'rider_daily_state')) {
            this.db.prepare(`
        UPDATE stage_entries
        SET status = 'dns',
            status_reason = (
              SELECT CASE WHEN health_status = 'ill' THEN 'Krankheitsbedingt' ELSE 'Verletzungsbedingt' END
              FROM rider_daily_state
              WHERE rider_daily_state.rider_id = stage_entries.rider_id
            )
        WHERE stage_id = ?
          AND status = 'scheduled'
          AND rider_id IN (
            SELECT rider_id
            FROM rider_daily_state
            WHERE unavailable_days_remaining > 0
          )
      `).run(stage.id);
            this.db.prepare(`
        UPDATE stage_entries
        SET status = 'dns', status_reason = 'Erschöpfung'
        WHERE stage_id = ?
          AND status = 'scheduled'
          AND rider_id IN (
            SELECT rider_id
            FROM rider_daily_state
            WHERE (short_term_fatigue + long_term_fatigue_decayable + long_term_fatigue_locked) >= 25.0
          )
      `).run(stage.id);
        }
    }
    clearStageEntries(stageId) {
        if (!(0, mappers_1.tableExists)(this.db, 'stage_entries')) {
            return;
        }
        this.db.prepare('DELETE FROM stage_entries WHERE stage_id = ?').run(stageId);
    }
    updateStageEntryStatus(stageId, riderId, status, statusReason = null) {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries (
        stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        team_id        INTEGER NOT NULL REFERENCES teams(id),
        rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
        status_reason  TEXT,
        PRIMARY KEY (stage_id, rider_id)
      )
    `).run();
        this.db.prepare(`
      UPDATE stage_entries
      SET status = ?, status_reason = ?
      WHERE stage_id = ? AND rider_id = ?
    `).run(status, statusReason, stageId, riderId);
    }
    markStageEntriesFinished(stageId, riderIds) {
        if (riderIds.length === 0) {
            return;
        }
        // Schema-Erstellung/Überprüfung einmalig vor der Schleife ausführen
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS stage_entries (
        stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
        race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        team_id        INTEGER NOT NULL REFERENCES teams(id),
        rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
        status_reason  TEXT,
        PRIMARY KEY (stage_id, rider_id)
      )
    `).run();
        // SQL-Statement einmalig vorbereiten
        const updateStmt = this.db.prepare(`
      UPDATE stage_entries
      SET status = 'finished', status_reason = NULL
      WHERE stage_id = ? AND rider_id = ?
    `);
        this.db.transaction(() => {
            for (const riderId of riderIds) {
                updateStmt.run(stageId, riderId);
            }
        })();
    }
    getFullyClassifiedStageRaceRiderIds(raceId, upToStageNumber) {
        if (upToStageNumber < 1 || !(0, mappers_1.tableExists)(this.db, 'stages') || !(0, mappers_1.tableExists)(this.db, 'stage_entries') || !(0, mappers_1.tableExists)(this.db, 'races')) {
            return [];
        }
        const raceRow = this.db.prepare('SELECT is_stage_race FROM races WHERE id = ?').get(raceId);
        if (!raceRow || raceRow.is_stage_race !== 1) {
            return [];
        }
        const expectedStageCount = this.db.prepare(`
      SELECT COUNT(*) AS stage_count
      FROM stages
      WHERE race_id = ?
        AND stage_number <= ?
    `).get(raceId, upToStageNumber)?.stage_count ?? 0;
        if (expectedStageCount < 1) {
            return [];
        }
        const tableName = (0, mappers_1.tableExists)(this.db, 'all_stage_entries') ? 'all_stage_entries' : 'stage_entries';
        const rows = this.db.prepare(`
      SELECT ${tableName}.rider_id AS rider_id
      FROM ${tableName}
      JOIN stages ON stages.id = ${tableName}.stage_id
      WHERE ${tableName}.race_id = ?
        AND stages.stage_number <= ?
      GROUP BY ${tableName}.rider_id
      HAVING COUNT(*) = ?
        AND SUM(CASE WHEN ${tableName}.status = 'finished' THEN 1 ELSE 0 END) = ?
        AND SUM(CASE WHEN ${tableName}.status IN ('dns', 'dnf') THEN 1 ELSE 0 END) = 0
    `).all(raceId, upToStageNumber, expectedStageCount, expectedStageCount);
        return rows.map((row) => row.rider_id);
    }
    markUnavailableStageRaceParticipantsAsDnf() {
        if (!(0, mappers_1.tableExists)(this.db, 'races')
            || !(0, mappers_1.tableExists)(this.db, 'stages')
            || !(0, mappers_1.tableExists)(this.db, 'race_entries')
            || !(0, mappers_1.tableExists)(this.db, 'stage_entries')
            || !(0, mappers_1.tableExists)(this.db, 'rider_daily_state')) {
            return 0;
        }
        const candidates = this.db.prepare(`
      SELECT
        target_stage.id AS stage_id,
        candidate.race_id AS race_id,
        candidate.team_id AS team_id,
        candidate.rider_id AS rider_id,
        candidate.health_status AS health_status
      FROM (
        SELECT
          race_entries.race_id AS race_id,
          race_entries.team_id AS team_id,
          race_entries.rider_id AS rider_id,
          rider_daily_state.health_status AS health_status,
          MAX(stages.stage_number) AS last_finished_stage_number
        FROM race_entries
        JOIN races ON races.id = race_entries.race_id
        JOIN rider_daily_state ON rider_daily_state.rider_id = race_entries.rider_id
        JOIN stage_entries ON stage_entries.race_id = race_entries.race_id
          AND stage_entries.rider_id = race_entries.rider_id
          AND stage_entries.status = 'finished'
        JOIN stages ON stages.id = stage_entries.stage_id
        WHERE races.is_stage_race = 1
          AND rider_daily_state.unavailable_days_remaining > 0
          AND rider_daily_state.health_status IN ('ill', 'injured')
          AND NOT EXISTS (
            SELECT 1
            FROM stage_entries AS exited_entries
            WHERE exited_entries.race_id = race_entries.race_id
              AND exited_entries.rider_id = race_entries.rider_id
              AND exited_entries.status IN ('dns', 'dnf')
          )
        GROUP BY race_entries.race_id, race_entries.team_id, race_entries.rider_id, rider_daily_state.health_status
      ) AS candidate
      JOIN stages AS target_stage
        ON target_stage.race_id = candidate.race_id
       AND target_stage.stage_number = candidate.last_finished_stage_number + 1
    `).all();
        if (candidates.length === 0) {
            return 0;
        }
        const upsertStageEntry = this.db.prepare(`
      INSERT INTO stage_entries (stage_id, race_id, team_id, rider_id, status, status_reason)
      VALUES (?, ?, ?, ?, 'dnf', ?)
      ON CONFLICT(stage_id, rider_id) DO UPDATE SET
        race_id = excluded.race_id,
        team_id = excluded.team_id,
        status = excluded.status,
        status_reason = excluded.status_reason
    `);
        this.db.transaction(() => {
            for (const candidate of candidates) {
                upsertStageEntry.run(candidate.stage_id, candidate.race_id, candidate.team_id, candidate.rider_id, candidate.health_status === 'ill' ? 'Krankheit' : 'Verletzung');
            }
        })();
        return candidates.length;
    }
    attachStageRaceFatigue(raceId, riders, stageNumber) {
        if (riders.length === 0 || stageNumber < 1) {
            return riders;
        }
        new GameStateRepository(this.db).ensureStageRaceStateSchema();
        const fatigueRows = this.db.prepare(`
      SELECT race_id,
             rider_id,
             accumulated_random_fatigue,
             incident_day_form_penalty,
             incident_micro_form_penalty,
             incident_stamina_penalty,
             incident_day_form_cap,
             race_recuperation_penalty,
             current_recovery_penalty
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);
        return riders.map((rider) => {
            const row = fatigueRows.get(raceId, rider.id);
            const accumulatedRandomFatigue = row?.accumulated_random_fatigue ?? 0;
            const stageRaceRecuperationPenalty = (row?.race_recuperation_penalty ?? 0) + (row?.current_recovery_penalty ?? 0);
            return {
                ...rider,
                accumulatedRandomFatigue,
                fatigueMalus: (0, mappers_1.resolveStageRaceFatigueMalus)(stageNumber, (0, mappers_1.resolveEffectiveRecuperationSkill)(rider.skills.recuperation, stageRaceRecuperationPenalty), accumulatedRandomFatigue),
                stageRaceDayFormPenalty: row?.incident_day_form_penalty ?? 0,
                stageRaceMicroFormPenalty: row?.incident_micro_form_penalty ?? 0,
                stageRaceStaminaPenalty: row?.incident_stamina_penalty ?? 0,
                stageRaceDayFormCap: row?.incident_day_form_cap ?? null,
                stageRaceRecuperationPenalty,
            };
        });
    }
    applyIncidentRaceState(raceId, incidents) {
        if (incidents.length === 0) {
            return;
        }
        new GameStateRepository(this.db).ensureStageRaceStateSchema();
        const relevantIncidents = incidents.filter((incident) => incident.type === 'crash' && incident.severity !== 'severe');
        if (relevantIncidents.length === 0) {
            return;
        }
        const insertState = this.db.prepare(`
      INSERT OR IGNORE INTO rider_stage_race_state (
        race_id, rider_id, accumulated_random_fatigue, last_applied_stage_number,
        incident_day_form_penalty, incident_micro_form_penalty, incident_stamina_penalty,
        incident_day_form_cap, race_recuperation_penalty, current_recovery_penalty,
        pending_recovery_penalty_1, pending_recovery_penalty_2, pending_recovery_penalty_3
      ) VALUES (?, ?, 0, 0, 0, 0, 0, NULL, 0, 0, 0, 0, 0)
    `);
        const currentState = this.db.prepare(`
      SELECT incident_day_form_penalty,
             incident_micro_form_penalty,
             incident_stamina_penalty,
             incident_day_form_cap,
             race_recuperation_penalty,
             pending_recovery_penalty_1,
             pending_recovery_penalty_2,
             pending_recovery_penalty_3
      FROM rider_stage_race_state
      WHERE race_id = ? AND rider_id = ?
    `);
        const updateState = this.db.prepare(`
      UPDATE rider_stage_race_state
      SET incident_day_form_penalty = ?,
          incident_micro_form_penalty = ?,
          incident_stamina_penalty = ?,
          incident_day_form_cap = ?,
          race_recuperation_penalty = ?,
          pending_recovery_penalty_1 = ?,
          pending_recovery_penalty_2 = ?,
          pending_recovery_penalty_3 = ?
      WHERE race_id = ? AND rider_id = ?
    `);
        for (const incident of relevantIncidents) {
            insertState.run(raceId, incident.riderId);
            const existing = currentState.get(raceId, incident.riderId);
            if (!existing) {
                continue;
            }
            let incidentDayFormPenalty = existing.incident_day_form_penalty;
            let incidentMicroFormPenalty = existing.incident_micro_form_penalty;
            let incidentStaminaPenalty = existing.incident_stamina_penalty;
            let incidentDayFormCap = existing.incident_day_form_cap;
            let raceRecuperationPenalty = existing.race_recuperation_penalty;
            let pendingRecoveryPenalty1 = existing.pending_recovery_penalty_1;
            let pendingRecoveryPenalty2 = existing.pending_recovery_penalty_2;
            let pendingRecoveryPenalty3 = existing.pending_recovery_penalty_3;
            if (incident.severity === 'medium') {
                incidentDayFormPenalty = (0, mappers_1.roundToTwoDecimals)(incidentDayFormPenalty + incident.dayFormPenalty - 3);
                incidentMicroFormPenalty = (0, mappers_1.roundToTwoDecimals)(incidentMicroFormPenalty - 3);
                incidentStaminaPenalty = (0, mappers_1.roundToTwoDecimals)(incidentStaminaPenalty + incident.staminaPenalty);
                incidentDayFormCap = incidentDayFormCap == null ? 0 : Math.min(incidentDayFormCap, 0);
                raceRecuperationPenalty = (0, mappers_1.roundToTwoDecimals)(raceRecuperationPenalty + incident.raceRecuperationPenalty);
            }
            if (incident.severity === 'light') {
                pendingRecoveryPenalty1 = (0, mappers_1.roundToTwoDecimals)(pendingRecoveryPenalty1 + (incident.recoveryPenaltyStages[0] ?? 0));
                pendingRecoveryPenalty2 = (0, mappers_1.roundToTwoDecimals)(pendingRecoveryPenalty2 + (incident.recoveryPenaltyStages[1] ?? 0));
                pendingRecoveryPenalty3 = (0, mappers_1.roundToTwoDecimals)(pendingRecoveryPenalty3 + (incident.recoveryPenaltyStages[2] ?? 0));
            }
            updateState.run(incidentDayFormPenalty, incidentMicroFormPenalty, incidentStaminaPenalty, incidentDayFormCap, raceRecuperationPenalty, pendingRecoveryPenalty1, pendingRecoveryPenalty2, pendingRecoveryPenalty3, raceId, incident.riderId);
        }
    }
    getStageScoringRules() {
        if (!(0, mappers_1.tableExists)(this.db, 'rules')) {
            return [];
        }
        const rows = this.db.prepare(`
      SELECT id,
             rule_key,
             applies_to,
             marker_type,
             marker_category,
             weight_flat,
             weight_mountain,
             weight_medium_mountain,
             weight_hill,
             weight_time_trial,
             weight_prologue,
             weight_cobble,
             weight_sprint,
             weight_acceleration,
             weight_downhill,
             weight_attack,
             weight_stamina,
             weight_resistance,
             weight_recuperation,
             weight_bike_handling
      FROM rules
      ORDER BY id ASC
    `).all();
        return rows.map(mappers_1.mapStageScoringRule);
    }
    getSkillWeightRules() {
        if (!(0, mappers_1.tableExists)(this.db, 'skill_weights')) {
            return [];
        }
        const rows = this.db.prepare(`
      SELECT id,
             simulation_mode,
             terrain,
             weight_flat,
             weight_mountain,
             weight_medium_mountain,
             weight_hill,
             weight_time_trial,
             weight_prologue,
             weight_cobble,
             weight_sprint,
             weight_acceleration,
             weight_downhill,
             weight_attack,
             weight_stamina,
             weight_resistance,
             weight_recuperation,
             weight_bike_handling,
                  final_spread_late_multiplier,
                  final_spread_peak_multiplier,
             ttt_speed_multiplier
      FROM skill_weights
      ORDER BY id ASC
    `).all();
        return rows.map(mappers_1.mapSkillWeightRule);
    }
    ensureStageRaceStateSchema() {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS rider_stage_race_state (
        race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        accumulated_random_fatigue REAL NOT NULL DEFAULT 0,
        last_applied_stage_number INTEGER NOT NULL DEFAULT 0,
        incident_day_form_penalty REAL NOT NULL DEFAULT 0,
        incident_micro_form_penalty REAL NOT NULL DEFAULT 0,
        incident_stamina_penalty REAL NOT NULL DEFAULT 0,
        incident_day_form_cap REAL,
        race_recuperation_penalty REAL NOT NULL DEFAULT 0,
        current_recovery_penalty REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_1 REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_2 REAL NOT NULL DEFAULT 0,
        pending_recovery_penalty_3 REAL NOT NULL DEFAULT 0,
        PRIMARY KEY (race_id, rider_id)
      )
    `).run();
        this.db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_rider_stage_race_state_race
      ON rider_stage_race_state(race_id, rider_id)
    `).run();
        const missingColumns = [
            ['incident_day_form_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['incident_micro_form_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['incident_stamina_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['incident_day_form_cap', 'REAL'],
            ['race_recuperation_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['current_recovery_penalty', 'REAL NOT NULL DEFAULT 0'],
            ['pending_recovery_penalty_1', 'REAL NOT NULL DEFAULT 0'],
            ['pending_recovery_penalty_2', 'REAL NOT NULL DEFAULT 0'],
            ['pending_recovery_penalty_3', 'REAL NOT NULL DEFAULT 0'],
        ];
        for (const [columnName, columnDefinition] of missingColumns) {
            if (!(0, mappers_1.columnExists)(this.db, 'rider_stage_race_state', columnName)) {
                this.db.prepare(`
          ALTER TABLE rider_stage_race_state
          ADD COLUMN ${columnName} ${columnDefinition}
        `).run();
            }
        }
    }
    syncSeasonPointEventsForSeason(season = new GameStateRepository(this.db).getCurrentSeason(), stageId) {
        if (!(0, mappers_1.tableExists)(this.db, 'season_point_events') || !(0, mappers_1.tableExists)(this.db, 'results')) {
            return;
        }
        const query = `
      SELECT
        stages.id AS stage_id,
        stages.race_id AS race_id,
        stages.stage_number AS stage_number,
        stages.date AS date,
        stages.profile AS profile,
        races.is_stage_race AS is_stage_race,
        races.number_of_stages AS number_of_stages,
        race_categories_bonus.points_stage AS points_stage,
        race_categories_bonus.points_mountainstage AS points_mountainstage,
        race_categories_bonus.points_one_day AS points_one_day,
        race_categories_bonus.points_gc_final AS points_gc_final,
        race_categories_bonus.points_jersey_leader_day AS points_jersey_leader_day,
        race_categories_bonus.points_jersey_sprint_day AS points_jersey_sprint_day,
        race_categories_bonus.points_jersey_mountain_day AS points_jersey_mountain_day,
        race_categories_bonus.points_jersey_youth_day AS points_jersey_youth_day,
        race_categories_bonus.points_jersey_sprint_final AS points_jersey_sprint_final,
        race_categories_bonus.points_jersey_mountain_final AS points_jersey_mountain_final,
        race_categories_bonus.points_jersey_youth_final AS points_jersey_youth_final
      FROM stages
      JOIN races ON races.id = stages.race_id
      JOIN race_categories ON race_categories.id = races.category_id
      JOIN race_categories_bonus ON race_categories_bonus.id = race_categories.bonus_system_id
      WHERE CAST(substr(stages.date, 1, 4) AS INTEGER) = ?
        ${stageId != null ? 'AND stages.id = ?' : ''}
        AND EXISTS (
          SELECT 1
          FROM all_results results
          WHERE results.stage_id = stages.id AND results.result_type_id = ?
        )
      ORDER BY stages.date ASC, stages.race_id ASC, stages.stage_number ASC
    `;
        const params = stageId != null ? [season, stageId, mappers_1.RESULT_TYPE_IDS.stage] : [season, mappers_1.RESULT_TYPE_IDS.stage];
        const stages = this.db.prepare(query).all(...params);
        if (stages.length === 0) {
            return;
        }
        const insert = this.db.prepare(`
      INSERT OR IGNORE INTO season_point_events (
        season, race_id, stage_id, rider_id, team_id, award_type, rank, points_awarded, awarded_on
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        this.db.transaction(() => {
            for (const stage of stages) {
                const stageRows = new ResultRepository_1.ResultRepository(this.db).loadSeasonPointResultRows(stage.stage_id, mappers_1.RESULT_TYPE_IDS.stage);
                const gcRows = new ResultRepository_1.ResultRepository(this.db).loadSeasonPointResultRows(stage.stage_id, mappers_1.RESULT_TYPE_IDS.gc);
                const pointsRows = new ResultRepository_1.ResultRepository(this.db).loadSeasonPointResultRows(stage.stage_id, mappers_1.RESULT_TYPE_IDS.points);
                const mountainRows = new ResultRepository_1.ResultRepository(this.db).loadSeasonPointResultRows(stage.stage_id, mappers_1.RESULT_TYPE_IDS.mountain);
                const youthRows = new ResultRepository_1.ResultRepository(this.db).loadSeasonPointResultRows(stage.stage_id, mappers_1.RESULT_TYPE_IDS.youth);
                const pointsLeaderRow = this.db.prepare(`
          SELECT points
          FROM all_results
          WHERE stage_id = ? AND result_type_id = ? AND rank = 1
        `).get(stage.stage_id, mappers_1.RESULT_TYPE_IDS.points);
                const hasPointsPoints = pointsLeaderRow != null && pointsLeaderRow.points != null && pointsLeaderRow.points > 0;
                const mountainLeaderRow = this.db.prepare(`
          SELECT points
          FROM all_results
          WHERE stage_id = ? AND result_type_id = ? AND rank = 1
        `).get(stage.stage_id, mappers_1.RESULT_TYPE_IDS.mountain);
                const hasMountainPoints = mountainLeaderRow != null && mountainLeaderRow.points != null && mountainLeaderRow.points > 0;
                if (stage.is_stage_race === 1) {
                    new ResultRepository_1.ResultRepository(this.db).insertSeasonPointAwards(insert, season, stage, 'stage_result', stageRows, (0, mappers_1.resolveStageResultPointValues)(stage));
                    new ResultRepository_1.ResultRepository(this.db).insertSeasonPointLeaderAward(insert, season, stage, 'gc_leader_day', gcRows[0], stage.points_jersey_leader_day);
                    if (hasPointsPoints) {
                        new ResultRepository_1.ResultRepository(this.db).insertSeasonPointLeaderAward(insert, season, stage, 'points_leader_day', pointsRows[0], stage.points_jersey_sprint_day);
                    }
                    if (hasMountainPoints) {
                        new ResultRepository_1.ResultRepository(this.db).insertSeasonPointLeaderAward(insert, season, stage, 'mountain_leader_day', mountainRows[0], stage.points_jersey_mountain_day);
                    }
                    new ResultRepository_1.ResultRepository(this.db).insertSeasonPointLeaderAward(insert, season, stage, 'youth_leader_day', youthRows[0], stage.points_jersey_youth_day);
                    if (stage.stage_number === stage.number_of_stages) {
                        new ResultRepository_1.ResultRepository(this.db).insertSeasonPointAwards(insert, season, stage, 'gc_final', gcRows, (0, mappers_1.parseRankedValues)(stage.points_gc_final));
                        if (hasPointsPoints) {
                            new ResultRepository_1.ResultRepository(this.db).insertSeasonPointAwards(insert, season, stage, 'points_final', pointsRows, (0, mappers_1.parseRankedValues)(stage.points_jersey_sprint_final));
                        }
                        if (hasMountainPoints) {
                            new ResultRepository_1.ResultRepository(this.db).insertSeasonPointAwards(insert, season, stage, 'mountain_final', mountainRows, (0, mappers_1.parseRankedValues)(stage.points_jersey_mountain_final));
                        }
                        new ResultRepository_1.ResultRepository(this.db).insertSeasonPointAwards(insert, season, stage, 'youth_final', youthRows, (0, mappers_1.parseRankedValues)(stage.points_jersey_youth_final));
                    }
                }
                else {
                    new ResultRepository_1.ResultRepository(this.db).insertSeasonPointAwards(insert, season, stage, 'one_day_result', stageRows, (0, mappers_1.parseRankedValues)(stage.points_one_day));
                }
            }
        })();
    }
}
exports.GameStateRepository = GameStateRepository;
