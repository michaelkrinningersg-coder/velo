# Walkthrough - Sprint Leadout Tiebreak Feature

We have implemented a sprint leadout tie-break bonus at the end of flat (`finish_flat`) and hilly (`finish_hill`) stages. This bonus is awarded to the rider with the best base score of each team in the current race based on the presence of supportive teammates with strong sprint skills, simulating leadout support.

## Changes Made

### Frontend - Simulation Engine
- **RiderState Extended**: Added `leadoutBonus?: number` to track the applied bonus for each rider during the simulation.
- **Team-specific Random Multiplier**: Added `teamSprintRandomValues` map to `SimulationEngine` to generate and cache a team-specific random multiplier $X \in [0.25, 0.6]$ rolled once per team.
- **Leadout Bonus Calculation**: Implemented `calculateSprintLeadoutBonus(rider)`:
  - Determines if the stage finish type is `'finish_flat'` or `'finish_hill'`.
  - Determines the team's best sprinter among the starting participants of the current race as the rider with the highest base score (`calculatePhotoFinishScore` which represents skill/form score, breaking ties deterministically by rider ID).
  - Checks if this rider has base Sprint Skill > 73.
  - Counts the other teammates who have Sprint Skill $\ge 72$ and whose status is not DNF, OTL, or DNS.
  - Multiplies the teammates count by the team's random multiplier.
- **Tiebreak Application**: Added both the specialization tie-break adjustment and the new leadout bonus to `rider.photoFinishScore` when crossing the finish line.
- **Console Log Updates**: Updated `logFinishSprintTieBreakIfNeeded` console logger to print the clear breakdown of the calculations showing the score before and after adjustments:
  - Format: `Score (ohne Boni): ${skillScore.toFixed(2)} -> Score (mit Boni): ${rider.photoFinishScore.toFixed(2)} [SpecAdj: ${specAdj > 0 ? '+' : ''}${specAdj.toFixed(2)}, Leadout: +${leadoutBonus.toFixed(2)}]`

## Verification Results

### Git Diff Check
The changes have been reviewed and verified for correctness. The logic is fully self-contained in `SimulationEngine.ts`.
