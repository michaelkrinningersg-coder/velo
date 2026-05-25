const fs = require('fs');
const path = require('path');

const HEADER = 'length_km,gradient_percent,terrain,tech_level,wind_exp,marker_type,marker_name,marker_cat,end_marker_type,end_marker_name,end_marker_cat';
const STAGES_DIR = path.resolve(__dirname, '..', '..', 'data', 'stages');
const CATALOG_PATH = path.join(STAGES_DIR, 'dummy_stage_catalog.md');

function formatNumber(value) {
  return Number(value).toFixed(2);
}

function createSegment(overrides = {}) {
  return {
    lengthKm: 3.2,
    gradientPercent: 0,
    terrain: 'Flat',
    techLevel: 5,
    windExp: 6,
    markerType: '',
    markerName: '',
    markerCat: '',
    endMarkerType: '',
    endMarkerName: '',
    endMarkerCat: '',
    ...overrides,
  };
}

function segmentToCsv(segment) {
  return [
    formatNumber(segment.lengthKm),
    formatNumber(segment.gradientPercent),
    segment.terrain,
    String(segment.techLevel),
    String(segment.windExp),
    segment.markerType || '',
    segment.markerName || '',
    segment.markerCat || '',
    segment.endMarkerType || '',
    segment.endMarkerName || '',
    segment.endMarkerCat || '',
  ].join(',');
}

function writeStage(fileName, segments) {
  const content = [HEADER, ...segments.map(segmentToCsv)].join('\n') + '\n';
  fs.writeFileSync(path.join(STAGES_DIR, fileName), content, 'utf8');
}

function setStartMarker(segments, name) {
  segments[0].markerType = 'start';
  segments[0].markerName = name;
  segments[0].markerCat = 'null';
}

function setFinishMarker(segments, type, name, cat = 'null') {
  const last = segments[segments.length - 1];
  last.endMarkerType = type;
  last.endMarkerName = name;
  last.endMarkerCat = cat;
}

function addSprint(segments, index, name) {
  const segment = segments[index];
  if (!segment) return;
  segment.endMarkerType = segment.endMarkerType ? `${segment.endMarkerType}|sprint_intermediate` : 'sprint_intermediate';
  segment.endMarkerName = segment.endMarkerName ? `${segment.endMarkerName}|${name}` : name;
  segment.endMarkerCat = segment.endMarkerCat ? `${segment.endMarkerCat}|Sprint` : 'Sprint';
}

function applyTerrainWindow(segments, start, values) {
  values.forEach((value, offset) => {
    const segment = segments[start + offset];
    if (!segment) return;
    Object.assign(segment, value);
  });
}

function applyClimb(segments, climb) {
  const { start, name, cat, profile, gradients, finishType, finishName } = climb;
  const terrain = profile;
  const climbSegments = gradients.map((gradient, offset) => ({
    gradientPercent: gradient,
    terrain,
    techLevel: terrain === 'High_Mountain' ? 7 : terrain === 'Mountain' ? 6 : terrain === 'Medium_Mountain' ? 6 : 5,
    windExp: terrain === 'High_Mountain' ? 4 : 5,
    lengthKm: terrain === 'High_Mountain' ? 2.8 : terrain === 'Mountain' ? 3.0 : terrain === 'Medium_Mountain' ? 3.1 : 3.2,
  }));
  applyTerrainWindow(segments, start, climbSegments);
  const first = segments[start];
  first.markerType = first.markerType ? `${first.markerType}|climb_start` : 'climb_start';
  first.markerName = first.markerName ? `${first.markerName}|${name}` : name;
  first.markerCat = first.markerCat ? `${first.markerCat}|null` : 'null';
  const lastIndex = start + gradients.length - 1;
  const last = segments[lastIndex];
  if (finishType) {
    last.endMarkerType = finishType;
    last.endMarkerName = finishName ?? name;
    last.endMarkerCat = cat;
  } else {
    last.endMarkerType = last.endMarkerType ? `${last.endMarkerType}|climb_top` : 'climb_top';
    last.endMarkerName = last.endMarkerName ? `${last.endMarkerName}|${name}` : name;
    last.endMarkerCat = last.endMarkerCat ? `${last.endMarkerCat}|${cat}` : cat;
  }

  const descentPattern = terrain === 'High_Mountain'
    ? [-6.4, -5.8, -4.9]
    : terrain === 'Mountain'
      ? [-5.9, -5.0, -4.1]
      : terrain === 'Medium_Mountain'
        ? [-4.8, -3.7]
        : [-4.0, -2.8];
  descentPattern.forEach((gradient, offset) => {
    const segment = segments[lastIndex + 1 + offset];
    if (!segment || lastIndex + 1 + offset >= segments.length - 1) return;
    segment.gradientPercent = gradient;
    segment.terrain = 'Abfahrt';
    segment.techLevel = 6;
    segment.windExp = 5;
    segment.lengthKm = terrain === 'High_Mountain' ? 3.1 : 2.7;
  });
}

function buildBaseSegments(count, pattern) {
  return Array.from({ length: count }, (_, index) => createSegment(pattern[index % pattern.length]));
}

const flatPattern = [
  { lengthKm: 3.8, gradientPercent: 0.3, terrain: 'Flat', techLevel: 4, windExp: 7 },
  { lengthKm: 3.1, gradientPercent: -0.2, terrain: 'Flat', techLevel: 4, windExp: 7 },
  { lengthKm: 3.5, gradientPercent: 0.7, terrain: 'Flat', techLevel: 4, windExp: 6 },
  { lengthKm: 2.8, gradientPercent: 1.1, terrain: 'Hill', techLevel: 5, windExp: 6 },
  { lengthKm: 2.6, gradientPercent: -1.5, terrain: 'Abfahrt', techLevel: 5, windExp: 6 },
  { lengthKm: 3.4, gradientPercent: 0.4, terrain: 'Flat', techLevel: 4, windExp: 7 },
];

const rollingPattern = [
  { lengthKm: 3.2, gradientPercent: 1.0, terrain: 'Flat', techLevel: 4, windExp: 6 },
  { lengthKm: 2.8, gradientPercent: 2.4, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 2.4, gradientPercent: -2.1, terrain: 'Abfahrt', techLevel: 5, windExp: 5 },
  { lengthKm: 3.0, gradientPercent: 0.8, terrain: 'Flat', techLevel: 4, windExp: 6 },
  { lengthKm: 2.6, gradientPercent: 3.1, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 2.5, gradientPercent: -2.8, terrain: 'Abfahrt', techLevel: 5, windExp: 5 },
];

const hillyPattern = [
  { lengthKm: 3.1, gradientPercent: 1.8, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 2.7, gradientPercent: 3.6, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 2.2, gradientPercent: -3.2, terrain: 'Abfahrt', techLevel: 6, windExp: 5 },
  { lengthKm: 3.0, gradientPercent: 1.1, terrain: 'Flat', techLevel: 4, windExp: 6 },
  { lengthKm: 2.8, gradientPercent: 4.0, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 2.3, gradientPercent: -2.5, terrain: 'Abfahrt', techLevel: 6, windExp: 5 },
];

const mediumMountainPattern = [
  { lengthKm: 3.3, gradientPercent: 1.2, terrain: 'Flat', techLevel: 4, windExp: 6 },
  { lengthKm: 3.1, gradientPercent: 3.8, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 3.0, gradientPercent: 5.2, terrain: 'Medium_Mountain', techLevel: 6, windExp: 5 },
  { lengthKm: 2.6, gradientPercent: -4.8, terrain: 'Abfahrt', techLevel: 6, windExp: 5 },
  { lengthKm: 3.0, gradientPercent: 2.0, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 2.8, gradientPercent: -2.0, terrain: 'Flat', techLevel: 4, windExp: 6 },
];

