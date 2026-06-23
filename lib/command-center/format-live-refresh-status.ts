export type LiveRefreshStatusLabels = {
  updatedNow: string;
  updatedSecondsAgo: string;
  updatedMinutesAgo: string;
  refreshFailed: string;
};

export function formatLiveRefreshStatus(
  lastUpdatedAt: number | null,
  refreshError: string | null,
  labels: LiveRefreshStatusLabels,
  nowMs: number = Date.now(),
): string {
  if (refreshError) {
    return labels.refreshFailed;
  }
  if (lastUpdatedAt === null) {
    return "";
  }

  const elapsedSeconds = Math.max(0, Math.floor((nowMs - lastUpdatedAt) / 1000));
  if (elapsedSeconds < 5) {
    return labels.updatedNow;
  }
  if (elapsedSeconds < 60) {
    return labels.updatedSecondsAgo.replace("{seconds}", String(elapsedSeconds));
  }

  const minutes = Math.floor(elapsedSeconds / 60);
  return labels.updatedMinutesAgo.replace("{minutes}", String(minutes));
}
