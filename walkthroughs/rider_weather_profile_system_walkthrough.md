# Walkthrough - Rider Weather Profile System

This walkthrough summarizes the completed changes to integrate the career-fixed weather preference/malus profile system for riders in Velo.

## Changes Made

### 1. Shared Definitions and Typings
- Modified [types.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/shared/types.ts):
  - Added `weatherProfileId` to the `Rider` and `RiderStatsPayload` interfaces.
  - Added `lieutenants` field to the `RealtimeSimulationBootstrap` payload to transfer leader-lieutenant pairings to the frontend simulation engine.

### 2. Database Schema, Migration, and Seeding
- Modified [schema.sql](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/assets/schema.sql):
  - Updated the `riders` table schema to include `weather_profile_id` (between 1 and 7, default 1).
- Modified [DatabaseService.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/DatabaseService.ts):
  - Added automatic migration checking for the `weather_profile_id` column.
  - Existing savegame databases are migrated by backfilling riders with a random weather profile from 1 to 7 using SQLite's `(ABS(RANDOM()) % 7) + 1`.
- Modified [bootstrapper.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/bootstrapper.ts):
  - Updated the initial rider seed routine to assign a random `weather_profile_id` between 1 and 7.
- Modified [RiderNewgenService.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/game/RiderNewgenService.ts):
  - Configured year-start newgen creation to roll a random career-fixed weather profile (1 to 7) for all generated riders.

### 3. Backend Mappers & APIs
- Modified [mappers.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/mappers.ts):
  - Added mapping for `weather_profile_id` -> `weatherProfileId` inside `RiderRow` mapping functions.
- Modified [RiderRepository.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/db/repositories/RiderRepository.ts):
  - Added `weatherProfileId` mapping in stats payload queries.
- Modified [api.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/backend/src/routes/api.ts):
  - Queried active season leader-lieutenant pairings from `rider_lieutenants` table and exposed them under `lieutenants` in the realtime simulation bootstrap payload.

### 4. Race Simulation Modifiers
- Modified [SimulationEngine.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/frontend/src/race-sim/SimulationEngine.ts):
  - Defined the 7 weather profiles containing preferences, maluses, and neutral conditions.
  - Implemented dynamic skill modification based on rolled weather for flat, mountain, stamina, bikeHandling, recuperation, and downhill skills:
    - **Preference**: each skill gets independent random boost from `+0.2` to `+1.0`.
    - **Malus**: each skill gets independent random penalty from `-0.2` to `-1.0`.
    - **Lieutenant Mitigation**: if the rider's starting lieutenant has the active weather as a preference, the malus is reduced by a random `40% to 75%`.
- Modified [incidents.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/frontend/src/race-sim/incidents.ts):
  - Halved crash and mechanical failure chances (reduces chance by 50%) for starting riders whose weather preference matches the stage's rolled weather.

### 5. Frontend UI
- Modified [riderStats.ts](file:///c:/Users/micha/OneDrive/Desktop/velo-1/frontend/src/views/riderStats.ts):
  - Rendered the two weather preference SVG icons in the rider stats header alongside specialization pills.
  - Displayed a generic weather icon `🌤️` prefix next to the weather icons, with maluses kept hidden as requested.

---

## Verification & Testing

### Type-Checking & Builds
- Run `npm --prefix backend run build`: Compiled successfully.
- Run `.\frontend\node_modules\.bin\tsc --project frontend/tsconfig.json --noEmit`: Compiled with no type errors.

### Manual Verification Path
1. **Load/Save & DB Migration**:
   - Starting/loading the game will auto-migrate the database. The `ensureRiderWeatherProfileSchema` check will execute and backfill a random profile from 1 to 7 for all existing riders in the database.
2. **Rider Stats Header Icons**:
   - Opening the rider statistics view shows the weather preference pill (e.g. `🌤️ [Icon1] [Icon2]`) next to their specializations in the header column.
3. **Simulation Modifiers**:
   - Running stage simulations dynamically applies skill modifications based on rolled weather and lieutenant pairings.
   - Reduced crash and mechanical rates (halved) will apply for riders riding in their preferred weather conditions.
