import { ParsedStageSegment, Race, Rider, Stage, TimeTrialEntry, TimeTrialResult } from '../../../shared/types';
import { buildSkillWeightRuleMap, resolveSkillWeightSimulationMode, resolveWeightedSkillFromSkills, SkillWeightRule } from '../../../shared/skillWeights';
import { StageParser } from './StageParser';

const SPEED_BASE_FLAT     = 50.0;
const SPEED_BASE_HILLY    = 41.0;
const SPEED_BASE_MOUNTAIN = 30.0;
const ATTR_SPEED_FACTOR   = 0.28;
const FORM_MIN  = 0.88;
const FORM_MAX  = 1.12;
const NOISE_RANGE = 0.015;
const TECH_PENALTY_FACTOR = 0.0025;
const WIND_FACTOR = 0.003;

function resolveFormBonus(rider: Rider): number {
  return (rider.formBonus ?? 0)
    + (rider.raceFormBonus ?? 0)
    - ((rider.fatigueMalus ?? 0) + (rider.longTermFatigueMalus ?? 0) + (rider.shortTermFatigueMalus ?? 0)) * 0.5;
}

export class TimeTrialSimulator {
  static sampleDayFormFactor(): number {
    return FORM_MIN + Math.random() * (FORM_MAX - FORM_MIN);
  }

  static simulate(race: Race, stage: Stage, riders: Rider[], skillWeightRules: SkillWeightRule[] = []): TimeTrialResult {
    const segments = StageParser.parseStageProfile(stage.detailsCsvFile, stage.startElevation);
    const skillWeightRuleMap = buildSkillWeightRuleMap(skillWeightRules);
    const distanceKm = segments.reduce((sum, segment) => sum + segment.length_km, 0);

    const entries: TimeTrialEntry[] = riders.map(rider =>
      TimeTrialSimulator.simulateRider(rider, stage.profile, segments, skillWeightRuleMap),
    );
    entries.sort((a, b) => a.finishTimeSeconds - b.finishTimeSeconds);

    const leaderTime = entries[0].finishTimeSeconds;
    for (const entry of entries) {
      entry.gapSeconds   = entry.finishTimeSeconds - leaderTime;
      entry.gapFormatted = entry.gapSeconds === 0
        ? 'Führend'
        : '+' + TimeTrialSimulator.formatGap(entry.gapSeconds);
    }

    return {
      raceId: race.id,
      raceName: race.isStageRace ? `${race.name} - Etappe ${stage.stageNumber}` : race.name,
      distanceKm,
      season: Number.parseInt(stage.date.slice(0, 4), 10),
      date: stage.date,
      entries,
    };
  }

  private static resolveBaseSpeed(segment: ParsedStageSegment): number {
    if (segment.terrain === 'Cobble') {
      return SPEED_BASE_HILLY - 3;
    }
    if (segment.gradient_percent >= 5.0) return SPEED_BASE_MOUNTAIN;
    if (segment.gradient_percent >= 2.0) return SPEED_BASE_HILLY;
    return SPEED_BASE_FLAT;
  }

  private static simulateRider(
    rider: Rider,
    stageProfile: Stage['profile'],
    segments: ParsedStageSegment[],
    skillWeightRuleMap: Map<string, SkillWeightRule['weights']>,
  ): TimeTrialEntry {
    const dayForm = TimeTrialSimulator.sampleDayFormFactor();
    const finishTimeSeconds = segments.reduce((sum, segment) => sum + TimeTrialSimulator.simulateSegment(rider, stageProfile, segment, dayForm, skillWeightRuleMap), 0);

    return {
      rider,
      dayFormFactor: Math.round(dayForm * 1000) / 1000,
      finishTimeSeconds,
      gapSeconds: 0,
      finishTimeFormatted: TimeTrialSimulator.formatTime(finishTimeSeconds),
      gapFormatted:        '',
    };
  }

  private static simulateSegment(
    rider: Rider,
    stageProfile: Stage['profile'],
    segment: ParsedStageSegment,
    dayForm: number,
    skillWeightRuleMap: Map<string, SkillWeightRule['weights']>,
  ): number {
    const segmentSkill = TimeTrialSimulator.resolveSegmentSkill(rider, stageProfile, segment, skillWeightRuleMap);
    return TimeTrialSimulator.simulateSegmentForEffectiveSkill(segment, segmentSkill * dayForm);
  }

  static resolveEffectiveSegmentSkill(
    rider: Rider,
    stageProfile: Stage['profile'],
    segment: ParsedStageSegment,
    dayForm: number,
    skillWeightRuleMap: Map<string, SkillWeightRule['weights']>,
  ): number {
    return TimeTrialSimulator.resolveSegmentSkill(rider, stageProfile, segment, skillWeightRuleMap) * dayForm;
  }

  static simulateSegmentForEffectiveSkill(segment: ParsedStageSegment, effectiveSkill: number): number {
    const baseSpeed = TimeTrialSimulator.resolveBaseSpeed(segment);
    const attrDelta = (effectiveSkill - 50) * ATTR_SPEED_FACTOR;
    const noise = (Math.random() * 2 - 1) * NOISE_RANGE;
    const techPenalty = 1 - ((segment.tech_level - 1) * TECH_PENALTY_FACTOR);
    const windPenalty = 1 - ((segment.wind_exp - 1) * WIND_FACTOR);
    const speed = Math.max(15, (baseSpeed + attrDelta) * (1 + noise) * techPenalty * windPenalty);
    return (segment.length_km / speed) * 3600;
  }

  private static resolveSegmentSkill(
    rider: Rider,
    stageProfile: Stage['profile'],
    segment: ParsedStageSegment,
    skillWeightRuleMap: Map<string, SkillWeightRule['weights']>,
  ): number {
    const formBonus = resolveFormBonus(rider);
    return resolveWeightedSkillFromSkills(
      rider.skills,
      resolveSkillWeightSimulationMode(stageProfile),
      segment.terrain,
      skillWeightRuleMap,
    ) + formBonus;
  }

  private static formatTime(totalSec: number): string {
    const h  = Math.floor(totalSec / 3600);
    const m  = Math.floor((totalSec % 3600) / 60);
    const s  = Math.floor(totalSec % 60);
    const ms = Math.round((totalSec % 1) * 10);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}.${ms}` : `${mm}:${ss}.${ms}`;
  }

  private static formatGap(gapSec: number): string {
    const m  = Math.floor(gapSec / 60);
    const s  = Math.floor(gapSec % 60);
    const ms = Math.round((gapSec % 1) * 10);
    const ss = String(s).padStart(2, '0');
    return `${m}:${ss}.${ms}`;
  }
}
