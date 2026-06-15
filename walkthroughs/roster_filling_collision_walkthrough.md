# Walkthrough: Intelligentes Auffüllen von Starterfeldern & Kollisionsprüfung

Wir haben das automatische Auffüllen von Starterfeldern bei parallelen Rennen grundlegend überarbeitet, um unterbesetzte Teams (wie bei der *Vuelta a Andalucia*) zu verhindern.

## Das Problem
Bisher wurden Fahrer komplett für das Auffüllen freier Plätze blockiert, sobald das parallele Rennen in ihrem Saisonprogramm vorkam – selbst wenn sie dort gar nicht im finalen Starterfeld aufgestellt oder als Kandidaten eingeplant wurden. Dadurch waren viele Helfer blockiert und Teams starteten mit deutlich weniger als den erlaubten 8 Fahrern.

## Die Lösung

### 1. Aktive & Eingeplante Kollisionsprüfung (`hasActiveOrEarmarkedCollision`)
In [RaceRosterService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/simulation/RaceRosterService.ts) wurde die simple Prüfung auf Programm-Kollisionen durch eine differenzierte Logik ersetzt:
* **Bereits finalisierte Starterfelder**: Wenn das überlappende Rennen für das Team bereits finalisiert wurde (Einträge in `race_entries` vorhanden sind), ist der Fahrer nur blockiert, wenn er tatsächlich in diesem Starterfeld aufgestellt ist.
* **Zukünftige (nicht finalisierte) Rennen**: Wenn das überlappende Rennen noch nicht gestartet/finalisiert wurde, wird ermittelt, ob der Fahrer zu den "eingeplanten" Fahrern gehört. Dazu werden die Programmfahrer des Teams für das überlappende Rennen sortiert (`orderProgramCandidates`) und die Top-X Plätze (entsprechend der maximalen Teamgröße, z. B. 8) reserviert. Ein Fahrer ist nur dann blockiert, wenn er zu dieser gesetzten Top-Auswahl gehört.

### 2. Rollenbeschränkungen je Rennkategorie (`canFillRosterSlot`)
Je nach Prestigeklasse des Rennens dürfen unterschiedliche Rollen als Auffüllfahrer nachrücken:
* **Monuments & Grand Tours**: Alle Rollen außer Wasserträger/Helfer/Sprinter dürfen auch von Kapitänen (`1`) und Co-Kapitänen (`2`) aufgefüllt werden.
* **Stage Race High & One Day High**: Ausschließlich Edelhelfer (`3`), Starke Helfer (`4`) und Wasserträger (`5`).
* **Andere Rennen (Middle/Low/Standard)**: Edelhelfer (`3`), Starke Helfer (`4`), Wasserträger (`5`) und Sprinter (`6`).

### 3. Rennkategorie-spezifische Sortierreihenfolge (`orderFillCandidates`)
Beim Auffüllen werden die Kandidaten nach folgendem Muster sortiert:
* **Monuments & Grand Tours**:
  1. Kapitäne (`1`)
  2. Co-Kapitäne (`2`)
  3. Sprinter (`6`)
  4. Edelhelfer (`3`)
  5. Starke Helfer (`4`)
  6. Wasserträger (`5`)
  *(Jeweils sortiert nach Gesamtstärke `overallRating` absteigend)*
* **Stage Race High & One Day High**:
  1. Edelhelfer (`3`)
  2. Starke Helfer (`4`)
  3. Wasserträger (`5`)
  *(Jeweils sortiert nach Gesamtstärke `overallRating` absteigend)*
* **Andere Rennen (Standard)**:
  1. Wasserträger (`5`)
  2. Starke Helfer (`4`)
  3. Edelhelfer (`3`)
  *(Sortiert nach Renntagen `seasonRaceDays` aufsteigend, um Fahrer mit wenig Renntagen zu bevorzugen)*
  4. Sprinter (`6`)
  *(Sortiert nach Gesamtstärke `overallRating` aufsteigend, also schwache Sprinter zuerst)*

---

## Technische Implementierung

### [RaceRosterService.ts](file:///c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/backend/src/simulation/RaceRosterService.ts)
* `hasActiveOrEarmarkedCollision(...)`: Implementiert die differenzierte Abfrage auf `race_entries` bzw. die earmarking-Prüfung über `orderProgramCandidates` und das `categoryId`-abhängige Fahrerlimit.
* `canFillRosterSlot(...)`: Filtert Kandidaten basierend auf der Rennkategorie und führt die Kollisionsprüfung durch.
* `orderFillCandidates(...)`: Sortiert die verbleibenden Auffüllkandidaten nach den oben definierten Prioritäten.
* `buildRaceRoster(...)`: Überträgt den `teamFullRoster` korrekt in die Selektions- und Kollisionsprüfungsfunktionen.

---

## Verifikationsergebnisse
Mit dem Testskript `test_roster_fill.js` wurde die Rostergenerierung der *Vuelta a Andalucia* (überlappend mit der *Algarve-Rundfahrt*) simuliert.
* **Vor dem Fix**: Decathlon-Renault und Philips-Santander starteten aufgrund überlappender Programme mit nur 4-6 Fahrern.
* **Nach dem Fix**: Alle betroffenen Teams füllen ihr Starterfeld erfolgreich auf die maximalen **8/8 Fahrer** auf.
* Die Auswahl bevorzugt korrekterweise Wasserträger mit den wenigsten Renntagen und danach schwache Sprinter, ohne zukünftige Programme der Kapitäne/Co-Kapitäne zu stören.
