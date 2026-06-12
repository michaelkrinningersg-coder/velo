# Walkthrough - Stage Points Gain, Conditional UCI Points, Two-Daily Form Display & Clickable Messages

We have implemented:
1. **Stage Points Gain in Results**: Displaying the points won on the current stage next to the total points in the Points and Mountain classification tables.
   - Points won on the stage for Points classification is fetched from the stage results table (`resultTypeId === 1`).
   - Points won on the stage for Mountain classification is computed by summing `pointsAwarded` from climb/hill marker checkpoints (`isMountainClassificationMarkerType` is true).
   - Displayed next to the total points as a green `+xx` badge, at 2/3 font size and bold.
2. **Conditional UCI Points in Stage Races**: UCI points (daily leader points and final standings points) for Points and Mountain classifications in stage races are now only awarded if the classification leader has points > 0.
   - Wrapped points awarding in `GameStateRepository.ts` in conditional checks using database queries for classification leaders' points on each stage.
3. **Two-Daily Form History Display**: In the Form tab of the Rider Stats modal, the form values are now plotted and listed only for every second day (index % 2 === 0).
   - Both the main rider and compared riders curves are filtered to show two-daily data points.
4. **Clicking Rider Name in Live Simulation Messages**: Clicking a rider's name/group button in the live simulation event message logs now triggers and opens the rider stats view modal `openRiderStats` (in addition to selecting their race group).
5. **Clickable Rider Names in Stage Results Events (Ereignisse) List**: Clicking a rider's name in either the "Fahrer" column or the "Ereignis" column (event description text) under the "Ereignisse" tab on the stage results page now triggers and opens the rider stats view modal.
   - Populated `state.riders` in `loadStageResults` if it was empty, and triggered fetch dynamically in `renderResultsView` to ensure rider details are always available.
   - Created `formatEventTextWithAllRiders` to dynamically parse and wrap any matching rider name (including names with trailing GC ranks like `(67.)`) in a clickable `<button>` with the `app-rider-link` class.
   - Added `this.allEvents.push(newMessage)` inside `pushMessage` in `SimulationEngine.ts` to ensure all generated events are correctly passed to the backend, stored, and loaded in results.

---

## Changes Made

### 1. Stage Points Gain in Results
In [results.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/results.ts):
- Computed `stagePointsMap` (for Points classification) and `stageMountainPointsMap` (for Mountain classification) when loading stage results.
- In Points like classification row rendering, retrieved the rider's stage points and appended `+xx` in green (`var(--success, #22c55e)`) at 2/3 font size and bold if points won on the stage > 0.

### 2. Conditional UCI Points in Stage Races
In [GameStateRepository.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/repositories/GameStateRepository.ts):
- Query points of Points and Mountain classification leaders on each simulated stage.
- Conditionally call `insertSeasonPointLeaderAward` and `insertSeasonPointAwards` for Point and Mountain classifications only if the leader has points > 0 on that stage.

### 3. Two-Daily Form History Display
In [riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts):
- Filtered `formHistory` of the main rider and compared riders using a `filter((_, idx) => idx % 2 === 0)` condition before mapping and rendering points/curves.

### 4. Clicking Rider Name in Live Simulation Messages
In [RaceSimView.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/RaceSimView.ts):
- Imported `openRiderStats` from `../views/riderStats`.
- In the click event handler for event messages, trigger `openRiderStats(riderId)` whenever a rider-anchored title or inline rider name is clicked.

### 5. Clickable Rider Names in Stage Results Events (Ereignisse) List
In [SimulationEngine.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/SimulationEngine.ts):
- Pushed every generated simulation event message to `this.allEvents` inside `pushMessage` so that all events are passed to the backend on stage completion and stored.
In [results.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/results.ts):
- Added `renderRiderNameLink` to the imported items from `../state`.
- Fetched `state.riders` inside `loadStageResults` and dynamically inside `renderResultsView` if they are empty, so rider information is populated.
- Created `formatEventTextWithAllRiders` which scans the event title/detail for any matching rider name, wraps them dynamically in a placeholder button, escapes other HTML characters, and replaces placeholders with `<button class="app-rider-link">`.
- Updated the table body row HTML mapping for the Events tab to call `formatEventTextWithAllRiders` on the event's `title` and `detail` fields.

---

## Verification Results

### Clean Build & Compile
We ran `npm run build` using Node, which built both the frontend and backend perfectly:
- **tsc (backend)**: Completed successfully.
- **tsc & vite build (frontend)**: Completed successfully.
- **Vite Production bundle**: Compiled and packed assets successfully.
