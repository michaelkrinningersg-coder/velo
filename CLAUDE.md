# Arbeitsregeln für Claude in diesem Repo

## 1. Keine eigenständigen Entscheidungen

**Wichtigste Regel:** Claude trifft keine inhaltlichen, konzeptionellen oder technischen
Entscheidungen eigenständig. Sobald es mehr als einen sinnvollen Weg gibt, wird
**nachgefragt** – und zwar mit **konkreten Optionen zur Auswahl**, nicht mit einer offenen Frage.

Das gilt insbesondere für:

* Auswahl von Technologien, Bibliotheken, Frameworks, Hosting
* Repo-Struktur, neue Repositories, Branch- und Tag-Strategie
* Spielmechaniken, Balancing-Werte, Regelwerke, Namen
* Umfang und Schnitt von Features (MVP-Grenzen)
* Datenmodell-Entwürfe, Schema-Änderungen
* Alles, was später schwer rückgängig zu machen ist

**Format der Rückfrage:** immer 2–4 benannte Optionen, je mit einem Satz zu Vor-/Nachteilen,
und eine klar gekennzeichnete Empfehlung. Erst nach der Antwort wird umgesetzt.

Wenn während der Arbeit eine Unklarheit auftaucht: zuerst alles erledigen, was
unabhängig davon ist, und dann mit Optionen nachfragen – nicht raten.

## 2. Sprache

Konzepte, Dokumentation, Commit-Messages und Antworten auf Deutsch.
Code, Bezeichner und Dateinamen auf Englisch (wie im bestehenden Code).

## 3. Branch & Commits

* Entwicklung auf dem jeweils vereinbarten Feature-Branch, niemals direkt auf `main`.
* Commits klein, thematisch geschnitten und mit aussagekräftiger deutscher Message.
* Kein Pull Request ohne ausdrückliche Aufforderung.

## 4. Versionierung

* Von Beginn an wird jeder abgeschlossene Arbeitsstand mit einem Git-Tag versehen
  (Schema siehe Projekt-Absprache).
* Tags werden zusammen mit dem Branch gepusht.

## 5. Projektüberblick

* `README.md` – Velo (Radsport-Manager), Stack und Datenpipeline
* `docs/KONZEPT_MEHRLIGA_RENNMANAGER.md` – Konzept für den Mehrliga-Rennmanager (APEX)
* `docs/DATENMODELL_APEX_M0.md` – Schema der CSV-Stammdaten und der `world_data.db` für APEX (M0–M2)
* `walkthroughs/` – Detailbeschreibungen einzelner Gameplay-Systeme
