# Screens 2A / 3A / 4A — Integrationsleitfaden

Die Screens wurden als Design-Component gebaut (inline-Styles, `React.createElement` für Charts).
`velo` rendert Views als **HTML-Strings** (`innerHTML`) mit **CSS-Klassen** aus `main.css`.
Übernahme = Struktur + Werte aus dem Design in die bestehenden Render-Funktionen übertragen und
an `state`/API binden. Referenz für Layout, Farben, Werte: `design/Velo Redesign.dc.html`.

## 2A · Dashboard → `frontend/src/views/dashboard.ts`
- `renderDashboard()` / `renderDashboardRaces()` umbauen.
- **KPIs** nur noch: Weltrangliste (Delta „vs. Vorwoche" nur mit Backend-Snapshot, sonst weglassen),
  Saisonpunkte, Saisonsiege. (Renntage/Kader-OVR entfernt.)
- **Renn-Radar**: Datumsblock (Tag/Monat) + Kategorie **nur als Farbbalken** (kein Text), laufendes
  Rennen rot markiert. Daten aus `state.races` (nächste ~10 Tage).
- **Auto-Progress** + „Tag fortschreiben" nebeneinander.
- **Top-10 Fahrer/Teams** mit Punkte/Siege-Umschalter — clientseitig aus `state.riders`
  (`seasonPoints`,`seasonWins`) bzw. `state.teams` sortieren. **Team-Siege-Standing** braucht ggf.
  eine neue Aggregation. Mini-Jerseys: `renderMiniJersey(teamId,name)` (existiert bereits).
- **Rotierende Siegfahrer-Karte** (Fahrer mit `seasonWins>0`) mit Radar + Siegliste (Rennen/Etappe,
  absteigend nach UCI-Punkten; nur One-Day / Etappensieg / GC-1).

## 3A · Season-Kalender → `frontend/src/views/calendar.ts`
- **Kleinster Aufwand** — der Wochen-/Slot-Algorithmus ist 1:1 aus eurer `calendar.ts` übernommen
  (Monday-Start-Wochen, Slot-Zuteilung nach Dauer/Start).
- Neu: Broadcast-Styling + **Saison-Ribbon** (Renndichte pro Monat aus `state.races` zählen) +
  Rennliste im Renn-Radar-Stil. Kategorie-Farben aus `resolveRaceCategoryBadgeStyle()`.

## 4A · Fahrer-Statistik → `frontend/src/views/riderStats.ts`
Acht Tabs. Verdrahtung wie gehabt (`RiderStatsPayload`), nur Darstellung neu:
- **Header**: Team-Trikot, OVR-Ring, **FORM/OVR/FATIGUE-Ringe**; Team-Rolle (`role.name`), Alter
  aus `birthYear` (gelb, ohne „J."), Länder-Flagge (`renderFlag`), Spec 1–3, Kapitän/Leutnant + Mentor.
- **Ergebnisse**: pro Rennen gruppiert; Wertungen (GC→Punkte→Berg→Nachwuchs→Ausreißer, nur wenn
  platziert) **oben**, Etappen neueste zuerst; Spalten inkl. **HM** und **Profil-Score**; Ausreißer-
  Spalte (lila), Ereignisse (getragene Trikots + Events als farbige Quadrate mit Hover), echte Wetter-Icons.
- **Top-Results**: flache Bestenliste, nur Punkte-Ergebnisse, Filter Saison/Wertung/Klasse/Profil/Format/Rang,
  Pagination nach 25.
- **Programm**: Saison-Timeline (Mehrtages-Balken/Eintages-Punkte, Ziele = Top-5 Prestige mit ★,
  Formpeaks-Humps, Heute-Linie) + Rennliste (Status inkl. „Nicht teilgenommen").
- **Form**: Saison-Kurve **nur bis heute**; Aufbauphase **56 Tage** (`SEASON_FORM_RISE_DAYS`),
  Abbau 14 Tage; Kurven Form/Season-Form/Rennform + Fatigue (Gesamt/Kurz/Lang) togglebar.
- **Skills**: 6-Achsen-Radar + volle 10-Skill-Liste, Terrain/Format, Wetter-Präferenz mit Icons.
- **Erschöpfung**: Gesamtfatigue-Ring (2 Nachkommastellen, dynamischer Max 25/30/35…), Zusammensetzung,
  Renntage gesamt.
- **Karriere**: Highlights (inkl. neuer **Gesamt-km**, siehe `01-total_km-backend.md`) + gruppierte
  Panels + **Ergebnisse nach Rennklasse** (One-Day: 1./2./3. + Top10 cyan; Rundfahrt: GC & Etappen
  getrennt + Trikot-Führungstage), Hover-Tooltips auf allen Quadraten.
- **Verträge**: Vertragsjahr-Tabelle je Saison (Team, Rolle, Status Aktiv/Ausgelaufen inkl. Zukunft,
  Renntage, Siege, Punkte, UCI-Rang). Kein Gehalt (nicht in DB).

## CSS
Das Design nutzt Inline-Styles. Für `velo` entweder (a) die neuen Blöcke als Inline-Styles in den
HTML-Strings belassen, oder (b) die wiederkehrenden Muster als Klassen in `main.css` extrahieren
(Broadcast-Palette: BG `#0b1120`/`#0c1526`, Border `#1e2c49`, Akzent Cyan `#22d3ee`, Mono
`JetBrains Mono`). Empfehlung: pro Screen eine Datei, Muster in `main.css` sammeln.

## Tipp
Da dies eine 1:1-Portierung großer Views ist, eignet sich der **„Handoff to Claude Code"-Flow**:
Repo mit einem Coding-Agent öffnen und die Screens datei-für-datei gegen `design/Velo Redesign.dc.html`
umsetzen lassen. Auf Wunsch liefere ich auch den vollständigen TypeScript-Port pro Screen einzeln.
