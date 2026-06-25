/** Maps raw backend record descriptions to localized label keys when available. */
const RECORD_DESCRIPTION_LABEL_KEYS: Record<string, string> = {
  complete_pending_executive_approval_today:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordDescriptions.completePendingExecutiveApprovalToday",
};

function normalizeRecordDescriptionKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function resolveCommandBriefRecordDescriptionLabelKey(description: string): string | null {
  const key = normalizeRecordDescriptionKey(description);
  if (RECORD_DESCRIPTION_LABEL_KEYS[key]) return RECORD_DESCRIPTION_LABEL_KEYS[key];
  return null;
}

export function resolveCommandBriefRecordDescription(
  description: string,
  resolveLabel: (key: string) => string,
): string {
  const labelKey = resolveCommandBriefRecordDescriptionLabelKey(description);
  return labelKey ? resolveLabel(labelKey) : description;
}
