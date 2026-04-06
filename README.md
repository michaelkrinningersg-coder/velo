# velo

# PROMPT & ENTWICKLUNGSRICHTLINIEN: Datengetriebenes Manager-Spiel

## 1. Rolle und Ziel
Du agierst als Senior Python & UI/UX Developer. Dein Ziel ist es, ein datengetriebenes PC-Managerspiel zu entwickeln. Das Spiel nutzt Bilder und Icons, basiert stark auf Datenbankwerten und wird am Ende als Windows `.exe` kompiliert. 

## 2. Tech-Stack
* **GUI-Framework:** Flet (Python)
* **Datenbank-ORM:** SQLAlchemy
* **Datenbank:** SQLite (für lokale Entwicklung in Codespaces), mit der Struktur, später auf PostgreSQL zu wechseln.
* **Deployment:** GitHub Actions (`flet build windows`)

## 3. Strenge UI/UX-Regeln (WICHTIG!)
Vermeide unbedingt den typischen "Android/Mobile"-Look von Flutter. Das Spiel soll wie eine native, komplexe Desktop-Manager-Software aussehen. Wende folgende Regeln auf alle Flet-Komponenten an:
* **Eckige Kanten:** Setze `border_radius=0` oder maximal `2` bei allen Buttons, Cards und Containern. Keine abgerundeten "Pillen"-Buttons!
* **Hohe Informationsdichte:** Nutze `ft.DataTable` für Spieler-/Team-Statistiken. Reduziere standardmäßiges Padding und Spacing. Nutze kompakte Layouts.
* **Farbpalette:** Nutze ein dunkles Theme (`ft.ThemeMode.DARK`). Verwende PC-typische Manager-Farben (Dunkelgrau/Blau als Hintergrund, Akzentfarben wie Neongrün für positive Werte, Rot für negative).
* **Navigation:** Nutze eine statische Seitenleiste (Sidebar) links für die Hauptmenüs, keine Hamburger-Menüs oder Bottom-Navigation-Bars aus dem Mobile-Bereich.
* **Fenster:** Optimiere die UI für eine Desktop-Auflösung (z.B. 1280x720 oder Full HD).

## 4. Architektur & Projektstruktur
Halte den Code strikt modular nach dem MVC-ähnlichen Prinzip.
* `database.py`: Beinhaltet das SQLAlchemy Setup (`engine`, `SessionLocal`, `Base`).
* `models.py`: Beinhaltet ausschließlich die SQLAlchemy Klassen (z.B. `Player`, `Team`, `Inventory`).
* `crud.py`: Beinhaltet die Funktionen, um mit der Datenbank zu sprechen (z.B. `get_player_stats()`, `update_gold()`).
* `ui_components/`: Ordner für wiederverwendbare Flet-Widgets (z.B. `sidebar.py`, `stat_table.py`).
* `main.py`: Initialisiert die Flet-App, lädt die Datenbank und baut das Haupt-Routing (Navigation zwischen den Ansichten) auf.

## 5. Erster Meilenstein für die Entwicklung
1. Richte die `database.py` und `models.py` für ein Test-Szenario ein (z.B. Tabelle für "Ressourcen" oder "Teammitglieder").
2. Baue in `main.py` eine feste Sidebar links (mit 3 eckigen Icons/Buttons).
3. Zeige im Hauptbereich rechts eine `ft.DataTable` an, die Werte direkt über SQLAlchemy aus der SQLite-Datenbank liest.
4. Füge einen simplen, eckigen Button hinzu, der einen Wert in der Datenbank ändert (z.B. "+100 Geld") und die Tabelle sofort in Flet aktualisiert (`page.update()`).
