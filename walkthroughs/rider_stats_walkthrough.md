# Walkthrough - Rider Stats "Top - Results" Tab

We have successfully implemented the **Top - Results** tab inside the Rider Stats details view. This tab lists the rider's best career results (stage finishes, final GC standings, final points, mountain, and youth classifications, and one-day races).

## Feature Overview

- **New Tab Button**: Added a "Top - Results" tab button next to "Ergebnisse" in the Rider Stats modal header.
- **New Tab Button**: Added a "Top - Results" tab button next to "Ergebnisse" in the Rider Stats modal header.
- **Dynamic Dropdown Filters**:
  - **Rennklasse** dropdown allows filtering by specific race categories (e.g. WorldTour, ProTour). For stage race categories (e.g., Grand Tour, Stage Race High/Middle/Low), the category is subdivided into **Etappen** (stage finishes) and **GC** (final standings/GC results) options.
  - **Saison** dropdown allows filtering by specific seasons or selecting "All Time".
- **Sorting**: Career results are sorted descending by the obtained season points. In case of equal points (e.g., 0 points):
  - When filtering by "All", results are sorted by race class priority (Grand Tour -> Monument -> Stage Race High -> One Day High -> Stage Race Middle -> One Day Middle -> Stage Race Low -> One Day Low -> other), then GC/final standings results are placed before daily stage results, and then by placement rank.
  - When filtering by a specific category, results are sorted by placement rank (ascending), and then GC/final standings results are placed before daily stage results.
- **Pagination**: Splits results into 20 items per page, up to 10 pages.
- **Table Columns (Split Placement)**:
  - **Platz**: Displays the placement for daily/stage finishes, one-day races, DNF, or OTL. Shows `–` for final standings.
  - **GC / Wertung**: Renders the placement with styled final classification color classes (`is-gc`, `is-points`, `is-mountain`, `is-youth`) for final standings. Shows `–` for daily stage finishes.
  - **Rennen**: Displays the formatted race name / stage number / classification type.
  - **Profil**: Shows the stage profile icon badge.
  - **Score**: Displays the stage difficulty score (0 to 350) formatted as a color-coded badge. The badge is displayed only for stage/one-day finishes; final standings do not display a score (showing `–`).
  - **Klasse**: Renders the colored race category badge.
  - **Saison**: Shows the season year.
  - **Punkte**: Displays the season points obtained.


## Changes Made

### 1. Shared Types
In [types.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/shared/types.ts):
- Added `stageScore: number;` to the `RiderStatsRow` interface.

### 2. Backend database mappings
In [mappers.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/mappers.ts):
- Added `stage_score: number;` to both `RiderStatsStageDbRow` and `RiderStatsFinalDbRow` database mapping interfaces.

### 3. Backend Repository
In [RiderRepository.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/repositories/RiderRepository.ts):
- Selected `stages.stage_score AS stage_score` in the database queries for both stage results (`stageRows`) and final classification results (`finalRows`).
- Mapped `stage_score` value to the frontend `stageScore` property of `RiderStatsRow` in both processing loops.

### 4. Database Migrations
In [DatabaseService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/DatabaseService.ts):
- Added `stage_score` to the schema check list (`missingColumns`) in `ensureStageSpreadData`.
- Updated `ensureStageSpreadData` query logic to fetch `stage_score` from `world_data.db` and perform bulk updates on savegames if columns are missing or values are outdated/0.
- Called `ensureStageSpreadData` inside `getActiveConnection` so that any loaded savegame receives the migrated `stage_score` values.

### 5. Frontend State
In [state.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/state.ts):
- Added `'topResults'` to the `RiderStatsTab` tab type union.
- Added state fields for filtering category, season, and current active page number for the pagination:
  - `riderStatsTopResultsFilterCategory: string | null`
  - `riderStatsTopResultsFilterSeason: number | null`
  - `riderStatsTopResultsPage: number`

### 6. Frontend View and Event Handling
In [riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts):
- Added the tab switcher button "Top - Results".
- Reset the category, season, and page number state variables to default values when opening the Rider Stats details modal.
- Handled the `'topResults'` tab render routing in `renderRiderStatsBody()`.
- Implemented `renderRiderStatsTopResultsTab()` to flatten season-grouped results, collect unique categories/seasons for the select filters, sort rows by points descending, paginate them (20 results per page, max 10 pages), and output the formatted table.
- Added event listeners for dropdown changes and pagination button clicks to update state and trigger reactive re-rendering of the tab body.
- Added the subdivision options for stage races (Etappen and GC) in the category select list.
- Implemented the tie-breaker sorting logic (class priority -> GC vs Stage -> rank).
- Split the placement column into "Platz" and "GC / Wertung" columns.
- Formatted the stage score badge to only display for stage/one-day results and default to `–` otherwise.
