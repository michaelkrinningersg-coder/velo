# Walkthrough - Custom Substep Size for Instant Simulation

We have implemented support for custom, configurable substep sizes in the `SimulationEngine` and configured instant (headless) simulations to run with 3-second substeps instead of the default 1-second substeps.

## Feature Overview

- **Custom Substeps**: Added a `maxSubstepSeconds` option to the `SimulationEngine` constructor. This configures the maximum duration of a single substep (defaulting to `1` second to preserve normal live UI simulation speed and physics resolution).
- **Faster Instant Simulation**: Configured instant simulations in `runInstantSimulation.ts` to run with a 3-second substep interval, reducing the main loop iterations by 3x and significantly improving simulation performance.
- **Isolate Live Simulation**: The standard live UI race view continues to use the default 1-second substep interval to maintain visual animation smoothness.

---

## Changes Made

### 1. Frontend Simulation Engine
In [SimulationEngine.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/SimulationEngine.ts):
- Added the `maxSubstepSeconds` private field to the `SimulationEngine` class.
- Updated the constructor to accept an optional `options` parameter with `maxSubstepSeconds`.
- Updated the `step` method to use `this.maxSubstepSeconds` instead of the static `MAX_SUBSTEP_SECONDS` constant when chunking the remaining seconds.

### 2. Instant Simulation Config
In [runInstantSimulation.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/race-sim/runInstantSimulation.ts):
- Updated the instantiation of `SimulationEngine` to pass `{ maxSubstepSeconds: 3 }` options.

---

## Verification & Build Results

### Compilation Checks
- Verified that the entire frontend compiles cleanly with TypeScript:
  `& "C:\Users\mkrinninger\AppData\Local\ms-playwright-go\1.57.0\node.exe" "frontend/node_modules/typescript/bin/tsc" --project tsconfig.json` -> Compiled successfully with 0 errors.

### Production Build
- Successfully rebuilt frontend optimized production assets via Vite:
  `& "C:\Users\mkrinninger\AppData\Local\ms-playwright-go\1.57.0\node.exe" "frontend/node_modules/vite/bin/vite.js" build`
