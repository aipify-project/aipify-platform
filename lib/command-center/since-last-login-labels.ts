import type { Translator } from "@/lib/i18n/translate";

export type SinceLastLoginUxLabels = {
  activityHeading: string;
  insight: string;
  insightLabel: string;
  summaryRequiresAttention: string;
  summaryCompleted: string;
  summaryOtherChanges: string;
  groupRequiresAttention: string;
  groupCompleted: string;
  groupOtherChanges: string;
  emptyAttention: string;
  emptyAll: string;
  emptyAllDescription: string;
  errorTitle: string;
  errorDescription: string;
  refresh: string;
  viewActivityHistory: string;
  openAction: string;
  countItem: string;
  countItems: string;
  countUpdate: string;
  countUpdates: string;
  countEscalation: string;
  countEscalations: string;
  severity: {
    critical: string;
    high: string;
    medium: string;
    low: string;
    info: string;
  };
  workflow: {
    open: string;
    pending: string;
    awaitingApproval: string;
    inProgress: string;
    completed: string;
  };
  completedByAipify: string;
  information: string;
};

export function buildSinceLastLoginUxLabels(t: Translator): SinceLastLoginUxLabels {
  const p = "customerApp.executiveCommandCenter.sinceLastLoginUx";
  return {
    activityHeading: t(`${p}.activityHeading`),
    insight: t(`${p}.insight`),
    insightLabel: t(`${p}.insightLabel`),
    summaryRequiresAttention: t(`${p}.summaryRequiresAttention`),
    summaryCompleted: t(`${p}.summaryCompleted`),
    summaryOtherChanges: t(`${p}.summaryOtherChanges`),
    groupRequiresAttention: t(`${p}.groupRequiresAttention`),
    groupCompleted: t(`${p}.groupCompleted`),
    groupOtherChanges: t(`${p}.groupOtherChanges`),
    emptyAttention: t(`${p}.emptyAttention`),
    emptyAll: t(`${p}.emptyAll`),
    emptyAllDescription: t(`${p}.emptyAllDescription`),
    errorTitle: t(`${p}.errorTitle`),
    errorDescription: t(`${p}.errorDescription`),
    refresh: t(`${p}.refresh`),
    viewActivityHistory: t(`${p}.viewActivityHistory`),
    openAction: t(`${p}.openAction`),
    countItem: t(`${p}.countItem`),
    countItems: t(`${p}.countItems`),
    countUpdate: t(`${p}.countUpdate`),
    countUpdates: t(`${p}.countUpdates`),
    countEscalation: t(`${p}.countEscalation`),
    countEscalations: t(`${p}.countEscalations`),
    severity: {
      critical: t(`${p}.severity.critical`),
      high: t(`${p}.severity.high`),
      medium: t(`${p}.severity.medium`),
      low: t(`${p}.severity.low`),
      info: t(`${p}.severity.info`),
    },
    workflow: {
      open: t(`${p}.workflow.open`),
      pending: t(`${p}.workflow.pending`),
      awaitingApproval: t(`${p}.workflow.awaitingApproval`),
      inProgress: t(`${p}.workflow.inProgress`),
      completed: t(`${p}.workflow.completed`),
    },
    completedByAipify: t(`${p}.completedByAipify`),
    information: t(`${p}.information`),
  };
}

export function formatSinceLastLoginCount(
  labels: SinceLastLoginUxLabels,
  count: number,
  eventType: string
): string {
  const type = eventType.toLowerCase();
  if (type.includes("escalat")) {
    return count === 1 ? labels.countEscalation : labels.countEscalations.replace("{{count}}", String(count));
  }
  if (type.includes("update") || type.includes("change") || type.includes("publication")) {
    return count === 1
      ? labels.countUpdate
      : labels.countUpdates.replace("{{count}}", String(count));
  }
  return count === 1 ? labels.countItem : labels.countItems.replace("{{count}}", String(count));
}
