# Walkthrough - Season Calendar & Dashboard Upcoming Races Filtering

We have successfully implemented the "Saisonkalender" (Season Calendar) dashboard view and updated the main Dashboard to display upcoming races for the next 7 days, categorizing them into "In Progress" and "Upcoming".

## Changes Made

### 1. Navigation Button & View Layout
- **[index.html](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/index.html)**:
  - Added a "📅 Kalender" button in the sidebar nav directly above "Teams".
  - Created a new view container (`#view-calendar`) layout hosting a split pane:
    - **Left Pane**: Monthly calendar grid layout displaying week rows (Monday-Sunday) and day cells, with today's date highlighted.
    - **Right Pane**: A detailed table list of all season races including Start Date, Format, Location, Category, Participants, Distance, Elevation, and Status.

### 2. View Controllers & Business Logic
- **[state.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/state.ts)**:
  - Registered `'calendar'` in the `ViewName` literal union type.
- **[calendar.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/calendar.ts)** [NEW]:
  - Implemented `initCalendarView()` and `showCalendarView()`.
  - Created a month grid generator (`getCalendarWeeks`) that pads the first and last weeks with previous/next month days.
  - Formulated a week-based slot allocation algorithm that sorts overlapping races (longer duration first, then earlier starts) and fits up to 3 races per day in separate slots.
  - Styled multi-day events as horizontal connecting bars matching the race category style (background, color, border).
  - Wired search filtering for the race list table.
  - Implemented cross-highlighting hover states: hovering over a race bar in the calendar highlights the list row, and vice versa.
  - Bound clickable links to trigger the stages results modal and the participants modal.
- **[app.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/app.ts)**:
  - Imported calendar controller functions.
  - Registered the `'calendar'` click callback and initialized the calendar view.

### 3. Dashboard Updates
- **[dashboard.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/views/dashboard.ts)**:
  - Updated `renderDashboardRaces()` to filter upcoming races to the next 7 days using a timezone-neutral `addDays` calculator.
  - Split races into "In Progress" and "Upcoming (Next 7 Days)", separating them with distinct row dividers in the tbody.

### 4. Styles & Aesthetics
- **[main.css](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/frontend/src/main.css)**:
  - Added calendar split layout styling with card overlays and scrollable table wraps.
  - Styled day cells, weekday headers, and past/other-month days.
  - Designed the connecting event bars, glowing active live race state, and a pulsing red live indicator dot.
  - Added dashboard table subsection divider rows.
  - Integrated cross-highlighting hover background and border indicators.

---

## Verification & Build Results

The codebase compiles and bundles successfully without warnings or errors. Verified using the build tool:
- Backend TypeScript compilation check: **SUCCESSFUL**
- Frontend TypeScript check: **SUCCESSFUL**
- Frontend Vite production build: **SUCCESSFUL**
