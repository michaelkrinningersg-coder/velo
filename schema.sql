PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS divisions (
    division_id INTEGER PRIMARY KEY,
    division_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL UNIQUE,
    abbreviation TEXT NOT NULL UNIQUE,
    budget INTEGER NOT NULL DEFAULT 0 CHECK (budget >= 0),
    main_sponsor1_id INTEGER,
    main_sponsor2_id INTEGER,
    prestige INTEGER NOT NULL DEFAULT 50 CHECK (prestige >= 0),
    division_id INTEGER NOT NULL DEFAULT 1 REFERENCES divisions(division_id),
    uci_points INTEGER NOT NULL DEFAULT 0 CHECK (uci_points >= 0),
    jersey_asset_id INTEGER
);