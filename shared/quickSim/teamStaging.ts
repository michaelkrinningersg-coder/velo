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
 *
 * Zwei Ausnahmen gibt es doch. Kapitaene, Co-Kapitaene und Sprinter fallen nie
 * unter -1: sie fahren ihr eigenes Rennen, auch wenn sie an diesem Tag hinten
 * in ihrer Mannschaft stehen — die Abstufung bildet Helferdienste ab, und die
 * leisten sie nicht. Und der beste Etappenfahrer einer Mannschaft faellt in
 * einer Rundfahrt gar nicht ins Minus, weil er die Gesamtwertung faehrt.
 */

/** Zuschlag je Platz innerhalb der Mannschaft, vom besten an. */
export const TEAM_STAGING_STEPS: readonly number[] = [1, 0, -0.5, -1, -1.5, -2, -2.5, -3];

/**
 * Untergrenze fuer Rollen, die ihr eigenes Rennen fahren duerfen.
 *
 * Ein Kapitaen, Co-Kapitaen oder Sprinter faehrt nicht fuer einen anderen.
 * Steht er an einem schwachen Tag trotzdem hinten in seiner Mannschaft, soll
 * ihn die Abstufung nicht zusaetzlich nach unten druecken — sie bildet
 * Helferdienste ab, und die leistet er nicht.
 */
export const TEAM_STAGING_ROLE_FLOOR = -1;

/** Rollen, fuer die die Untergrenze gilt. Namen ohne Umlaute und klein. */
export const TEAM_STAGING_FLOOR_ROLES = new Set<string>(['kapitaen', 'co-kapitaen', 'sprinter']);

/**
 * Rollennamen vergleichbar machen.
 *
 * Aus der Datenbank kommt `Kapitaen`, aus aelteren Staenden auch `Kapitän`.
 * Umlaute werden deshalb zuerst ausgeschrieben und erst danach die restlichen
 * Betonungszeichen entfernt — `normalize('NFD')` allein macht aus dem Umlaut
 * ein blankes `a`, und der Vergleich schlaegt fehl.
 */
export function normalisiereRolle(roleName: string | null | undefined): string {
  return (roleName ?? '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Zuschlag fuer eine Position innerhalb der Mannschaft.
 *
 * Hinter dem achten Fahrer bleibt es bei -3. Ein Kader von acht ist die Regel;
 * die wenigen groesseren Mannschaften sollen nicht immer tiefer fallen, nur
 * weil sie mehr Fahrer am Start haben.
 */
export function resolveTeamStagingDelta(positionInTeam: number, roleName?: string | null): number {
  if (positionInTeam < 0) {
    return 0;
  }
  const letzte = TEAM_STAGING_STEPS[TEAM_STAGING_STEPS.length - 1] as number;
  const roh = TEAM_STAGING_STEPS[positionInTeam] ?? letzte;
  return TEAM_STAGING_FLOOR_ROLES.has(normalisiereRolle(roleName))
    ? Math.max(TEAM_STAGING_ROLE_FLOOR, roh)
    : roh;
}

/**
 * Untergrenze fuer den besten Etappenfahrer einer Mannschaft.
 *
 * In einer Rundfahrt schickt eine Mannschaft einen Fahrer auf die
 * Gesamtwertung. Er faehrt jeden Tag sein eigenes Rennen — auch an einem Tag,
 * an dem ihm das Profil nicht liegt und zwei Kollegen vor ihm stehen. Die
 * Abstufung darf ihn deshalb nicht ins Minus druecken; sie soll die Arbeit
 * verteilen, nicht die Gesamtwertung umwerfen.
 *
 * Gilt nur in Rundfahrten: an einem Eintagesrennen gibt es keine
 * Gesamtwertung, fuer die jemand geschont werden muesste.
 */
export const TEAM_STAGING_LEADER_FLOOR = 0;

/**
 * Wie der Etappenfahrer einer Mannschaft bestimmt wird.
 *
 * Berg, Mittelgebirge und Zeitfahren — die drei Faehigkeiten, die eine
 * Gesamtwertung entscheiden. Sprint, Flach und Huegel stehen bewusst nicht
 * darin: wer sie hat, gewinnt Etappen, keine Rundfahrten.
 */
export const STAGE_RACER_WEIGHTS = { mountain: 0.6, mediumMountain: 0.25, timeTrial: 0.15 } as const;

export function resolveStageRacerValue(
  skills: { mountain: number; mediumMountain: number; timeTrial: number },
): number {
  return (skills.mountain * STAGE_RACER_WEIGHTS.mountain)
    + (skills.mediumMountain * STAGE_RACER_WEIGHTS.mediumMountain)
    + (skills.timeTrial * STAGE_RACER_WEIGHTS.timeTrial);
}

export interface TeamStagingRider {
  riderId: number;
  teamId?: number | null;
  score: number;
  /** Rollenname aus der Datenbank. Entscheidet ueber die Untergrenze. */
  roleName?: string | null;
  /** Wert aus `resolveStageRacerValue`. Der beste einer Mannschaft faellt nicht unter null. */
  stageRacerValue?: number;
}

/**
 * Zuschlag je Fahrer aus der Reihenfolge innerhalb seiner Mannschaft.
 *
 * Fahrer ohne Mannschaft bilden jeweils eine eigene und bekommen damit den
 * Zuschlag des Besten — sie haben niemanden, fuer den sie arbeiten koennten.
 * Bei gleichem Score entscheidet die Fahrer-Id, damit die Reihenfolge nicht
 * von der Eingabereihenfolge abhaengt.
 */
export function buildTeamStagingDeltas(
  riders: readonly TeamStagingRider[],
  isStageRace = false,
): Map<number, number> {
  const nachTeam = new Map<number, TeamStagingRider[]>();
  for (const rider of riders) {
    const teamId = rider.teamId ?? -rider.riderId;
    const eimer = nachTeam.get(teamId) ?? [];
    eimer.push(rider);
    nachTeam.set(teamId, eimer);
  }

  const deltas = new Map<number, number>();
  for (const mitglieder of nachTeam.values()) {
    // Der beste Etappenfahrer der Mannschaft, gemessen an den drei
    // Faehigkeiten, die eine Gesamtwertung entscheiden. Bei Gleichstand
    // entscheidet die Fahrer-Id, damit die Wahl nicht an der
    // Eingabereihenfolge haengt.
    let kapitaenDerRundfahrt: number | null = null;
    if (isStageRace) {
      let bester = Number.NEGATIVE_INFINITY;
      for (const rider of mitglieder) {
        const wert = rider.stageRacerValue;
        if (wert == null) {
          continue;
        }
        if (wert > bester || (wert === bester && kapitaenDerRundfahrt != null && rider.riderId < kapitaenDerRundfahrt)) {
          bester = wert;
          kapitaenDerRundfahrt = rider.riderId;
        }
      }
    }

    const sortiert = [...mitglieder].sort(
      (links, rechts) => rechts.score - links.score || links.riderId - rechts.riderId,
    );
    sortiert.forEach((rider, position) => {
      const roh = resolveTeamStagingDelta(position, rider.roleName);
      deltas.set(
        rider.riderId,
        rider.riderId === kapitaenDerRundfahrt ? Math.max(TEAM_STAGING_LEADER_FLOOR, roh) : roh,
      );
    });
  }
  return deltas;
}
