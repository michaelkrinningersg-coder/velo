// Hall-of-Fame Badge-Tier-Logik (SINGLE SOURCE OF TRUTH).
//
// Diese Datei enthaelt AUSSCHLIESSLICH die reine (DOM-freie) Ableitung, welche
// Tier-Stufe (gold/silver/bronze/cyan/purple) bzw. welchen "earned"-Zustand ein
// Fahrer je Badge erreicht. Die Praesentation (Icons, Namen, Hovertexte, Styles)
// bleibt bewusst im Frontend (`frontend/src/views/riderStats.ts`).
//
// Verwendet von:
//  - Frontend: `buildHallOfFameBadges` liest Tier/earned aus `computeRiderBadgeTiers`.
//  - Backend: `BadgeMaterializationService` materialisiert die Badges pro Fahrer.
//
// WICHTIG: Ein Badge gilt als "gehalten", wenn `tier != null` ODER `earned === true`.

export type HofTierKey = 'gold' | 'silver' | 'bronze' | 'cyan' | 'purple';

export function resolveFirstPlacePilotTier(rank: number | null): HofTierKey | null {
  if (rank == null) return null;
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  if (rank <= 10) return 'cyan';
  if (rank <= 25) return 'purple';
  return null;
}

export function resolveWinTrackerTier(wins: number): HofTierKey | null {
  if (wins > 100) return 'gold';
  if (wins >= 75) return 'silver';
  if (wins >= 50) return 'bronze';
  if (wins >= 25) return 'cyan';
  if (wins >= 10) return 'purple';
  return null;
}

// Schwellen-Tier: hoechste erreichte Stufe [lila, cyan, bronze, silber, gold].
export function resolveThresholdTier(value: number, thresholds: [number, number, number, number, number]): HofTierKey | null {
  if (value >= thresholds[4]) return 'gold';
  if (value >= thresholds[3]) return 'silver';
  if (value >= thresholds[2]) return 'bronze';
  if (value >= thresholds[1]) return 'cyan';
  if (value >= thresholds[0]) return 'purple';
  return null;
}

// Rang-Tier: P1 gold, P2 silber, P3 bronze, P4-10 cyan, P11-25 lila.
export function resolveRankTier(rank: number | null): HofTierKey | null {
  if (rank == null) return null;
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  if (rank <= 10) return 'cyan';
  if (rank <= 25) return 'purple';
  return null;
}

// Geo-Tier: 2 Kontinente Bronze, 3 Silber, 4 Gold.
export function resolveContinentTier(count: number): HofTierKey | null {
  if (count >= 4) return 'gold';
  if (count >= 3) return 'silver';
  if (count >= 2) return 'bronze';
  return null;
}

export interface RiderBadgeTierInput {
  hallOfFame?: any;
  careerStats?: any;
  careerWins?: number;
}

export interface RiderBadgeTier {
  key: string;
  tier: HofTierKey | null;
  earned: boolean;
}

/**
 * Berechnet fuer JEDES Hall-of-Fame-Badge das erreichte Tier bzw. den
 * earned-Zustand. Muss 1:1 zu `buildHallOfFameBadges` im Frontend passen.
 */
