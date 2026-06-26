export function isMountainClassificationMarker(marker) {
    return marker.type === 'climb_top'
        || ((marker.type === 'finish_hill' || marker.type === 'finish_mountain') && marker.cat != null && marker.cat !== 'Sprint');
}
function buildStageBoundaryMarkerKey(segmentIndex, boundary, markerIndex, marker) {
    return `${marker.type}:${segmentIndex}:${boundary}:${markerIndex}`;
}
function buildDefaultMarkerLabel(marker, ordinal) {
    if (marker.type === 'sprint_intermediate')
        return `SZ ${ordinal}`;
    if (isMountainClassificationMarker(marker))
        return `Berg ${ordinal}`;
    if (marker.type === 'climb_start')
        return `Anstieg ${ordinal}`;
    if (marker.type === 'start')
        return 'Start';
    return 'Ziel';
}
export function collectStageBoundaryMarkers(summary) {
    const markers = [];
    summary.segments.forEach((segment, segmentIndex) => {
        const sequenceBase = segmentIndex * 2;
        (segment.start_markers ?? []).forEach((marker, markerIndex) => {
            markers.push({
                key: buildStageBoundaryMarkerKey(segmentIndex, 'start', markerIndex, marker),
                label: '',
                marker,
                kmMark: segment.start_km,
                elevation: segment.start_elevation,
                boundary: 'start',
                sequence: sequenceBase + (markerIndex / 100),
            });
        });
        (segment.end_markers ?? []).forEach((marker, markerIndex) => {
            markers.push({
                key: buildStageBoundaryMarkerKey(segmentIndex, 'end', markerIndex, marker),
                label: '',
                marker,
                kmMark: segment.end_km,
                elevation: segment.end_elevation,
                boundary: 'end',
                sequence: sequenceBase + 1 + (markerIndex / 100),
            });
        });
    });
    const sorted = markers.sort((left, right) => left.kmMark - right.kmMark || left.sequence - right.sequence);
    const counts = new Map();
    return sorted.map((entry) => {
        const ordinal = (counts.get(entry.marker.type) ?? 0) + 1;
        counts.set(entry.marker.type, ordinal);
        return {
            ...entry,
            label: entry.marker.name ?? buildDefaultMarkerLabel(entry.marker, ordinal),
        };
    });
}
export function buildIntermediateSplitLabels(summary) {
    return collectStageBoundaryMarkers(summary)
        .filter(({ marker }) => marker.type === 'sprint_intermediate' || isMountainClassificationMarker(marker))
        .map(({ label }) => label);
}
export function summarizeStageMarkers(summary) {
    const boundaryMarkers = collectStageBoundaryMarkers(summary);
    return {
        segmentCount: summary.segments.length,
        sprintCount: boundaryMarkers.filter(({ marker }) => marker.type === 'sprint_intermediate').length,
        climbCount: boundaryMarkers.filter(({ marker }) => isMountainClassificationMarker(marker)).length,
    };
}
