-- ============================================================
--  VELO â€“ Master-Datenbankschema (world_data.db)
--  Wird bei Spielstart als schreibgeschÃ¼tzte Vorlage genutzt.
--  Beim Erstellen einer neuen Karriere wird diese Datei in den
--  savegames-Ordner kopiert und dort weiterentwickelt.
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ---- Karriere-Metadaten (nur in Savegame-Kopien befÃ¼llt) ----
CREATE TABLE IF NOT EXISTS career_meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- ---- Globaler Spielzustand --------------------------------
CREATE TABLE IF NOT EXISTS game_state (
  id            INTEGER PRIMARY KEY CHECK(id = 1),
  current_date  TEXT    NOT NULL,
  season        INTEGER NOT NULL,
  is_game_over  INTEGER NOT NULL DEFAULT 0 CHECK(is_game_over IN (0, 1))
);

-- ---- Länder-Gruppen für Programme -----------------------------
CREATE TABLE IF NOT EXISTS program_groups (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL UNIQUE
);

-- ---- Laender-Stammdaten -------------------------------------
CREATE TABLE IF NOT EXISTS sta_country (
  id                 INTEGER PRIMARY KEY,
  name               TEXT    NOT NULL,
  code_3             TEXT    NOT NULL UNIQUE CHECK(length(code_3) = 3),
  continent          TEXT    NOT NULL,
  regen_rating       INTEGER NOT NULL CHECK(regen_rating BETWEEN 1 AND 100),
  number_regen_min   INTEGER NOT NULL CHECK(number_regen_min >= 0),
  number_regen_max   INTEGER NOT NULL CHECK(number_regen_max >= number_regen_min),
  program_group_id   INTEGER REFERENCES program_groups(id)
);

-- ---- Liga-System / Divisionen mit Regeln --------------------
CREATE TABLE IF NOT EXISTS division_teams (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT    NOT NULL UNIQUE,
  tier             INTEGER NOT NULL CHECK(tier >= 1),
  max_teams        INTEGER NOT NULL CHECK(max_teams > 0),
  min_roster_size  INTEGER NOT NULL CHECK(min_roster_size > 0),
  max_roster_size  INTEGER NOT NULL CHECK(max_roster_size >= min_roster_size)
);

-- ---- Teams --------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT    NOT NULL,
  abbreviation    TEXT    NOT NULL CHECK(length(abbreviation) = 3),
  division_id     INTEGER NOT NULL REFERENCES division_teams(id),
  u23_team        INTEGER REFERENCES teams(id),
  is_player_team  INTEGER NOT NULL DEFAULT 0 CHECK(is_player_team IN (0, 1)),
  country_id      INTEGER NOT NULL REFERENCES sta_country(id),
  color_primary   TEXT    NOT NULL,
  color_secondary TEXT    NOT NULL,
  ai_focus_1      INTEGER NOT NULL REFERENCES type_rider(id),
  ai_focus_2      INTEGER NOT NULL REFERENCES type_rider(id),
  ai_focus_3      INTEGER NOT NULL REFERENCES type_rider(id)
);

-- ---- Rider-Typen -------------------------------------------
CREATE TABLE IF NOT EXISTS type_rider (
  id                INTEGER PRIMARY KEY,
  type_key          TEXT    NOT NULL UNIQUE,
  display_name      TEXT    NOT NULL,
  is_stage_focus    INTEGER NOT NULL DEFAULT 0 CHECK(is_stage_focus IN (0, 1)),
  is_one_day_focus  INTEGER NOT NULL DEFAULT 0 CHECK(is_one_day_focus IN (0, 1))
);

-- ---- Fahrerrollen ------------------------------------------
CREATE TABLE IF NOT EXISTS sta_role (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL UNIQUE,
  weighting  INTEGER NOT NULL CHECK(weighting >= 0)
);

