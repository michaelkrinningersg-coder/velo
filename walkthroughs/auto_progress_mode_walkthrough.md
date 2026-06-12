# Walkthrough: Auto Progress Mode

This walkthrough documents the implementation of the **Auto Progress Mode**, which automates pending stage simulations and day progression in Velo until stopped via the Spacebar.

## Changes Made

### 1. User Interface
In [index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html):
- Added the `<button class="btn btn-secondary" id="btn-auto-progress">Auto Progress</button>` button next to the "Nächster Tag" button.
- Styled the `.game-state-actions` container to have a gap of `0.5rem` between the buttons.

### 2. State Management
In [state.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/state.ts):
- Added the global `autoProgressActive` boolean state and `setAutoProgressActive` function.
- Updated `showLoading` and `updateInstantProgress` to append ` (Leertaste zum Stoppen)` to the loader texts when `autoProgressActive` is true. This ensures the user is aware of how to stop the process.

### 3. Simulation Flow
In [liveRace.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/liveRace.ts):
- Modified `openInstantStage` to return `Promise<boolean>` (resolves to `true` on success, `false` on error/abort).
- Added the optional `skipViewActivation` parameter to both `openInstantStage` and `completeRealtimeStage` to allow the loop to run background simulations without repeatedly redirecting the active view to the Results page.

### 4. Progress Logic & Event Listeners
In [dashboard.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/dashboard.ts):
- Refactored `btn-advance-day` click event handler to call a unified `executeDayAdvance()` function.
- Implemented `toggleAutoProgress()`, `startAutoProgress()`, `stopAutoProgress()`, and `updateAutoProgressUI()`.
- Implemented `runAutoProgressLoop()`:
  - While `autoProgressActive` is true, checks for pending stages.
  - If a stage is pending, simulates the first one in the list via `openInstantStage(stageId, true)`.
  - If no stages are pending, advances the day via `executeDayAdvance()`.
  - Stoppage of the loop is robustly handled; if any simulation/advance fails or returns `false`, `autoProgressActive` is set to `false` and the loop exits.
- Registered a window keydown listener on the `Space` key that terminates the auto progress if active. Inputs/textareas are bypassed to ensure typing does not trigger stopping.
- Registered click listener on the `btn-auto-progress` button.

---

## Verification Plan

### Manual Verification Steps
1. Run the local server using your standard launcher (e.g., `npm run dev` in the root).
2. Open the application in your browser (`http://localhost:5173`).
3. Click on a save game or start a new career.
4. Verify the **Auto Progress** button is visible next to **Nächster Tag** in the top bar.
5. Click **Auto Progress**:
   - Verify that the simulation loader appears and says `Instant-Simulation läuft … XX% (Leertaste zum Stoppen)`.
   - Verify that you remain on the Dashboard view when the simulation completes.
   - Verify that the next stage immediately starts simulating.
   - Verify that when all stages of the day are simulated, the day advances automatically (shows `Tag wird fortgeschrieben... (Leertaste zum Stoppen)`).
6. Press the **Spacebar**:
   - Verify that the current stage finishes simulating (or the current day change finishes), and then the loop stops.
   - Verify that the button switches back from `Stoppen (Leertaste)` to `Auto Progress`.
7. Verify that you can click **Auto Progress** again to resume.
