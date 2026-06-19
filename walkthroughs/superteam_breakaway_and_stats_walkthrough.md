# Walkthrough - Superteam Selection, Role fallbacks, and Stats/UI Integrations

We have successfully integrated the **Superteam** (Captain Support) gameplay mechanics with role fallback logic, breakaway exclusions, career/season statistics, leaderboards, event subtabs, and UI indicators.

## Core Features & Fallbacks Checked

1. **Candidate Team Selection Rules:**
   - Teams are only eligible if they have a Captain (Kapitän) or Co-Captain who is in the Top 10 GC and under the top 20 stage favorites.
   - If no team matches this criteria, we fallback/expand to checking for teams with an Edelhelfer (Lieutenant) in the Top 10 GC and top 20 stage favorites.
   - This prevents selecting any team that lacks high-ranking GC/favorite leaders.

2. **Team Leader Protection (Breakaway & Modifiers):**
   - If the selected team has neither Captain nor Co-Captain starting/active in the race, we fallback to designating their best Edelhelfer (highest overall rating) as the protected leader.
   - The protected leader is strictly prevented from:
     - Entering early breakaways.
     - Receiving the helper bonus (random +2 to +6) and subsequent malus (random -4 to -8, determined individually per rider).
   - This ensures the helper bonus/malus is reserved strictly for support riders, while the designated team leader is kept safe in the peloton.

3. **Superteam Breakaway Rider & Caught Behavior:**
   - The rider who goes into the breakaway for the Superteam initially receives no Superteam bonus/malus, only the normal breakaway bonus.
   - We continuously check when this rider is caught by the team's protected leader (captain/co-captain) who triggers the Superteam.
   - From the moment he is caught:
     - The breakaway malus is removed/ignored.
     - The rider receives the Superteam skill bonus (+2 to +6) immediately.
   - At the end of the stage (past `superTeamEndPercent`), the rider collapses and receives the Superteam malus (-4 to -8, determined individually) just like the other team support riders.

---

## Detailed Changes Made

### 1. Frontend Integration & Snapshot Passing
In [liveRace.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/liveRace.ts):
- Updated the `completeRealtimeStage` function signature and callers to pass `snapshot.superTeamId` under the commit request payload, allowing the backend to properly associate the stage's Superteam.

### 2. Frontend Views & Statistics Panels
- In [riderStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/riderStats.ts):
  - Modified `renderStatusDotsColumn` to draw an Indigo status dot (`.status-dot-superteam`) with the tooltip "Superteam-Teilnahme" if `row.superTeamId === row.teamId`.
  - Added the **Superteam** career stats card inside the grid under the "Karrierestatistiken" tab showing `stats.superteamCount`.
- In [teamStats.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/teamStats.ts):
  - Added the **Superteam** career stats card in the success stats grid showing the seasonal and all-time `stats.superteamCount` counts for the team.

### 3. Events subtab & Jersey Rendering
In [results.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/results.ts):
- Added a dedicated **Superteam** filter subtab under Results -> Ereignisse.
- When filtering by Superteam, rendered the team's jersey, a direct link to the team page as the main participant, and the custom event messages.
- Generated the new `event-badge-superteam` badge styling for all superteam rows.

### 4. Leaderboard Metric Option
In [index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html):
- Inserted `<option value="superteam_count">Superteambonus</option>` directly below the "Höchster Leadout-Bonus" choice inside the "Action & Taktik" dropdown.

### 5. Custom Styling
In [main.css](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/main.css):
- Defined the styling rules for `.status-dot-superteam` using a vibrant indigo background (`#6366f1`) and soft shadow.
- Defined the styling rules for `.event-badge-superteam` with custom background opacity, border, and indigo coloring.

### 6. Simulation Engine & Breakaway Caught Logic
In [SimulationEngine.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/SimulationEngine.ts):
- Added `superTeamBreakawayRiderId` and `superTeamBreakawayRiderCaught` state variables to track the breakaway rider of the Superteam and whether they have been caught by the team leader.
- Implemented caught-detection in `advanceSubstep`: if an active protected leader has traveled at least the distance of the breakaway rider, `superTeamBreakawayRiderCaught` becomes true, a live race message is pushed, and their `breakawayMalus` is cleared.
- Excluded the breakaway rider from the Superteam skills modification block initially. Once caught, we apply the Superteam bonus immediately, and transition to the individual Superteam malus once they exceed `superTeamEndPercent`.
- Enforced `breakawayMalus = 0` continuously once caught to ensure no breakaway-specific exhaustion penalty applies to them in the final phase.
- Added a safety check (`rider.superTeamActiveLogged`) for applying the Superteam malus: only riders who actually received the bonus earlier in the stage are subjected to the malus. Protected leaders (Captains/Co-Captains) and delayed riders who never received the bonus are completely excluded from the malus.
- Adjusted the global `superTeamEndPercent` range to be **86% to 96%** of the stage distance.
- Implemented **individual malus values**: each helper has a randomized malus between **-4 and -8** (`rider.superTeamMalusAmount`), rolled dynamically on-demand when they first transition to the exhaustion phase.

---

## Verification Summary

- Checked candidate team filtering: Step A first filters for Captains/Co-Captains meeting the GC and favorite criteria, and falls back to Step B (Edelhelfers) if empty.
- Checked protected leader identification: Fallback logic successfully resolves the best Edelhelfer if no Captain/Co-Captain is present.
- Checked breakaway eligible list: Protected leader (whether captain, co-captain, or edelhelfer) returns `false` when checked against `protectedLeaderIds.has(rider.id)`.
- Checked modifier mutation: `!this.superTeamProtectedLeaderIds.has(rider.rider.id)` prevents protected leaders from being subjected to skill shifts.
- Verified that the Superteam breakaway rider initially gets no Superteam bonus, receives the bonus immediately upon being caught by the leader (with breakaway malus cleared), and fades with the Superteam malus at the end of the stage.
- Verified that the Superteam malus is strictly restricted to riders who previously received the bonus (checked via `superTeamActiveLogged`).
- Verified that the `superTeamEndPercent` is within the **86% to 96%** range and that each rider receives an **individually rolled malus between -4 and -8** upon exhaustion.
- Compiled frontend views and backend types successfully.
