# Walkthrough - Rider Stats "Top - Results" Tab

We have successfully implemented the **Top - Results** tab inside the Rider Stats details view. This tab lists the rider's best career results (stage finishes, final GC standings, final points, mountain, and youth classifications, and one-day races).

## Feature Overview

- **New Tab Button**: Added a "Top - Results" tab button next to "Ergebnisse" in the Rider Stats modal header.
- **Dynamic Dropdown Filters**:
  - **Rennklasse** dropdown allows filtering by specific race categories found in the rider's results (e.g. WorldTour, ProTour) or selecting "Alle Rennklassen".
  - **Saison** dropdown allows filtering by specific seasons found in the rider's results (e.g. Saison 2026) or selecting "All Time".
- **Sorting**: Career results are sorted descending by the obtained season points (`seasonPoints` absteigend).
- **Pagination**: Splits results into 20 items per page. Up to 10 pages are supported.
- **Table Columns**:
  - **Platz**: Renders the placement with styled final classification color classes (`is-gc`, `is-points`, `is-mountain`, `is-youth`) for final standings, and standard placement badges for stage/one-day finishes.
  - **Rennen**: Displays the formatted race name / stage number / classification type.
  - **Profil**: Shows the stage profile icon badge.
  - **Score**: Displays the stage difficulty score formatted as a color-coded badge.
  - **Klasse**: Renders the colored race category badge styled with CSS variables.
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

### 4. Frontend State
In [state.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/state.ts):
- Added `'topResults'` to the `RiderStatsTab` tab type union.
- Added state fields for filtering category, season, and current active page number for the pagination:
  - `riderStatsTopResultsFilterCategory: string | null`
  - `riderStatsTopResultsFilterSeason: number | null`
  - `riderStatsTopResultsPage: number`

### 5. Frontend View and Event Handling
In [riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts):
- Added the tab switcher button "Top - Results".
- Reset the category, season, and page number state variables to default values when opening the Rider Stats details modal.
- Handled the `'topResults'` tab render routing in `renderRiderStatsBody()`.
- Implemented `renderRiderStatsTopResultsTab()` to flatten season-grouped results, collect unique categories/seasons for the select filters, sort rows by points descending, paginate them (20 results per page, max 10 pages), and output the formatted table.
- Added event listeners for dropdown changes and pagination button clicks to update state and trigger reactive re-rendering of the tab body.
