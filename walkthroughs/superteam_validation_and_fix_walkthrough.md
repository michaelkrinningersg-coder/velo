# Walkthrough - Superteam Eligibility & Parameter Verification

We investigated the user's report that in the first 8-stage race (Santos Tour Down Under) with the last two stages being `High_Mountain`, the Superteam did not trigger after running it twice.

---

## 1. Analysis & Verification

Using an active savegame (`a_1781271884931.db`) which was captured during the Santos Tour Down Under, we simulated the candidate team selection logic for **Stage 7** and **Stage 8** (both `High_Mountain` stages):

- **GC Standings Check:** The top 10 GC riders were correctly retrieved, including GC leaders like Richard Carapaz, Simon Yates, Ben O'Connor, Egan Bernal, etc.
- **Rider Roles Check:** Their roles were correctly resolved in the DB as `Kapitaen`, `Co-Kapitaen`, and `Edelhelfer` (normalized correctly in the code).
- **Candidate Team Selection Output:**
  - Stage 7: `[ 25, 7, 2, 16, 24 ]` (5 unique candidate teams matching the Captain/Co-Captain GC top 10 criteria).
  - Stage 8: `[ 25, 7, 2, 16, 24 ]` (5 unique candidate teams).

### Why didn't it trigger?
1. **Eligibility Rules:** Per requirements, the Superteam is only eligible from **Stage 4 onwards** and on **difficult profiles** (`Hilly_Difficult`, `Medium_Mountain`, `Mountain`, `High_Mountain`). In the Santos Tour Down Under, the stages are:
   - Stage 1: TTT (not eligible)
   - Stage 2: High_Mountain (stage number < 4, not eligible)
   - Stage 3-4: Rolling (not difficult profile, not eligible)
   - Stage 5: ITT (not eligible)
   - Stage 6: Rolling (not eligible)
   - **Stage 7: High_Mountain (eligible, 50% Auslösechance)**
   - **Stage 8: High_Mountain (eligible, 50% Auslösechance)**
   
   Thus, in each full playthrough of this 8-stage race, there are only **2 stages** eligible for the Superteam.
2. **Probability Math:** With a 50% chance per eligible stage, the probability of *not* triggering on both Stage 7 and 8 is `0.5 * 0.5 = 25%`. Across **two runs** (4 eligible stages total), the probability of not triggering at all purely by random chance is `0.5^4 = 6.25%`. This is statistically low but entirely possible.

---

## 2. Parameter Correction & Constructor timing bugfix

During analysis of why the instant simulation crashed on the 4th stage, we uncovered and fixed two critical bugs:

### Bug A: Omitted parameter in SimulationEngine
- The `precalculateStageBreakaway` function signature accepts `bootstrap.teams` as its 8th parameter to resolve team names inside candidate logs.
- The invocation in `SimulationEngine.ts` omitted this parameter. We updated the call to pass `bootstrap.teams` correctly.

### Bug B: Constructor Timing Issue (CRITICAL)
- **Problem:** When the 50% roll successfully triggers a Superteam, the engine calls `this.pushMessage(...)` inside the constructor. 
- **Root Cause:** At that point in the constructor execution, `this.riders` has not yet been initialized (its assignment occurs later in the constructor). `pushMessage` internally tries to access `this.riders.filter(...)` to determine the leader distance for the message telemetry, resulting in an immediate crash:
  `can't access property "filter", this.riders is undefined`
- **Solution:** We moved the Superteam initialization and message-logging logic down inside the constructor, so that it executes *after* `this.riders` has been fully populated.

---

## 3. Updated Favorite Formulas for Flat, Rolling, and Hilly Profiles

We modified the favorite score calculation in [stageFavorites.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/stageFavorites.ts) to match the updated requirements:

- **Flat:** Change from `0.8 * sprint + 0.2 * flat` to:
  `0.8 * sprint + 0.15 * acceleration + 0.05 * flat`
- **Rolling:** Change from `0.7 * sprint + 0.2 * flat + 0.1 * hill` to:
  `0.7 * sprint + 0.2 * acceleration + 0.1 * hill`
- **Hilly:** Change from `0.4 * sprint + 0.2 * flat + 0.4 * hill` to:
  `0.45 * sprint + 0.1 * flat + 0.45 * hill`

---

## 4. Compilation & Build

We successfully ran the project build to verify there are no compilation or type check issues:
- Backend: Compiled cleanly via `tsc`.
- Frontend: Bundled cleanly via `vite build`.
