# Plan: Verbesserung der Fahrerentwicklung & Newgen-System

Stand: nach Code-Analyse und Klärung der offenen Fragen

---

## 1. Aktueller Stand – was ist bereits da?

### 1.1 Entwicklung (Backend) — `RiderDevelopmentService.ts`
- `advanceDailyDevelopment(...)` läuft täglich (`GameStateService.advanceRiderDailyStates`).
- **Blockierte Gründe**: `retired`, `ill`, `injured`, `unavailable`, `form_decline`, `offseason` (Nov+Dec), `peak_age_reached`, `no_headroom`.
- **Wachstum**: `dailyGrowth = min(0.018, headroom × Faktor)`, Faktor aus `ageFactor`, `developmentFactor`, `resolveSkillFocusFactor(riderType, skillKey)`, Zufall.
- **Abbau**: ab `decline_age`, täglicher kleiner Verlust pro Skill, `resolveSkillDeclineFactor(skillKey)`.
- **Potenziale** in `buildPotentials()` aus `current + headroom × ...` berechnet.
- `skill_bike_handling` ist abgeleitet (`calcBikeHandling`).
- `initializeRiders()` setzt Erstwerte (peak/decline/retirement_age, skill_development, potentials, rider_type_id, specializations) nur, wenn diese Felder 0 sind.
- `recalculateSpecializations()` läuft beim Jahreswechsel.

### 1.2 Frontend (Team-Menü) — `app.ts`
- Tab „Skills" zeigt pro Fahrer `overallRating` + 15 Skills (`TEAM_SKILL_COLUMNS`).
- `renderSkillValue()` rendert nur den absoluten Wert, **kein Delta, kein Hover-Potential**.

### 1.3 Newgens
**Aktuell gibt es KEINEN Newgen-Workflow.** Nur `sta_country.csv` mit `number_regen_min/max` existiert.

### 1.4 Namen
Aktuell aus `riders.csv`. Keine Namensdatenbank pro Land, kein Würfelmechanismus.

---

## 2. Geklärte Entscheidungen (User-Inputs)

### 2.1 Daily-Entwicklung — finale Regeln

| Bedingung | Wachstum | Abbau |
|-----------|----------|-------|
| gesund, nicht im Rennen, nicht in Decline-Form, **NICHT** im November, noch vor `peak_age`, headroom > 0 | ✅ | ✅ |
| krank / verletzt / unavailable | ❌ | ✅ |
| **im Rennen** (siehe G2: SQL auf `stage_entries`) | ❌ | ❌ (Rennen schonen) |
| in Decline-Form (`formPhase === 'decline'`, 14 Tage nach Peak) | ❌ | ✅ |
| in Build-Form (`formPhase === 'build'`, 42 Tage vor Peak) | ✅ | ❌ |
| **November** (`11-01` – `11-30`) | ❌ | ✅ |
| **Dezember** | ✅ (kein Off-Monat, nur November) | ✅ |
| `age >= peak_age` und `age < decline_age` | ❌ (Peak erreicht) | ❌ |
| `age >= decline_age` | ❌ | ✅ (altersabhängig) |
| `age >= retirement_age` | ❌ | Retired |
| `skill >= potential` | ❌ | ❌ |

**Neue `resolveDevelopmentBlockReason()`-Logik**:
```ts
function resolveDevelopmentBlockReason(
  row, context, currentDate, age
): { canGrow: boolean; canDecline: boolean } {
  if (row.is_retired === 1)               return { canGrow: false, canDecline: false };
  if (context?.healthStatus !== 'healthy') return { canGrow: false, canDecline: true };
  if ((context?.unavailableDaysRemaining ?? 0) > 0)
                                          return { canGrow: false, canDecline: true };
  if (isInRaceToday)                      return { canGrow: false, canDecline: false };
  if (context?.formPhase === 'decline')   return { canGrow: false, canDecline: true };
  if (context?.formPhase === 'build')     return { canGrow: true,  canDecline: false };
  if (isNovember(currentDate))            return { canGrow: false, canDecline: true };
  if (age >= row.peak_age)                 return { canGrow: false, canDecline: false };
  return { canGrow: true, canDecline: true };
}
```

