from dataclasses import dataclass
from pathlib import Path
import csv

from database import BASE_DIR, get_connection


TEAM_SEED_PATH = BASE_DIR / "data" / "teams.csv"


@dataclass(slots=True)
class Team:
    team_id: int
    team_name: str
    abbreviation: str
    budget: int
    main_sponsor1_id: int | None
    main_sponsor2_id: int | None
    prestige: int
    division_id: int
    division_name: str
    uci_points: int
    jersey_asset_id: int | None


def _parse_optional_int(value: str | None) -> int | None:
    if value is None:
        return None
    normalized = value.strip()
    if not normalized:
        return None
    return int(normalized)


def _parse_required_int(value: str | None, default: int) -> int:
    if value is None:
        return default
    normalized = value.strip()
    if not normalized:
        return default
    return int(normalized)


def sync_teams_from_csv(csv_path: Path = TEAM_SEED_PATH) -> int:
    """Synchronisiert Teams aus CSV mit Upsert (nicht nur Seed)."""
    if not csv_path.exists():
        return 0

    with get_connection() as connection:
        upserted_count = 0
        with csv_path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                connection.execute(
                    """
                    INSERT OR REPLACE INTO teams (
                        team_id,
                        team_name,
                        abbreviation,
                        budget,
                        main_sponsor1_id,
                        main_sponsor2_id,
                        prestige,
                        division_id,
                        uci_points,
                        jersey_asset_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        _parse_optional_int(row.get("team_id")),
                        row["team_name"].strip(),
                        row["abbreviation"].strip(),
                        _parse_required_int(row.get("budget"), 0),
                        _parse_optional_int(row.get("main_sponsor1_id")),
                        _parse_optional_int(row.get("main_sponsor2_id")),
                        _parse_required_int(row.get("prestige"), 50),
                        _parse_required_int(row.get("division_id"), 1),
                        _parse_required_int(row.get("uci_points"), 0),
                        _parse_optional_int(row.get("jersey_asset_id")),
                    )
                )
                upserted_count += 1
        
        connection.commit()
        return upserted_count


def get_teams() -> list[Team]:
    """Liest Teams mit Division-Namen aus DB."""
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                t.team_id,
                t.team_name,
                t.abbreviation,
                t.budget,
                t.main_sponsor1_id,
                t.main_sponsor2_id,
                t.prestige,
                t.division_id,
                d.division_name,
                t.uci_points,
                t.jersey_asset_id
            FROM teams t
            LEFT JOIN divisions d ON t.division_id = d.division_id
            ORDER BY t.prestige DESC, t.uci_points DESC, t.team_name ASC
            """
        ).fetchall()

    return [
        Team(
            team_id=row["team_id"],
            team_name=row["team_name"],
            abbreviation=row["abbreviation"],
            budget=row["budget"],
            main_sponsor1_id=row["main_sponsor1_id"],
            main_sponsor2_id=row["main_sponsor2_id"],
            prestige=row["prestige"],
            division_id=row["division_id"],
            division_name=row["division_name"] or "Unknown",
            uci_points=row["uci_points"],
            jersey_asset_id=row["jersey_asset_id"],
        )
        for row in rows
    ]