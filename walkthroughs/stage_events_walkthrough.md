# Walkthrough - Stage Events (Etappenereignisse)

We have successfully implemented the "Ereignisse" (Events) feature, which logs and displays various events during a stage in a dedicated tab on the stage results page.

## Feature Overview

A new **Ereignisse** tab has been added right next to the **OTL/DNF** tab in the stage results view. This tab lists race-day events in chronological order, including:
- **DNS (Did Not Start)**: Registered riders who are injured/ill at the start of the stage (logged at km 0).
- **Superform / Supermalus**: Riders with active daily form spikes (logged at km 0 with green `▲` and red `▼` badges/arrows).
- **Form Peak (Formhöhepunkt)**: Riders reaching their planned season peak (logged at km 0 with a golden `★` star).
- **Breakaway Attempts (Ausreißversuche)**: Pushed individually per rider.
- **Attacks & Counter-Attacks**: Attacks and reacting counter-attacks pointing to who they react to.
- **Mass Crashes (Massensturz)**: Pushed individually for each victim, marked with specific prefixes: `Massensturz (Auslöser)`, `Massensturz (involviert)`, or `Massensturz (Folge)`.

All events are held in a temporary in-memory store in the backend, meaning they are available until the next day transition (Tageswechsel), which resets the store. No database changes were made.

---

## Changes Made

### 1. Shared Types
In [shared/types.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/shared/types.ts):
- Declared `RaceSimMessage` globally. Added `kmMark`, `isMassCrash`, and `isMassCrashTrigger`.
- Added `events?: RaceSimMessage[]` to `RealtimeStageCommitRequest` and `StageResultsPayload`.

### 2. Simulation Engine
In [frontend/src/race-sim/SimulationEngine.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/SimulationEngine.ts):
- Tracked all generated race messages in a list `allEvents` with computed `kmMark` values.
- Logged daily Superform, Supermalus, and Form Peak events at km 0.
- Pushed breakaway and counter-attack messages individually per rider.
- Multiplied mass crash incidents to log individual victim statuses.
- Exposed `allEvents` in `getSnapshot()`.

### 3. State Management & Live Race View
In [frontend/src/views/liveRace.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/liveRace.ts) & [frontend/src/state.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/state.ts):
- Added the `'events'` special view option.
- Captured `snapshot.allEvents` on simulation finish and sent them to the server.

### 4. Backend Route & Commit Service
In [backend/src/routes/api.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/routes/api.ts) & [backend/src/simulation/StageResultCommitService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/simulation/StageResultCommitService.ts):
- Parsed incoming simulation events.
- Queried registered race entries vs actual starters to calculate DNS riders at the start of the stage, converting them into DNS messages.
- Saved combined events in-memory.

### 5. Repository & Game State
In [backend/src/db/repositories/ResultRepository.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/db/repositories/ResultRepository.ts) & [backend/src/game/GameStateService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/game/GameStateService.ts):
- Stored events in a static map `inMemoryStageEvents` keyed by stage ID.
- Appended events to stage results response payload when requested.
- Cleared the store when `advanceDay()` is called.

### 6. Frontend View & Styling
In [frontend/src/views/results.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/results.ts) & [frontend/src/main.css](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/main.css):
- Rendered the **Ereignisse** tab right next to OTL/DNF.
- Designed a 3-column table with fixed widths: **km Marke** (100px), **Fahrer** (240px), and **Ereignis** (auto) to prevent layout shifting.
- Set `table-layout: fixed` on the results table dynamically when the Events tab is open.
- Enforced a single-line, no-wrap styling for the **Fahrer** column (jersey, rider name link, and country flag are displayed inline without wrapping).
- Sorted events chronologically by km mark. For events at km 0, sorted them by type priority:
  1. Superform (`▲ Guten Tag`)
  2. Supermalus (`▼ Schlechten Tag`)
  3. Form Peak (`★ Formhöhepunkt`)
  4. DNS (`nicht am Start`)
  And then alphabetically by rider name within each type.
- Formatted rider names in the **Ereignis** column to include their pre-stage GC ranking in parentheses, e.g., `Quentin Pacher (67.)`.
- Implemented and mapped colored indicator badges:
  - Superform: `▲ Guten Tag` (green badge)
  - Supermalus: `▼ Schlechten Tag` (red/coral badge)
  - Form Peak: `★ Formhöhepunkt` (orange badge)
  - DNS: `DNS` (red badge)
  - DNF & Mass Crashes: `DNF` / `Massensturz` (red badges)
  - Fluchtgruppe: `Fluchtgruppe` (purple/indigo badge for attacks, counter-attacks, and breakaway phase endings)
  - Defekt: `Defekt` (orange badge)
  - Sturz: `Sturz` (red badge)