> **G1 — Geklärt**: November = `11-01` bis `11-30`. **Dezember ist KEIN Off-Monat.**
> **G2 — Geklärt**: „Im Rennen" wird per SQL auf `stage_entries` (heutiges Datum) ermittelt.

### 2.2 Potential-Logik — Geklärt
- **G3**: Potential wird **fix bei Erzeugung** gesetzt.
- Potential kann nicht weiter wachsen, aber **kann sinken** (z. B. wenn ein Fahrer die Karriere beendet, oder als Balancing-Option bei Verletzungen).
- **Aktuell**: Potential bleibt eingefroren. Senkung ist explizit erlaubt, wird aber im Alltag **nicht** passieren.

### 2.3 `skill_development` (1-20) — Geklärt
- **Initial**: Wird beim Spielstart für **alle Fahrer neu gewürfelt** (1-20).
- **Jährlich**: Wird am Jahresbeginn neu gewürfelt, **aber nur um ±3** verändert.
- **Beispiel**: Fahrer hatte `12` → dieses Jahr `10` bis `15`.

### 2.4 Newgen-Workflow — Geklärt

#### Auslöser
- Beim Tageswechsel `31.12.YYYY → 01.01.YYYY` (vor dem `recalculateSpecializations` der neuen Saison).
- **G6**: Erst Newgens erzeugen, dann Spezialisierungen würfeln.
- `birth_year = nextSeason - 16` (Fahrer wird zu Saisonbeginn 16).

#### Anzahl
- `count = rand(number_regen_min, number_regen_max)` pro Land.
- **Q4**: Die CSV-Werte sind **harte Caps** nach oben und unten (nicht nur Minimals).
- Länder mit `number_regen_max = 0` bekommen keine Newgens.
- **Q5**: **Keine zusätzliche Gewichtung pro Land** (nur die CSV-Werte zählen).

#### Werte — Finale Skill-Ranges (Start 40-60, Potential 60-85)
Siehe `data/csv/newgen_start_presets.csv` (33 Presets) und `data/csv/newgen_potential_presets.csv` (33 Presets).

**Wichtig — Q8**: Beide CSVs sind **nur Defaults**. Bei der Erzeugung werden sie **live gewürfelt**, sodass jedes Jahr unterschiedliche Talente entstehen. Die CSV dient als **Verteilung / Plausibilitätscheck**.

#### Matching-Logik
Für jeden Newgen:
1. Würfle ein **Start-Preset** (gewichtet mit `preset.weight`).
2. Generiere konkrete Startwerte: `start[key] = rand(preset.min_key, preset.max_key)` pro Skill.
3. Filtere alle **Potential-Presets**, bei denen **alle** `pot[key] > start[key]` gelten.
4. Würfle aus den verbleibenden Potential-Presets eines (gewichtet).
5. Generiere konkrete Potentiale: `pot[key] = rand(preset.min_key, preset.max_key)` pro Skill, **clamped auf `[start[key]+1, 85]`**.
6. Falls nach 1000 Versuchen kein passendes Potential-Preset gefunden → backoff: senke `start` leicht (oder verwende ein Notfall-Preset mit Potential 60-65).

#### Vertrag — G4 Geklärt
- **Kein KI-Markt** für Newgens (kommt später).
- Newgens bleiben **free agents**, bis ein Vertrag abgeschlossen wird.
- Ebenso: Fahrer mit auslaufenden Verträgen werden free agents.

#### Rolle / Spezialisierung / Programm — G6 Geklärt
- Free Agents bekommen **keine Rolle** (`role_id = null`).
- Spezialisierungen werden **nach** Start- und Potential-Würfelung berechnet (Top-3 Scores).
- **Kein `rider_season_programs`** für Free Agents.

#### U23-Teams — G7 Geklärt
- Newgens werden **nicht** an U23-Teams gebunden.
- Sie bleiben free agents bis ein Vertrag abgeschlossen wird.

