# Feature Ideen
- **Gezielter Trainings-Fokus (Spieler-Interaktion)**: Ein "Trainings-Fokus"-Dropdown in das Team-Menü einbauen. Der Spieler kann für jeden Fahrer festlegen, worauf er sich konzentrieren soll (z.B. "Fokus Berg", "Fokus Zeitfahren", "Ausgewogen"). Das ändert den Multiplikator (`resolveSkillFocusFactor`) in der täglichen Berechnung dramatisch zugunsten des gewählten Skills.

Recommendation 1.2: Expand Mentor Impact to "Long-Term Potential Expansion"
The current mentoring system grants short-term in-game buffs during race setup when a mentor (age $\ge 31$, strength $\ge 73$, matching specialization) is in the starter roster. We can deepen this system by allowing seasoned veterans to actively expand the future potential ceiling of young riders.

The Plan: During the winter break / off-season rollover (when the season advances in GameStateService.ts):
Check if a U23 rider was on the same team as a qualifying active mentor and participated in similar programs.
With a small, satisfying chance (e.g. 5%), grant the protégé a permanent potential boost (pot_mountain, pot_flat, or pot_overall increments by +1). This provides a rich and realistic mechanic where veterancy shapes the future of your squad, complementing the existing breakthrough metrics.

 Add Visual Tooltips spelling out "Lock Block Reasons"
Roster selection utilizes a RiderLockMap where riders can be grayed out because of standard constraints (e.g., winter break, injuries, exhaustion, sickness).

The Plan: In frontend/src/views/liveRace.ts (or relevant roster viewer), attach a hover tooltip to deactivated elements spelling out concrete return estimates:
❄ Winter Break: "Taking a winter holiday. Returns February 15th."
🩹 Injury: "Suffered medium crash injury. Recovers in 6 days (re-opens on DD.MM.YYYY)."
💤 Exhaustion: "High fatigue accumulation. Needs a rest period."