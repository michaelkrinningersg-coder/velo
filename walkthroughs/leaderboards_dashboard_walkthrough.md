# Walkthrough - Leaderboards & Records Dashboard

We have successfully implemented the "Statistiken & Rekorde" (Leaderboards & Records) dashboard in the application. The dashboard provides a highly optimized, fully featured ranking view of riders and teams across various categories, with strict filter resetting and locking rules.

## Changes Made

### 1. Database Schema & Triggers
- **[DatabaseService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/DatabaseService.ts)**:
  - Created the new `rider_season_stats` table to cache stats (breakaway attempts/kms, attacks, counter-attacks, crashes, defects, illnesses/days, injuries/days, DNS/DNF/OTL counts, etc.) on a per-rider per-season basis.
  - Added triggers `trg_update_highest_rider_records_fatigue` and `trg_update_highest_rider_records_form` to `rider_daily_state` to automatically update peak values in `rider_career_stats` when short/long-term fatigue or form change.
  - Added migration robustness to check active savegame races before migrating program mappings to prevent foreign key constraint violations.

### 2. Backend Aggregations & Routing
- **[StageResultCommitService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/simulation/StageResultCommitService.ts)**:
  - Aggregated breakaway kilometers from text event logs, day form, home advantage, and home pressure events.
  - Tallied all rider incident/dropout metrics and persisted them into `rider_season_stats` upon completing stages.
- **[GameStateService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/game/GameStateService.ts)**:
  - Incremented illness/injury and corresponding recovery duration days inside `rider_season_stats` when rolling daily rider health.
- **[LeaderboardRepository.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/repositories/LeaderboardRepository.ts)**:
  - Formulated raw SQL queries for all 6 categories (Rennerfolg, Belastung, Physis & Form, Action & Taktik, Wertungen, Ereignisse).
  - Joined `sta_country` and selected `code_3 AS nationality` to align with the core database schema.
  - Checked `is_retired = 0` to filter only active riders.
  - Implemented specialized mentor calculations (veteran U23 mentor count mapped via active team matching) and youngest winners queries (grouped by unique rider wins).
- **[api.ts (Backend)](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/routes/api.ts)**:
  - Registered `GET /api/leaderboards` query endpoint.

### 3. Frontend Views & Control Logic
- **[index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html)**:
  - Added sidebar navigation button for `📊 Statistiken & Rekorde`.
  - Added layout structure with multi-dropdown selects, scope toggle buttons (TEAMS / FAHRER), and period selector tabs (Saison / All-Time).
- **[leaderboards.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/leaderboards.ts)**:
  - Implemented dropdown select rules: selecting a metric in any of the 6 dropdowns automatically resets all other 5 dropdowns to empty.
  - Managed live period: when a tagesaktueller Live-Wert (fatigue/form) is active, hides the period selector and forces "Live".
  - Managed record locking: when a peak fatigue/form or youngest winners/mentors record is selected, disables the "Saison" button and locks the period to "All-Time".
  - Handled scope toggling: hiding the "Physis & Form" dropdown entirely and restoring previous selections when switching between Riders and Teams.
  - Integrated `renderMiniJersey` and styled badges for rank listings.
  - Bound clickable rider names to trigger the `openRiderStats` modal.
- **[app.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/app.ts)**:
  - Wired view routing event listener and view initializer.

---

## Validation & Verification

### 1. Build Verification
- Compiled and bundled the backend and frontend modules successfully using `build_all.js`.
- Confirming all TypeScript typing issues (e.g. `'live'` period cast on team query returns) are resolved.

### 2. Database Schema & Migration Verification
- Instantiated `DatabaseService`, loaded the career savegame, and verified:
  - `rider_season_stats` schema created successfully with correct columns.
  - New fatigue/form peak columns added to `rider_career_stats` successfully.
  - Triggers correctly registered.

### 3. Repository Query Verification
- Verified all leaderboard metrics for riders and teams by calling the repository queries against real game state data:
  - All Rennerfolg, Belastung, Physis, Action, Wertungen, and Ereignisse metrics fetched successfully without errors.
  - Mentor ranking query successfully returned team mentoring counts.
  - Youngest winners CTE correctly grouped and selected youngest rider wins.