### 2.5 Namen
- `data/csv/rider_names.csv` enthält 30+ Vor- und Nachnamen pro Land.
- **Status**: Aktuell für 9 Top-Länder (ITA, FRA, BEL, NED, GER, ESP, DEN, COL, EST, GBR, AUS).
- **TODO vor Inbetriebnahme**: Auf alle 139 Länder in `sta_country.csv` erweitern.
- Länder ohne Namen fallen zurück auf einen Default-Pool (z. B. „Rider 1", „Rider 2" – aber das sollte nie passieren).

### 2.6 Anzeige der Saison-Entwicklung
- Neue Tabelle `rider_skill_yearly_baseline(rider_id, season, skill_key, baseline_value)`.
- Beim Jahreswechsel: Snapshot der aktuellen Skill-Werte als `year_start`.
- `Rider` Interface erweitern um `yearStartSkills: Record<RiderSkillKey, number>`.
- Frontend: `renderSkillValue(value, delta, potential)` rendert
  ```html
  <span class="skill-value" style="color:..." title="Potential: 84,5">72</span>
  <span class="skill-delta skill-delta-positive">+1,35</span>
  ```
- **Hover auf Basiswert**: zeigt `Potential: 84,5` (Debug).

---

## 3. Datenbank- und Code-Änderungen

### 3.1 Neue / geänderte Dateien
| Datei | Zweck | Status |
|-------|-------|--------|
| `data/csv/newgen_start_presets.csv` | Startwert-Presets | ✅ erstellt (33 Presets) |
| `data/csv/newgen_potential_presets.csv` | Potential-Presets | ✅ erstellt (33 Presets) |
| `data/csv/rider_names.csv` | Vornamen/Nachnamen pro Land | ⚠ erstellt (9 Länder, restliche TODO) |
| `backend/src/game/RiderNewgenService.ts` | Erzeugt jährlich neue Fahrer | 🔨 zu erstellen |
| `backend/src/game/RiderDevelopmentService.ts` | Refactor: neue Block-Logik | 🔨 |
| `backend/src/game/GameStateService.ts` | Aufruf `RiderNewgenService` beim Jahreswechsel | 🔨 |
| `backend/src/db/GameRepository.ts` | Methoden `getRiderNames`, `getNewgenPresets` | 🔨 |
| `backend/src/bootstrapper.ts` | `seedRiderNames`, `seedNewgenPresets` | 🔨 |
| `backend/assets/schema.sql` | Neue Tabelle `rider_skill_yearly_baseline` | 🔨 |
| `shared/types.ts` | `Rider.yearStartSkills` | 🔨 |
| `frontend/src/app.ts` | `renderSkillValue` mit Delta + Hover-Potential | 🔨 |
| `frontend/src/main.css` | Klassen `skill-delta-positive/negative` | 🔨 |

### 3.2 Geändertes DB-Schema
```sql
CREATE TABLE IF NOT EXISTS rider_skill_yearly_baseline (
  rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  skill_key TEXT NOT NULL,
  baseline_value REAL NOT NULL,
  PRIMARY KEY (rider_id, season, skill_key)
);

CREATE INDEX IF NOT EXISTS idx_rider_skill_yearly_baseline_lookup
  ON rider_skill_yearly_baseline(season, rider_id);
```

### 3.3 Jahresbeginn-Snapshot
In `GameStateService.advanceDay` falls `nextSeason !== currentSeason`:
```sql
INSERT OR REPLACE INTO rider_skill_yearly_baseline (rider_id, season, skill_key, baseline_value)
SELECT id, ?, 'flat', skill_flat FROM riders WHERE is_retired = 0
UNION ALL SELECT id, ?, 'mountain', skill_mountain FROM riders WHERE is_retired = 0
... (15 Skills)
```

### 3.4 Newgen-Trigger
Im selben Block:
```ts
if (currentRow.current_date.endsWith('-12-31')) {
  new RiderNewgenService(this.db).createYearStartNewgens(currentRow.season + 1);
}
```

### 3.5 „im Rennen"-Erkennung
Pro Tag, einmalig aggregieren:
```sql
SELECT rider_id FROM stage_entries se
JOIN stages s ON s.id = se.stage_id
WHERE s.date = ? AND se.status IN ('scheduled', 'started')
```
Ergebnis als `Set<riderId>` → in `context.isInRaceToday` durchschleifen.

