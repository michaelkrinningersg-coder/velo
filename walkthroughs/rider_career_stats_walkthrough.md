# Walkthrough - Rider Career Statistics & Live Top Results Filtering

We have successfully implemented the requested features:

1. **Live Checkbox Filtering in Top-Results Tab**:
   - Added six premium checkboxes next to the Season filter dropdown in the `Top - Results` tab of the `RiderStatsView`:
     - **nur GC** (filters for GC standings `gc_final`)
     - **nur Bergwertung** (filters for mountain classification `mountain_final`)
     - **nur Punktewertung** (filters for points classification `points_final`)
     - **nur Nachwuchs** (filters for youth classification `youth_final`)
     - **One Day Races** (filters for one-day race results)
     - **Etappenwertungen** (filters for individual stage results in stage races)
   - Checking/unchecking options triggers real-time filtering in the UI immediately without reloading the page.
   - Kept all sorting and pagination logic completely intact.

2. **Persistent Career Statistics ("Karrierestatistiken" Tab)**:
   - Added a new tab `"Karrierestatistiken"` to the `RiderStatsView`.
   - Displays all-time stats that are never reset:
     - **Ausreißversuche** (Breakaway attempts)
     - **Attacken** (Attacks)
     - **Konterattacken** (Counter-attacks)
     - **Stürze** (Crashes)
     - **Defekte** (Mechanical defects)
   - Groups victories and podiums by race category (Rennklasse), styled with premium badges following exact colors:
     - **Points Jersey**: Green
     - **Mountain Jersey**: Red
     - **Youth Jersey**: White
     - **GC Positions / Wins**: Sieg (Gold), Podium (Silver), Top Ten (Bronze).
     - **Zero Counts**: Faded/transparent styling to maintain clean UI legibility.
   - Stage races display achievements in a two-line layout:
     - *Line 1*: GC wins, GC podiums, GC Top Tens, and classification jersey wins.
     - *Line 2*: Stage wins and stage podiums.
   - One-day races display wins and podiums in a single line.

3. **Database Schema & Real-Time Logging**:
   - Created the database table `rider_career_stats` to persistently track all-time counts.
   - In `StageResultCommitService`, during the SQLite stage simulation commit transaction, computed and incremented each rider's breakaway attempts, end-stage attacks, counter-attacks, crashes, and mechanical defects.
   - In `RiderRepository`, queried `rider_career_stats` and aggregated `results` to build the full `careerStats` payload for the frontend.

---

## Technical Implementations

### 1. Database Table
Table created via `DatabaseService.ts`:
```sql
CREATE TABLE IF NOT EXISTS rider_career_stats (
  rider_id INTEGER PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
  breakaway_attempts INTEGER NOT NULL DEFAULT 0,
  attacks INTEGER NOT NULL DEFAULT 0,
  counter_attacks INTEGER NOT NULL DEFAULT 0,
  crashes INTEGER NOT NULL DEFAULT 0,
  defects INTEGER NOT NULL DEFAULT 0
);
```

### 2. Stats Aggregation
Aggregated inside the commit transaction block in `StageResultCommitService.ts`:
```typescript
const updateStatsStmt = this.db.prepare(`
  INSERT INTO rider_career_stats (
    rider_id, breakaway_attempts, attacks, counter_attacks, crashes, defects
  ) VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(rider_id) DO UPDATE SET
    breakaway_attempts = breakaway_attempts + excluded.breakaway_attempts,
    attacks = attacks + excluded.attacks,
    counter_attacks = counter_attacks + excluded.counter_attacks,
    crashes = crashes + excluded.crashes,
    defects = defects + excluded.defects
`);
```

### 3. Frontend Filtering
Applied in `renderRiderStatsTopResultsTab()` in `riderStats.ts`:
```typescript
let filteredRows = allRows.filter(r => {
  const isFinalRow = r.rowType !== 'stage_result';
  if (isFinalRow) {
    if (r.rowType === 'gc_final') return state.riderStatsTopResultsFilters.gc;
    if (r.rowType === 'mountain_final') return state.riderStatsTopResultsFilters.mountain;
    if (r.rowType === 'points_final') return state.riderStatsTopResultsFilters.points;
    if (r.rowType === 'youth_final') return state.riderStatsTopResultsFilters.youth;
    return true;
  } else {
    if (r.isStageRace) {
      return state.riderStatsTopResultsFilters.stage;
    } else {
      return state.riderStatsTopResultsFilters.oneDay;
    }
  }
});
```

---

## Verification
- Schema setup and database insertions run automatically and atomically within transactions.
- Checkboxes live-filter top results correctly and reactively.
- Career stats tab updates immediately as simulations finish and values persist across sessions.
