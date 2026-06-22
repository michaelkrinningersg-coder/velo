import { api } from '../api';
import { $, esc, state, renderFlag, renderCountry, renderRiderAvailabilityMarker, formatRiderName, getRiderCountryCode, getRiderRoleName, renderSkillValueWithDelta, renderRaceFormBonusValue, renderSeasonFormValue, renderLoadMalusValue, renderSeasonFormPhase, renderRiderProgramButton, isActiveView, showLoading, hideLoading, getRiderSpecializationLabel, } from '../state';
import { renderRiderNameLink } from '../riderStatsUi';
// Dynamically or directly imported view functions
import { openRiderProgram } from './dashboard';
export const TEAM_SKILL_COLUMNS = [
    { key: 'flat', label: 'Fl' },
    { key: 'mountain', label: 'Berg' },
    { key: 'mediumMountain', label: 'MB' },
    { key: 'hill', label: 'Hgl' },
    { key: 'timeTrial', label: 'ZF' },
    { key: 'prologue', label: 'Pro' },
    { key: 'cobble', label: 'Pf' },
    { key: 'sprint', label: 'Spr' },
    { key: 'acceleration', label: 'Acc' },
    { key: 'downhill', label: 'Abf' },
    { key: 'attack', label: 'Atk' },
    { key: 'stamina', label: 'Sta' },
    { key: 'resistance', label: 'Res' },
    { key: 'recuperation', label: 'Rec' },
    { key: 'bikeHandling', label: 'Ftg' },
];
export const TEAM_DETAIL_PAGE_ORDER = ['skills', 'form', 'profile', 'preferences'];
export const TEAM_TABLE_COLUMNS = [
    { id: 'name', label: 'Name', title: 'Name - Nachname, Vorname', sortKey: 'name', className: 'team-table-col-name' },
    { id: 'country', label: 'Country', title: 'Country - Flagge und 3er-Code', sortKey: 'countryCode', className: 'team-table-col-country' },
    { id: 'age', label: 'Alt', title: 'Alter', sortKey: 'age', className: 'team-table-col-age' },
    { id: 'roleName', label: 'Rolle', title: 'Teamrolle des Fahrers', sortKey: 'roleName', className: 'team-table-col-role' },
];
export const TEAM_DETAIL_PAGE_COLUMNS = {
    skills: [
        { id: 'overallRating', label: 'Ges', title: 'Gesamtstärke', sortKey: 'overallRating', className: 'team-table-col-overall' },
        { id: 'potOverall', label: 'Pot', title: 'Potenzial', sortKey: 'potOverall', className: 'team-table-col-pot' },
        ...TEAM_SKILL_COLUMNS.map((column) => ({
            id: `skill-${column.key}`,
            label: column.label,
            title: column.label,
            sortKey: column.key,
            className: 'team-table-col-skill',
        })),
    ],
    form: [
        { id: 'birthYear', label: 'Jg', title: 'Geburtsjahr', sortKey: 'birthYear', className: 'team-table-col-year' },
        { id: 'contractEndSeason', label: 'V-Ende', title: 'Vertragsende - Ende des aktiven Vertrags', sortKey: 'contractEndSeason', className: 'team-table-col-contract' },
        { id: 'formBonus', label: 'S-Form', title: 'Saisonformbonus', sortKey: 'formBonus', className: 'team-table-col-points' },
        { id: 'raceFormBonus', label: 'R-Form', title: 'Rennbonus aus saisonalem Formfenster', sortKey: 'raceFormBonus', className: 'team-table-col-points' },
        { id: 'averageForm', label: 'Ø Form', title: 'Durchschnittliche Rennform (S-Form + R-Form)', sortKey: 'averageForm', className: 'team-table-col-points' },
        { id: 'longTermFatigueMalus', label: 'L-Ersch', title: 'Langzeit-Erschöpfung ab dem 50. Saisonrenntag', sortKey: 'longTermFatigueMalus', className: 'team-table-col-points' },
        { id: 'shortTermFatigueMalus', label: 'Akut', title: 'Akuter Verschleiß im rollenden 30-Tage-Fenster', sortKey: 'shortTermFatigueMalus', className: 'team-table-col-points' },
        { id: 'seasonFormPhase', label: 'Phase', title: 'Formphase', sortKey: 'seasonFormPhase', className: 'team-table-col-phase' },
        { id: 'seasonPoints', label: 'Pkt', title: 'Saisonpunkte - kumulierte Punkte der aktuellen Saison', sortKey: 'seasonPoints', className: 'team-table-col-points' },
        { id: 'seasonRaceDays', label: 'Renntage', title: 'Renntage in der laufenden Saison', sortKey: 'seasonRaceDays', className: 'team-table-col-points' },
        { id: 'seasonWins', label: 'Siege', title: 'Siege in der laufenden Saison', sortKey: 'seasonWins', className: 'team-table-col-points' },
    ],
    profile: [
        { id: 'peak1', label: 'Peak 1', title: 'Erster Formhöhepunkt', sortKey: 'peak1', className: 'team-table-col-date' },
        { id: 'peak2', label: 'Peak 2', title: 'Zweiter Formhöhepunkt', sortKey: 'peak2', className: 'team-table-col-date' },
        { id: 'peak3', label: 'Peak 3', title: 'Dritter Formhöhepunkt', sortKey: 'peak3', className: 'team-table-col-date' },
        { id: 'riderType', label: 'Typ', title: 'Fahrertyp (Spezialisierungen)', sortKey: 'riderType', className: 'team-table-col-profile' },
        { id: 'specialization1', label: 'Spec1', title: 'Spezialisierung 1', sortKey: 'specialization1', className: 'team-table-col-profile' },
        { id: 'specialization2', label: 'Spec2', title: 'Spezialisierung 2', sortKey: 'specialization2', className: 'team-table-col-profile' },
        { id: 'specialization3', label: 'Spec3', title: 'Spezialisierung 3', sortKey: 'specialization3', className: 'team-table-col-profile' },
        { id: 'skillDevelopment', label: 'Entw.', title: 'Skill Development', sortKey: 'skillDevelopment', className: 'team-table-col-points' },
    ],
    preferences: [
        { id: 'seasonProgram', label: 'Programm', title: 'Saisonprogramm', className: 'team-table-col-program' },
        { id: 'mentorName', label: 'Mentor', title: 'Entwicklungs-Mentor im Team', sortKey: 'mentorName', className: 'team-table-col-mentor' },
        { id: 'favoriteRaces', label: 'Lieblingsrennen', title: 'Lieblingsrennen', className: 'team-table-col-preferences' },
        { id: 'nonFavoriteRaces', label: 'Nicht bevorzugt', title: 'Nicht bevorzugte Rennen', className: 'team-table-col-preferences' },
    ],
};
export function getActiveTeamTableColumns() {
    return [...TEAM_TABLE_COLUMNS, ...TEAM_DETAIL_PAGE_COLUMNS[state.teamDetailPage]];
}
export function getTeamTopAverage(teamId, limit = 12) {
    const teamRiders = state.riders
        .filter(rider => rider.activeTeamId === teamId)
        .sort((left, right) => right.overallRating - left.overallRating)
        .slice(0, limit);
    if (teamRiders.length === 0)
        return null;
    const total = teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0);
    return total / teamRiders.length;
}
export function getTeamAverage(teamId) {
    const teamRiders = state.riders.filter(rider => rider.activeTeamId === teamId);
    if (teamRiders.length === 0)
        return null;
    const total = teamRiders.reduce((sum, rider) => sum + rider.overallRating, 0);
    return total / teamRiders.length;
}
export function formatTeamTopAverage(teamId) {
    const average = getTeamTopAverage(teamId);
    return average == null ? '–' : average.toFixed(2).replace('.', ',');
}
export function formatTeamAverage(teamId) {
    const average = getTeamAverage(teamId);
    return average == null ? '–' : average.toFixed(2).replace('.', ',');
}
export function compareStrings(left, right) {
    return left.localeCompare(right, 'de', { sensitivity: 'base' });
}
export function compareOptionalStrings(left, right) {
    if (left == null && right == null)
        return 0;
    if (left == null)
        return 1;
    if (right == null)
        return -1;
    return compareStrings(left, right);
}
export function getPeakDate(rider, index) {
    return rider.seasonFormPeakDates?.[index];
}
export function getSpecializationSortLabel(value) {
    return value == null ? undefined : (typeof value === 'string' ? getRiderSpecializationLabel(value) : value.name);
}
export function getDefaultTeamSortDirection(sortKey) {
    return ['birthYear', 'age', 'overallRating', 'potOverall', 'formBonus', 'raceFormBonus', 'seasonFormPhase', 'seasonPoints', 'seasonRaceDays', 'seasonWins', 'skillDevelopment', ...TEAM_SKILL_COLUMNS.map((column) => column.key)].includes(sortKey)
        ? 'desc'
        : 'asc';
}
export function getSortIndicator(sortKey) {
    if (state.teamTableSort.key !== sortKey)
        return '<span class="team-table-sort-indicator">↕</span>';
    return `<span class="team-table-sort-indicator team-table-sort-indicator-active">${state.teamTableSort.direction === 'asc' ? '↑' : '↓'}</span>`;
}
export function renderTeamTableHeader(column) {
    if (!column.sortKey) {
        return `<th class="${esc(column.className ?? '')}" title="${esc(column.title)}">${esc(column.label)}</th>`;
    }
    const activeClass = state.teamTableSort.key === column.sortKey ? ' team-table-sort-active' : '';
    return `
    <th class="${esc(column.className ?? '')}" title="${esc(column.title)}">
      <button
        type="button"
        class="team-table-sort${activeClass}"
        data-team-sort="${column.sortKey}"
      >
        <span class="team-table-sort-label">${esc(column.label)}</span>
        ${getSortIndicator(column.sortKey)}
      </button>
    </th>`;
}
export function renderTeamDetailPageTabs() {
    return `
    <div class="team-detail-page-tabs" role="tablist" aria-label="Fahrer-Detailseite">
      ${TEAM_DETAIL_PAGE_ORDER.map((page) => {
        const labels = {
            skills: 'Werte',
            form: 'Saisonform',
            profile: 'Fahrertyp & Peaks',
            preferences: 'Programm & Mentoren',
        };
        return `
          <button
            type="button"
            class="team-detail-page-tab${state.teamDetailPage === page ? ' team-detail-page-tab-active' : ''}"
            role="tab"
            aria-selected="${state.teamDetailPage === page ? 'true' : 'false'}"
            data-team-detail-page="${page}"
          >
            ${labels[page]}
          </button>`;
    }).join('')}
    </div>`;
}
export const TEAM_SKILL_TITLES = {
    flat: 'Flach',
    mountain: 'Berg',
    mediumMountain: 'Mittlere Berge',
    hill: 'Hügel',
    timeTrial: 'Zeitfahren',
    prologue: 'Prolog',
    cobble: 'Pflaster',
    sprint: 'Sprint',
    acceleration: 'Antritt',
    downhill: 'Abfahrt',
    attack: 'Attacke',
    stamina: 'Stamina',
    resistance: 'Widerstand',
    recuperation: 'Regeneration',
    bikeHandling: 'Fahrtechnik',
};
export function getTeamSortLabel(sortKey) {
    if (sortKey === 'name')
        return 'Name';
    if (sortKey === 'countryCode')
        return 'Herkunft';
    if (sortKey === 'birthYear')
        return 'Geburtsjahr';
    if (sortKey === 'age')
        return 'Alter';
    if (sortKey === 'overallRating')
        return 'Stärke';
    if (sortKey === 'potOverall')
        return 'Potenzial';
    if (sortKey === 'formBonus')
        return 'Saisonform';
    if (sortKey === 'raceFormBonus')
        return 'Rennform';
    if (sortKey === 'averageForm')
        return 'Average Form';
    if (sortKey === 'longTermFatigueMalus')
        return 'Langzeiterschöpfung';
    if (sortKey === 'shortTermFatigueMalus')
        return 'Akute Erschöpfung';
    if (sortKey === 'seasonPoints')
        return 'Saisonpunkte';
    if (sortKey === 'seasonRaceDays')
        return 'Renntage';
    if (sortKey === 'seasonWins')
        return 'Siege';
    if (sortKey === 'contractEndSeason')
        return 'Vertragsende';
    if (sortKey === 'seasonFormPhase')
        return 'Formphase';
    if (sortKey === 'roleName')
        return 'Teamrolle';
    if (sortKey === 'riderType')
        return 'Fahrertyp';
    if (sortKey === 'specialization1')
        return 'Spec 1';
    if (sortKey === 'specialization2')
        return 'Spec 2';
    if (sortKey === 'specialization3')
        return 'Spec 3';
    if (sortKey === 'skillDevelopment')
        return 'Entwicklung';
    if (sortKey === 'mentorName')
        return 'Mentor';
    if (sortKey === 'peak1')
        return 'Peak 1';
    if (sortKey === 'peak2')
        return 'Peak 2';
    if (sortKey === 'peak3')
        return 'Peak 3';
    return TEAM_SKILL_TITLES[sortKey] ?? String(sortKey);
}
export function sortTeamRiders(riders) {
    const sortedRiders = [...riders];
    const directionFactor = state.teamTableSort.direction === 'asc' ? 1 : -1;
    sortedRiders.sort((left, right) => {
        let comparison = 0;
        switch (state.teamTableSort.key) {
            case 'name':
                comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
                break;
            case 'countryCode':
                comparison = compareStrings(getRiderCountryCode(left), getRiderCountryCode(right));
                break;
            case 'birthYear':
                comparison = left.birthYear - right.birthYear;
                break;
            case 'age':
                comparison = (left.age ?? 0) - (right.age ?? 0);
                break;
            case 'overallRating':
                comparison = left.overallRating - right.overallRating;
                break;
            case 'potOverall':
                comparison = (left.potential ?? 0) - (right.potential ?? 0);
                break;
            case 'formBonus':
                comparison = (left.formBonus ?? 0) - (right.formBonus ?? 0);
                break;
            case 'raceFormBonus':
                comparison = (left.raceFormBonus ?? 0) - (right.raceFormBonus ?? 0);
                break;
            case 'longTermFatigueMalus':
                comparison = (left.longTermFatigueMalus ?? 0) - (right.longTermFatigueMalus ?? 0);
                break;
            case 'shortTermFatigueMalus':
                comparison = (left.shortTermFatigueMalus ?? 0) - (right.shortTermFatigueMalus ?? 0);
                break;
            case 'seasonPoints':
                comparison = (left.seasonPoints ?? 0) - (right.seasonPoints ?? 0);
                break;
            case 'seasonRaceDays':
                comparison = (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0);
                break;
            case 'seasonWins':
                comparison = (left.seasonWins ?? 0) - (right.seasonWins ?? 0);
                break;
            case 'contractEndSeason':
                comparison = (left.contractEndSeason ?? Number.MAX_SAFE_INTEGER) - (right.contractEndSeason ?? Number.MAX_SAFE_INTEGER);
                break;
            case 'seasonFormPhase':
                comparison = compareStrings(left.seasonFormPhase ?? 'neutral', right.seasonFormPhase ?? 'neutral');
                break;
            case 'roleName':
                comparison = compareStrings(getRiderRoleName(left), getRiderRoleName(right));
                break;
            case 'riderType':
                comparison = compareStrings(left.riderType, right.riderType)
                    || compareStrings(formatRiderName(left), formatRiderName(right));
                break;
            case 'skillDevelopment':
                comparison = (left.skillDevelopment ?? 0) - (right.skillDevelopment ?? 0);
                break;
            case 'specialization1':
                comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization1), getSpecializationSortLabel(right.specialization1));
                break;
            case 'specialization2':
                comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization2), getSpecializationSortLabel(right.specialization2));
                break;
            case 'specialization3':
                comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization3), getSpecializationSortLabel(right.specialization3));
                break;
            case 'peak1':
                comparison = compareOptionalStrings(getPeakDate(left, 0), getPeakDate(right, 0));
                break;
            case 'peak2':
                comparison = compareOptionalStrings(getPeakDate(left, 1), getPeakDate(right, 1));
                break;
            case 'peak3':
                comparison = compareOptionalStrings(getPeakDate(left, 2), getPeakDate(right, 2));
                break;
            default:
                comparison = left.skills[state.teamTableSort.key] - right.skills[state.teamTableSort.key];
                break;
        }
        if (comparison === 0) {
            comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
        }
        return comparison * directionFactor;
    });
    return sortedRiders;
}
export function sortRiderMenuRiders(riders) {
    const sortedRiders = [...riders];
    const directionFactor = state.riderMenuTableSort.direction === 'asc' ? 1 : -1;
    sortedRiders.sort((left, right) => {
        let comparison = 0;
        switch (state.riderMenuTableSort.key) {
            case 'name':
                comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
                break;
            case 'countryCode':
                comparison = compareStrings(getRiderCountryCode(left), getRiderCountryCode(right));
                break;
            case 'birthYear':
                comparison = left.birthYear - right.birthYear;
                break;
            case 'age':
                comparison = (left.age ?? 0) - (right.age ?? 0);
                break;
            case 'overallRating':
                comparison = left.overallRating - right.overallRating;
                break;
            case 'potOverall':
                comparison = (left.potential ?? 0) - (right.potential ?? 0);
                break;
            case 'formBonus':
                comparison = (left.formBonus ?? 0) - (right.formBonus ?? 0);
                break;
            case 'raceFormBonus':
                comparison = (left.raceFormBonus ?? 0) - (right.raceFormBonus ?? 0);
                break;
            case 'longTermFatigueMalus':
                comparison = (left.longTermFatigueMalus ?? 0) - (right.longTermFatigueMalus ?? 0);
                break;
            case 'shortTermFatigueMalus':
                comparison = (left.shortTermFatigueMalus ?? 0) - (right.shortTermFatigueMalus ?? 0);
                break;
            case 'seasonPoints':
                comparison = (left.seasonPoints ?? 0) - (right.seasonPoints ?? 0);
                break;
            case 'seasonRaceDays':
                comparison = (left.seasonRaceDays ?? 0) - (right.seasonRaceDays ?? 0);
                break;
            case 'seasonWins':
                comparison = (left.seasonWins ?? 0) - (right.seasonWins ?? 0);
                break;
            case 'contractEndSeason':
                comparison = (left.contractEndSeason ?? Number.MAX_SAFE_INTEGER) - (right.contractEndSeason ?? Number.MAX_SAFE_INTEGER);
                break;
            case 'seasonFormPhase':
                comparison = compareStrings(left.seasonFormPhase ?? 'neutral', right.seasonFormPhase ?? 'neutral');
                break;
            case 'roleName':
                comparison = compareStrings(getRiderRoleName(left), getRiderRoleName(right));
                break;
            case 'riderType':
                comparison = compareStrings(left.riderType, right.riderType)
                    || compareStrings(formatRiderName(left), formatRiderName(right));
                break;
            case 'skillDevelopment':
                comparison = (left.skillDevelopment ?? 0) - (right.skillDevelopment ?? 0);
                break;
            case 'specialization1':
                comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization1), getSpecializationSortLabel(right.specialization1));
                break;
            case 'specialization2':
                comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization2), getSpecializationSortLabel(right.specialization2));
                break;
            case 'specialization3':
                comparison = compareOptionalStrings(getSpecializationSortLabel(left.specialization3), getSpecializationSortLabel(right.specialization3));
                break;
            case 'peak1':
                comparison = compareOptionalStrings(getPeakDate(left, 0), getPeakDate(right, 0));
                break;
            case 'peak2':
                comparison = compareOptionalStrings(getPeakDate(left, 1), getPeakDate(right, 1));
                break;
            case 'peak3':
                comparison = compareOptionalStrings(getPeakDate(left, 2), getPeakDate(right, 2));
                break;
            default:
                comparison = left.skills[state.riderMenuTableSort.key] - right.skills[state.riderMenuTableSort.key];
                break;
        }
        if (comparison === 0) {
            comparison = compareStrings(left.lastName, right.lastName) || compareStrings(left.firstName, right.firstName);
        }
        return comparison * directionFactor;
    });
    return sortedRiders;
}
export function renderRacePrefs(raceIds) {
    if (raceIds.length === 0)
        return '–';
    return raceIds.map(raceId => {
        const race = state.races.find(entry => entry.id === raceId);
        return race ? esc(race.name) : `Rennen ${raceId}`;
    }).join(', ');
}
export function renderPeakDatesSummary(rider) {
    const peakDates = rider.seasonFormPeakDates ?? [];
    if (peakDates.length === 0) {
        return '–';
    }
    return peakDates.join(' · ');
}
export function renderTeamTableCell(rider, column) {
    switch (column.id) {
        case 'name':
            return `<td class="team-table-name-cell">${renderRiderNameLink(formatRiderName(rider), {
                riderId: rider.id,
                teamId: rider.activeTeamId,
                strong: (state.teamDetailPage === 'form' || state.teamDetailPage === 'profile' || state.teamDetailPage === 'preferences'),
            })}${renderRiderAvailabilityMarker(rider)}</td>`;
        case 'country':
            return `<td><span class="team-table-country-cell">${renderFlag(getRiderCountryCode(rider))}<span>${esc(getRiderCountryCode(rider))}</span></span></td>`;
        case 'age':
            return `<td>${rider.age ?? (state.gameState ? state.gameState.season - rider.birthYear : '–')}</td>`;
        case 'roleName':
            return `<td class="team-table-wrap-cell">${esc(getRiderRoleName(rider))}</td>`;
        case 'overallRating':
            return `<td><span style="font-weight:bold">${rider.overallRating.toFixed(2)}</span></td>`;
        case 'potOverall':
            return `<td>${rider.potential != null ? rider.potential.toFixed(2) : '-'}</td>`;
        case 'birthYear':
            return `<td>${rider.birthYear}</td>`;
        case 'contractEndSeason':
            return `<td>${rider.contractEndSeason != null ? rider.contractEndSeason : '–'}</td>`;
        case 'formBonus':
            return `<td>${renderSeasonFormValue(rider.formBonus)}</td>`;
        case 'raceFormBonus':
            return `<td>${renderRaceFormBonusValue(rider.raceFormBonus)}</td>`;
        case 'averageForm':
            // formBonus + raceFormBonus
            return `<td>${renderSeasonFormValue((rider.formBonus ?? 0) + (rider.raceFormBonus ?? 0))}</td>`;
        case 'longTermFatigueMalus':
            return `<td>${renderLoadMalusValue(rider.longTermFatigueMalus, 'none', 'Langzeit-Fatigue')}</td>`;
        case 'shortTermFatigueMalus':
            return `<td>${renderLoadMalusValue(rider.shortTermFatigueMalus, rider.shortTermFatigueWarning, 'Kurzzeit-Fatigue')}</td>`;
        case 'seasonFormPhase':
            return `<td>${renderSeasonFormPhase(rider)}</td>`;
        case 'seasonPoints':
            return `<td>${rider.seasonPoints ?? 0}</td>`;
        case 'seasonRaceDays':
            return `<td>${rider.seasonRaceDays ?? 0}</td>`;
        case 'seasonWins':
            return `<td>${rider.seasonWins ?? 0}</td>`;
        case 'peak1':
            return `<td class="team-table-wrap-cell">${esc(getPeakDate(rider, 0) ?? '–')}</td>`;
        case 'peak2':
            return `<td class="team-table-wrap-cell">${esc(getPeakDate(rider, 1) ?? '–')}</td>`;
        case 'peak3':
            return `<td class="team-table-wrap-cell">${esc(getPeakDate(rider, 2) ?? '–')}</td>`;
        case 'riderType':
            return `<td class="team-table-wrap-cell">${esc(rider.riderType ?? '–')}</td>`;
        case 'specialization1':
            return `<td class="team-table-wrap-cell">${rider.specialization1 ? esc(getRiderSpecializationLabel(rider.specialization1)) : '–'}</td>`;
        case 'specialization2':
            return `<td class="team-table-wrap-cell">${rider.specialization2 ? esc(getRiderSpecializationLabel(rider.specialization2)) : '–'}</td>`;
        case 'specialization3':
            return `<td class="team-table-wrap-cell">${rider.specialization3 ? esc(getRiderSpecializationLabel(rider.specialization3)) : '–'}</td>`;
        case 'skillDevelopment':
            return `<td>${rider.skillDevelopment != null && rider.skillDevelopment > 0 ? `<span class="race-sim-form-positive">+${rider.skillDevelopment}</span>` : '–'}</td>`;
        case 'seasonProgram':
            return `<td>${renderRiderProgramButton(rider)}</td>`;
        case 'mentorName':
            if (rider.mentorName) {
                return `<td><div style="display:flex;align-items:center;justify-content:flex-start;gap:0.4rem;">${renderFlag(rider.mentorCountryCode ?? 'UNK')} <span>${esc(rider.mentorName)} (${rider.mentorAge ?? '?'})</span></div></td>`;
            }
            return `<td>–</td>`;
        case 'favoriteRaces':
            return `<td class="team-table-wrap-cell">${renderRacePrefs(rider.favoriteRaces ?? [])}</td>`;
        case 'nonFavoriteRaces':
            return `<td class="team-table-wrap-cell">${renderRacePrefs(rider.nonFavoriteRaces ?? [])}</td>`;
        default: {
            if (column.id.startsWith('skill-')) {
                const skillKey = column.sortKey;
                if (skillKey && skillKey in rider.skills) {
                    return `<td>${renderSkillValueWithDelta(rider.skills[skillKey], rider.yearStartSkills?.[skillKey], rider.potentials?.[skillKey])}</td>`;
                }
                return '<td>-</td>';
            }
            return '<td>–</td>';
        }
    }
}
export async function refreshTeamsViewData() {
    showLoading('Teams/Fahrer werden aktualisiert...');
    try {
        const onlyWithTeam = !isActiveView('riders');
        const res = await api.getRiders(undefined, onlyWithTeam);
        if (res.success) {
            state.riders = res.data ?? [];
        }
        await api.getTeams().then(t => {
            if (t.success)
                state.teams = t.data ?? [];
        });
        if (isActiveView('teams')) {
            renderTeams();
        }
        if (isActiveView('riders')) {
            // Import and render riders menu dynamically
            const { renderRidersMenu } = await import('./riders');
            renderRidersMenu();
        }
    }
    finally {
        hideLoading();
    }
}
export async function loadTeams(options = {}) {
    const res = await api.getTeams();
    if (!res.success) {
        console.error('loadTeams Fehler:', res.error);
        $('teams-detail').innerHTML = `<p class="error-msg">Teams konnten nicht geladen werden: ${esc(res.error ?? 'Unbekannt')}</p>`;
        return;
    }
    state.teams = res.data ?? [];
    if (options.render !== false && isActiveView('teams')) {
        renderTeams();
    }
}
export function renderTeams() {
    const dropdown = $('teams-dropdown');
    const currentVal = dropdown.value;
    dropdown.innerHTML = '<option value="">– Team auswählen –</option>' +
        state.teams.map(t => `<option value="${t.id}"${String(t.id) === currentVal ? ' selected' : ''}>${esc(t.name)} (${esc(t.division ?? t.divisionName ?? '')}) · ${esc(t.abbreviation)}</option>`).join('');
    const selectedId = currentVal ? Number(currentVal) : null;
    renderTeamDetail(selectedId);
}
export function renderTeamDetail(teamId) {
    const detail = $('teams-detail');
    if (teamId === null) {
        detail.innerHTML = '<p class="text-muted" style="padding:1rem 0">Team aus der Liste auswählen.</p>';
        return;
    }
    const team = state.teams.find(t => t.id === teamId);
    if (!team) {
        detail.innerHTML = '';
        return;
    }
    const riders = sortTeamRiders(state.riders.filter(r => r.activeTeamId === teamId));
    const divBadge = team.division === 'U23' ? 'badge-u23' : 'badge-classics';
    const activeColumns = getActiveTeamTableColumns();
    detail.innerHTML = `
    <div class="team-detail-card">
      <div class="team-detail-header">
        <h3>${esc(team.name)}</h3>
        <div class="team-detail-meta">
          <span class="badge ${divBadge}">${esc(team.division ?? team.divisionName ?? '')}</span>
          <span>${renderCountry(team.country, team.countryCode)}</span>
          <span>Kürzel: ${esc(team.abbreviation)} · Top 12 ${esc(formatTeamTopAverage(team.id))} (${esc(formatTeamAverage(team.id))})</span>
          ${team.isPlayerTeam ? '<span class="badge badge-live">Spielerteam</span>' : ''}
        </div>
      </div>
      <div class="team-detail-meta" style="margin-top:0.75rem">
        <span>${riders.length} Fahrer</span>
        <span class="text-muted">Sortierung: ${esc(getTeamSortLabel(state.teamTableSort.key))} ${state.teamTableSort.direction === 'asc' ? 'aufsteigend' : 'absteigend'}</span>
      </div>
      ${renderTeamDetailPageTabs()}
      <div class="team-detail-table-scroll">
        <table class="data-table data-table-teams">
          <thead><tr>
            ${activeColumns.map(renderTeamTableHeader).join('')}
          </tr></thead>
          <tbody>
            ${riders.length === 0
        ? `<tr><td colspan="${activeColumns.length}" class="text-muted">Keine Fahrer.</td></tr>`
        : riders.map(r => {
            return `
                <tr class="team-detail-row">
                  ${activeColumns.map((column) => renderTeamTableCell(r, column)).join('')}
                </tr>`;
        }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}
export function initTeamsListeners() {
    $('teams-dropdown').addEventListener('change', (e) => {
        const val = e.target.value;
        state.teamDetailPage = 'skills';
        renderTeamDetail(val ? Number(val) : null);
    });
    $('teams-detail').addEventListener('click', (event) => {
        const programButton = event.target.closest('button[data-rider-program-id]');
        if (programButton) {
            const riderId = Number(programButton.dataset['riderProgramId']);
            if (Number.isFinite(riderId)) {
                void openRiderProgram(riderId);
            }
            return;
        }
        const pageButton = event.target.closest('button[data-team-detail-page]');
        if (pageButton) {
            const nextPage = pageButton.dataset['teamDetailPage'];
            if (TEAM_DETAIL_PAGE_ORDER.includes(nextPage)) {
                state.teamDetailPage = nextPage;
                const visibleSortKeys = new Set(getActiveTeamTableColumns().map((column) => column.sortKey).filter((sortKey) => sortKey != null));
                if (!visibleSortKeys.has(state.teamTableSort.key)) {
                    state.teamTableSort = { key: 'name', direction: 'asc' };
                }
                const selectedTeamId = Number($('teams-dropdown').value);
                renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
            }
            return;
        }
        const sortButton = event.target.closest('button[data-team-sort]');
        if (sortButton) {
            const sortKey = sortButton.dataset['teamSort'];
            if (state.teamTableSort.key === sortKey) {
                state.teamTableSort.direction = state.teamTableSort.direction === 'asc' ? 'desc' : 'asc';
            }
            else {
                state.teamTableSort = {
                    key: sortKey,
                    direction: getDefaultTeamSortDirection(sortKey),
                };
            }
            const selectedTeamId = Number($('teams-dropdown').value);
            renderTeamDetail(Number.isFinite(selectedTeamId) ? selectedTeamId : null);
            return;
        }
    });
}
