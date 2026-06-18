# Walkthrough - Instant Simulation Progress Panel Refinement

We have successfully refined the **Instant Simulation Progress Overlay** (Fortschrittsbalken) to display rich pre-stage context while a stage is being simulated.

## Key Enhancements

1. **Dual-Layout Loading Overlay:**
   - Modified the loading overlay in [index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html) to support two clean UI layouts:
     - **Default Loader (`#default-loader`):** Standard spinner and text used for quick database/career operations.
     - **Instant Simulation Panel (`#instant-sim-panel`):** A column-based dashboard displayed only during instant simulation ticks.

2. **Stage Favorites (Left Sidebar):**
   - Automatically calculates the pre-stage favorites for the current stage profile.
   - Lists the **Top 10 favorites** with their:
     - Direct team jersey asset image (large-scale rendering, complete with drop-shadow).
     - Rider name, nationality flag, and team abbreviation.
     - Active GC ranking and time gap (e.g. `GC 1 (Gelb)` or `GC 3 (+1:45)`).

3. **General Classification Standings (Right Sidebar):**
   - Lists the **Top 10 riders in General Classification** with:
     - Large-scale team jersey representation.
     - Rider name, nationality flag, and team abbreviation.
     - Time gap to the GC leader (e.g. leader is `Gelb`, subsequent riders show gap `+12s`, `+2:10`, etc.).

4. **Central Simulation Engine State:**
   - Centered column displays the spinning indicator, active simulation step status text, and the styled progress bar updating in real-time as the simulation progresses.

---

## Detailed Changes Made

- In [liveRace.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/liveRace.ts):
  - Assigned the fetched `bootstrap` payload to `state.realtimeBootstrap` at the start of the simulation flow.
- In [index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html):
  - Refactored `#loading-overlay` elements to toggle between standard and custom sidebar structures.
- In [state.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/state.ts):
  - Imported `calculateStageFavorites` from the simulation package.
  - Implemented `renderInstantSimPanel` to fetch favorites and GC stand rows, map flags and jerseys, format time gaps, and render cards.
  - Modified `showLoading`, `showInstantProgress`, and `updateInstantProgress` to handle state-conditional visibility and render trigger hooks.
  - Removed the `#` prefix symbol from the rank badges inside the sidebar cards.
- In [main.css](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/main.css):
  - Appended premium CSS classes for layout structures (`.instant-sim-panel`, `.instant-sim-sidebar`, `.instant-sim-center`), responsive layout limits, large jerseys, hover transitions, and badge chips.
  - Increased `.instant-sim-panel` dimensions (`height: 820px; max-height: 95vh; max-width: 1200px;`) to fully display all 10 Stage Favorites and 10 GC riders simultaneously without requiring any vertical scrolling.
  - Enlarged the font size of `.instant-sim-name` (to `0.96rem`) and `.instant-sim-gc-info` (to `0.86rem`).
  - Styled `.instant-sim-rank-badge` to be larger (to `0.88rem`), colored in bright yellow (`#fbbf24`), and styled with a matching transparent yellow background and border.