### 3.6 Frontend
```ts
function renderSkillValueWithDelta(value: number, yearStart: number, potential: number): string {
  const delta = Math.round((value - yearStart) * 100) / 100;
  const deltaClass = delta > 0 ? 'skill-delta-positive' : delta < 0 ? 'skill-delta-negative' : '';
  const deltaText = delta === 0 ? '' :
    `<span class="skill-delta ${deltaClass}">${delta > 0 ? '+' : ''}${delta.toFixed(2).replace('.', ',')}</span>`;
  return `
    <span class="skill-value" style="color:${getSkillColor(value)}" title="Potential: ${potential.toFixed(2).replace('.', ',')}">${Math.round(value)}</span>
    ${deltaText}
  `;
}
```

CSS:
```css
.skill-delta-positive { color: #16a34a; font-size: 0.7em; margin-left: 4px; }
.skill-delta-negative { color: #dc2626; font-size: 0.7em; margin-left: 4px; }
```

---

## 4. Reihenfolge der Umsetzung

1. ✅ **CSV-Dateien angelegt** (3 Stück)
2. ✅ **DB-Schema erweitern** (`rider_skill_yearly_baseline`)
3. ✅ **Bootstrapper erweitern** (Seeds für die drei neuen CSVs)
4. ✅ **`RiderNewgenService.ts` schreiben**
5. ✅ **`RiderDevelopmentService.advanceDailyDevelopment` umbauen** (neue Block-Logik + „im Rennen"-Erkennung)
6. ✅ **Jahresbeginn-Snapshot** in `GameStateService.advanceDay` einbauen
7. ✅ **`skill_development` jährlich neu würfeln** (±3 Begrenzung)
8. ✅ **Shared Types** erweitern
9. ✅ **Frontend-Render** für Deltas + Hover
10. ✅ **Tests / manuelles Smoke-Test** (1.1.2027 → Newgens geprüft, 1 Monat simuliert, Deltas sichtbar)

---

## 5. Offene TODOs / Risiken

### 5.1 TODOs
- **`rider_names.csv`**: Für 130 Länder fehlen die Namen. **Wer macht das?**
  - Option A: Manuell erweitern (je Land ~30 Vor- + 30 Nachnamen, Recherche nötig).
  - Option B: KI-gestützt (ein Skript könnte mit einer LLM die Liste pro Land erstellen).
  - Option C: Vereinfachter Default-Pool (z. B. nur west-europäische Namen) – wird aber unschön für asiatische/afrikanische Länder.
- **Migration Bestandsfahrer**: Soll `initializeRiders()` mit `force = true` laufen?
  - User-Antwort: **„es sollten nur fahrer über die csv neu reinkommen"** → keine Migration nötig. Nur **neue** Fahrer (Newgens) durchlaufen die neue Logik.
  - Bestehende Fahrer behalten ihre alten Potentiale.
- **Wie wird der Wechsel von alten zu neuen Potentialen fair gestaltet?**
  - Vorschlag: Bestehende Fahrer behalten ihre aktuellen `pot_*`-Werte; die neuen Presets greifen erst, wenn ein neuer Fahrer erzeugt wird.

### 5.2 Risiken
- **Race-Day-Query**: 1× pro Tag für ~6000 Fahrer → vorab in `Set` aggregieren.
- **DB-Locks**: 6000 × 15 = 90000 Inserts am 31.12. → in `db.transaction()`.
- **Newgen-Preset-Match-Backoff**: Falls nie ein passendes Potential-Preset gefunden wird → Notfall-Preset (Potential 60-65 für alle Skills).
- **CSS-Konflikt**: `skill-delta-positive/negative` müssen neu in `main.css` angelegt werden.
- **Performance des neuen Daily-Developments**: Eine zusätzliche SQL-Query pro Tag (für „im Rennen") ist ok, aber wir sollten sie **cachen** (1× pro Tag berechnen, in `RiderDevelopmentDailyContext` weiterreichen).
