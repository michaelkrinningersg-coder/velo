# Walkthrough - Most Active Rider Standings, Leadout Leaderboard Details & Stage Status Dots

We have successfully implemented the requested features:

## 1. Most Active Rider (Ausreißerkönig) Standings
- **Results Standings Tab**:
  - Registered breakaway classification inside `RESULT_TYPE_IDS` (type `7`) and added the new `Aktivste Fahrer` standings tab in the results view (`results.ts`).
  - Implemented logic in `StageResultCommitService` to calculate cumulative breakaway kilometers, assign rankings, and commit breakaway results to the SQLite database.
  - Implemented the priority-based worn jersey hierarchy logic (`yellow` > `green` > `red` > `white` > `purple`) where classifications are assigned in sequence and secondary jerseys pass down to the runner-ups.
- **Jersey Dot & Career Badges**:
  - Added purple jersey leader dots (`.jersey-dot-purple`) to standings tables.
  - Tracked breakaway wins (`breakawayWins`) and jersey leadership days (`breakawayJerseys`) in rider/team career stats.
  - Rendered career badges in `RiderStatsView` and `TeamStatsView` with a premium purple gradient for wins and a purple border for leadership days.

## 2. Highest Leadout Bonus Leaderboard Details
- Enhanced rider and team "Highest Leadout Bonus" queries in `LeaderboardRepository.ts` to `LEFT JOIN` `races` and `stages` to fetch `season`, `race_name`, and `stage_number`.
- Modified the frontend `leaderboards.ts` to render an extra column `"Rennen / Etappe / Jahr"` detailing the exact race, stage, and season/year where the record leadout bonus was achieved.

## 3. Stage Events & Jersey Overlays
- **Database Storage**:
  - Configured schema check constraints in `DatabaseService.ts` for `breakaway_kms`, `event_ids`, and `jerseys_worn` columns on the `results` table.
  - Serialized stage incidents and events during simulation in `StageResultCommitService.ts` as a string (`1:2|3:1`) mapped to the stage results.
  - Standardized the 9 event types: Sturz (1), Defekt (2), Superform (3), Supermalus (4), Attacken (5), Konterattacken (6), Heimvorteil (7), Superheimvorteil (8), Heimdruck (9).
- **Status Dots Column**:
  - Implemented the `renderStatusDotsColumn` helper function in `riderStats.ts` (shared with `teamStats.ts`).
  - Added a new `"Status"` column right after `"Rennen / Etappe"` in both Seasons results and Top-results tables of `RiderStatsView` and `TeamStatsView`.
  - Displayed events and jerseys as small colored status dots featuring a glassmorphic hover tooltip detailing the event names, counts, and worn jerseys.

---

## Technical Highlights & Verification

### 1. Types & Database Mappings
Updated `shared/types.ts` to include breakaway wins/jerseys and status fields:
```typescript
export interface TeamStatsTopResult {
  ...
  eventIds?: string | null;
  jerseysWorn?: string | null;
}
```

Updated the SQLite query in `TeamRepository.ts` to select event/jersey columns for top results:
```sql
LEFT JOIN results ON results.stage_id = spe.stage_id 
                 AND results.rider_id = spe.rider_id 
                 AND results.result_type_id = 1
```

### 2. Glassmorphic CSS Styling
Added class styles for the status dots, worn jerseys, and tooltip:
```css
.status-tooltip {
  position: absolute;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(10px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  ...
}
```

### 3. Compilation & Build Verification
- Verified backend TypeScript compilation: compiled successfully with **no errors**.
- Verified frontend TypeScript compilation: compiled successfully with **no errors**.
- Compiled and verified production bundling via Vite: completed successfully.