const cobblePattern = [
  { lengthKm: 3.2, gradientPercent: 0.6, terrain: 'Flat', techLevel: 5, windExp: 7 },
  { lengthKm: 2.1, gradientPercent: 1.4, terrain: 'Cobble', techLevel: 7, windExp: 6 },
  { lengthKm: 2.6, gradientPercent: -0.7, terrain: 'Flat', techLevel: 5, windExp: 7 },
  { lengthKm: 2.0, gradientPercent: 1.9, terrain: 'Cobble', techLevel: 7, windExp: 6 },
  { lengthKm: 2.8, gradientPercent: 0.8, terrain: 'Flat', techLevel: 5, windExp: 7 },
  { lengthKm: 1.9, gradientPercent: 2.3, terrain: 'Cobble', techLevel: 7, windExp: 6 },
];

const cobbleHillPattern = [
  { lengthKm: 2.8, gradientPercent: 1.2, terrain: 'Flat', techLevel: 5, windExp: 6 },
  { lengthKm: 1.9, gradientPercent: 3.2, terrain: 'Cobble_Hill', techLevel: 7, windExp: 5 },
  { lengthKm: 2.0, gradientPercent: -2.1, terrain: 'Abfahrt', techLevel: 6, windExp: 5 },
  { lengthKm: 2.5, gradientPercent: 2.5, terrain: 'Hill', techLevel: 5, windExp: 5 },
  { lengthKm: 1.8, gradientPercent: 4.0, terrain: 'Cobble_Hill', techLevel: 7, windExp: 5 },
  { lengthKm: 2.2, gradientPercent: -1.3, terrain: 'Flat', techLevel: 5, windExp: 6 },
];

function buildRoadStage(spec) {
  const segments = buildBaseSegments(spec.segmentCount, spec.pattern);
  setStartMarker(segments, spec.startName);

  for (const sprint of spec.sprints || []) {
    addSprint(segments, sprint.index, sprint.name);
  }

  for (const climb of spec.climbs || []) {
    applyClimb(segments, climb);
  }

  for (const window of spec.overrides || []) {
    applyTerrainWindow(segments, window.start, window.values);
  }

  if (!segments[segments.length - 1].endMarkerType && (spec.finishType === 'finish_hill' || spec.finishType === 'finish_mountain')) {
    const finishStart = Math.max(segments.length - 4, 0);
    const finishTerrain = spec.finishType === 'finish_mountain'
      ? (spec.profile === 'High_Mountain' ? 'High_Mountain' : 'Mountain')
      : 'Hill';
    const finishGradients = spec.finishType === 'finish_mountain'
      ? [5.9, 6.4, 6.8, 6.1]
      : [4.5, 5.1, 5.4, 4.7];
    applyClimb(segments, {
      start: finishStart,
      name: spec.finishName,
      cat: spec.finishCat || '3',
      profile: finishTerrain,
      gradients: finishGradients,
      finishType: spec.finishType,
      finishName: spec.finishName,
    });
  }

  if (!segments[segments.length - 1].endMarkerType) {
    setFinishMarker(segments, spec.finishType, spec.finishName, spec.finishCat || 'null');
  }

  return segments;
}

function buildTimeTrialStage(spec, isTeamTrial) {
  const defaultPattern = isTeamTrial
    ? [
        { lengthKm: 1.0, gradientPercent: 0.3, terrain: 'Flat', techLevel: 5, windExp: 6 },
        { lengthKm: 0.9, gradientPercent: 0.8, terrain: 'Flat', techLevel: 5, windExp: 6 },
        { lengthKm: 0.8, gradientPercent: -0.5, terrain: 'Flat', techLevel: 6, windExp: 5 },
        { lengthKm: 0.9, gradientPercent: 1.1, terrain: 'Hill', techLevel: 6, windExp: 5 },
      ]
    : [
        { lengthKm: 0.8, gradientPercent: 0.4, terrain: 'Flat', techLevel: 6, windExp: 5 },
        { lengthKm: 0.7, gradientPercent: 1.0, terrain: 'Flat', techLevel: 6, windExp: 5 },
        { lengthKm: 0.7, gradientPercent: -0.6, terrain: 'Flat', techLevel: 7, windExp: 4 },
        { lengthKm: 0.8, gradientPercent: 1.6, terrain: 'Hill', techLevel: 7, windExp: 4 },
      ];
  const segments = buildBaseSegments(spec.segmentCount, spec.pattern || defaultPattern);
  setStartMarker(segments, spec.startName);
  for (const sprint of spec.sprints || []) {
    addSprint(segments, sprint.index, sprint.name);
  }
  for (const window of spec.overrides || []) {
    applyTerrainWindow(segments, window.start, window.values);
  }
  if (spec.targetDistanceKm) {
    const baseDistance = estimateDistance(segments);
    const scaleFactor = spec.targetDistanceKm / baseDistance;
    segments.forEach((segment) => {
      segment.lengthKm = Math.max(0.05, Number((segment.lengthKm * scaleFactor).toFixed(2)));
    });
    const distanceDelta = Number((spec.targetDistanceKm - estimateDistance(segments)).toFixed(2));
    if (Math.abs(distanceDelta) >= 0.01) {
      segments[segments.length - 1].lengthKm = Number((segments[segments.length - 1].lengthKm + distanceDelta).toFixed(2));
    }
  }
  setFinishMarker(segments, 'finish_TT', spec.finishName, 'null');
  return segments;
}

