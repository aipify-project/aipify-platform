export type NotificationPreferencesStatus = "idle" | "loading" | "ready" | "error";

export function preferencesStatusIsLoading(status: NotificationPreferencesStatus): boolean {
  return status === "loading";
}

export function preferencesStatusIsError(status: NotificationPreferencesStatus): boolean {
  return status === "error";
}

export function canStartPreferencesLoad(
  status: NotificationPreferencesStatus,
  manualRetry: boolean,
): boolean {
  if (status === "loading") return false;
  if (manualRetry) return true;
  return status === "idle";
}

export function nextPreferencesStatusAfterLoadSuccess(): NotificationPreferencesStatus {
  return "ready";
}

export function nextPreferencesStatusAfterLoadFailure(): NotificationPreferencesStatus {
  return "error";
}

export function nextPreferencesStatusOnManualRetry(): NotificationPreferencesStatus {
  return "loading";
}
