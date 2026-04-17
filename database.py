from pathlib import Path
import sqlite3


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "velo.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"
DIVISIONS_CSV_PATH = BASE_DIR / "data" / "divisions.csv"


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def _migrate_legacy_division_column() -> None:
    """Migriert alte TEXT division Spalte zu division_id."""
    try:
        with get_connection() as connection:
            cursor = connection.execute(
                "PRAGMA table_info(teams)"
            )
            columns = {row[1] for row in cursor.fetchall()}
            
            if "division" not in columns or "division_id" in columns:
                return
            
            division_map = {
                "Fantasy": 1,
                "1": 1,
                "Development": 2,
                "2": 2,
            }
            
            connection.execute(
                "ALTER TABLE teams ADD COLUMN division_id_temp INTEGER NOT NULL DEFAULT 1"
            )
            
            rows = connection.execute(
                "SELECT team_id, division FROM teams"
            ).fetchall()
            
            for row in rows:
                team_id, division_val = row
                mapped_id = division_map.get((division_val or "").strip(), 1)
                connection.execute(
                    "UPDATE teams SET division_id_temp = ? WHERE team_id = ?",
                    (mapped_id, team_id)
                )
            
            connection.execute("ALTER TABLE teams DROP COLUMN division")
            connection.execute(
                "ALTER TABLE teams RENAME COLUMN division_id_temp TO division_id"
            )
            
            connection.commit()
    except Exception:
        pass


def _seed_divisions() -> None:
    """Seeded divisions Tabelle aus CSV wenn leer."""
    divisions_csv = DIVISIONS_CSV_PATH
    if not divisions_csv.exists():
        return
    
    with get_connection() as connection:
        cursor = connection.execute("SELECT COUNT(*) FROM divisions")
        if cursor.fetchone()[0] > 0:
            return
        
        import csv
        with divisions_csv.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                connection.execute(
                    "INSERT OR IGNORE INTO divisions (division_id, division_name) VALUES (?, ?)",
                    (
                        int(row["Division_Id"]),
                        row["Division_name"].strip(),
                    )
                )
        connection.commit()


def initialize_database() -> None:
    """Initialisiert DB: Schema, Migration, Seed-Daten."""
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    with get_connection() as connection:
        connection.executescript(schema_sql)
    
    _migrate_legacy_division_column()
    _seed_divisions()