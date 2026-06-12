# Walkthrough - Stage Points Gain, Conditional UCI Points & Two-Daily Form Display

We have implemented:
1. **Stage Points Gain in Results**: Displaying the points won on the current stage next to the total points in the Points and Mountain classification tables.
   - Points won on the stage for Points classification is fetched from the stage results table (`resultTypeId === 1`).
   - Points won on the stage for Mountain classification is computed by summing `pointsAwarded` from climb/hill marker checkpoints (`isMountainClassificationMarkerType` is true).
   - Displayed next to the total points as a green `+xx` badge, at 2/3 font size and bold.
2. **Conditional UCI Points in Stage Races**: UCI points (daily leader points and final standings points) for Points and Mountain classifications in stage races are now only awarded if the classification leader has points > 0.
   - Wrapped points awarding in `GameStateRepository.ts` in conditional checks using database queries for classification leaders' points on each stage.
3. **Two-Daily Form History Display**: In the Form tab of the Rider Stats modal, the form values are now plotted and listed only for every second day (index % 2 === 0).
   - Both the main rider and compared riders curves are filtered to show two-daily data points.

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

---

## Verification Results

### Clean Build & Compile
We ran `npm run build` using Node, which built both the frontend and backend perfectly:
- **tsc (backend)**: Completed successfully.
- **tsc & vite build (frontend)**: Completed successfully.
- **Vite Production bundle**: Compiled and packed assets successfully.
