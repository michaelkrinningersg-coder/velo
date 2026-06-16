# Walkthrough - Stage Editor Auto CSV Update & ID Validation

This walkthrough summarizes the changes implemented to automate CSV file updates during Stage Export and add ID validation/skipping.

## Changes Completed

### 1. Backend (`backend/src/simulation/RouteImporter.ts` & `backend/src/routes/api.ts`)
- **API Endpoints**: Added endpoints `/api/stage-editor/countries`, `/api/stage-editor/race-categories`, and `/api/stage-editor/race-programs` to read data from CSV sources (`sta_country.csv`, `race_categories.csv`, and `race_programs.csv`) and return them to the frontend.
- **Weather Formatting**: Modified `buildStagesCsv()` to ensure the `allowed_weather` column is strictly wrapped in double quotes (e.g. `"1|3"`).
- **Auto-Updates**:
  - `updateStagesCsv()`: Automatically updates or appends the metadata row in `data/csv/stages.csv` on export.
  - `updateRacesCsv()`: Conditionally updates or appends race details in `data/csv/races.csv` on export if "Neues Rennen anlegen" is active.
  - `updateRaceProgramRacesCsv()`: Conditionally updates mapping rows in `data/csv/race_program_races.csv` for the selected programs, filtering existing mapping entries for the given `raceId` and rebuilding the list with sequential IDs (1 to N).
- **Detail Save**: Automatically writes the detailed CSV file directly to the server's `data/stages/` folder on export.

### 2. Frontend (`frontend/src/views/stageEditor.ts`, `frontend/src/api.ts`, `frontend/src/state.ts`, `frontend/index.html`)
- **Dropdown Profile Selection**: Modified the summary card display to dynamically show the profile currently selected in the "Profil" dropdown instead of the suggested one calculated during import. The exported CSV and `stages.csv` files will use the user-selected classification.
- **Dynamic Selectors**: Populated the countries and categories dropdown selectors dynamically from the backend list.
- **Race Details Toggle**: Added a checkbox `stage-editor-new-race-checkbox` to show/hide the new race details panel. Checking this checkbox automatically checks and displays the program selector panel.
- **Program Multi-Select Dropdown**: Added a checkbox `stage-editor-program-checkbox` to show/hide the custom program selector dropdown menu. The list of programs is loaded dynamically, and checks/unchecks are displayed dynamically in a custom multi-select selector.
- **ID Skipping & Arrow/Spinner Hook**:
  - Added listeners to `input` event on the Stage-ID and Race-ID fields.
  - Using an `isTyping` flag to track keyboard digits vs arrow keys/native input spinners, the field values automatically skip already occupied IDs in that direction (i.e. incrementing/decrementing sequentially until a free ID is found).
- **Metadata Errors & Validation**:
  - Added verification to block exports if the entered Stage-ID already exists in `stages.csv`.
  - Added verification to block exports if "Neues Rennen" is active and the entered Race-ID already exists in `races.csv` or `stages.csv`.
  - Added verification to block exports if "Neues Rennen" is NOT active and the entered Race-ID does NOT exist.
  - Validates race details and requires at least one program selection if the corresponding checkboxes are checked.
- **Post-Export Auto-Increment & Reload**:
  - Reloads existing stages lists from the backend dynamically.
  - Automatically increments the Stage-ID to the next free ID (which automatically skips the newly exported stage).
  - Automatically increments the Stage Number by 1.
  - Automatically increments the Date by 1 day.
  - Keeps the Race-ID unchanged so consecutive stages for the same race can be edited.
  - Unchecks the "Neues Rennen" checkbox and hides the corresponding forms.

---

## Verification Results

### Automated Verification
Run compilation test to verify frontend and backend TypeScript compilation:
```powershell
$env:PATH="C:\Users\mkrinninger\node;" + $env:PATH; C:\Users\mkrinninger\node\npm.cmd run build
```
**Result**: Build succeeded with exit code 0. Both layers compiled successfully.

---

## Manual Verification Steps
1. Navigate to the **Stage Editor** view in the browser.
2. Verify that **Land** and **Kategorie** dropdown lists are fully populated.
3. Check the **Neues Rennen anlegen / aktualisieren (races.csv)** checkbox:
   - The race details fields should appear.
   - The **Programme definieren (race_program_races.csv)** checkbox should be checked automatically, showing the program selection dropdown.
4. Click on **Zugeordnete Programme** dropdown, check multiple programs, click **OK**, and verify that the selection is correctly formatted in the trigger button.
5. In the Stage-ID and Race-ID inputs:
   - Try using keyboard Arrow Up/Down or click the spinner arrows. Observe that occupied IDs (e.g. existing stage/race IDs) are automatically skipped.
   - Try typing an occupied ID manually. Click export, and verify that the validation error blocks the export with a detailed alert.
6. Select a stage classification (e.g., `Rolling`) from the dropdown menu, and check that it updates immediately in the summary block above.
7. Provide valid inputs and click **CSV-Export**:
   - Check that the new stage is automatically saved in `data/stages/` and appended/updated in `data/csv/stages.csv`.
   - Verify that weather IDs are double-quoted in `stages.csv`.
   - Verify that the profile column contains your chosen value (e.g. `Rolling`).
   - Check that `data/csv/races.csv` has the new race row.
   - Check that `data/csv/race_program_races.csv` has the new program mapping rows.
   - Verify that on the page, the Stage-ID is incremented to the next free ID, Stage Number is incremented by 1, Date is incremented by 1 day, Race-ID is unchanged, and checkboxes are reset.