-- ---- Fahrer -------------------------------------------------
CREATE TABLE IF NOT EXISTS riders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name     TEXT    NOT NULL,
  last_name      TEXT    NOT NULL,
  country_id     INTEGER NOT NULL REFERENCES sta_country(id),
  role_id        INTEGER REFERENCES sta_role(id),
  rider_type_id  INTEGER NOT NULL REFERENCES type_rider(id),
  birth_year     INTEGER NOT NULL,
  peak_age       INTEGER NOT NULL DEFAULT 0 CHECK(peak_age BETWEEN 0 AND 28),
  decline_age    INTEGER NOT NULL DEFAULT 0 CHECK(decline_age BETWEEN 0 AND 32),
  retirement_age INTEGER NOT NULL DEFAULT 0 CHECK(retirement_age BETWEEN 0 AND 38),
  skill_development INTEGER NOT NULL DEFAULT 0 CHECK(skill_development BETWEEN 0 AND 20),
  pot_overall    REAL NOT NULL DEFAULT 0 CHECK(pot_overall BETWEEN 0 AND 85),
  overall_rating REAL NOT NULL CHECK(overall_rating BETWEEN 0 AND 85),
  skill_flat              REAL NOT NULL DEFAULT 50 CHECK(skill_flat BETWEEN 0 AND 85),
  skill_mountain          REAL NOT NULL DEFAULT 50 CHECK(skill_mountain BETWEEN 0 AND 85),
  skill_medium_mountain   REAL NOT NULL DEFAULT 50 CHECK(skill_medium_mountain BETWEEN 0 AND 85),
  skill_hill              REAL NOT NULL DEFAULT 50 CHECK(skill_hill BETWEEN 0 AND 85),
  skill_time_trial        REAL NOT NULL DEFAULT 50 CHECK(skill_time_trial BETWEEN 0 AND 85),
  skill_prologue          REAL NOT NULL DEFAULT 50 CHECK(skill_prologue BETWEEN 0 AND 85),
  skill_cobble            REAL NOT NULL DEFAULT 50 CHECK(skill_cobble BETWEEN 0 AND 85),
  skill_sprint            REAL NOT NULL DEFAULT 50 CHECK(skill_sprint BETWEEN 0 AND 85),
  skill_acceleration      REAL NOT NULL DEFAULT 50 CHECK(skill_acceleration BETWEEN 0 AND 85),
  skill_downhill          REAL NOT NULL DEFAULT 50 CHECK(skill_downhill BETWEEN 0 AND 85),
  skill_attack            REAL NOT NULL DEFAULT 50 CHECK(skill_attack BETWEEN 0 AND 85),
  skill_stamina           REAL NOT NULL DEFAULT 50 CHECK(skill_stamina BETWEEN 0 AND 85),
  skill_resistance        REAL NOT NULL DEFAULT 50 CHECK(skill_resistance BETWEEN 0 AND 85),
  skill_recuperation      REAL NOT NULL DEFAULT 50 CHECK(skill_recuperation BETWEEN 0 AND 85),
  skill_bike_handling     REAL NOT NULL DEFAULT 50 CHECK(skill_bike_handling BETWEEN 0 AND 85),
  pot_flat              REAL NOT NULL DEFAULT 0 CHECK(pot_flat BETWEEN 0 AND 85),
  pot_mountain          REAL NOT NULL DEFAULT 0 CHECK(pot_mountain BETWEEN 0 AND 85),
  pot_medium_mountain   REAL NOT NULL DEFAULT 0 CHECK(pot_medium_mountain BETWEEN 0 AND 85),
  pot_hill              REAL NOT NULL DEFAULT 0 CHECK(pot_hill BETWEEN 0 AND 85),
  pot_time_trial        REAL NOT NULL DEFAULT 0 CHECK(pot_time_trial BETWEEN 0 AND 85),
  pot_prologue          REAL NOT NULL DEFAULT 0 CHECK(pot_prologue BETWEEN 0 AND 85),
  pot_cobble            REAL NOT NULL DEFAULT 0 CHECK(pot_cobble BETWEEN 0 AND 85),
  pot_sprint            REAL NOT NULL DEFAULT 0 CHECK(pot_sprint BETWEEN 0 AND 85),
  pot_acceleration      REAL NOT NULL DEFAULT 0 CHECK(pot_acceleration BETWEEN 0 AND 85),
  pot_downhill          REAL NOT NULL DEFAULT 0 CHECK(pot_downhill BETWEEN 0 AND 85),
  pot_attack            REAL NOT NULL DEFAULT 0 CHECK(pot_attack BETWEEN 0 AND 85),
  pot_stamina           REAL NOT NULL DEFAULT 0 CHECK(pot_stamina BETWEEN 0 AND 85),
  pot_resistance        REAL NOT NULL DEFAULT 0 CHECK(pot_resistance BETWEEN 0 AND 85),
  pot_recuperation      REAL NOT NULL DEFAULT 0 CHECK(pot_recuperation BETWEEN 0 AND 85),
  pot_bike_handling     REAL NOT NULL DEFAULT 0 CHECK(pot_bike_handling BETWEEN 0 AND 85),
  specialization_1_id  INTEGER REFERENCES type_rider(id),
  specialization_2_id  INTEGER REFERENCES type_rider(id),
  specialization_3_id  INTEGER REFERENCES type_rider(id),
  is_stage_racer    INTEGER NOT NULL DEFAULT 0 CHECK(is_stage_racer IN (0, 1)),
  is_one_day_racer  INTEGER NOT NULL DEFAULT 0 CHECK(is_one_day_racer IN (0, 1)),
  has_grand_tour_tag INTEGER NOT NULL DEFAULT 0 CHECK(has_grand_tour_tag IN (0, 1)),
  has_stage_race_tag INTEGER NOT NULL DEFAULT 0 CHECK(has_stage_race_tag IN (0, 1)),
  has_one_day_classic_tag INTEGER NOT NULL DEFAULT 0 CHECK(has_one_day_classic_tag IN (0, 1)),
  favorite_races    TEXT    NOT NULL DEFAULT '',
  non_favorite_races TEXT   NOT NULL DEFAULT '',
  active_team_id    INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  active_contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL,
  is_retired        INTEGER NOT NULL DEFAULT 0 CHECK(is_retired IN (0, 1)),
  weather_profile_id INTEGER NOT NULL DEFAULT 1 CHECK(weather_profile_id BETWEEN 1 AND 7),
  yearly_baseline_skills TEXT DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_riders_active_team ON riders(active_team_id);
CREATE INDEX IF NOT EXISTS idx_riders_type ON riders(rider_type_id);

-- ---- VertrÃ¤ge -----------------------------------------------
CREATE TABLE IF NOT EXISTS contracts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  rider_id        INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  team_id         INTEGER NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  start_season    INTEGER NOT NULL,
  end_season      INTEGER NOT NULL,
  status          TEXT    NOT NULL DEFAULT 'future' CHECK(status IN ('active', 'expired', 'future')),
  CHECK(end_season >= start_season),
  UNIQUE(rider_id, start_season)
);