const stageSpecs = [
  { fileName: 'dummy_flat_a.csv', profile: 'Flat', label: 'Flat A', note: 'Breiter Sprinttag mit zwei Zwischensprints und flachem Finale.', builder: () => buildRoadStage({ segmentCount: 34, pattern: flatPattern, startName: 'Dummy Flat A Start', sprints: [{ index: 10, name: 'Flat A Sprint 1' }, { index: 23, name: 'Flat A Sprint 2' }], finishType: 'finish_flat', finishName: 'Dummy Flat A Finish' }) },
  { fileName: 'dummy_flat_b.csv', profile: 'Flat', label: 'Flat B', note: 'Windiger Flachkurs mit spaetem Sprint und leichtem Wellenfinale.', builder: () => buildRoadStage({ segmentCount: 38, pattern: flatPattern, startName: 'Dummy Flat B Start', sprints: [{ index: 13, name: 'Flat B Sprint 1' }, { index: 28, name: 'Flat B Sprint 2' }], overrides: [{ start: 30, values: [{ gradientPercent: 1.6, terrain: 'Hill' }, { gradientPercent: 0.9, terrain: 'Flat' }, { gradientPercent: -1.3, terrain: 'Abfahrt' }] }], finishType: 'finish_flat', finishName: 'Dummy Flat B Finish' }) },
  { fileName: 'dummy_flat_c.csv', profile: 'Flat', label: 'Flat C', note: 'Langer Flachkurs mit kurzem Kopfwindblock und ruhigem Sprintfinish.', builder: () => buildRoadStage({ segmentCount: 42, pattern: flatPattern, startName: 'Dummy Flat C Start', sprints: [{ index: 15, name: 'Flat C Sprint 1' }, { index: 31, name: 'Flat C Sprint 2' }], finishType: 'finish_flat', finishName: 'Dummy Flat C Finish' }) },

  { fileName: 'dummy_rolling_a.csv', profile: 'Rolling', label: 'Rolling A', note: 'Rollender Kurs mit vielen kleinen Wellen und zwei Sprints.', builder: () => buildRoadStage({ segmentCount: 36, pattern: rollingPattern, startName: 'Dummy Rolling A Start', sprints: [{ index: 11, name: 'Rolling A Sprint 1' }, { index: 25, name: 'Rolling A Sprint 2' }], finishType: 'finish_flat', finishName: 'Dummy Rolling A Finish' }) },
  { fileName: 'dummy_rolling_b.csv', profile: 'Rolling', label: 'Rolling B', note: 'Welliger Tagesverlauf mit spaeten Rampen im letzten Viertel.', builder: () => buildRoadStage({ segmentCount: 40, pattern: rollingPattern, startName: 'Dummy Rolling B Start', sprints: [{ index: 14, name: 'Rolling B Sprint 1' }], overrides: [{ start: 30, values: [{ gradientPercent: 3.7, terrain: 'Hill' }, { gradientPercent: 4.2, terrain: 'Hill' }, { gradientPercent: -3.2, terrain: 'Abfahrt' }, { gradientPercent: 2.1, terrain: 'Hill' }] }], finishType: 'finish_flat', finishName: 'Dummy Rolling B Finish' }) },
  { fileName: 'dummy_rolling_c.csv', profile: 'Rolling', label: 'Rolling C', note: 'Lange Übergangsetappe mit verstreuten Wellen und leichtem Finale.', builder: () => buildRoadStage({ segmentCount: 44, pattern: rollingPattern, startName: 'Dummy Rolling C Start', sprints: [{ index: 17, name: 'Rolling C Sprint 1' }, { index: 33, name: 'Rolling C Sprint 2' }], finishType: 'finish_hill', finishName: 'Dummy Rolling C Finish', finishCat: '4' }) },

  { fileName: 'dummy_hilly_a.csv', profile: 'Hilly', label: 'Hilly A', note: 'Puncheur-Etappe mit zwei kleineren kategorisierten Anstiegen und flachem Ziel.', builder: () => buildRoadStage({ segmentCount: 38, pattern: hillyPattern, startName: 'Dummy Hilly A Start', sprints: [{ index: 12, name: 'Hilly A Sprint 1' }], climbs: [{ start: 8, name: 'Hilly A Climb 1', cat: '4', profile: 'Hill', gradients: [4.8, 5.2, 4.5] }, { start: 24, name: 'Hilly A Climb 2', cat: '3', profile: 'Hill', gradients: [5.1, 5.5, 4.9, 4.3] }], finishType: 'finish_flat', finishName: 'Dummy Hilly A Finish' }) },
  { fileName: 'dummy_hilly_b.csv', profile: 'Hilly', label: 'Hilly B', note: 'Wellenreicher Kurs mit spaetem Punch-Finale.', builder: () => buildRoadStage({ segmentCount: 42, pattern: hillyPattern, startName: 'Dummy Hilly B Start', sprints: [{ index: 15, name: 'Hilly B Sprint 1' }, { index: 27, name: 'Hilly B Sprint 2' }], climbs: [{ start: 10, name: 'Hilly B Climb 1', cat: '4', profile: 'Hill', gradients: [4.5, 4.9, 4.4] }], overrides: [{ start: 34, values: [{ gradientPercent: 5.2, terrain: 'Hill' }, { gradientPercent: 5.7, terrain: 'Hill' }, { gradientPercent: 4.8, terrain: 'Hill' }] }], finishType: 'finish_hill', finishName: 'Dummy Hilly B Finish', finishCat: '3' }) },
  { fileName: 'dummy_hilly_c.csv', profile: 'Hilly', label: 'Hilly C', note: 'Selektive Klassikeretappe mit wiederholten Kuppen und leichtem Schlussanstieg.', builder: () => buildRoadStage({ segmentCount: 46, pattern: hillyPattern, startName: 'Dummy Hilly C Start', sprints: [{ index: 13, name: 'Hilly C Sprint 1' }], climbs: [{ start: 7, name: 'Hilly C Climb 1', cat: '4', profile: 'Hill', gradients: [4.7, 4.8, 4.2] }, { start: 21, name: 'Hilly C Climb 2', cat: '3', profile: 'Hill', gradients: [5.6, 5.9, 5.3, 4.8] }], finishType: 'finish_hill', finishName: 'Dummy Hilly C Finish', finishCat: '4' }) },

  { fileName: 'dummy_hilly_difficult_a.csv', profile: 'Hilly_Difficult', label: 'Hilly_Difficult A', note: 'Zwei fruehe Anstiege, danach welliges Finale.', builder: () => buildRoadStage({ segmentCount: 44, pattern: hillyPattern, startName: 'Dummy Hilly Difficult A Start', sprints: [{ index: 18, name: 'HD A Sprint 1' }], climbs: [{ start: 5, name: 'HD A Climb 1', cat: '3', profile: 'Hill', gradients: [5.8, 6.1, 5.7, 4.9] }, { start: 14, name: 'HD A Climb 2', cat: '2', profile: 'Hill', gradients: [6.4, 6.8, 6.1, 5.5, 4.9] }], finishType: 'finish_hill', finishName: 'Dummy Hilly Difficult A Finish', finishCat: '3' }) },
  { fileName: 'dummy_hilly_difficult_b.csv', profile: 'Hilly_Difficult', label: 'Hilly_Difficult B', note: 'Doppelanstieg im Mittelteil und flache Ausrollphase.', builder: () => buildRoadStage({ segmentCount: 46, pattern: hillyPattern, startName: 'Dummy Hilly Difficult B Start', climbs: [{ start: 12, name: 'HD B Climb 1', cat: '3', profile: 'Hill', gradients: [5.9, 6.2, 5.6, 5.0] }, { start: 20, name: 'HD B Climb 2', cat: '2', profile: 'Hill', gradients: [6.8, 7.2, 6.4, 5.8, 5.0] }], sprints: [{ index: 31, name: 'HD B Sprint 1' }], finishType: 'finish_flat', finishName: 'Dummy Hilly Difficult B Finish' }) },
  { fileName: 'dummy_hilly_difficult_c.csv', profile: 'Hilly_Difficult', label: 'Hilly_Difficult C', note: 'Langer Schlussanstieg nach ruhigem Mittelteil.', builder: () => buildRoadStage({ segmentCount: 48, pattern: hillyPattern, startName: 'Dummy Hilly Difficult C Start', sprints: [{ index: 17, name: 'HD C Sprint 1' }], climbs: [{ start: 38, name: 'HD C Summit Finish', cat: '2', profile: 'Hill', gradients: [5.9, 6.3, 6.6, 6.4, 6.1, 5.4], finishType: 'finish_hill', finishName: 'Dummy Hilly Difficult C Finish' }], finishType: 'finish_hill', finishName: 'Dummy Hilly Difficult C Finish', finishCat: '2' }) },
  { fileName: 'dummy_hilly_difficult_d.csv', profile: 'Hilly_Difficult', label: 'Hilly_Difficult D', note: 'Viele kurze Rampen ueber den ganzen Tag verteilt.', builder: () => buildRoadStage({ segmentCount: 50, pattern: hillyPattern, startName: 'Dummy Hilly Difficult D Start', climbs: [{ start: 6, name: 'HD D Ramp 1', cat: '4', profile: 'Hill', gradients: [5.1, 5.4, 4.8] }, { start: 17, name: 'HD D Ramp 2', cat: '3', profile: 'Hill', gradients: [6.0, 6.3, 5.6, 4.8] }, { start: 29, name: 'HD D Ramp 3', cat: '3', profile: 'Hill', gradients: [5.8, 6.2, 5.7, 5.0] }, { start: 40, name: 'HD D Ramp 4', cat: '4', profile: 'Hill', gradients: [4.9, 5.1, 4.6] }], finishType: 'finish_flat', finishName: 'Dummy Hilly Difficult D Finish' }) },
  { fileName: 'dummy_hilly_difficult_e.csv', profile: 'Hilly_Difficult', label: 'Hilly_Difficult E', note: 'Schwere Kette im letzten Drittel mit Abfahrt ins Ziel.', builder: () => buildRoadStage({ segmentCount: 52, pattern: hillyPattern, startName: 'Dummy Hilly Difficult E Start', sprints: [{ index: 14, name: 'HD E Sprint 1' }], climbs: [{ start: 30, name: 'HD E Climb 1', cat: '3', profile: 'Hill', gradients: [5.8, 6.0, 5.7, 4.9] }, { start: 38, name: 'HD E Climb 2', cat: '2', profile: 'Hill', gradients: [6.7, 7.0, 6.5, 6.0, 5.4] }], finishType: 'finish_flat', finishName: 'Dummy Hilly Difficult E Finish' }) },
  { fileName: 'dummy_hilly_difficult_f.csv', profile: 'Hilly_Difficult', label: 'Hilly_Difficult F', note: 'Drei selektive Huegel und kurzer Schlussanstieg.', builder: () => buildRoadStage({ segmentCount: 54, pattern: hillyPattern, startName: 'Dummy Hilly Difficult F Start', climbs: [{ start: 8, name: 'HD F Climb 1', cat: '4', profile: 'Hill', gradients: [5.0, 5.3, 4.7] }, { start: 22, name: 'HD F Climb 2', cat: '3', profile: 'Hill', gradients: [6.1, 6.4, 5.8, 5.0] }, { start: 45, name: 'HD F Finale', cat: '2', profile: 'Hill', gradients: [6.4, 6.9, 6.6, 5.8, 5.1], finishType: 'finish_hill', finishName: 'Dummy Hilly Difficult F Finish' }], finishType: 'finish_hill', finishName: 'Dummy Hilly Difficult F Finish', finishCat: '2' }) },

  { fileName: 'dummy_medium_mountain_a.csv', profile: 'Medium_Mountain', label: 'Medium_Mountain A', note: 'Uebergangsetappe mit zwei mittleren Anstiegen und sprintarmer Schlussphase.', builder: () => buildRoadStage({ segmentCount: 44, pattern: mediumMountainPattern, startName: 'Dummy Medium Mountain A Start', climbs: [{ start: 9, name: 'MMA Climb 1', cat: '3', profile: 'Medium_Mountain', gradients: [5.4, 5.8, 5.2, 4.7] }, { start: 27, name: 'MMA Climb 2', cat: '2', profile: 'Medium_Mountain', gradients: [6.0, 6.4, 6.1, 5.5, 4.8] }], finishType: 'finish_flat', finishName: 'Dummy Medium Mountain A Finish' }) },
  { fileName: 'dummy_medium_mountain_b.csv', profile: 'Medium_Mountain', label: 'Medium_Mountain B', note: 'Mittlere Bergetappe mit spaeter Anfahrt und Hill-Finish.', builder: () => buildRoadStage({ segmentCount: 48, pattern: mediumMountainPattern, startName: 'Dummy Medium Mountain B Start', sprints: [{ index: 15, name: 'MMB Sprint 1' }], climbs: [{ start: 18, name: 'MMB Climb 1', cat: '3', profile: 'Medium_Mountain', gradients: [5.6, 5.9, 5.4, 4.9] }, { start: 39, name: 'MMB Finish Climb', cat: '2', profile: 'Medium_Mountain', gradients: [6.1, 6.5, 6.2, 5.7, 5.1], finishType: 'finish_hill', finishName: 'Dummy Medium Mountain B Finish' }], finishType: 'finish_hill', finishName: 'Dummy Medium Mountain B Finish', finishCat: '2' }) },
  { fileName: 'dummy_medium_mountain_c.csv', profile: 'Medium_Mountain', label: 'Medium_Mountain C', note: 'Drei kuerzere Anstiege mit Abfahrt ins Ziel.', builder: () => buildRoadStage({ segmentCount: 52, pattern: mediumMountainPattern, startName: 'Dummy Medium Mountain C Start', climbs: [{ start: 7, name: 'MMC Climb 1', cat: '4', profile: 'Medium_Mountain', gradients: [5.2, 5.5, 5.0] }, { start: 21, name: 'MMC Climb 2', cat: '3', profile: 'Medium_Mountain', gradients: [5.9, 6.2, 5.8, 5.1] }, { start: 35, name: 'MMC Climb 3', cat: '2', profile: 'Medium_Mountain', gradients: [6.3, 6.7, 6.2, 5.7, 5.0] }], finishType: 'finish_flat', finishName: 'Dummy Medium Mountain C Finish' }) },

  { fileName: 'dummy_mountain_a.csv', profile: 'Mountain', label: 'Mountain A', note: 'Fruehe Hauptselektion, danach langer Abfahrts- und Uebergangsteil.', builder: () => buildRoadStage({ segmentCount: 50, pattern: mediumMountainPattern, startName: 'Dummy Mountain A Start', climbs: [{ start: 8, name: 'Mountain A Pass', cat: '1', profile: 'Mountain', gradients: [6.4, 6.8, 7.0, 6.6, 6.1, 5.7] }, { start: 32, name: 'Mountain A Climb 2', cat: '2', profile: 'Medium_Mountain', gradients: [5.8, 6.1, 5.7, 5.0] }], finishType: 'finish_flat', finishName: 'Dummy Mountain A Finish' }) },
  { fileName: 'dummy_mountain_b.csv', profile: 'Mountain', label: 'Mountain B', note: 'Doppelanstieg im Mittelteil und kurzes Bergfinish.', builder: () => buildRoadStage({ segmentCount: 52, pattern: mediumMountainPattern, startName: 'Dummy Mountain B Start', climbs: [{ start: 15, name: 'Mountain B Climb 1', cat: '2', profile: 'Mountain', gradients: [6.1, 6.5, 6.8, 6.4, 5.8] }, { start: 26, name: 'Mountain B Climb 2', cat: '1', profile: 'Mountain', gradients: [6.7, 7.0, 7.2, 6.9, 6.3, 5.7] }, { start: 45, name: 'Mountain B Finale', cat: '2', profile: 'Mountain', gradients: [6.3, 6.7, 6.2, 5.6], finishType: 'finish_mountain', finishName: 'Dummy Mountain B Finish' }], finishType: 'finish_mountain', finishName: 'Dummy Mountain B Finish', finishCat: '2' }) },
  { fileName: 'dummy_mountain_c.csv', profile: 'Mountain', label: 'Mountain C', note: 'Langer Schlussanstieg nach einfachem Beginn.', builder: () => buildRoadStage({ segmentCount: 54, pattern: mediumMountainPattern, startName: 'Dummy Mountain C Start', sprints: [{ index: 18, name: 'Mountain C Sprint 1' }], climbs: [{ start: 39, name: 'Mountain C Summit', cat: '1', profile: 'Mountain', gradients: [6.4, 6.8, 7.1, 7.0, 6.7, 6.1], finishType: 'finish_mountain', finishName: 'Dummy Mountain C Finish' }], finishType: 'finish_mountain', finishName: 'Dummy Mountain C Finish', finishCat: '1' }) },
  { fileName: 'dummy_mountain_d.csv', profile: 'Mountain', label: 'Mountain D', note: 'Viele kuerzere Berge mit flachem Ziel.', builder: () => buildRoadStage({ segmentCount: 56, pattern: mediumMountainPattern, startName: 'Dummy Mountain D Start', climbs: [{ start: 10, name: 'Mountain D Climb 1', cat: '2', profile: 'Mountain', gradients: [6.0, 6.4, 6.1, 5.4] }, { start: 22, name: 'Mountain D Climb 2', cat: '2', profile: 'Mountain', gradients: [6.3, 6.7, 6.3, 5.7] }, { start: 35, name: 'Mountain D Climb 3', cat: '1', profile: 'Mountain', gradients: [6.8, 7.1, 7.0, 6.4, 5.8] }, { start: 46, name: 'Mountain D Climb 4', cat: '2', profile: 'Medium_Mountain', gradients: [5.8, 6.1, 5.7, 5.0] }], finishType: 'finish_flat', finishName: 'Dummy Mountain D Finish' }) },
  { fileName: 'dummy_mountain_e.csv', profile: 'Mountain', label: 'Mountain E', note: 'Ein langer Zentralpass und steile Zielrampe.', builder: () => buildRoadStage({ segmentCount: 58, pattern: mediumMountainPattern, startName: 'Dummy Mountain E Start', climbs: [{ start: 16, name: 'Mountain E Long Pass', cat: '1', profile: 'Mountain', gradients: [5.9, 6.2, 6.5, 6.7, 6.6, 6.2, 5.8] }, { start: 50, name: 'Mountain E Finale', cat: '1', profile: 'Mountain', gradients: [6.7, 7.0, 7.3, 6.8, 6.1], finishType: 'finish_mountain', finishName: 'Dummy Mountain E Finish' }], finishType: 'finish_mountain', finishName: 'Dummy Mountain E Finish', finishCat: '1' }) },
  { fileName: 'dummy_mountain_f.csv', profile: 'Mountain', label: 'Mountain F', note: 'Schwere Kletterkette im letzten Drittel mit Bergankunft.', builder: () => buildRoadStage({ segmentCount: 60, pattern: mediumMountainPattern, startName: 'Dummy Mountain F Start', climbs: [{ start: 31, name: 'Mountain F Climb 1', cat: '2', profile: 'Mountain', gradients: [6.2, 6.5, 6.1, 5.6] }, { start: 40, name: 'Mountain F Climb 2', cat: '1', profile: 'Mountain', gradients: [6.8, 7.1, 7.0, 6.5, 5.8] }, { start: 54, name: 'Mountain F Summit Finish', cat: '1', profile: 'Mountain', gradients: [6.9, 7.2, 7.5, 7.1, 6.4, 5.9], finishType: 'finish_mountain', finishName: 'Dummy Mountain F Finish' }], finishType: 'finish_mountain', finishName: 'Dummy Mountain F Finish', finishCat: '1' }) },

  { fileName: 'dummy_high_mountain_a.csv', profile: 'High_Mountain', label: 'High_Mountain A', note: 'Frueher Hochgebirgspass und lange Talphase.', builder: () => buildRoadStage({ segmentCount: 56, pattern: mediumMountainPattern, startName: 'Dummy High Mountain A Start', climbs: [{ start: 9, name: 'High Mountain A Pass', cat: 'HC', profile: 'High_Mountain', gradients: [6.9, 7.2, 7.5, 7.3, 7.0, 6.6, 6.1] }, { start: 38, name: 'High Mountain A Climb 2', cat: '1', profile: 'Mountain', gradients: [6.5, 6.8, 6.6, 6.0, 5.4] }], finishType: 'finish_flat', finishName: 'Dummy High Mountain A Finish' }) },
  { fileName: 'dummy_high_mountain_b.csv', profile: 'High_Mountain', label: 'High_Mountain B', note: 'Zwei grosse Paesse im Mittelteil und Talankunft.', builder: () => buildRoadStage({ segmentCount: 58, pattern: mediumMountainPattern, startName: 'Dummy High Mountain B Start', climbs: [{ start: 15, name: 'High Mountain B Pass 1', cat: '1', profile: 'High_Mountain', gradients: [6.8, 7.1, 7.3, 7.0, 6.6, 6.0] }, { start: 28, name: 'High Mountain B Pass 2', cat: 'HC', profile: 'High_Mountain', gradients: [7.0, 7.3, 7.6, 7.4, 7.1, 6.8, 6.2] }], finishType: 'finish_flat', finishName: 'Dummy High Mountain B Finish' }) },
  { fileName: 'dummy_high_mountain_c.csv', profile: 'High_Mountain', label: 'High_Mountain C', note: 'Sehr langer Schlussanstieg im Hochgebirge.', builder: () => buildRoadStage({ segmentCount: 60, pattern: mediumMountainPattern, startName: 'Dummy High Mountain C Start', sprints: [{ index: 18, name: 'High Mountain C Sprint 1' }], climbs: [{ start: 45, name: 'High Mountain C Summit', cat: 'HC', profile: 'High_Mountain', gradients: [6.9, 7.2, 7.5, 7.7, 7.4, 7.0, 6.5], finishType: 'finish_mountain', finishName: 'Dummy High Mountain C Finish' }], finishType: 'finish_mountain', finishName: 'Dummy High Mountain C Finish', finishCat: 'HC' }) },
  { fileName: 'dummy_high_mountain_d.csv', profile: 'High_Mountain', label: 'High_Mountain D', note: 'Drei grosse Berge mit flachem Ziel nach langer Abfahrt.', builder: () => buildRoadStage({ segmentCount: 62, pattern: mediumMountainPattern, startName: 'Dummy High Mountain D Start', climbs: [{ start: 8, name: 'High Mountain D Climb 1', cat: '1', profile: 'High_Mountain', gradients: [6.7, 7.0, 7.2, 7.0, 6.5, 6.0] }, { start: 24, name: 'High Mountain D Climb 2', cat: 'HC', profile: 'High_Mountain', gradients: [7.0, 7.4, 7.7, 7.5, 7.1, 6.8, 6.2] }, { start: 42, name: 'High Mountain D Climb 3', cat: '1', profile: 'High_Mountain', gradients: [6.8, 7.1, 7.3, 7.0, 6.4, 5.9] }], finishType: 'finish_flat', finishName: 'Dummy High Mountain D Finish' }) },
  { fileName: 'dummy_high_mountain_e.csv', profile: 'High_Mountain', label: 'High_Mountain E', note: 'Langer Zentralpass und brutale Schlussrampe.', builder: () => buildRoadStage({ segmentCount: 64, pattern: mediumMountainPattern, startName: 'Dummy High Mountain E Start', climbs: [{ start: 18, name: 'High Mountain E Long Pass', cat: 'HC', profile: 'High_Mountain', gradients: [6.8, 7.0, 7.2, 7.4, 7.3, 7.1, 6.8, 6.3] }, { start: 56, name: 'High Mountain E Finish', cat: 'HC', profile: 'High_Mountain', gradients: [7.2, 7.5, 7.8, 7.6, 7.0], finishType: 'finish_mountain', finishName: 'Dummy High Mountain E Finish' }], finishType: 'finish_mountain', finishName: 'Dummy High Mountain E Finish', finishCat: 'HC' }) },
  { fileName: 'dummy_high_mountain_f.csv', profile: 'High_Mountain', label: 'High_Mountain F', note: 'Kletterkette im letzten Drittel mit harter Bergankunft.', builder: () => buildRoadStage({ segmentCount: 66, pattern: mediumMountainPattern, startName: 'Dummy High Mountain F Start', climbs: [{ start: 34, name: 'High Mountain F Climb 1', cat: '1', profile: 'High_Mountain', gradients: [6.9, 7.2, 7.4, 7.1, 6.5, 6.0] }, { start: 46, name: 'High Mountain F Climb 2', cat: 'HC', profile: 'High_Mountain', gradients: [7.2, 7.5, 7.8, 7.6, 7.2, 6.9, 6.3] }, { start: 60, name: 'High Mountain F Summit', cat: 'HC', profile: 'High_Mountain', gradients: [7.3, 7.6, 7.9, 7.7, 7.1, 6.6], finishType: 'finish_mountain', finishName: 'Dummy High Mountain F Finish' }], finishType: 'finish_mountain', finishName: 'Dummy High Mountain F Finish', finishCat: 'HC' }) },

  { fileName: 'dummy_cobble_a.csv', profile: 'Cobble', label: 'Cobble A', note: 'Flacher Pavé-Tag mit mehreren Sektoren und Sprintankunft.', builder: () => buildRoadStage({ segmentCount: 36, pattern: cobblePattern, startName: 'Dummy Cobble A Start', sprints: [{ index: 11, name: 'Cobble A Sprint 1' }, { index: 24, name: 'Cobble A Sprint 2' }], finishType: 'finish_flat', finishName: 'Dummy Cobble A Finish' }) },
  { fileName: 'dummy_cobble_b.csv', profile: 'Cobble', label: 'Cobble B', note: 'Laengerer Kopfsteinpflastertag mit spaetem schweren Sektor.', builder: () => buildRoadStage({ segmentCount: 40, pattern: cobblePattern, startName: 'Dummy Cobble B Start', sprints: [{ index: 13, name: 'Cobble B Sprint 1' }], overrides: [{ start: 31, values: [{ terrain: 'Cobble', gradientPercent: 2.1, techLevel: 8, windExp: 6, lengthKm: 2.0 }, { terrain: 'Cobble', gradientPercent: 2.4, techLevel: 8, windExp: 6, lengthKm: 1.8 }, { terrain: 'Flat', gradientPercent: -0.4, techLevel: 5, windExp: 7, lengthKm: 2.4 }] }], finishType: 'finish_flat', finishName: 'Dummy Cobble B Finish' }) },
  { fileName: 'dummy_cobble_c.csv', profile: 'Cobble', label: 'Cobble C', note: 'Klassikerhafter Pavé-Kurs mit leichtem Schlussanstieg.', builder: () => buildRoadStage({ segmentCount: 44, pattern: cobblePattern, startName: 'Dummy Cobble C Start', sprints: [{ index: 16, name: 'Cobble C Sprint 1' }], finishType: 'finish_hill', finishName: 'Dummy Cobble C Finish', finishCat: '4' }) },

  { fileName: 'dummy_cobble_hill_a.csv', profile: 'Cobble_Hill', label: 'Cobble_Hill A', note: 'Ardennen-Pavé-Mix mit kurzem Huegelfinale.', builder: () => buildRoadStage({ segmentCount: 38, pattern: cobbleHillPattern, startName: 'Dummy Cobble Hill A Start', sprints: [{ index: 12, name: 'Cobble Hill A Sprint 1' }], finishType: 'finish_hill', finishName: 'Dummy Cobble Hill A Finish', finishCat: '4' }) },
  { fileName: 'dummy_cobble_hill_b.csv', profile: 'Cobble_Hill', label: 'Cobble_Hill B', note: 'Viele kurze Pavé-Rampen und selektive Schlussrunde.', builder: () => buildRoadStage({ segmentCount: 42, pattern: cobbleHillPattern, startName: 'Dummy Cobble Hill B Start', sprints: [{ index: 15, name: 'Cobble Hill B Sprint 1' }], climbs: [{ start: 30, name: 'Cobble Hill B Kicker', cat: '4', profile: 'Hill', gradients: [5.2, 5.6, 5.0] }], finishType: 'finish_hill', finishName: 'Dummy Cobble Hill B Finish', finishCat: '3' }) },
  { fileName: 'dummy_cobble_hill_c.csv', profile: 'Cobble_Hill', label: 'Cobble_Hill C', note: 'Langer Klassikerkurs mit spaeter Kopfsteinpflaster-Huegelkette.', builder: () => buildRoadStage({ segmentCount: 46, pattern: cobbleHillPattern, startName: 'Dummy Cobble Hill C Start', climbs: [{ start: 33, name: 'Cobble Hill C Rise', cat: '3', profile: 'Hill', gradients: [5.6, 5.9, 5.4, 4.8] }], finishType: 'finish_flat', finishName: 'Dummy Cobble Hill C Finish' }) },

  { fileName: 'dummy_itt_a.csv', profile: 'ITT', label: 'ITT A', note: '2.28 km Stadtprolog nach Romandie-Muster, fast komplett flach und technisch.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 2.28, startName: 'Dummy ITT A Start', finishName: 'Dummy ITT A Finish', pattern: [{ lengthKm: 0.18, gradientPercent: 0.2, terrain: 'Flat', techLevel: 8, windExp: 3 }, { lengthKm: 0.14, gradientPercent: -0.3, terrain: 'Flat', techLevel: 8, windExp: 3 }, { lengthKm: 0.16, gradientPercent: 0.6, terrain: 'Flat', techLevel: 8, windExp: 3 }, { lengthKm: 0.15, gradientPercent: 0.1, terrain: 'Flat', techLevel: 9, windExp: 3 }] }, false) },
  { fileName: 'dummy_itt_b.csv', profile: 'ITT', label: 'ITT B', note: '4.80 km kurzer Prolog mit Rueckenwindpassagen und leichten Richtungswechseln.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 4.8, startName: 'Dummy ITT B Start', finishName: 'Dummy ITT B Finish', pattern: [{ lengthKm: 0.22, gradientPercent: 0.4, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.18, gradientPercent: 1.2, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.16, gradientPercent: -0.7, terrain: 'Flat', techLevel: 8, windExp: 3 }, { lengthKm: 0.20, gradientPercent: 0.6, terrain: 'Flat', techLevel: 9, windExp: 3 }] }, false) },
  { fileName: 'dummy_itt_c.csv', profile: 'ITT', label: 'ITT C', note: '6.82 km klassischer Prologkurs im Stil Romandie 2023, technisch aber schnell.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 6.82, startName: 'Dummy ITT C Start', finishName: 'Dummy ITT C Finish', pattern: [{ lengthKm: 0.30, gradientPercent: 0.5, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.22, gradientPercent: -0.4, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.25, gradientPercent: 1.0, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.24, gradientPercent: 0.2, terrain: 'Flat', techLevel: 9, windExp: 3 }] }, false) },
  { fileName: 'dummy_itt_d.csv', profile: 'ITT', label: 'ITT D', note: '10.00 km flaches Kuesten-ITT wie bei Tirreno, offen fuer Wind und reine Motoren.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 10.0, startName: 'Dummy ITT D Start', finishName: 'Dummy ITT D Finish', pattern: [{ lengthKm: 0.44, gradientPercent: 0.2, terrain: 'Flat', techLevel: 6, windExp: 7 }, { lengthKm: 0.36, gradientPercent: 0.8, terrain: 'Flat', techLevel: 6, windExp: 7 }, { lengthKm: 0.31, gradientPercent: -0.4, terrain: 'Flat', techLevel: 7, windExp: 6 }, { lengthKm: 0.39, gradientPercent: 0.5, terrain: 'Flat', techLevel: 7, windExp: 7 }] }, false) },
  { fileName: 'dummy_itt_e.csv', profile: 'ITT', label: 'ITT E', note: '12.00 km Startzeitfahren nach Vuelta-Art, urban, flach und relativ technisch.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 12.0, startName: 'Dummy ITT E Start', finishName: 'Dummy ITT E Finish', pattern: [{ lengthKm: 0.46, gradientPercent: 0.3, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.38, gradientPercent: 1.0, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.34, gradientPercent: -0.5, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.42, gradientPercent: 0.7, terrain: 'Flat', techLevel: 8, windExp: 4 }] }, false) },
  { fileName: 'dummy_itt_f.csv', profile: 'ITT', label: 'ITT F', note: '15.50 km welliges ITT mit sanften Richtungswechseln wie in Romandie.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 15.5, startName: 'Dummy ITT F Start', finishName: 'Dummy ITT F Finish', pattern: [{ lengthKm: 0.55, gradientPercent: 0.6, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.46, gradientPercent: 1.8, terrain: 'Hill', techLevel: 7, windExp: 5 }, { lengthKm: 0.40, gradientPercent: -1.1, terrain: 'Flat', techLevel: 7, windExp: 4 }, { lengthKm: 0.52, gradientPercent: 1.2, terrain: 'Flat', techLevel: 7, windExp: 5 }] }, false) },
  { fileName: 'dummy_itt_g.csv', profile: 'ITT', label: 'ITT G', note: '15.70 km bergigeres GC-ITT mit spaetem Anstieg nach Tour-de-Suisse-Muster.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 15.7, startName: 'Dummy ITT G Start', finishName: 'Dummy ITT G Finish', pattern: [{ lengthKm: 0.52, gradientPercent: 0.5, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.44, gradientPercent: 2.4, terrain: 'Hill', techLevel: 7, windExp: 4 }, { lengthKm: 0.39, gradientPercent: -1.4, terrain: 'Flat', techLevel: 7, windExp: 4 }, { lengthKm: 0.50, gradientPercent: 1.6, terrain: 'Hill', techLevel: 7, windExp: 4 }], overrides: [{ start: 23, values: [{ gradientPercent: 4.1, terrain: 'Hill', techLevel: 7, windExp: 4 }, { gradientPercent: 4.8, terrain: 'Hill', techLevel: 7, windExp: 4 }, { gradientPercent: 5.2, terrain: 'Hill', techLevel: 7, windExp: 4 }, { gradientPercent: 4.5, terrain: 'Hill', techLevel: 8, windExp: 3 }] }] }, false) },
  { fileName: 'dummy_itt_h.csv', profile: 'ITT', label: 'ITT H', note: '18.75 km rollendes Mittelzeitfahren nach Romandie 2023, rhythmisch und selektiv.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 18.75, startName: 'Dummy ITT H Start', finishName: 'Dummy ITT H Finish', pattern: [{ lengthKm: 0.63, gradientPercent: 0.7, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.53, gradientPercent: 2.0, terrain: 'Hill', techLevel: 7, windExp: 4 }, { lengthKm: 0.45, gradientPercent: -1.3, terrain: 'Flat', techLevel: 7, windExp: 4 }, { lengthKm: 0.59, gradientPercent: 1.0, terrain: 'Flat', techLevel: 7, windExp: 5 }] }, false) },
  { fileName: 'dummy_itt_i.csv', profile: 'ITT', label: 'ITT I', note: '24.60 km schnelles GC-ITT wie bei der Vuelta, breit, offen und leicht wellig.', builder: () => buildTimeTrialStage({ segmentCount: 32, targetDistanceKm: 24.6, startName: 'Dummy ITT I Start', finishName: 'Dummy ITT I Finish', pattern: [{ lengthKm: 0.78, gradientPercent: 0.4, terrain: 'Flat', techLevel: 6, windExp: 6 }, { lengthKm: 0.69, gradientPercent: 1.4, terrain: 'Flat', techLevel: 6, windExp: 6 }, { lengthKm: 0.60, gradientPercent: -0.8, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.72, gradientPercent: 1.6, terrain: 'Hill', techLevel: 7, windExp: 5 }] }, false) },
  { fileName: 'dummy_itt_j.csv', profile: 'ITT', label: 'ITT J', note: '25.30 km flaches Power-ITT nach Tour-de-France-Vorbild, wenige technische Bremsungen.', builder: () => buildTimeTrialStage({ segmentCount: 32, targetDistanceKm: 25.3, startName: 'Dummy ITT J Start', finishName: 'Dummy ITT J Finish', pattern: [{ lengthKm: 0.84, gradientPercent: 0.2, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.75, gradientPercent: 0.9, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.64, gradientPercent: -0.5, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.79, gradientPercent: 0.7, terrain: 'Flat', techLevel: 6, windExp: 6 }] }, false) },
  { fileName: 'dummy_itt_k.csv', profile: 'ITT', label: 'ITT K', note: '31.20 km langes ITT im Giro-Stil, flach bis leicht wellig mit hohem Materialvorteil.', builder: () => buildTimeTrialStage({ segmentCount: 34, targetDistanceKm: 31.2, startName: 'Dummy ITT K Start', finishName: 'Dummy ITT K Finish', pattern: [{ lengthKm: 0.93, gradientPercent: 0.3, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.82, gradientPercent: 1.2, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.70, gradientPercent: -0.7, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.88, gradientPercent: 1.6, terrain: 'Hill', techLevel: 6, windExp: 5 }] }, false) },
  { fileName: 'dummy_itt_l.csv', profile: 'ITT', label: 'ITT L', note: '40.60 km langes GC-ITT mit spaetem Bergdruck, orientiert an Giro- und Suisse-Extremen.', builder: () => buildTimeTrialStage({ segmentCount: 36, targetDistanceKm: 40.6, startName: 'Dummy ITT L Start', finishName: 'Dummy ITT L Finish', pattern: [{ lengthKm: 1.05, gradientPercent: 0.5, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.92, gradientPercent: 1.8, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.80, gradientPercent: -0.9, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.97, gradientPercent: 2.1, terrain: 'Hill', techLevel: 6, windExp: 5 }], overrides: [{ start: 28, values: [{ gradientPercent: 3.8, terrain: 'Hill', techLevel: 6, windExp: 4 }, { gradientPercent: 4.5, terrain: 'Hill', techLevel: 7, windExp: 4 }, { gradientPercent: 5.0, terrain: 'Hill', techLevel: 7, windExp: 4 }, { gradientPercent: 5.4, terrain: 'Hill', techLevel: 7, windExp: 3 }, { gradientPercent: 4.8, terrain: 'Hill', techLevel: 7, windExp: 3 }] }] }, false) },

  { fileName: 'dummy_ttt_a.csv', profile: 'TTT', label: 'TTT A', note: '14.80 km urbanes Auftakt-TTT nach Vuelta-Muster, technisch und schnell.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 14.8, startName: 'Dummy TTT A Start', finishName: 'Dummy TTT A Finish', pattern: [{ lengthKm: 0.58, gradientPercent: 0.2, terrain: 'Flat', techLevel: 7, windExp: 4 }, { lengthKm: 0.47, gradientPercent: 0.9, terrain: 'Flat', techLevel: 7, windExp: 4 }, { lengthKm: 0.40, gradientPercent: -0.6, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.51, gradientPercent: 0.5, terrain: 'Flat', techLevel: 8, windExp: 4 }] }, true) },
  { fileName: 'dummy_ttt_b.csv', profile: 'TTT', label: 'TTT B', note: '16.50 km kurzes, breites Mannschaftszeitfahren mit wenigen Unterbrechungen.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 16.5, startName: 'Dummy TTT B Start', finishName: 'Dummy TTT B Finish', pattern: [{ lengthKm: 0.64, gradientPercent: 0.3, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.53, gradientPercent: 1.0, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.45, gradientPercent: -0.6, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.56, gradientPercent: 0.8, terrain: 'Flat', techLevel: 7, windExp: 5 }] }, true) },
  { fileName: 'dummy_ttt_c.csv', profile: 'TTT', label: 'TTT C', note: '18.00 km offenes TTT mit Windkante-Potenzial auf langen Geraden.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 18.0, startName: 'Dummy TTT C Start', finishName: 'Dummy TTT C Finish', pattern: [{ lengthKm: 0.68, gradientPercent: 0.2, terrain: 'Flat', techLevel: 5, windExp: 7 }, { lengthKm: 0.57, gradientPercent: 0.9, terrain: 'Flat', techLevel: 5, windExp: 7 }, { lengthKm: 0.48, gradientPercent: -0.5, terrain: 'Flat', techLevel: 6, windExp: 7 }, { lengthKm: 0.60, gradientPercent: 0.7, terrain: 'Flat', techLevel: 6, windExp: 7 }] }, true) },
  { fileName: 'dummy_ttt_d.csv', profile: 'TTT', label: 'TTT D', note: '20.00 km technischeres TTT mit mehreren Kreisverkehren und Beschleunigungsphasen.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 20.0, startName: 'Dummy TTT D Start', finishName: 'Dummy TTT D Finish', pattern: [{ lengthKm: 0.70, gradientPercent: 0.3, terrain: 'Flat', techLevel: 7, windExp: 4 }, { lengthKm: 0.60, gradientPercent: 1.2, terrain: 'Flat', techLevel: 7, windExp: 4 }, { lengthKm: 0.50, gradientPercent: -0.8, terrain: 'Flat', techLevel: 8, windExp: 4 }, { lengthKm: 0.62, gradientPercent: 0.8, terrain: 'Flat', techLevel: 8, windExp: 4 }] }, true) },
  { fileName: 'dummy_ttt_e.csv', profile: 'TTT', label: 'TTT E', note: '21.50 km breites Flach-TTT fuer klassische Zugmaschinen.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 21.5, startName: 'Dummy TTT E Start', finishName: 'Dummy TTT E Finish', pattern: [{ lengthKm: 0.78, gradientPercent: 0.2, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.67, gradientPercent: 0.9, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.55, gradientPercent: -0.5, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.70, gradientPercent: 0.6, terrain: 'Flat', techLevel: 6, windExp: 6 }] }, true) },
  { fileName: 'dummy_ttt_f.csv', profile: 'TTT', label: 'TTT F', note: '23.00 km rollendes Mannschaftszeitfahren mit kurzen Schwellenanstiegen.', builder: () => buildTimeTrialStage({ segmentCount: 30, targetDistanceKm: 23.0, startName: 'Dummy TTT F Start', finishName: 'Dummy TTT F Finish', pattern: [{ lengthKm: 0.79, gradientPercent: 0.5, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.68, gradientPercent: 1.8, terrain: 'Hill', techLevel: 6, windExp: 5 }, { lengthKm: 0.57, gradientPercent: -1.0, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.72, gradientPercent: 1.1, terrain: 'Flat', techLevel: 7, windExp: 5 }] }, true) },
  { fileName: 'dummy_ttt_g.csv', profile: 'TTT', label: 'TTT G', note: '24.50 km aerodynamisches TTT auf offenen Schnellstrassen.', builder: () => buildTimeTrialStage({ segmentCount: 32, targetDistanceKm: 24.5, startName: 'Dummy TTT G Start', finishName: 'Dummy TTT G Finish', pattern: [{ lengthKm: 0.84, gradientPercent: 0.2, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.74, gradientPercent: 1.0, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.62, gradientPercent: -0.6, terrain: 'Flat', techLevel: 6, windExp: 6 }, { lengthKm: 0.79, gradientPercent: 0.7, terrain: 'Flat', techLevel: 6, windExp: 6 }] }, true) },
  { fileName: 'dummy_ttt_h.csv', profile: 'TTT', label: 'TTT H', note: '26.90 km modernes WorldTour-TTT direkt nach Paris–Nice 2024 skaliert.', builder: () => buildTimeTrialStage({ segmentCount: 32, targetDistanceKm: 26.9, startName: 'Dummy TTT H Start', finishName: 'Dummy TTT H Finish', pattern: [{ lengthKm: 0.88, gradientPercent: 0.3, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.77, gradientPercent: 1.2, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.65, gradientPercent: -0.7, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.82, gradientPercent: 0.9, terrain: 'Flat', techLevel: 7, windExp: 5 }] }, true) },
  { fileName: 'dummy_ttt_i.csv', profile: 'TTT', label: 'TTT I', note: '27.80 km welliges TTT mit spaeter Rhythmusbrechung vor dem Ziel.', builder: () => buildTimeTrialStage({ segmentCount: 32, targetDistanceKm: 27.8, startName: 'Dummy TTT I Start', finishName: 'Dummy TTT I Finish', pattern: [{ lengthKm: 0.90, gradientPercent: 0.4, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.78, gradientPercent: 1.7, terrain: 'Hill', techLevel: 6, windExp: 5 }, { lengthKm: 0.66, gradientPercent: -0.9, terrain: 'Flat', techLevel: 7, windExp: 5 }, { lengthKm: 0.83, gradientPercent: 1.0, terrain: 'Flat', techLevel: 7, windExp: 5 }] }, true) },
  { fileName: 'dummy_ttt_j.csv', profile: 'TTT', label: 'TTT J', note: '29.50 km windanfaelliges TTT mit langen Expositionsphasen auf offenem Terrain.', builder: () => buildTimeTrialStage({ segmentCount: 34, targetDistanceKm: 29.5, startName: 'Dummy TTT J Start', finishName: 'Dummy TTT J Finish', pattern: [{ lengthKm: 0.92, gradientPercent: 0.2, terrain: 'Flat', techLevel: 5, windExp: 7 }, { lengthKm: 0.81, gradientPercent: 1.0, terrain: 'Flat', techLevel: 5, windExp: 7 }, { lengthKm: 0.68, gradientPercent: -0.6, terrain: 'Flat', techLevel: 6, windExp: 7 }, { lengthKm: 0.86, gradientPercent: 0.8, terrain: 'Flat', techLevel: 6, windExp: 7 }] }, true) },
  { fileName: 'dummy_ttt_k.csv', profile: 'TTT', label: 'TTT K', note: '32.20 km langes WorldTour-TTT im Stil Paris–Nice 2023, gleichmaessig und kraftlastig.', builder: () => buildTimeTrialStage({ segmentCount: 34, targetDistanceKm: 32.2, startName: 'Dummy TTT K Start', finishName: 'Dummy TTT K Finish', pattern: [{ lengthKm: 0.98, gradientPercent: 0.3, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.86, gradientPercent: 1.1, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.72, gradientPercent: -0.7, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.91, gradientPercent: 0.9, terrain: 'Flat', techLevel: 6, windExp: 6 }] }, true) },
  { fileName: 'dummy_ttt_l.csv', profile: 'TTT', label: 'TTT L', note: '31.00 km langes TTT mit leichtem Schlussanstieg fuer Teams mit guten Rouleurs und Punchern.', builder: () => buildTimeTrialStage({ segmentCount: 34, targetDistanceKm: 31.0, startName: 'Dummy TTT L Start', finishName: 'Dummy TTT L Finish', pattern: [{ lengthKm: 0.95, gradientPercent: 0.3, terrain: 'Flat', techLevel: 5, windExp: 6 }, { lengthKm: 0.84, gradientPercent: 1.4, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.70, gradientPercent: -0.8, terrain: 'Flat', techLevel: 6, windExp: 5 }, { lengthKm: 0.88, gradientPercent: 1.2, terrain: 'Hill', techLevel: 6, windExp: 5 }], overrides: [{ start: 28, values: [{ gradientPercent: 2.4, terrain: 'Hill', techLevel: 6, windExp: 4 }, { gradientPercent: 2.9, terrain: 'Hill', techLevel: 6, windExp: 4 }, { gradientPercent: 3.2, terrain: 'Hill', techLevel: 7, windExp: 4 }, { gradientPercent: 2.6, terrain: 'Hill', techLevel: 7, windExp: 4 }] }] }, true) },
];

function estimateDistance(segments) {
  return segments.reduce((sum, segment) => sum + segment.lengthKm, 0);
}

function writeCatalog(entries) {
  const grouped = new Map();
  for (const entry of entries) {
    const profileEntries = grouped.get(entry.profile) || [];
    profileEntries.push(entry);
    grouped.set(entry.profile, profileEntries);
  }

  const lines = ['# Dummy Stage Catalog', '', 'Wiederverwendbarer Katalog fuer Platzhalter-Etappen. Dateinamen koennen direkt in `data/csv/stages.csv` referenziert werden.', ''];
  for (const [profile, entriesForProfile] of grouped.entries()) {
    lines.push(`## ${profile}`);
    lines.push('');
    for (const entry of entriesForProfile) {
      lines.push(`- ${entry.label}: \`${entry.fileName}\` | ${entry.segmentCount} Segmente | ca. ${formatNumber(entry.distanceKm)} km | ${entry.note}`);
    }
    lines.push('');
  }

  fs.writeFileSync(CATALOG_PATH, `${lines.join('\n')}\n`, 'utf8');
}

function main() {
  const catalogEntries = [];
  for (const spec of stageSpecs) {
    const segments = spec.builder();
    writeStage(spec.fileName, segments);
    catalogEntries.push({
      profile: spec.profile,
      label: spec.label,
      fileName: spec.fileName,
      note: spec.note,
      segmentCount: segments.length,
      distanceKm: estimateDistance(segments),
    });
  }
  writeCatalog(catalogEntries);
  console.log(`Generated ${catalogEntries.length} dummy stage files and catalog.`);
}

main();
