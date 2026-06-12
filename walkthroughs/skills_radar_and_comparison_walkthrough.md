# Walkthrough - Classification Leader Dots & Rider Stats Form Comparison & Skills Radar

We have implemented:
1. **Daily Form History Synchronization**: Form history updates in the database now happen daily instead of weekly.
2. **Classification Leader Dot Badges in Results**: Displaying GC, Points, Mountain, and Youth leaders next to rider names as colored dots (Yellow, Green, Red, White).
3. **Interactive Rider Stats Form Comparison**: Comparing up to 10 riders on an expanded SVG form chart with team and rider selectors, distinct colored curves, and a sidebar legend with delete controls.
4. **Skill Radar Chart Tab**: A hexagon/spider-web radar visualization for the 6 main skills alongside a color-graded three-column skills list.

---

## Changes Made

### 1. Daily Form History Synchronization
In [GameStateService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/game/GameStateService.ts):
- Replaced checks for `new Date(...).getDay() === 1` with daily sync execution.
- Renamed the internal method `syncWeeklyFormHistory` to `syncDailyFormHistory` to accurately represent the daily recording of form history data.

### 2. Classification Leader Dot Badges in Results
In [results.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/results.ts):
- Declared a helper function `renderLeaderDots(riderId)` that resolves the current leaders for each rider classification (GC, Points, Mountain, Youth) directly from the active results payload.
- Rules applied for display:
  - **Yellow Dot (GC)**: Shown next to the GC classification leader in the GC standings tab, or in the Stage standings tab if it is a stage race (Rundfahrt).
  - **Green Dot (Points)**: Shown next to the Points classification leader.
  - **Red Dot (Mountain)**: Shown next to the Mountain classification leader.
  - **White Dot (Youth)**: Shown next to the Youth classification leader.
- Appended `renderLeaderDots(row.riderId)` next to rider names (`participantCell`) in all rider-based results standings tables.

### 3. CSS Badging Styles
In [main.css](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/main.css):
- Added styling rules for `.jersey-dots-wrapper` and individual dots (`.jersey-dot-yellow`, `.jersey-dot-green`, `.jersey-dot-red`, `.jersey-dot-white`) to display round dots with proper margins and contrast.

### 4. Interactive Rider Stats Form Comparison
In [riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts):
- Declared module-level variables `comparedRiders` and `selectedCompareTeamId` to track compared riders, including their peak dates, points, and placement ranks.
- Reset the compared state automatically inside `openRiderStats` when opening a new rider stats modal.
- Increased chart dimensions by **1.6x height** (`chartH = 384`) and **1.3x width** (`chartW = 1300`), and expanded the SVG viewBox (`1350x444`, SVG height attribute `460`) to display form curve values clearly.
- Rendered selectors above the chart:
  - **Team (Tier 1)**: Lists only WorldTour (Tier 1) teams.
  - **Fahrer**: Lists active riders belonging to the selected team (excluding the main rider and already compared riders).
- Selecting a compared rider fetches their stats dynamically via `api.getRiderStats` (storing their `peakDates`, `currentSeasonPoints`, and `currentSeasonRank`) and overlays their curve (lines and points only, in a unique color) and their peak dates as vertical dashed lines (in their respective color) on the SVG chart.
- The area under the curve is filled with a warm yellow color (`rgba(251, 191, 36, 0.15)`) ONLY for the main rider. Compared curves have no fill.
- Rendered a **Legende** sidebar to the right of the chart showing the main rider and compared riders with their respective curve colors.
- **Rider Stats in Legend**: Next to each rider's name in the legend, their Season Points and Season Rank placement are shown inside parentheses in the format `(Points/Rank)`, like `(1540/12)`.
- Added a remove button (`×`) next to each compared rider in the legend. Clicking it deletes the rider (and their corresponding curve, points, and vertical peak lines) from the comparison list and updates the chart instantly.

### 5. Skill Radar Chart & Skills Tab
In [riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts):
- Added a new **Skills** tab button to `renderRiderStatsTabs(payload)`.
- Implemented `renderRiderStatsSkillsTab(rider, payload)`:
  - Draws a hexagon / spider-web radar chart displaying the 6 main skills (**Mountain, Hill, Sprint, TimeTrial, Cobble, Attack**).
  - Concentric hexagon grid lines are plotted at every 5 points: **60** (center), **65, 70, 75, 80, 85** (outer edge).
  - Plots the rider's specific skill polygon overlayed in a semitransparent indigo styling (`rgba(99, 102, 241, 0.35)`).
- Beside the radar chart, renders 10 key skills (**Mountain, Hill, Sprint, TimeTrial, Cobble, Attack, Medium Mountain, Flat, Prologue, Acceleration**) formatted as score badges:
  - Stepped color gradients from dark red (`55 and below`) up to green (`80 and above`), matching intermediate scores through orange and yellow.
  - Organized the skills cleanly in **three columns**.
- Updated `renderRiderStatsBody` to display the skills tab, and registered the new tab in `initRiderStatsListeners` event handlers.
- Updated `RiderStatsTab` union type in [state.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/state.ts) to support the `'skills'` tab.

---

## Verification Results

### Clean Build & Compile
We ran `npm run build` using Node v24, which built both the frontend and backend perfectly:
- **tsc (backend)**: Completed successfully.
- **tsc & vite build (frontend)**: Completed successfully.
- **Vite Production bundle**: Compiled and packed assets successfully:
  - `dist/index.html` (28.50 kB)
  - `dist/assets/index-B0lX9MLa.css` (79.76 kB)
  - `dist/assets/index-CxyiEmRY.js` (375.34 kB)
