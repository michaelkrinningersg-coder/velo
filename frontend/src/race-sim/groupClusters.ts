import type { RiderCluster } from './SimulationEngine';

export interface NamedRaceGroup extends RiderCluster {
  label: string;
  isPeloton: boolean;
  previousGapMeters: number | null;
  nextGapMeters: number | null;
}

const DISPLAY_CLUSTER_MIN_GAP_METERS = 200;

export function mergeDisplayedClusters(clusters: RiderCluster[]): RiderCluster[] {
  if (clusters.length === 0) {
    return [];
  }

  const merged: Array<RiderCluster & { distanceSum: number }> = [];

  for (const cluster of clusters) {
    const current = merged[merged.length - 1];
    if (!current || Math.abs(current.distanceMeter - cluster.distanceMeter) >= DISPLAY_CLUSTER_MIN_GAP_METERS) {
      merged.push({
        riderIds: [...cluster.riderIds],
        riderCount: cluster.riderCount,
        distanceMeter: cluster.distanceMeter,
        distanceSum: cluster.distanceMeter * cluster.riderCount,
      });
      continue;
    }

    current.riderIds.push(...cluster.riderIds);
    current.riderCount += cluster.riderCount;
    current.distanceSum += cluster.distanceMeter * cluster.riderCount;
    current.distanceMeter = current.distanceSum / current.riderCount;
  }

  return merged.map(({ distanceSum: _distanceSum, ...cluster }) => cluster);
}

export function buildNamedRaceGroups(clusters: RiderCluster[]): NamedRaceGroup[] {
  if (clusters.length === 0) {
    return [];
  }

  let pelotonIndex = 0;
  for (let index = 1; index < clusters.length; index += 1) {
    if (clusters[index].riderCount > clusters[pelotonIndex].riderCount) {
      pelotonIndex = index;
    }
  }

  let escapeCounter = 0;
  let chaseCounter = 0;

  return clusters.map((cluster, index) => {
    const isPeloton = index === pelotonIndex;
    let label: string;

    if (isPeloton) {
      label = 'P';
    } else if (index < pelotonIndex) {
      escapeCounter += 1;
      label = `E${escapeCounter}`;
    } else {
      chaseCounter += 1;
      label = `A${chaseCounter}`;
    }

    return {
      ...cluster,
      label,
      isPeloton,
      previousGapMeters: index > 0 ? Math.max(0, clusters[index - 1].distanceMeter - cluster.distanceMeter) : null,
      nextGapMeters: index < clusters.length - 1 ? Math.max(0, cluster.distanceMeter - clusters[index + 1].distanceMeter) : null,
    };
  });
}

export function resolveDefaultRaceGroupLabel(groups: NamedRaceGroup[], currentLabel: string | null = null): string | null {
  if (currentLabel != null && groups.some((group) => group.label === currentLabel)) {
    return currentLabel;
  }

  return groups.find((group) => group.label.startsWith('E'))?.label
    ?? groups.find((group) => group.label === 'P')?.label
    ?? groups[0]?.label
    ?? null;
}