CREATE INDEX IF NOT EXISTS idx_contracts_rider_season ON contracts(rider_id, start_season, end_season);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- ---- Rennkategorien / Punkte- und Bonussysteme -------------
CREATE TABLE IF NOT EXISTS race_categories_bonus (
  id                           INTEGER PRIMARY KEY,
  name                         TEXT    NOT NULL UNIQUE,
  bonus_seconds_final          TEXT    NOT NULL DEFAULT '',
  bonus_seconds_intermediate   TEXT    NOT NULL DEFAULT '',
  points_stage                 TEXT    NOT NULL DEFAULT '',
  points_mountainstage         TEXT    NOT NULL DEFAULT '',
  points_sprint_finish         TEXT    NOT NULL DEFAULT '',
  points_one_day               TEXT    NOT NULL DEFAULT '',
  points_gc_final              TEXT    NOT NULL DEFAULT '',
  points_jersey_leader_day     INTEGER NOT NULL DEFAULT 0 CHECK(points_jersey_leader_day >= 0),
  points_jersey_sprint_day     INTEGER NOT NULL DEFAULT 0 CHECK(points_jersey_sprint_day >= 0),
  points_jersey_mountain_day   INTEGER NOT NULL DEFAULT 0 CHECK(points_jersey_mountain_day >= 0),
  points_jersey_youth_day      INTEGER NOT NULL DEFAULT 0 CHECK(points_jersey_youth_day >= 0),
  points_sprint_intermediate   TEXT    NOT NULL DEFAULT '',
  points_mountain_hc           TEXT    NOT NULL DEFAULT '',
  points_mountain_cat1         TEXT    NOT NULL DEFAULT '',
  points_mountain_cat2         TEXT    NOT NULL DEFAULT '',
  points_mountain_cat3         TEXT    NOT NULL DEFAULT '',
  points_mountain_cat4         TEXT    NOT NULL DEFAULT '',
  points_jersey_sprint_final   TEXT    NOT NULL DEFAULT '',
  points_jersey_mountain_final TEXT    NOT NULL DEFAULT '',
  points_jersey_youth_final    TEXT    NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS race_categories (
  id                         INTEGER PRIMARY KEY,
  name                       TEXT    NOT NULL UNIQUE,
  tier                       INTEGER NOT NULL CHECK(tier IN (1, 2, 3)),
  number_of_teams            INTEGER NOT NULL CHECK(number_of_teams > 0),
  number_of_riders           INTEGER NOT NULL CHECK(number_of_riders > 0),
  bonus_system_id            INTEGER NOT NULL REFERENCES race_categories_bonus(id),
  home_selection_probability REAL    NOT NULL DEFAULT 0.0 CHECK(home_selection_probability >= 0.0)
);

CREATE INDEX IF NOT EXISTS idx_race_categories_tier ON race_categories(tier);

CREATE TABLE IF NOT EXISTS rules (
  id                     INTEGER PRIMARY KEY,
  rule_key               TEXT    NOT NULL UNIQUE,
  applies_to             TEXT    NOT NULL CHECK(applies_to IN ('sprint_intermediate', 'climb_top', 'finish')),
  marker_type            TEXT    NOT NULL CHECK(marker_type IN ('sprint_intermediate', 'climb_top', 'finish_flat', 'finish_hill', 'finish_mountain')),
  marker_category        TEXT    CHECK(marker_category IS NULL OR marker_category IN ('HC', '1', '2', '3', '4', 'Sprint')),
  weight_flat            REAL    NOT NULL DEFAULT 0 CHECK(weight_flat >= 0),
  weight_mountain        REAL    NOT NULL DEFAULT 0 CHECK(weight_mountain >= 0),
  weight_medium_mountain REAL    NOT NULL DEFAULT 0 CHECK(weight_medium_mountain >= 0),
  weight_hill            REAL    NOT NULL DEFAULT 0 CHECK(weight_hill >= 0),
  weight_time_trial      REAL    NOT NULL DEFAULT 0 CHECK(weight_time_trial >= 0),
  weight_prologue        REAL    NOT NULL DEFAULT 0 CHECK(weight_prologue >= 0),
  weight_cobble          REAL    NOT NULL DEFAULT 0 CHECK(weight_cobble >= 0),
  weight_sprint          REAL    NOT NULL DEFAULT 0 CHECK(weight_sprint >= 0),
  weight_acceleration    REAL    NOT NULL DEFAULT 0 CHECK(weight_acceleration >= 0),
  weight_downhill        REAL    NOT NULL DEFAULT 0 CHECK(weight_downhill >= 0),
  weight_attack          REAL    NOT NULL DEFAULT 0 CHECK(weight_attack >= 0),
  weight_stamina         REAL    NOT NULL DEFAULT 0 CHECK(weight_stamina >= 0),
  weight_resistance      REAL    NOT NULL DEFAULT 0 CHECK(weight_resistance >= 0),
  weight_recuperation    REAL    NOT NULL DEFAULT 0 CHECK(weight_recuperation >= 0),
  weight_bike_handling   REAL    NOT NULL DEFAULT 0 CHECK(weight_bike_handling >= 0)
);

CREATE INDEX IF NOT EXISTS idx_rules_context ON rules(applies_to, marker_type, marker_category);

CREATE TABLE IF NOT EXISTS skill_weights (
  id                     INTEGER PRIMARY KEY,
  simulation_mode        TEXT    NOT NULL CHECK(simulation_mode IN ('road', 'itt', 'ttt')),
  terrain                TEXT    NOT NULL CHECK(terrain IN ('Flat', 'Hill', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'Cobble', 'Cobble_Hill', 'Abfahrt', 'Sprint')),
  weight_flat            REAL    NOT NULL DEFAULT 0 CHECK(weight_flat >= 0),
  weight_mountain        REAL    NOT NULL DEFAULT 0 CHECK(weight_mountain >= 0),
  weight_medium_mountain REAL    NOT NULL DEFAULT 0 CHECK(weight_medium_mountain >= 0),
  weight_hill            REAL    NOT NULL DEFAULT 0 CHECK(weight_hill >= 0),
  weight_time_trial      REAL    NOT NULL DEFAULT 0 CHECK(weight_time_trial >= 0),
  weight_prologue        REAL    NOT NULL DEFAULT 0 CHECK(weight_prologue >= 0),
  weight_cobble          REAL    NOT NULL DEFAULT 0 CHECK(weight_cobble >= 0),
  weight_sprint          REAL    NOT NULL DEFAULT 0 CHECK(weight_sprint >= 0),
  weight_acceleration    REAL    NOT NULL DEFAULT 0 CHECK(weight_acceleration >= 0),
  weight_downhill        REAL    NOT NULL DEFAULT 0 CHECK(weight_downhill >= 0),
  weight_attack          REAL    NOT NULL DEFAULT 0 CHECK(weight_attack >= 0),
  weight_stamina         REAL    NOT NULL DEFAULT 0 CHECK(weight_stamina >= 0),
  weight_resistance      REAL    NOT NULL DEFAULT 0 CHECK(weight_resistance >= 0),
  weight_recuperation    REAL    NOT NULL DEFAULT 0 CHECK(weight_recuperation >= 0),
  weight_bike_handling   REAL    NOT NULL DEFAULT 0 CHECK(weight_bike_handling >= 0),
  final_spread_late_multiplier REAL NOT NULL DEFAULT 1 CHECK(final_spread_late_multiplier > 0),
  final_spread_peak_multiplier REAL NOT NULL DEFAULT 1 CHECK(final_spread_peak_multiplier > 0),
  ttt_speed_multiplier   REAL    NOT NULL DEFAULT 1 CHECK(ttt_speed_multiplier > 0),
  UNIQUE(simulation_mode, terrain)
);

CREATE INDEX IF NOT EXISTS idx_skill_weights_context ON skill_weights(simulation_mode, terrain);

-- ---- Rennen -------------------------------------------------
CREATE TABLE IF NOT EXISTS races (
  id                          INTEGER PRIMARY KEY,
  name                        TEXT    NOT NULL,
  country_id                  INTEGER NOT NULL REFERENCES sta_country(id),
  category_id                 INTEGER NOT NULL REFERENCES race_categories(id),
  is_stage_race               INTEGER NOT NULL CHECK(is_stage_race IN (0, 1)),
  number_of_stages            INTEGER NOT NULL CHECK(number_of_stages > 0),
  start_date                  TEXT    NOT NULL,
  end_date                    TEXT    NOT NULL,
  prestige                    INTEGER NOT NULL CHECK(prestige BETWEEN 0 AND 100),
  preferred_nationality_group TEXT,
  required_specs              TEXT,
  CHECK(end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_races_start_date ON races(start_date);
CREATE INDEX IF NOT EXISTS idx_races_end_date ON races(end_date);
CREATE INDEX IF NOT EXISTS idx_races_category ON races(category_id);
CREATE INDEX IF NOT EXISTS idx_races_country ON races(country_id);

CREATE TABLE IF NOT EXISTS race_programs (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS race_program_races (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id  INTEGER NOT NULL REFERENCES race_programs(id) ON DELETE CASCADE,
  race_id     INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  allowed_program_group_ids TEXT,
  UNIQUE(program_id, race_id)
);

CREATE INDEX IF NOT EXISTS idx_race_program_races_race
  ON race_program_races(race_id, program_id);

CREATE TABLE IF NOT EXISTS race_program_probability_rules (
  id          INTEGER PRIMARY KEY,
  role_name   TEXT NOT NULL,
  spec_1      INTEGER REFERENCES type_rider(id),
  spec_2      INTEGER REFERENCES type_rider(id),
  spec_3      INTEGER REFERENCES type_rider(id),
  program_id  INTEGER NOT NULL REFERENCES race_programs(id) ON DELETE CASCADE,
  probability REAL NOT NULL CHECK(probability >= 0)
);

CREATE INDEX IF NOT EXISTS idx_race_program_probability_rules_lookup
  ON race_program_probability_rules(role_name, spec_1, spec_2, spec_3);

CREATE TABLE IF NOT EXISTS rider_season_programs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  season       INTEGER NOT NULL,
  rider_id     INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  program_id   INTEGER NOT NULL REFERENCES race_programs(id),
  assigned_on  TEXT    NOT NULL,
  UNIQUE(season, rider_id)
);

CREATE INDEX IF NOT EXISTS idx_rider_season_programs_program
  ON rider_season_programs(season, program_id);

-- ---- Wetter --------------------------------------------------
CREATE TABLE IF NOT EXISTS wetter (
  id INTEGER PRIMARY KEY,
  wetter_name TEXT NOT NULL UNIQUE,
  effekt_sturz_min REAL NOT NULL DEFAULT 0.0,
  effekt_sturz_max REAL NOT NULL DEFAULT 0.0,
  effekt_defekt_min REAL NOT NULL DEFAULT 0.0,
  effekt_defekt_max REAL NOT NULL DEFAULT 0.0,
  windkanten_gefahr_min REAL NOT NULL DEFAULT 0.0,
  windkanten_gefahr_max REAL NOT NULL DEFAULT 0.0,
  effekt_fatigue_min REAL NOT NULL DEFAULT 0.0,
  effekt_fatigue_max REAL NOT NULL DEFAULT 0.0,
  breakaway_bonus_min REAL NOT NULL DEFAULT 0.0,
  breakaway_bonus_max REAL NOT NULL DEFAULT 0.0
);

-- ---- Etappen -----------------------------------------------
CREATE TABLE IF NOT EXISTS stages (
  id                INTEGER PRIMARY KEY,
  race_id           INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  stage_number      INTEGER NOT NULL CHECK(stage_number > 0),
  date              TEXT    NOT NULL,
  profile           TEXT    NOT NULL CHECK(profile IN ('Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'ITT', 'TTT', 'Cobble', 'Cobble_Hill')),
  start_elevation   REAL    NOT NULL,
  details_csv_file  TEXT    NOT NULL CHECK(length(details_csv_file) > 0 AND instr(details_csv_file, '/') = 0 AND instr(details_csv_file, '\\') = 0),
  final_spread_start_percent REAL NOT NULL DEFAULT 70 CHECK(final_spread_start_percent BETWEEN 0 AND 100),
  final_push_start_percent REAL NOT NULL DEFAULT 90 CHECK(final_push_start_percent BETWEEN 0 AND 100),
  final_spread_difficulty_multiplier REAL NOT NULL DEFAULT 1 CHECK(final_spread_difficulty_multiplier > 0),
  crash_incident_multiplier REAL NOT NULL DEFAULT 1 CHECK(crash_incident_multiplier > 0),
  mechanical_incident_multiplier REAL NOT NULL DEFAULT 1 CHECK(mechanical_incident_multiplier > 0),
  stage_score      INTEGER NOT NULL DEFAULT 0 CHECK(stage_score BETWEEN 0 AND 1000),
  allowed_weather TEXT NOT NULL DEFAULT '1|2|3|4|5|6|7',
  rolled_weather_id INTEGER REFERENCES wetter(id),
  super_team_id INTEGER REFERENCES teams(id),
  UNIQUE(race_id, stage_number)
);


CREATE INDEX IF NOT EXISTS idx_stages_race ON stages(race_id);
CREATE INDEX IF NOT EXISTS idx_stages_date ON stages(date);

CREATE TABLE IF NOT EXISTS stage_climb_scores (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  stage_id    INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  climb_index INTEGER NOT NULL CHECK(climb_index > 0),
  name        TEXT    NOT NULL,
  category    TEXT    CHECK(category IS NULL OR category IN ('HC', '1', '2', '3', '4')),
  start_km    REAL    NOT NULL,
  end_km      REAL    NOT NULL,
  climb_score INTEGER NOT NULL CHECK(climb_score >= 0),
  UNIQUE(stage_id, climb_index)
);

CREATE INDEX IF NOT EXISTS idx_stage_climb_scores_stage
  ON stage_climb_scores(stage_id);

-- ---- Rennteilnehmer -----------------------------------------
CREATE TABLE IF NOT EXISTS active_race_entries (
  race_id  INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  team_id  INTEGER NOT NULL REFERENCES teams(id),
  rider_id INTEGER NOT NULL REFERENCES riders(id),
  PRIMARY KEY (race_id, rider_id)
);

CREATE INDEX IF NOT EXISTS idx_active_race_entries_rider_race
  ON active_race_entries(rider_id, race_id);

CREATE TABLE IF NOT EXISTS race_entries_compact (
  race_id  INTEGER PRIMARY KEY REFERENCES races(id) ON DELETE CASCADE,
  season   INTEGER NOT NULL,
  payload  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_race_entries_compact_season
  ON race_entries_compact(season);

CREATE VIEW IF NOT EXISTS race_entries AS
SELECT * FROM active_race_entries
UNION ALL
SELECT
  c.race_id AS race_id,
  CAST(j.value->>0 AS INTEGER) AS team_id,
  CAST(j.value->>1 AS INTEGER) AS rider_id
FROM race_entries_compact c,
json_each(c.payload) j;

CREATE TABLE IF NOT EXISTS stage_entries (
  stage_id       INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  race_id        INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  team_id        INTEGER NOT NULL REFERENCES teams(id),
  rider_id       INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  status         TEXT    NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'started', 'finished', 'dns', 'dnf')),
  status_reason  TEXT,
  PRIMARY KEY (stage_id, rider_id)
);

CREATE INDEX IF NOT EXISTS idx_stage_entries_race_stage_status
  ON stage_entries(race_id, stage_id, status);

CREATE INDEX IF NOT EXISTS idx_stage_entries_rider_status
  ON stage_entries(rider_id, status);

-- ---- Ergebnisarten ------------------------------------------
CREATE TABLE IF NOT EXISTS result_types (
  id    INTEGER PRIMARY KEY,
  name  TEXT    NOT NULL UNIQUE
);

-- ---- Ergebnisse / Wertungen ---------------------------------
CREATE TABLE IF NOT EXISTS results (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id          INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  stage_id         INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  rider_id         INTEGER REFERENCES riders(id) ON DELETE CASCADE,
  team_id          INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  result_type_id   INTEGER NOT NULL REFERENCES result_types(id),
  rank             INTEGER NOT NULL CHECK(rank > 0),
  time_seconds     INTEGER,
  points           INTEGER,
  is_breakaway     INTEGER NOT NULL DEFAULT 0 CHECK(is_breakaway IN (0, 1)),
  leadout_rider_id INTEGER REFERENCES riders(id) ON DELETE SET NULL,
  leadout_bonus    REAL,
  CHECK(
    (result_type_id = 1 AND team_id IS NOT NULL)
    OR
    (result_type_id = 6 AND rider_id IS NULL AND team_id IS NOT NULL)
    OR
    (result_type_id NOT IN (1, 6) AND rider_id IS NOT NULL AND team_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_results_stage_rider_type
  ON results(stage_id, rider_id, result_type_id)
  WHERE rider_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS stage_marker_results (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id               INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  stage_id              INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  marker_key            TEXT    NOT NULL,
  marker_label          TEXT    NOT NULL,
  marker_type           TEXT    NOT NULL,
  marker_category       TEXT,
  km_mark               REAL    NOT NULL,
  rider_id              INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  team_id               INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  rank                  INTEGER NOT NULL CHECK(rank > 0),
  crossing_time_seconds REAL    NOT NULL CHECK(crossing_time_seconds >= 0),
  gap_seconds           REAL    NOT NULL CHECK(gap_seconds >= 0),
  points_awarded        INTEGER NOT NULL DEFAULT 0 CHECK(points_awarded >= 0),
  photo_finish_score    REAL    NOT NULL,
  UNIQUE(stage_id, marker_key, rider_id)
);

CREATE INDEX IF NOT EXISTS idx_stage_marker_results_stage_key
  ON stage_marker_results(stage_id, marker_key, rank);



-- ---- Newgen: Startwert-Presets (Skills) --------------------
-- Definiert pro Profil-Typ (Sprint, Berg, â€¦) und Sub-Variante
-- (z. B. â€žReiner Sprinter", â€žPflaster-Sprinter") die Min/Max-
-- Bereiche, aus denen die Startskills neuer Fahrer gewÃ¼rfelt
-- werden. `weight` steuert die Wahrscheinlichkeit der Variante.
CREATE TABLE IF NOT EXISTS newgen_start_presets (
  preset_id              INTEGER PRIMARY KEY,
  type_key               TEXT    NOT NULL,
  display_name           TEXT    NOT NULL,
  weight                 INTEGER NOT NULL CHECK(weight > 0),
  min_flat               REAL    NOT NULL CHECK(min_flat BETWEEN 0 AND 85),
  max_flat               REAL    NOT NULL CHECK(max_flat BETWEEN min_flat AND 85),
  min_mountain           REAL    NOT NULL CHECK(min_mountain BETWEEN 0 AND 85),
  max_mountain           REAL    NOT NULL CHECK(max_mountain BETWEEN min_mountain AND 85),
  min_medium_mountain    REAL    NOT NULL CHECK(min_medium_mountain BETWEEN 0 AND 85),
  max_medium_mountain    REAL    NOT NULL CHECK(max_medium_mountain BETWEEN min_medium_mountain AND 85),
  min_hill               REAL    NOT NULL CHECK(min_hill BETWEEN 0 AND 85),
  max_hill               REAL    NOT NULL CHECK(max_hill BETWEEN min_hill AND 85),
  min_time_trial         REAL    NOT NULL CHECK(min_time_trial BETWEEN 0 AND 85),
  max_time_trial         REAL    NOT NULL CHECK(max_time_trial BETWEEN min_time_trial AND 85),
  min_prologue           REAL    NOT NULL CHECK(min_prologue BETWEEN 0 AND 85),
  max_prologue           REAL    NOT NULL CHECK(max_prologue BETWEEN min_prologue AND 85),
  min_cobble             REAL    NOT NULL CHECK(min_cobble BETWEEN 0 AND 85),
  max_cobble             REAL    NOT NULL CHECK(max_cobble BETWEEN min_cobble AND 85),
  min_sprint             REAL    NOT NULL CHECK(min_sprint BETWEEN 0 AND 85),
  max_sprint             REAL    NOT NULL CHECK(max_sprint BETWEEN min_sprint AND 85),
  min_acceleration       REAL    NOT NULL CHECK(min_acceleration BETWEEN 0 AND 85),
  max_acceleration       REAL    NOT NULL CHECK(max_acceleration BETWEEN min_acceleration AND 85),
  min_downhill           REAL    NOT NULL CHECK(min_downhill BETWEEN 0 AND 85),
  max_downhill           REAL    NOT NULL CHECK(max_downhill BETWEEN min_downhill AND 85),
  min_attack             REAL    NOT NULL CHECK(min_attack BETWEEN 0 AND 85),
  max_attack             REAL    NOT NULL CHECK(max_attack BETWEEN min_attack AND 85),
  min_stamina            REAL    NOT NULL CHECK(min_stamina BETWEEN 0 AND 85),
  max_stamina            REAL    NOT NULL CHECK(max_stamina BETWEEN min_stamina AND 85),
  min_resistance         REAL    NOT NULL CHECK(min_resistance BETWEEN 0 AND 85),
  max_resistance         REAL    NOT NULL CHECK(max_resistance BETWEEN min_resistance AND 85),
  min_recuperation       REAL    NOT NULL CHECK(min_recuperation BETWEEN 0 AND 85),
  max_recuperation       REAL    NOT NULL CHECK(max_recuperation BETWEEN min_recuperation AND 85),
  min_bike_handling      REAL    NOT NULL CHECK(min_bike_handling BETWEEN 0 AND 85),
  max_bike_handling      REAL    NOT NULL CHECK(max_bike_handling BETWEEN min_bike_handling AND 85)
);

CREATE INDEX IF NOT EXISTS idx_newgen_start_presets_type
  ON newgen_start_presets(type_key);

-- ---- Newgen: Potential-Presets ----------------------------
-- Analog zu den Startwert-Presets, aber fÃ¼r die Potentiale.
-- Die Potentiale bilden den Wachstumsspielraum bis zum
-- peak_age.
CREATE TABLE IF NOT EXISTS newgen_potential_presets (
  preset_id              INTEGER PRIMARY KEY,
  display_name           TEXT    NOT NULL,
  weight                 INTEGER NOT NULL CHECK(weight > 0),
  min_pot_flat               REAL    NOT NULL CHECK(min_pot_flat BETWEEN 0 AND 85),
  max_pot_flat               REAL    NOT NULL CHECK(max_pot_flat BETWEEN min_pot_flat AND 85),
  min_pot_mountain           REAL    NOT NULL CHECK(min_pot_mountain BETWEEN 0 AND 85),
  max_pot_mountain           REAL    NOT NULL CHECK(max_pot_mountain BETWEEN min_pot_mountain AND 85),
  min_pot_medium_mountain    REAL    NOT NULL CHECK(min_pot_medium_mountain BETWEEN 0 AND 85),
  max_pot_medium_mountain    REAL    NOT NULL CHECK(max_pot_medium_mountain BETWEEN min_pot_medium_mountain AND 85),
  min_pot_hill               REAL    NOT NULL CHECK(min_pot_hill BETWEEN 0 AND 85),
  max_pot_hill               REAL    NOT NULL CHECK(max_pot_hill BETWEEN min_pot_hill AND 85),
  min_pot_time_trial         REAL    NOT NULL CHECK(min_pot_time_trial BETWEEN 0 AND 85),
  max_pot_time_trial         REAL    NOT NULL CHECK(max_pot_time_trial BETWEEN min_pot_time_trial AND 85),
  min_pot_prologue           REAL    NOT NULL CHECK(min_pot_prologue BETWEEN 0 AND 85),
  max_pot_prologue           REAL    NOT NULL CHECK(max_pot_prologue BETWEEN min_pot_prologue AND 85),
  min_pot_cobble             REAL    NOT NULL CHECK(min_pot_cobble BETWEEN 0 AND 85),
  max_pot_cobble             REAL    NOT NULL CHECK(max_pot_cobble BETWEEN min_pot_cobble AND 85),
  min_pot_sprint             REAL    NOT NULL CHECK(min_pot_sprint BETWEEN 0 AND 85),
  max_pot_sprint             REAL    NOT NULL CHECK(max_pot_sprint BETWEEN min_pot_sprint AND 85),
  min_pot_acceleration       REAL    NOT NULL CHECK(min_pot_acceleration BETWEEN 0 AND 85),
  max_pot_acceleration       REAL    NOT NULL CHECK(max_pot_acceleration BETWEEN min_pot_acceleration AND 85),
  min_pot_downhill           REAL    NOT NULL CHECK(min_pot_downhill BETWEEN 0 AND 85),
  max_pot_downhill           REAL    NOT NULL CHECK(max_pot_downhill BETWEEN min_pot_downhill AND 85),
  min_pot_attack             REAL    NOT NULL CHECK(min_pot_attack BETWEEN 0 AND 85),
  max_pot_attack             REAL    NOT NULL CHECK(max_pot_attack BETWEEN min_pot_attack AND 85),
  min_pot_stamina            REAL    NOT NULL CHECK(min_pot_stamina BETWEEN 0 AND 85),
  max_pot_stamina            REAL    NOT NULL CHECK(max_pot_stamina BETWEEN min_pot_stamina AND 85),
  min_pot_resistance         REAL    NOT NULL CHECK(min_pot_resistance BETWEEN 0 AND 85),
  max_pot_resistance         REAL    NOT NULL CHECK(max_pot_resistance BETWEEN min_pot_resistance AND 85),
  min_pot_recuperation       REAL    NOT NULL CHECK(min_pot_recuperation BETWEEN 0 AND 85),
  max_pot_recuperation       REAL    NOT NULL CHECK(max_pot_recuperation BETWEEN min_pot_recuperation AND 85),
  min_pot_bike_handling      REAL    NOT NULL CHECK(min_pot_bike_handling BETWEEN 0 AND 85),
  max_pot_bike_handling      REAL    NOT NULL CHECK(max_pot_bike_handling BETWEEN min_pot_bike_handling AND 85)
);

-- ---- Newgen: Namens-Pool ----------------------------------
-- Pro Land (country_id) und Name-Typ (`first` / `last`) eine
-- Liste gewichteter Vornamen bzw. Nachnamen, aus denen bei der
-- Neugenerierung von Fahrern gezogen wird.
CREATE TABLE IF NOT EXISTS rider_names (
  country_id INTEGER NOT NULL REFERENCES sta_country(id) ON DELETE CASCADE,
  type       TEXT    NOT NULL CHECK(type IN ('first', 'last')),
  value      TEXT    NOT NULL,
  weight     INTEGER NOT NULL CHECK(weight > 0),
  PRIMARY KEY (country_id, type, value)
);

CREATE INDEX IF NOT EXISTS idx_rider_names_lookup
  ON rider_names(country_id, type, weight DESC);

-- ---- Taeglicher Fahrerzustand -------------------------------
CREATE TABLE IF NOT EXISTS rider_daily_state (
  rider_id                INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
  season                  INTEGER NOT NULL,
  form_bonus              REAL NOT NULL DEFAULT 0.0,
  race_form_bonus         REAL NOT NULL DEFAULT 0.0,
  peak_s_form             REAL NOT NULL DEFAULT 0.0,
  peak_r_form             REAL NOT NULL DEFAULT 0.0,
  active_peak_date        TEXT,
  peak_dates_json         TEXT NOT NULL DEFAULT '[]',
  health_status           TEXT NOT NULL DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'ill', 'injured')),
  unavailable_until       TEXT,
  unavailable_days_remaining INTEGER NOT NULL DEFAULT 0 CHECK(unavailable_days_remaining >= 0),
  season_points           INTEGER NOT NULL DEFAULT 0,
  season_wins             INTEGER NOT NULL DEFAULT 0,
  season_race_days_total  INTEGER NOT NULL DEFAULT 0 CHECK(season_race_days_total >= 0),
  rolling_30d_race_days   INTEGER NOT NULL DEFAULT 0 CHECK(rolling_30d_race_days >= 0),
  short_term_fatigue      REAL NOT NULL DEFAULT 0.0,
  long_term_fatigue_decayable REAL NOT NULL DEFAULT 0.0,
  long_term_fatigue_locked REAL NOT NULL DEFAULT 0.0,
  consecutive_non_race_days INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_rider_daily_state_season ON rider_daily_state(season);
CREATE INDEX IF NOT EXISTS idx_rider_daily_state_health ON rider_daily_state(health_status, unavailable_days_remaining);

CREATE TABLE IF NOT EXISTS rider_r_form_events (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  rider_id         INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  source_date      TEXT    NOT NULL,
  expires_on       TEXT    NOT NULL,
  amount           REAL    NOT NULL CHECK(amount >= 0),
  event_type       TEXT    NOT NULL CHECK(event_type IN ('race_day'))
);

CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_rider_date
  ON rider_r_form_events(rider_id, source_date, expires_on);

CREATE INDEX IF NOT EXISTS idx_rider_r_form_events_expires_on
  ON rider_r_form_events(expires_on);

CREATE TABLE IF NOT EXISTS rider_form_history (
  rider_id         INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  date             TEXT    NOT NULL,
  s_form           REAL    NOT NULL,
  r_form           REAL    NOT NULL,
  total_form       REAL    NOT NULL,
  PRIMARY KEY (rider_id, date)
);

CREATE INDEX IF NOT EXISTS idx_rider_form_history_date
  ON rider_form_history(date, rider_id);

CREATE TABLE IF NOT EXISTS rider_r_form_daily_awards (
  rider_id         INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  award_date       TEXT    NOT NULL,
  award_type       TEXT    NOT NULL CHECK(award_type IN ('build', 'free')),
  PRIMARY KEY (rider_id, award_date)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_results_stage_team_type
  ON results(stage_id, team_id, result_type_id)
  WHERE rider_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_results_stage_type_rank
  ON results(stage_id, result_type_id, rank);

-- Optimiert Queries, die nach rider_id (ggf. + result_type_id) filtern
-- (z. B. Karrierestatistik, Saison-Klassements, Fahrer-Historie).
-- Linke-Spalte als Praefix, daher greift er auch bei reinen
-- `WHERE rider_id = ?` Queries.
CREATE INDEX IF NOT EXISTS idx_results_rider_type
  ON results(rider_id, result_type_id)
  WHERE rider_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS rider_stage_race_state (
  race_id                         INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  rider_id                        INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  accumulated_random_fatigue      REAL NOT NULL DEFAULT 0,
  last_applied_stage_number       INTEGER NOT NULL DEFAULT 0,
  incident_day_form_penalty       REAL NOT NULL DEFAULT 0,
  incident_micro_form_penalty     REAL NOT NULL DEFAULT 0,
  incident_stamina_penalty        REAL NOT NULL DEFAULT 0,
  incident_day_form_cap           REAL,
  race_recuperation_penalty       REAL NOT NULL DEFAULT 0,
  current_recovery_penalty        REAL NOT NULL DEFAULT 0,
  pending_recovery_penalty_1      REAL NOT NULL DEFAULT 0,
  pending_recovery_penalty_2      REAL NOT NULL DEFAULT 0,
  pending_recovery_penalty_3      REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (race_id, rider_id)
);

CREATE INDEX IF NOT EXISTS idx_rider_stage_race_state_race
  ON rider_stage_race_state(race_id, rider_id);

CREATE INDEX IF NOT EXISTS idx_results_race_type
  ON results(race_id, result_type_id);

-- ---- Saisonpunkte ------------------------------------------
CREATE TABLE IF NOT EXISTS season_point_events (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  season           INTEGER NOT NULL,
  race_id          INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  stage_id         INTEGER NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  rider_id         INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  team_id          INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  award_type       TEXT    NOT NULL CHECK(award_type IN (
    'stage_result',
    'one_day_result',
    'gc_leader_day',
    'points_leader_day',
    'mountain_leader_day',
    'youth_leader_day',
    'gc_final',
    'points_final',
    'mountain_final',
    'youth_final'
  )),
  rank             INTEGER NOT NULL CHECK(rank > 0),
  points_awarded   INTEGER NOT NULL CHECK(points_awarded >= 0),
  awarded_on       TEXT    NOT NULL,
  UNIQUE(stage_id, rider_id, award_type)
);

CREATE INDEX IF NOT EXISTS idx_season_point_events_season_rider
  ON season_point_events(season, rider_id);

CREATE INDEX IF NOT EXISTS idx_season_point_events_season_team
  ON season_point_events(season, team_id);

CREATE INDEX IF NOT EXISTS idx_season_point_events_season_stage
  ON season_point_events(season, stage_id);

-- ---- Saisonstatistiken (aggregiert am Saisonende) -----------
CREATE TABLE IF NOT EXISTS season_stats (
  rider_id      INTEGER NOT NULL REFERENCES riders(id),
  season        INTEGER NOT NULL,
  races_ridden  INTEGER NOT NULL DEFAULT 0,
  wins          INTEGER NOT NULL DEFAULT 0,
  top3          INTEGER NOT NULL DEFAULT 0,
  top10         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (rider_id, season)
);

CREATE TABLE IF NOT EXISTS draft_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  season INTEGER NOT NULL,
  draft_round INTEGER NOT NULL,
  pick_number INTEGER NOT NULL,
  team_id INTEGER NOT NULL REFERENCES teams(id),
  rider_id INTEGER NOT NULL REFERENCES riders(id),
  old_team_id INTEGER REFERENCES teams(id),
  contract_length INTEGER NOT NULL,
  overall_at_draft REAL NOT NULL,
  pot_overall_at_draft REAL NOT NULL,
  draft_value REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS team_preferences (
  id_pref INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  country_id INTEGER NOT NULL REFERENCES sta_country(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL,
  UNIQUE(team_id, country_id)
);

-- ---- Stage Entries History / View --------------------------
CREATE TABLE IF NOT EXISTS stage_entries_compact (
  race_id  INTEGER PRIMARY KEY REFERENCES races(id) ON DELETE CASCADE,
  season   INTEGER NOT NULL,
  payload  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stage_entries_compact_season
  ON stage_entries_compact(season);

CREATE VIEW IF NOT EXISTS stage_entries_history AS
SELECT
  CAST(j.value->>'sid' AS INTEGER) AS stage_id,
  c.race_id AS race_id,
  CAST(j.value->>'tid' AS INTEGER) AS team_id,
  CAST(j.value->>'rid' AS INTEGER) AS rider_id,
  j.value->>'st' AS status,
  j.value->>'str' AS status_reason
FROM stage_entries_compact c,
json_each(c.payload) j;

CREATE VIEW IF NOT EXISTS all_stage_entries AS
SELECT * FROM stage_entries
UNION ALL
SELECT * FROM stage_entries_history;

-- ---- Archivierte Rennergebnisse ----------------------------
CREATE TABLE IF NOT EXISTS race_results_compact (
  race_id  INTEGER PRIMARY KEY REFERENCES races(id) ON DELETE CASCADE,
  season   INTEGER NOT NULL,
  payload  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_race_results_compact_season
  ON race_results_compact(season);

