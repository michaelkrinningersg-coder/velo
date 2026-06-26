# Plan - Regional Race Program Splits & UI Filters

This document stores the proposed plan to split program combinations into 4 regional groups (BeNeLUX, FraGer, EspSlo, ITAUSA), update database schemas and CSV reference files, and add interactive filters to the race program UI tabs.

## Analysis of thresholds for splitting combinations (based on active riders in 2026):
- **Threshold > 30 (or > 33):**
  - **Combos affected (10):** `SPH` (99), `AOO` (96), `OOO` (67), `HBS` (66), `BHT` (61), `PSH` (50), `HBP` (43), `BHP` (43), `HSP` (38), `SHP` (36)
  - **New programs created:** 10 × 24 = **240 new programs**.
- **Threshold > 40:**
  - **Combos affected (8):** `SPH` (99), `AOO` (96), `OOO` (67), `HBS` (66), `BHT` (61), `PSH` (50), `HBP` (43), `BHP` (43)
  - **New programs created:** 8 × 24 = **192 new programs**.
- **Threshold > 56:**
  - **Combos affected (5):** `SPH` (99), `AOO` (96), `OOO` (67), `HBS` (66), `BHT` (61)
  - **New programs created:** 5 × 24 = **120 new programs**.

## Proposed Changes

### 1. Database Schema & CSV Configuration
- **program_groups.csv [NEW]:**
  - Defines the 4 regional groups.
- **country.csv:**
  - Add `program_group_id` column to map countries to group IDs.
- **race_programs.csv & race_program_races.csv:**
  - Add the regional variants and copy the mappings of their parent standard program.
- **schema.sql:**
  - Add `program_groups` table and update `sta_country` with `program_group_id`.

### 2. Backend Services
- **bootstrapper.ts:**
  - Seed `program_groups` and populate `program_group_id` in `sta_country`.
- **DatabaseService.ts:**
  - Automatic migration for existing savegames to keep them backward-compatible.
- **RiderProgramService.ts:**
  - Instead of dynamically rebuilding programs, it checks if a regional program name (e.g. `SHP_BeNeLUX_1`) exists in the database.
  - If it exists, riders are grouped by region and assigned.
  - If not, they fallback to standard programs (e.g. `SHP_1`).

### 3. Frontend UI
- **racePrograms.ts:**
  - Add origin selection filter checkboxes (BeNeLUX, FraGer, EspSlo, ITAUSA) at the top of all tabs (using a shared `filterOrigins` state) and inside the popovers.
  - Filter calendars, programs, and popover assignment lists based on checked origins.
