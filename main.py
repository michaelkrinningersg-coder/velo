import flet as ft
import os

from database import DATABASE_PATH, initialize_database
from team_repository import Team, get_teams, sync_teams_from_csv


MENU_ITEMS = [
    ("calendar", "Kalender"),
    ("teams", "Teams"),
    ("drivers", "Fahrer"),
]


def build_placeholder_view(menu_label: str) -> ft.Control:
    return ft.Column(
        spacing=12,
        controls=[
            ft.Text(menu_label, size=30, weight=ft.FontWeight.W_700, color="#F5F7FA"),
            ft.Container(
                padding=ft.Padding(16, 16, 16, 16),
                bgcolor="#111922",
                border=ft.border.all(1, "#243447"),
                content=ft.Text(
                    "Dieser Bereich ist als Platzhalter angelegt. Weitere Funktionen folgen spaeter.",
                    size=14,
                    color="#D8E1EA",
                ),
            ),
        ],
    )


def build_teams_view(teams: list[Team], error_message: str | None = None) -> ft.Control:
    summary_text = (
        f"{len(teams)} Teams in {DATABASE_PATH.name}" if not error_message else error_message
    )
    table = ft.DataTable(
        bgcolor="#111922",
        border=ft.border.all(1, "#243447"),
        heading_row_color="#182330",
        horizontal_lines=ft.border.BorderSide(1, "#243447"),
        columns=[
            ft.DataColumn(ft.Text("Team", color="#F5F7FA")),
            ft.DataColumn(ft.Text("Kuerzel", color="#F5F7FA")),
            ft.DataColumn(ft.Text("Budget", color="#F5F7FA"), numeric=True),
            ft.DataColumn(ft.Text("Division", color="#F5F7FA")),
            ft.DataColumn(ft.Text("UCI-Punkte", color="#F5F7FA"), numeric=True),
        ],
        rows=[
            ft.DataRow(
                cells=[
                    ft.DataCell(ft.Text(team.team_name, color="#F5F7FA")),
                    ft.DataCell(ft.Text(team.abbreviation, color="#D8E1EA")),
                    ft.DataCell(ft.Text(str(team.budget), color="#D8E1EA")),
                    ft.DataCell(ft.Text(team.division_name, color="#D8E1EA")),
                    ft.DataCell(ft.Text(str(team.uci_points), color="#D8E1EA")),
                ]
            )
            for team in teams
        ],
    )

    return ft.Column(
        spacing=12,
        scroll=ft.ScrollMode.AUTO,
        controls=[
            ft.Text("Teams", size=30, weight=ft.FontWeight.W_700, color="#F5F7FA"),
            ft.Container(
                padding=ft.Padding(16, 16, 16, 16),
                bgcolor="#111922",
                border=ft.border.all(1, "#243447"),
                content=ft.Text(summary_text, size=14, color="#D8E1EA"),
            ),
            table,
        ],
    )


def main(page: ft.Page):
    initialize_database()
    sync_teams_from_csv()

    page.title = "Radsport Manager"
    page.theme_mode = ft.ThemeMode.DARK
    page.window.width = 1280
    page.window.height = 800
    page.window.min_width = 1024
    page.window.min_height = 640
    page.padding = 0
    page.spacing = 0
    page.bgcolor = "#0B1218"

    active_menu = "calendar"
    content_area = ft.Container(expand=True)

    def build_sidebar():
        buttons = [
            ft.Text("Hauptmenue", size=20, weight=ft.FontWeight.W_700, color="#F5F7FA"),
            ft.Divider(height=16, color="#243447"),
        ]

        for key, label in MENU_ITEMS:
            is_active = key == active_menu
            buttons.append(
                ft.Container(
                    margin=ft.margin.only(bottom=8),
                    content=ft.TextButton(
                        text=label,
                        on_click=lambda event, menu_key=key: set_active_menu(menu_key),
                        style=ft.ButtonStyle(
                            shape=ft.RoundedRectangleBorder(radius=8),
                            padding=ft.Padding(12, 12, 12, 12),
                            bgcolor={
                                ft.ControlState.DEFAULT: "#7CFC00" if is_active else "#1D2938"
                            },
                            color={
                                ft.ControlState.DEFAULT: "#0B1218" if is_active else "#E8EEF5"
                            },
                        ),
                    ),
                )
            )

        return ft.Container(
            width=260,
            bgcolor="#111922",
            padding=ft.Padding(18, 18, 18, 18),
            border=ft.border.only(right=ft.BorderSide(1, "#243447")),
            content=ft.Column(spacing=0, controls=buttons),
        )

    def build_content(menu_key):
        menu_label = next(label for key, label in MENU_ITEMS if key == menu_key)
        if menu_key == "teams":
            try:
                return ft.Container(
                    expand=True,
                    padding=ft.Padding(24, 24, 24, 24),
                    content=build_teams_view(get_teams()),
                )
            except Exception as error:
                return ft.Container(
                    expand=True,
                    padding=ft.Padding(24, 24, 24, 24),
                    content=build_teams_view([], f"Fehler beim Laden der Teams: {error}"),
                )

        return ft.Container(
            expand=True,
            padding=ft.Padding(24, 24, 24, 24),
            content=build_placeholder_view(menu_label),
        )

    def render():
        content_area.content = ft.Row(
            expand=True,
            spacing=0,
            controls=[
                build_sidebar(),
                build_content(active_menu),
            ],
        )
        page.update()

    def set_active_menu(menu_key):
        nonlocal active_menu
        active_menu = menu_key
        render()

    page.add(content_area)
    render()


if __name__ == "__main__":
    try:
        app_port = int(os.getenv("FLET_SERVER_PORT", "8550"))
    except ValueError:
        app_port = 8550

    ft.app(target=main, port=app_port)