export function computeRiderBadgeTiers(input: RiderBadgeTierInput): RiderBadgeTier[] {
  const payload = input;
  const hof: any = payload.hallOfFame ?? {
    allTimeWins: payload.careerWins ?? 0, allTimeWinsRank: null, rankedRiders: 0,
    allTimeRaceDays: 0, breakawayKms: 0, breakawayAttempts: 0, breakawayKmRank: null, rankedBreakawayRiders: 0,
  };
  const wins = hof.allTimeWins ?? 0;
  const rank = hof.allTimeWinsRank;
  // All-Time-Raenge der Ranglisten-Badges (null = nicht gewertet).
  const uciPointsRank = hof.uciPointsRank ?? null;
  const stageScoresRank = hof.stageScoresRank ?? null;
  const speedStageRank = hof.speedStageRank ?? null;
  const speedOnedayRank = hof.speedOnedayRank ?? null;
  const slowestStageRank = hof.slowestStageRank ?? null;
  const slowestOnedayRank = hof.slowestOnedayRank ?? null;
  const leadoutBonusRank = hof.leadoutBonusRank ?? null;
  const counterAttacksRank = hof.counterAttacksRank ?? null;
  const superteamCountRank = hof.superteamCountRank ?? null;
  const lieutenantPeakRank = hof.lieutenantPeakRank ?? null;
  const yellowDaysRank = hof.yellowDaysRank ?? null;
  const leadoutTrainRank = hof.leadoutTrainRank ?? null;
  // Badge-Kennzahlen Welle 1.
  const bestSeasonUciPoints = hof.bestSeasonUciPoints ?? 0;
  const phantomGcWins = hof.phantomGcWins ?? 0;
  const firstBloodWins = hof.firstBloodWins ?? 0;
  const hatTrickRaces = hof.hatTrickRaces ?? 0;
  const whereHillsWins = hof.whereHillsWins ?? 0;
  const springWins = hof.springWins ?? 0;
  const gcStayerTopTen = hof.gcStayerTopTen ?? 0;
  // Welle 2 (Distanz/Höhenmeter).
  const longHaulWins = hof.longHaulWins ?? 0;
  const staminaWins = hof.staminaWins ?? 0;
  const verticalLimitWins = hof.verticalLimitWins ?? 0;
  // Welle 3 (Positionen).
  const lanterneRougeStage = hof.lanterneRougeStage ?? 0;
  const lanterneRougeGt = hof.lanterneRougeGt ?? 0;
  const lanterneRougeSr = hof.lanterneRougeSr ?? 0;
  const timeCutFinishes = hof.timeCutFinishes ?? 0;
  const teamEffortPodiums = hof.teamEffortPodiums ?? 0;
  const oneManTeam = hof.oneManTeam ?? 0;
  const gcBySeconds = hof.gcBySeconds ?? 0;
  const bitterEndDnf = hof.bitterEndDnf ?? 0;
  const winStreakBest = hof.winStreakBest ?? 0;
  // Welle 5 (Helfer & Team).
  const waterCarrierDays = hof.waterCarrierDays ?? 0;
  const superDomestiqueLeadouts = hof.superDomestiqueLeadouts ?? 0;
  const lieutenantSeasons = hof.lieutenantSeasons ?? 0;
  const kingmakerCount = hof.kingmakerCount ?? 0;
  const franchiseSeasons = hof.franchiseSeasons ?? 0;
  const bandOfBrothersBest = hof.bandOfBrothersBest ?? 0;
  const cleanSweepCount = hof.cleanSweepCount ?? 0;
  const cleanSweepPlusCount = hof.cleanSweepPlusCount ?? 0;
  const hottestPick = hof.hottestPick === true;
  // Welle 6 (Saison-Muster).
  const mrReliableSeasons = hof.mrReliableSeasons ?? 0;
  const instantImpact = hof.instantImpact === true;
  const outOfDarkWins = hof.outOfDarkWins ?? 0;
  const hotStreakOpenerSeasons = hof.hotStreakOpenerSeasons ?? 0;
  // Welle 7 (Commit-getrackt).
  const peakPerformerWins = hof.peakPerformerWins ?? 0;
  const yoyoRaces = hof.yoyoRaces ?? 0;
  // Welle 8 (rein abgeleitet).
  const prologueWins = hof.prologueWins ?? 0;
  const autumnWins = hof.autumnWins ?? 0;
  const grandFinaleWins = hof.grandFinaleWins ?? 0;
  const prodigyWins = hof.prodigyWins ?? 0;
  const lastDanceWin = hof.lastDanceWin === true;
  const gtRunnerUp = hof.gtRunnerUp ?? 0;
  const undertakerWins = hof.undertakerWins ?? 0;
  const greenGrandSlam = hof.greenGrandSlam === true;
  // Welle 9 (Commit-getrackt).
  const escapeToVictory = hof.escapeToVictory ?? 0;
  const podiumLockout = hof.podiumLockout ?? 0;
  const jerseyStreakBest = hof.jerseyStreakBest ?? 0;
  const photoFinishWins = hof.photoFinishWins ?? 0;
  const soClose = hof.soClose ?? 0;
  const worldChampionRoadTitles = hof.worldChampionRoadTitles ?? 0;
  const worldChampionIttTitles = hof.worldChampionIttTitles ?? 0;
  const euroChampionRoadTitles = hof.euroChampionRoadTitles ?? 0;
  const euroChampionIttTitles = hof.euroChampionIttTitles ?? 0;
  const nationalChampionRoadTitles = hof.nationalChampionRoadTitles ?? 0;
  const nationalChampionIttTitles = hof.nationalChampionIttTitles ?? 0;
  const worldU23ChampionRoadTitles = hof.worldU23ChampionRoadTitles ?? 0;
  const worldU23ChampionIttTitles = hof.worldU23ChampionIttTitles ?? 0;
  const euroU23ChampionRoadTitles = hof.euroU23ChampionRoadTitles ?? 0;
  const euroU23ChampionIttTitles = hof.euroU23ChampionIttTitles ?? 0;
  const worldJuniorChampionRoadTitles = hof.worldJuniorChampionRoadTitles ?? 0;
  const worldJuniorChampionIttTitles = hof.worldJuniorChampionIttTitles ?? 0;
  const euroJuniorChampionRoadTitles = hof.euroJuniorChampionRoadTitles ?? 0;
  const euroJuniorChampionIttTitles = hof.euroJuniorChampionIttTitles ?? 0;
  const olympicChampionRoadTitles = hof.olympicChampionRoadTitles ?? 0;
  const olympicChampionIttTitles = hof.olympicChampionIttTitles ?? 0;
  const gtStageWinsTdf = hof.gtStageWinsTdf ?? 0;
  const gtStageWinsGiro = hof.gtStageWinsGiro ?? 0;
  const gtStageWinsVuelta = hof.gtStageWinsVuelta ?? 0;
  const gtWithStageWin = [gtStageWinsTdf, gtStageWinsGiro, gtStageWinsVuelta].filter((n) => n >= 1).length;
  // Welle 10 (rein abgeleitet).
  const pointsPerfectionist = hof.pointsPerfectionist ?? 0;
  const thirdWeekWonder = hof.thirdWeekWonder ?? 0;
  const monumentSweep = hof.monumentSweep === true;
  const babyFaceWins = hof.babyFaceWins ?? 0;
  const workhorseDays = hof.workhorseDays ?? 0;
  const longBreakawayWins = hof.longBreakawayWins ?? 0;
  // "Wilde" Kuriositaeten (Welle A).
  const defectsCount = hof.defects ?? 0;
  const doomedEscapes = hof.doomedEscapes ?? 0;
  const supermalusDays = hof.supermalusDays ?? 0;
  const bestSeasonRaceDays = hof.bestSeasonRaceDays ?? 0;
  const veteranWins = hof.veteranWins ?? 0;
  const awayWins = hof.awayWins ?? 0;
  const breakawayWins = hof.breakawayWins ?? 0;
  const groundhogStreak = hof.groundhogStreak ?? 0;
  const kamikazeRatio = (hof.allTimeAttacks ?? 0) / Math.max(1, hof.allTimeWins ?? 0);
  // "Wilde" Kuriositaeten (Welle B, Commit-getrackt).
  const fullMoonPodiums = hof.fullMoonPodiums ?? 0;
  const cleanStreakBest = hof.cleanStreakBest ?? 0;
  const grandToursFinished = hof.grandToursFinished ?? 0;
  const multiJerseyDays = hof.multiJerseyDays ?? 0;
  const raceDays = hof.allTimeRaceDays ?? 0;
  const brkKms = hof.breakawayKms ?? 0;
  const brkAttempts = hof.breakawayAttempts ?? 0;
  const brkRank = hof.breakawayKmRank;

  // Karriere-Kennzahlen aus careerStats (Skalare + Kategorie-Aggregate).
  const cs: any = payload.careerStats ?? {};
  const cats: any[] = Object.values(cs.categories ?? {});
  const sum = (f: (c: any) => number): number => cats.reduce((a, c) => a + (f(c) || 0), 0);
  const cat = (key: string): any => cs.categories?.[key] ?? {};

  const attacks = hof.allTimeAttacks ?? cs.attacks ?? 0;
  const counterAttacks = cs.counterAttacks ?? 0;
  const crashes = cs.crashes ?? 0;
  const defects = cs.defects ?? 0;
  const successfulBreakaways = cs.successfulBreakaways ?? 0;
  const bunchSprintWins = hof.bunchSprintWins ?? 0;
  const distanceKm = hof.allTimeDistanceKm ?? 0;
  const earthLoops = Math.floor(distanceKm / 40000);

  // Welle-1-Ableitungen aus den Kategorie-Aggregaten.
  const fogWins = sum((c) => c.winWeather6);
  const stormWins = sum((c) => c.winWeather4);
  const HOF_RACE_CLASSES = [
    'World Tour - Tour de France', 'World Tour - Grand Tour', 'World Tour - Monument',
    'World Tour - Stage Race High', 'World Tour - Stage Race Middle', 'World Tour - Stage Race Low',
    'World Tour - One Day High', 'World Tour - One Day Middle', 'World Tour - One Day Low',
  ];
  const classWon = (n: string): boolean => (((cat(n).gcWins || 0) + (cat(n).stageWins || 0) + (cat(n).oneDayWins || 0)) > 0);
  const careerSlamDone = HOF_RACE_CLASSES.every(classWon);
  const punchyClimberDone = sum((c) => (c.winHilly || 0) + (c.winHillyDifficult || 0)) >= 1
    && sum((c) => (c.winMountain || 0) + (c.winHighMountain || 0)) >= 1;
  const perennialSecondDone = sum((c) => (c.gcSecond || 0) + (c.stageSecond || 0) + (c.oneDaySecond || 0)) > 10 && wins === 0;
  const climbWins = sum((c) => (c.climbWinsHC || 0) + (c.climbWins1 || 0) + (c.climbWins2 || 0) + (c.climbWins3 || 0) + (c.climbWins4 || 0));
  const hcClimbs = sum((c) => c.climbWinsHC);
  const podiums = sum((c) => (c.gcWins || 0) + (c.stageWins || 0) + (c.oneDayWins || 0) + (c.gcSecond || 0) + (c.stageSecond || 0) + (c.oneDaySecond || 0) + (c.gcThird || 0) + (c.stageThird || 0) + (c.oneDayThird || 0));
  const yellowDays = sum((c) => c.leaderJerseys);
  const monumentWins = cat('World Tour - Monument').oneDayWins ?? 0;
  const grandTourWins = (cat('World Tour - Grand Tour').gcWins ?? 0) + (cat('World Tour - Tour de France').gcWins ?? 0);
  const tdfWins = cat('World Tour - Tour de France').gcWins ?? 0;

  // Zusaetzliche Kennzahlen fuer die neuen Badges.
  const greenDays = sum((c) => c.pointsJerseys);
  const komDays = sum((c) => c.mountainJerseys);
  const youthDays = sum((c) => c.youthJerseys);
  const timeTrialWins = sum((c) => (c.winITT || 0) + (c.winTTT || 0));
  const cobbleWins = sum((c) => (c.winCobble || 0) + (c.winCobbleHill || 0));
  const rainWins = sum((c) => (c.winWeather3 || 0) + (c.winWeather4 || 0));
  const superformDays = cs.superformDays ?? 0;
  const homeDays = (cs.homeAdvantageDays ?? 0) + (cs.superHomeAdvantageDays ?? 0);

  // Kennzahlen fuer die 18 Zusatz-Badges.
  const pointsTitles = sum((c) => c.pointsWins);
  const komTitles = sum((c) => c.mountainWins);
  const youthTitles = sum((c) => c.youthWins);
  const flatWins = sum((c) => (c.winFlat || 0) + (c.winRolling || 0));
  const punchWins = sum((c) => (c.winHilly || 0) + (c.winHillyDifficult || 0));
  const summitWins = sum((c) => (c.winMountain || 0) + (c.winHighMountain || 0));
  const sprintWinsTotal = sum((c) => c.sprintWins);
  const heatWins = sum((c) => c.winWeather2);
  const windWins = sum((c) => c.winWeather5);
  const snowWins = sum((c) => c.winWeather7);
  const topTens = sum((c) => (c.gcTopTen || 0) + (c.stageTopTen || 0) + (c.oneDayTopTen || 0));
  const secondPlaces = sum((c) => (c.gcSecond || 0) + (c.stageSecond || 0) + (c.oneDaySecond || 0));
  const injuries = cs.injuries ?? 0;
  const illnesses = cs.illnesses ?? 0;
  const hardLuck = (cs.dnfCount ?? 0) + (cs.otlCount ?? 0);
  const careerSeasons = hof.careerSeasons ?? 0;
  const mostSeasonsOneTeam = hof.mostSeasonsOneTeam ?? 0;
  const teamCount = hof.teamCount ?? 0;
  const fullMoonWins = hof.fullMoonWins ?? 0;
  const catPodiums = hof.catPodiums ?? 0;
  const ghostTop10 = hof.ghostTop10 ?? 0;
  const continentsWon = hof.continentsWon ?? [];
  const worldCitizenBestYear = hof.worldCitizenBestYear ?? 0;
  const wonContinent = (c: string) => continentsWon.includes(c);
  const countriesWonCount = hof.countriesWonCount ?? 0;
  const homeSoilWins = hof.homeSoilWins ?? 0;
  const nationExpressCountries = hof.nationExpressCountries ?? 0;
  const tourOfNationHome = hof.tourOfNationHome === true;

  // "The Complete Rider": genestete Stufen aus Rundfahrt-, Eintages- und
  // Massensprint-Erfolg.
  const hasGrandTour = grandTourWins >= 1;
  const hasStageHigh = (cat('World Tour - Stage Race High').gcWins ?? 0) >= 1;
  const hasMonument = monumentWins >= 1;
  const hasOneDayHigh = (cat('World Tour - One Day High').oneDayWins ?? 0) >= 1;
  const hasBunch = bunchSprintWins >= 1;
  const completeRiderTier: HofTierKey | null = (() => {
    if (!hasBunch) return null;
    if (hasGrandTour && hasMonument) return 'gold';
    if ((hasGrandTour || hasStageHigh) && hasMonument) return 'silver';
    if ((hasGrandTour || hasStageHigh) && (hasMonument || hasOneDayHigh)) return 'bronze';
    return null;
  })();

  const single = (key: string, earned: boolean): RiderBadgeTier => ({ key, tier: null, earned });
  const threshold = (key: string, tier: HofTierKey | null): RiderBadgeTier => ({ key, tier, earned: false });

  return [
    threshold('firstPlacePilot', resolveFirstPlacePilotTier(rank)),
    threshold('winTracker', resolveWinTrackerTier(wins)),
    threshold('raceDaySquirrel', resolveThresholdTier(raceDays, [350, 450, 550, 650, 750])),
    threshold('escapeArtist', resolveThresholdTier(brkKms, [10000, 12500, 15000, 17500, 20000])),
    threshold('baroudeurSupreme', resolveThresholdTier(brkAttempts, [75, 100, 150, 200, 250])),
    threshold('breakawayKing', resolveRankTier(brkRank)),
    threshold('bunchSprintBoss', resolveThresholdTier(bunchSprintWins, [10, 20, 35, 50, 65])),
    threshold('maillotJaune', resolveThresholdTier(yellowDays, [50, 100, 150, 200, 300])),
    threshold('podiumMachine', resolveThresholdTier(podiums, [25, 50, 100, 150, 200])),
    threshold('mountainGoat', resolveThresholdTier(climbWins, [20, 40, 60, 80, 100])),
    threshold('hcKing', resolveThresholdTier(hcClimbs, [5, 10, 15, 20, 25])),
    threshold('monumentHunter', resolveThresholdTier(monumentWins, [1, 2, 5, 8, 10])),
    threshold('attacker', resolveRankTier(hof.attacksRank ?? null)),
    threshold('restlessLegs', resolveThresholdTier(attacks, [15, 30, 45, 60, 75])),
    threshold('notWithoutMe', resolveThresholdTier(counterAttacks, [10, 20, 30, 40, 50])),
    threshold('breakawayMaster', resolveThresholdTier(successfulBreakaways, [5, 10, 15, 20, 25])),
    threshold('pechvogel', resolveThresholdTier(defects, [5, 10, 15, 20, 25])),
    threshold('sturzpilot', resolveThresholdTier(crashes, [5, 10, 15, 20, 25])),
    threshold('aroundTheWorld', resolveThresholdTier(earthLoops, [1, 2, 3, 4, 5])),
    single('erfolgreicherAusreisser', successfulBreakaways >= 1),
    single('monumentWinner', monumentWins >= 1),
    single('grandTourWinner', grandTourWins >= 1),
    single('worldChampionRoad', worldChampionRoadTitles >= 1),
    single('worldChampionItt', worldChampionIttTitles >= 1),
    single('euroChampionRoad', euroChampionRoadTitles >= 1),
    single('euroChampionItt', euroChampionIttTitles >= 1),
    threshold('nationalChampionRoad', resolveThresholdTier(nationalChampionRoadTitles, [1, 3, 5, 8, 12])),
    threshold('nationalChampionItt', resolveThresholdTier(nationalChampionIttTitles, [1, 3, 5, 8, 12])),
    single('worldU23ChampionRoad', worldU23ChampionRoadTitles >= 1),
    single('worldU23ChampionItt', worldU23ChampionIttTitles >= 1),
    single('euroU23ChampionRoad', euroU23ChampionRoadTitles >= 1),
    single('euroU23ChampionItt', euroU23ChampionIttTitles >= 1),
    single('worldJuniorChampionRoad', worldJuniorChampionRoadTitles >= 1),
    single('worldJuniorChampionItt', worldJuniorChampionIttTitles >= 1),
    single('euroJuniorChampionRoad', euroJuniorChampionRoadTitles >= 1),
    single('euroJuniorChampionItt', euroJuniorChampionIttTitles >= 1),
    single('olympicChampionRoad', olympicChampionRoadTitles >= 1),
    single('olympicChampionItt', olympicChampionIttTitles >= 1),
    single('careerRainbow',
      (worldJuniorChampionRoadTitles + worldJuniorChampionIttTitles) >= 1
        && (worldU23ChampionRoadTitles + worldU23ChampionIttTitles) >= 1
        && (worldChampionRoadTitles + worldChampionIttTitles) >= 1),
    single('grandTourStageSlam', gtWithStageWin === 3),
    single('missingOutOne', gtWithStageWin === 2),
    single('tdfWinner', tdfWins >= 1),
    single('allGrandTourWinner', hof.wonAllGrandTours === true),
    single('allMonumentWinner', hof.wonAllMonuments === true),
    single('cobbleKing', hof.wonCobbleKing === true),
    single('ardennenKing', hof.wonArdennenKing === true),
    threshold('greenMachine', resolveThresholdTier(greenDays, [25, 50, 75, 100, 150])),
    threshold('kingOfTheMountains', resolveThresholdTier(komDays, [25, 50, 75, 100, 150])),
    threshold('youngGun', resolveThresholdTier(youthDays, [25, 50, 75, 100, 125])),
    threshold('chronoMaster', resolveThresholdTier(timeTrialWins, [5, 10, 15, 20, 25])),
    threshold('cobbledClassicsKing', resolveThresholdTier(cobbleWins, [3, 6, 10, 15, 20])),
    threshold('rainMaster', resolveThresholdTier(rainWins, [5, 10, 15, 20, 25])),
    threshold('inTheZone', resolveThresholdTier(superformDays, [5, 10, 20, 25, 30])),
    threshold('homeHero', resolveThresholdTier(homeDays, [20, 40, 60, 80, 100])),
    threshold('completeRider', completeRiderTier),
    threshold('pointsChampion', resolveThresholdTier(pointsTitles, [2, 3, 5, 7, 11])),
    threshold('polkaDotKing', resolveThresholdTier(komTitles, [2, 3, 5, 7, 11])),
    threshold('bestYoungRider', resolveThresholdTier(youthTitles, [1, 2, 3, 5, 8])),
    threshold('rouleur', resolveThresholdTier(flatWins, [5, 10, 20, 30, 40])),
    threshold('puncheur', resolveThresholdTier(punchWins, [5, 10, 20, 30, 40])),
    threshold('summitFinisher', resolveThresholdTier(summitWins, [5, 10, 20, 30, 40])),
    threshold('sprintHunter', resolveThresholdTier(sprintWinsTotal, [10, 20, 30, 50, 75])),
    threshold('heatWarrior', resolveThresholdTier(heatWins, [3, 6, 10, 15, 20])),
    threshold('echelonMaster', resolveThresholdTier(windWins, [2, 4, 8, 12, 15])),
    threshold('iceBreaker', resolveThresholdTier(snowWins, [2, 4, 6, 8, 10])),
    threshold('topTenMachine', resolveThresholdTier(topTens, [25, 50, 100, 150, 200])),
    threshold('eternalSecond', resolveThresholdTier(secondPlaces, [5, 10, 20, 30, 40])),
    threshold('comebackKing', resolveThresholdTier(injuries, [3, 6, 10, 15, 20])),
    threshold('underTheWeather', resolveThresholdTier(illnesses, [3, 6, 10, 15, 20])),
    threshold('hardLuck', resolveThresholdTier(hardLuck, [5, 10, 15, 20, 25])),
    threshold('oneClubMan', resolveThresholdTier(mostSeasonsOneTeam, [3, 5, 7, 8, 10])),
    threshold('journeyman', resolveThresholdTier(teamCount, [3, 4, 5, 6, 7])),
    threshold('evergreen', resolveThresholdTier(careerSeasons, [5, 7, 10, 12, 15])),
    threshold('werewolf', resolveThresholdTier(fullMoonWins, [1, 2, 3, 5, 8])),
    threshold('worldCitizen', resolveContinentTier(worldCitizenBestYear)),
    threshold('globetrotter', resolveContinentTier(continentsWon.length)),
    single('winEurope', wonContinent('Europe')),
    single('winAsia', wonContinent('Asia')),
    single('winOceania', wonContinent('Oceania')),
    single('winNorthAmerica', wonContinent('North America')),
    single('mediterraneanMaster', hof.mediterraneanMaster === true),
    single('scandinavianMaster', hof.scandinavianMaster === true),
    single('beneluxMaster', hof.beneluxMaster === true),
    threshold('travelKing', resolveThresholdTier(countriesWonCount, [3, 5, 8, 12, 20])),
    threshold('homeSoilHero', resolveThresholdTier(homeSoilWins, [1, 5, 10, 20, 30])),
    threshold('nationExpress', resolveThresholdTier(nationExpressCountries, [10, 15, 20, 25, 30])),
    single('tourOfNation', tourOfNationHome),
    threshold('ghost', resolveThresholdTier(ghostTop10, [1, 2, 3, 5, 8])),
    threshold('theCat', resolveThresholdTier(catPodiums, [1, 3, 5, 7, 9])),
    threshold('recUciPoints', resolveRankTier(uciPointsRank)),
    threshold('recStageScores', resolveRankTier(stageScoresRank)),
    threshold('recSpeedStage', resolveRankTier(speedStageRank)),
    threshold('recSpeedOneday', resolveRankTier(speedOnedayRank)),
    threshold('recSlowestStage', resolveRankTier(slowestStageRank)),
    threshold('recSlowestOneday', resolveRankTier(slowestOnedayRank)),
    threshold('recLeadout', resolveRankTier(leadoutBonusRank)),
    threshold('recCounterAttacks', resolveRankTier(counterAttacksRank)),
    threshold('recSuperteam', resolveRankTier(superteamCountRank)),
    threshold('recLieutenant', resolveRankTier(lieutenantPeakRank)),
    threshold('recYellowDays', resolveRankTier(yellowDaysRank)),
    threshold('leadoutTrain', resolveRankTier(leadoutTrainRank)),
    threshold('gremlin', resolveThresholdTier(defectsCount, [3, 6, 10, 15, 20])),
    threshold('doomedEscapee', resolveThresholdTier(doomedEscapes, [40, 80, 120, 180, 250])),
    threshold('theSlump', resolveThresholdTier(supermalusDays, [15, 30, 60, 100, 150])),
    threshold('everPresent', resolveThresholdTier(bestSeasonRaceDays, [50, 65, 80, 95, 110])),
    threshold('vintageWine', resolveThresholdTier(veteranWins, [1, 2, 3, 5, 8])),
    threshold('roadWarrior', resolveThresholdTier(awayWins, [5, 15, 30, 50, 80])),
    threshold('kamikaze', resolveThresholdTier((hof.allTimeAttacks ?? 0) >= 20 ? kamikazeRatio : 0, [15, 30, 50, 80, 120])),
    threshold('smashGrab', resolveThresholdTier(breakawayWins, [1, 3, 5, 10, 20])),
    threshold('groundhogDay', resolveThresholdTier(groundhogStreak, [3, 4, 5, 6, 7])),
    threshold('nightShift', resolveThresholdTier(fullMoonPodiums, [1, 3, 5, 8, 12])),
    threshold('ironHorse', resolveThresholdTier(cleanStreakBest, [20, 40, 60, 90, 120])),
    threshold('marathonFinisher', resolveThresholdTier(grandToursFinished, [1, 3, 6, 10, 15])),
    threshold('wardrobeMalfunction', resolveThresholdTier(multiJerseyDays, [1, 5, 15, 30, 50])),
    threshold('pointAccumulator', resolveThresholdTier(bestSeasonUciPoints, [2000, 3000, 4000, 5000, 6000])),
    single('careerSlam', careerSlamDone),
    threshold('phantomGc', resolveThresholdTier(phantomGcWins, [1, 2, 3, 4, 5])),
    threshold('firstBlood', resolveThresholdTier(firstBloodWins, [1, 3, 5, 7, 10])),
    threshold('hatTrickHero', resolveThresholdTier(hatTrickRaces, [1, 2, 3, 4, 5])),
    threshold('whereHills', resolveThresholdTier(whereHillsWins, [2, 4, 6, 8, 10])),
    threshold('springKing', resolveThresholdTier(springWins, [2, 4, 6, 8, 10])),
    threshold('gcStayer', resolveThresholdTier(gcStayerTopTen, [2, 4, 6, 8, 10])),
    threshold('fogRider', resolveThresholdTier(fogWins, [2, 4, 6, 8, 10])),
    threshold('stormRider', resolveThresholdTier(stormWins, [2, 4, 6, 8, 10])),
    single('punchyClimber', punchyClimberDone),
    single('perennialSecond', perennialSecondDone),
    threshold('longHaul', resolveThresholdTier(longHaulWins, [2, 4, 6, 8, 10])),
    single('staminaMachine', staminaWins >= 1),
    threshold('verticalLimit', resolveThresholdTier(verticalLimitWins, [2, 4, 6, 8, 10])),
    threshold('lanterneRouge', resolveThresholdTier(lanterneRougeStage, [1, 3, 5, 10, 20])),
    threshold('redLanternLegend', resolveThresholdTier(lanterneRougeGt, [1, 2, 3, 5, 8])),
    threshold('broomWagonRegular', resolveThresholdTier(lanterneRougeSr, [1, 3, 5, 8, 12])),
    threshold('timeCutSpecialist', resolveThresholdTier(timeCutFinishes, [1, 3, 5, 10, 20])),
    threshold('teamEffort', resolveThresholdTier(teamEffortPodiums, [1, 3, 6, 10, 15])),
    threshold('oneManTeam', resolveThresholdTier(oneManTeam, [5, 10, 15, 20, 25])),
    threshold('gcBySeconds', resolveThresholdTier(gcBySeconds, [1, 2, 3, 4, 5])),
    threshold('notBitterEnd', resolveThresholdTier(bitterEndDnf, [1, 2, 3, 4, 5])),
    threshold('hotStreak', resolveThresholdTier(winStreakBest, [2, 4, 6, 8, 10])),
    threshold('waterCarrier', resolveThresholdTier(waterCarrierDays, [100, 200, 300, 400, 500])),
    threshold('superDomestique', resolveThresholdTier(superDomestiqueLeadouts, [10, 25, 50, 100, 200])),
    threshold('loyalLieutenant', resolveThresholdTier(lieutenantSeasons, [2, 4, 6, 8, 10])),
    threshold('packesel', resolveThresholdTier(brkKms, [2500, 5000, 7500, 10000, 15000])),
    threshold('kingmaker', resolveThresholdTier(kingmakerCount, [1, 2, 3, 4, 5])),
    threshold('theFranchise', resolveThresholdTier(franchiseSeasons, [1, 2, 3, 4, 5])),
    threshold('bandOfBrothers', resolveThresholdTier(bandOfBrothersBest, [5, 6, 7, 8, 10])),
    threshold('cleanSweep', resolveThresholdTier(cleanSweepCount, [1, 2, 3, 4, 5])),
    threshold('cleanSweepPlus', resolveThresholdTier(cleanSweepPlusCount, [1, 2, 3, 4, 5])),
    single('hottestPick', hottestPick),
    threshold('mrReliable', resolveThresholdTier(mrReliableSeasons, [1, 2, 3, 5, 8])),
    single('instantImpact', instantImpact),
    threshold('outOfDark', resolveThresholdTier(outOfDarkWins, [1, 2, 3, 4, 5])),
    threshold('hotStreakOpener', resolveThresholdTier(hotStreakOpenerSeasons, [1, 2, 3, 4, 5])),
    threshold('peakPerformer', resolveThresholdTier(peakPerformerWins, [1, 3, 5, 8, 12])),
    threshold('theYoyo', resolveThresholdTier(yoyoRaces, [1, 3, 5, 10, 12])),
    threshold('prologuePrince', resolveThresholdTier(prologueWins, [1, 2, 3, 5, 8])),
    threshold('autumnKing', resolveThresholdTier(autumnWins, [2, 4, 6, 8, 10])),
    threshold('grandFinale', resolveThresholdTier(grandFinaleWins, [1, 2, 3, 4, 5])),
    threshold('theProdigy', resolveThresholdTier(prodigyWins, [1, 2, 3, 4, 5])),
    single('lastDance', lastDanceWin),
    threshold('gtRunnerUp', resolveThresholdTier(gtRunnerUp, [1, 2, 3, 4, 5])),
    threshold('theUndertaker', resolveThresholdTier(undertakerWins, [1, 2, 3, 4, 5])),
    single('greenGrandSlam', greenGrandSlam),
    threshold('escapeToVictory', resolveThresholdTier(escapeToVictory, [1, 3, 5, 8, 12])),
    threshold('podiumLockout', resolveThresholdTier(podiumLockout, [1, 2, 3, 5, 8])),
    threshold('jerseyGuardian', resolveThresholdTier(jerseyStreakBest, [3, 6, 10, 15, 21])),
    threshold('photoFinishKing', resolveThresholdTier(photoFinishWins, [1, 3, 5, 8, 12])),
    threshold('soClose', resolveThresholdTier(soClose, [1, 3, 5, 8, 12])),
    threshold('pointsPerfectionist', resolveThresholdTier(pointsPerfectionist, [1, 2, 3, 4, 5])),
    threshold('thirdWeekWonder', resolveThresholdTier(thirdWeekWonder, [1, 2, 3, 4, 5])),
    single('monumentSweep', monumentSweep),
    threshold('babyFace', resolveThresholdTier(babyFaceWins, [1, 3, 5, 8, 12])),
    threshold('workhorse', resolveThresholdTier(workhorseDays, [100, 200, 300, 400, 500])),
    threshold('longBreakaway', resolveThresholdTier(longBreakawayWins, [1, 2, 3, 5, 8])),
  ];
}
