/**
 * Abstufung innerhalb einer Mannschaft im Ziel.
 *
 * Ohne sie stehen an einem guten Tag vier Fahrer derselben Mannschaft in den
 * Top 10 — jeder von ihnen faehrt sein eigenes Rennen, keiner arbeitet. Im
 * echten Radsport ist genau das die Ausnahme: eine Mannschaft schickt einen
 * nach vorne, der Rest faehrt fuer ihn und kommt entsprechend spaeter an.
 *
 * Die Abstufung bildet diese Arbeitsteilung ab, ohne sie zu simulieren. Je
 * Mannschaft werden die Fahrer nach ihrem Etappenscore sortiert; der beste
 * bekommt einen Zuschlag, der zweite nichts, ab dem dritten wird es
 * schrittweise teurer. Wer der beste ist, entscheidet damit der Score des
 * Tages und nicht die Rolle im Kader — ein Wassertraeger, dem die Etappe
 * liegt, kann auch mal der Kopf seiner Mannschaft sein.
 *
 * Die Werte gelten fuer jedes Terrain gleich: die Arbeit, die eine Mannschaft
 * verteilt, haengt nicht am Profil.
 */

/** Zuschlag je Platz innerhalb der Mannschaft, vom besten an. */
export const TEAM_STAGING_STEPS: readonly number[] = [1, 0, -0.5, -1, -1.5, -2, -2.5, -3];

/**
 * Wie es hinter dem achten Fahrer weitergeht.
 *
 * Ein Kader von acht ist die Regel; groessere Mannschaften gibt es nur in
 * Ausnahmefaellen. Fuer sie laeuft dieselbe Stufung weiter, statt auf -3
 * stehenzubleiben — sonst waeren der achte und der zehnte Fahrer gleich
 * gestellt, obwohl zwei weitere vor ihnen liegen.
 */
export const TEAM_STAGING_STEP_BEYOND = -0.5;

export function resolveTeamStagingDelta(positionInTeam: number): number {
  if (positionInTeam < 0) {
    return 0;
  }
  const bekannt = TEAM_STAGING_STEPS[positionInTeam];
  if (bekannt != null) {
    return bekannt;
  }
  const letzte = TEAM_STAGING_STEPS[TEAM_STAGING_STEPS.length - 1] as number;
  return letzte + ((positionInTeam - TEAM_STAGING_STEPS.length + 1) * TEAM_STAGING_STEP_BEYOND);
}

export interface TeamStagingRider {
  riderId: number;
  teamId?: number | null;
  score: number;
}

/**
 * Zuschlag je Fahrer aus der Reihenfolge innerhalb seiner Mannschaft.
 *
 * Fahrer ohne Mannschaft bilden jeweils eine eigene und bekommen damit den
 * Zuschlag des Besten — sie haben niemanden, fuer den sie arbeiten koennten.
 * Bei gleichem Score entscheidet die Fahrer-Id, damit die Reihenfolge nicht
 * von der Eingabereihenfolge abhaengt.
 */
export function buildTeamStagingDeltas(riders: readonly TeamStagingRider[]): Map<number, number> {
  const nachTeam = new Map<number, TeamStagingRider[]>();
  for (const rider of riders) {
    const teamId = rider.teamId ?? -rider.riderId;
    const eimer = nachTeam.get(teamId) ?? [];
    eimer.push(rider);
    nachTeam.set(teamId, eimer);
  }

  const deltas = new Map<number, number>();
  for (const mitglieder of nachTeam.values()) {
    const sortiert = [...mitglieder].sort(
      (links, rechts) => rechts.score - links.score || links.riderId - rechts.riderId,
    );
    sortiert.forEach((rider, position) => {
      deltas.set(rider.riderId, resolveTeamStagingDelta(position));
    });
  }
  return deltas;
}
