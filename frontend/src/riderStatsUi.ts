export interface RaceCategoryBadgeStyle {
  background: string;
  color: string;
  border: string;
}

export interface RiderLinkRenderOptions {
  riderId?: number | null;
  teamId?: number | null;
  strong?: boolean;
  linkClassName?: string;
  labelClassName?: string;
}

function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function joinClassNames(...classNames: Array<string | null | undefined | false>): string {
  return classNames.filter((className): className is string => Boolean(className && className.trim())).join(' ');
}

export function resolveRaceCategoryBadgeStyle(categoryName: string | null | undefined): RaceCategoryBadgeStyle {
  const normalizedCategoryName = (categoryName ?? '').toLowerCase();

  if (normalizedCategoryName.includes('tour de france')) {
    return { background: 'rgba(253, 224, 71, .25)', color: '#fef08a', border: 'rgba(234, 179, 8, .6)' };
  }
  if (normalizedCategoryName.includes('grand tour')) {
    return { background: 'rgba(6, 182, 212, .16)', color: '#a5f3fc', border: 'rgba(34, 211, 238, .34)' };
  }
  if (normalizedCategoryName.includes('monument')) {
    return { background: 'rgba(234, 179, 8, .18)', color: '#fde68a', border: 'rgba(250, 204, 21, .38)' };
  }
  if (normalizedCategoryName.includes('stage race high')) {
    return { background: 'rgba(37, 99, 235, .18)', color: '#bfdbfe', border: 'rgba(96, 165, 250, .36)' };
  }
  if (normalizedCategoryName.includes('stage race middle')) {
    return { background: 'rgba(79, 70, 229, .18)', color: '#c7d2fe', border: 'rgba(129, 140, 248, .36)' };
  }
  if (normalizedCategoryName.includes('stage race low')) {
    return { background: 'rgba(124, 58, 237, .18)', color: '#ddd6fe', border: 'rgba(167, 139, 250, .38)' };
  }
  if (normalizedCategoryName.includes('one day high')) {
    return { background: 'rgba(220, 38, 38, .18)', color: '#fecaca', border: 'rgba(248, 113, 113, .36)' };
  }
  if (normalizedCategoryName.includes('one day middle')) {
    return { background: 'rgba(234, 88, 12, .18)', color: '#fed7aa', border: 'rgba(251, 146, 60, .36)' };
  }
  if (normalizedCategoryName.includes('one day low')) {
    return { background: 'rgba(22, 163, 74, .16)', color: '#bbf7d0', border: 'rgba(74, 222, 128, .34)' };
  }

  return { background: 'rgba(100, 116, 139, .2)', color: '#cbd5e1', border: 'rgba(148, 163, 184, .3)' };
}

export function buildRaceCategoryBadgeCssVariables(style: RaceCategoryBadgeStyle): string {
  return `--dashboard-race-category-badge-bg:${style.background};--dashboard-race-category-badge-color:${style.color};--dashboard-race-category-badge-border:${style.border};`;
}

// Kompakte Champion-Marker (regierende WM/EM-Titeltraeger) je Fahrer-ID. Wird aus
// dem Saison-Wertungs-Payload gespeist und in allen Fahrer-Namenslinks angezeigt
// (Ergebnisse, Top Results, Wertungen, Dashboard).
const reigningChampionMarkersByRider = new Map<number, string>();

export function setReigningChampionMarkers(
  holders: Array<{ riderId: number; type: 'WM' | 'EM'; discipline: 'ITT' | 'ROAD' }> | undefined | null,
): void {
  reigningChampionMarkersByRider.clear();
  if (!holders) {
    return;
  }
  const byRider = new Map<number, Array<{ type: 'WM' | 'EM'; discipline: 'ITT' | 'ROAD' }>>();
  for (const holder of holders) {
    const bucket = byRider.get(holder.riderId) ?? [];
    bucket.push({ type: holder.type, discipline: holder.discipline });
    byRider.set(holder.riderId, bucket);
  }
  for (const [riderId, titles] of byRider) {
    reigningChampionMarkersByRider.set(riderId, renderReigningChampionMarkers(titles));
  }
}

function renderReigningChampionMarkers(titles: Array<{ type: 'WM' | 'EM'; discipline: 'ITT' | 'ROAD' }>): string {
  return titles
    .map((title) => {
      const disc = title.discipline === 'ITT' ? ' ITT' : '';
      if (title.type === 'WM') {
        return `<span title="Regierender Weltmeister${disc}" style="margin-left:5px;font-size:11px;filter:drop-shadow(0 0 3px rgba(236,72,153,.6));">🌈</span>`;
      }
      return `<span title="Regierender Europameister${disc}" style="margin-left:5px;font-size:11px;filter:drop-shadow(0 0 3px rgba(59,130,246,.7));">⭐</span>`;
    })
    .join('');
}

export function renderRiderNameLink(name: string, options: RiderLinkRenderOptions = {}): string {
  const labelTag = options.strong === false ? 'span' : 'strong';
  const labelClassName = joinClassNames('app-rider-link-label', options.labelClassName);
  const label = `<${labelTag} class="${labelClassName}">${esc(name)}</${labelTag}>`;
  const marker = options.riderId != null ? (reigningChampionMarkersByRider.get(options.riderId) ?? '') : '';

  if (options.riderId == null) {
    return label;
  }

  const attributes = [
    'type="button"',
    'class="' + joinClassNames('app-rider-link', options.linkClassName) + '"',
    `data-rider-id="${options.riderId}"`,
  ];

  if (options.teamId != null) {
    attributes.push(`data-team-id="${options.teamId}"`);
  }

  return `<button ${attributes.join(' ')}>${label}</button>${marker}`;
}

export function renderTeamNameLink(name: string, teamId: number | null | undefined, strong = true, extraClass = ''): string {
  const labelTag = strong === false ? 'span' : 'strong';
  const label = `<${labelTag} class="app-team-link-label">${esc(name)}</${labelTag}>`;

  if (teamId == null) {
    return label;
  }

  return `<button type="button" class="${joinClassNames('app-team-link', extraClass)}" data-team-id="${teamId}">${label}</button>`;
}