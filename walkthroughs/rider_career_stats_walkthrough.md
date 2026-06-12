# Walkthrough - Rider Career Statistics & Sprint Leadout Upgrades

We have successfully implemented the requested enhancements:

## Implementation Details

### 1. Database & Backend Stats Retrieval (`RiderRepository.ts`)
- Added SQL queries to aggregate rider non-finisher counts from the `stage_entries` table:
  - **DNS (Did Not Start)**: Count of entries with status `'dns'`.
  - **DNF (Did Not Finish)**: Count of entries with status `'dnf'` where `status_reason` does not start with `'OTL '`.
  - **OTL (Over Time Limit)**: Count of entries with status `'dnf'` where `status_reason` starts with `'OTL '`.
- Included these fields (`dnsCount`, `dnfCount`, `otlCount`) in the aggregated `RiderCareerStats` payload sent to the frontend.

### 2. Tab-Specific Dialog Width Scaling (`riderStats.ts`)
- Implemented `updateRiderStatsModalWidth()` to dynamically check the current tab:
  - When switching to the `"career"` (Karrierestatistiken) tab, the dialog modal card's `min-width` is set to `min(1080px, 95vw)` and `max-width` is set to `1300px` (20% width increase).
  - When switching to any other tab, the custom modal dimensions are cleared.
- Hooked this up dynamically during modal initialization and tab navigation.

### 3. Wrap-Prevention for Race Category Badges (`riderStats.ts`)
- Updated `renderRiderStatsRaceBadge` and `renderRiderStatsCategoryBadge` to output spans with style `white-space: nowrap; display: inline-block;`. This prevents race category badges from wrapping into multiple lines.

### 4. Summary & Health Tracking Cards (`riderStats.ts`)
- Inserted **Siege** (All-time victories) and **Renntage** (sum of days over all seasons) before **Ausreißversuche** at the top of the tab.
- Added summary cards for **DNS**, **DNF**, and **OTL**.
- Added split two-line counters for **Krankheiten** (Illnesses) and **Verletzungen** (Injuries), showing the number of occurrences on the first line and the duration (Tage) on the second line.

### 5. Category Details Enhancements (`riderStats.ts`)
- Displayed the all-time **Top 10** finishes (Bronze badge) for both:
  - **One-Day Races** (alongside wins and podiums).
  - **Stage Race Stages** (alongside stage wins and stage podiums).
- Displayed the **Renntage** count for each specific race category in the bottom-right corner of its card, styled with a calendar icon and colored count.

### 6. Team Leadout Sprint Restriction (`SimulationEngine.ts`)
- Enforced that only the strongest sprinter in the team (determined by the highest pre-adjustment photo finish score) is eligible for a leadout bonus.
- Any other teammate sprinters with Sprint Skill >= 74 will receive a leadout bonus of `0` to prevent multiple riders from the same team from receiving leadout bonuses simultaneously.

### 7. Exclusive Rank Counts in Career Statistics (`RiderRepository.ts`)
- Implemented mutually exclusive rank counts:
  - **Wins (Gold)**: `rank === 1`
  - **Podiums (Silver)**: `rank > 1 && rank <= 3` (excludes wins)
  - **Top 10 (Bronze)**: `rank > 3 && rank <= 10` (excludes podiums and wins)
- Applies to Stage results, One-Day results, and overall GC results.

---

## Verification
- Code successfully structures and aggregates stats dynamically from the database.
- Front-end correctly renders the responsive grid and properly formats card content into multi-line layouts as requested.
- Dynamic modal scaling transitions smoothly when navigating between stats tabs.
- Simulating races confirms that only the strongest team sprinter receives the teammate leadout bonus.
- Verified that podiums (Silver badge) do not count wins, and Top 10s (Bronze badge) do not count podiums/wins.
