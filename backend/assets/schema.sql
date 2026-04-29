-- ============================================================
--  VELO – Master-Datenbankschema (world_data.db)
--  Wird bei Spielstart als schreibgeschützte Vorlage genutzt.
--  Beim Erstellen einer neuen Karriere wird diese Datei in den
--  savegames-Ordner kopiert und dort weiterentwickelt.
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ---- Karriere-Metadaten (nur in Savegame-Kopien befüllt) ----
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

-- ---- Laender-Stammdaten -------------------------------------
CREATE TABLE IF NOT EXISTS sta_country (
  id                 INTEGER PRIMARY KEY,
  name               TEXT    NOT NULL,
  code_3             TEXT    NOT NULL UNIQUE CHECK(length(code_3) = 3),
  continent          TEXT    NOT NULL,
  regen_rating       INTEGER NOT NULL CHECK(regen_rating BETWEEN 1 AND 100),
  number_regen_min   INTEGER NOT NULL CHECK(number_regen_min >= 0),
  number_regen_max   INTEGER NOT NULL CHECK(number_regen_max >= number_regen_min)
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
  is_retired        INTEGER NOT NULL DEFAULT 0 CHECK(is_retired IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_riders_active_team ON riders(active_team_id);
CREATE INDEX IF NOT EXISTS idx_riders_type ON riders(rider_type_id);

-- ---- Verträge -----------------------------------------------
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
  id                INTEGER PRIMARY KEY,
  name              TEXT    NOT NULL UNIQUE,
  tier              INTEGER NOT NULL CHECK(tier IN (1, 2, 3)),
  number_of_teams   INTEGER NOT NULL CHECK(number_of_teams > 0),
  number_of_riders  INTEGER NOT NULL CHECK(number_of_riders > 0),
  bonus_system_id   INTEGER NOT NULL REFERENCES race_categories_bonus(id)
);

CREATE INDEX IF NOT EXISTS idx_race_categories_tier ON race_categories(tier);

-- ---- Rennen -------------------------------------------------
CREATE TABLE IF NOT EXISTS races (
  id                INTEGER PRIMARY KEY,
  name              TEXT    NOT NULL,
  country_id        INTEGER NOT NULL REFERENCES sta_country(id),
  category_id       INTEGER NOT NULL REFERENCES race_categories(id),
  is_stage_race     INTEGER NOT NULL CHECK(is_stage_race IN (0, 1)),
  number_of_stages  INTEGER NOT NULL CHECK(number_of_stages > 0),
  start_date        TEXT    NOT NULL,
  end_date          TEXT    NOT NULL,
  prestige          INTEGER NOT NULL CHECK(prestige BETWEEN 0 AND 100),
  CHECK(end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_races_start_date ON races(start_date);
CREATE INDEX IF NOT EXISTS idx_races_end_date ON races(end_date);
CREATE INDEX IF NOT EXISTS idx_races_category ON races(category_id);
CREATE INDEX IF NOT EXISTS idx_races_country ON races(country_id);

-- ---- Etappen -----------------------------------------------
CREATE TABLE IF NOT EXISTS stages (
  id                INTEGER PRIMARY KEY,
  race_id           INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  stage_number      INTEGER NOT NULL CHECK(stage_number > 0),
  date              TEXT    NOT NULL,
  profile           TEXT    NOT NULL CHECK(profile IN ('Flat', 'Rolling', 'Hilly', 'Hilly_Difficult', 'Medium_Mountain', 'Mountain', 'High_Mountain', 'ITT', 'TTT', 'Cobble', 'Cobble_Hill')),
  details_csv_file  TEXT    NOT NULL CHECK(length(details_csv_file) > 0 AND instr(details_csv_file, '/') = 0 AND instr(details_csv_file, '\\') = 0),
  UNIQUE(race_id, stage_number)
);

CREATE INDEX IF NOT EXISTS idx_stages_race ON stages(race_id);
CREATE INDEX IF NOT EXISTS idx_stages_date ON stages(date);

-- ---- Rennteilnehmer -----------------------------------------
CREATE TABLE IF NOT EXISTS race_entries (
  race_id  INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  team_id  INTEGER NOT NULL REFERENCES teams(id),
  rider_id INTEGER NOT NULL REFERENCES riders(id),
  PRIMARY KEY (race_id, rider_id)
);

-- ---- Rennergebnisse (Zeitfahren & allgemein) ----------------
CREATE TABLE IF NOT EXISTS race_results (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id          INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
  rider_id         INTEGER NOT NULL REFERENCES riders(id),
  finish_position  INTEGER NOT NULL,
  finish_time_sec  REAL    NOT NULL,
  gap_sec          REAL    NOT NULL DEFAULT 0.0,
  day_form_factor  REAL    NOT NULL DEFAULT 1.0,
  UNIQUE(race_id, rider_id)
);

CREATE INDEX IF NOT EXISTS idx_results_race ON race_results(race_id);

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
