# Walkthrough: Age-Based Fatigue and Resting Recovery Progression

We have implemented age-based modifiers for fatigue build-up during races, and progressive recovery decay bonuses for riders resting for 14 or more consecutive days.

## Changes Made

### Database Schema
- Added `consecutive_non_race_days INTEGER NOT NULL DEFAULT 0` to the `rider_daily_state` table in `backend/assets/schema.sql`.

### Seeding, Selections, and Daily Progression
- **Automatic Migration**: Added checking and dynamic table alteration to add `consecutive_non_race_days` to the SQLite database during startup inside `GameStateService.ts`.
- **Rider Fatigue Build-up (`applyStageFatigue` in `GameStateService.ts`)**:
  - Retrieved `r.birth_year` to calculate the exact rider age for the stage's year.
  - Adjusted short-term and long-term decayable fatigue accumulation:
    - **Aged 30-34**: Decreased by a random `8% to 12%` per stage/race.
    - **Younger than 24**: Increased by `3% +- random 2%` per year under 24.
    - **Younger than 24 (Stage Score > 300)**: Increased by `6% +- random 3%` per year under 24.
- **Daily Decay and Rest Recovery (`advanceRiderDailyStates` in `GameStateService.ts`)**:
  - Tracked `consecutive_non_race_days`: resets to `0` if the rider is scheduled/started on a race day today, otherwise increments by `1`.
  - For riders resting for **14 or more consecutive days**, increased base daily fatigue decay (recovery):
    - **Normal Riders (Age >= 24)**:
      - Short-term: `0.2` + `0.01` per day above 14 (capped at `0.35`).
      - Long-term decayable: `0.015` + `0.001` per day above 14 (capped at `0.02`).
    - **Young Riders (Age < 24)**:
      - Short-term: `(0.3 +- random 0.05)` + `0.01` per day above 14 (capped at `0.45`).
      - Long-term decayable: `(0.02 +- random 0.005)` + `0.001` per day above 14 (capped at `0.025`).
  - Implemented the helper function `roundToThreeDecimals` to retain high precision for long-term resting recovery values.
- **Estimated Recovery UI (`riderStats.ts`)**:
  - Left unchanged, continuing to show estimations based on the standard `0.2` / `0.01` values.
