/** Maps raw backend record titles to localized label keys when available. */
const RECORD_TITLE_LABEL_KEYS: Record<string, string> = {
  critical_approval_delay:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.criticalApprovalDelay",
  pending_trust_approval:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.pendingTrustApproval",
  major_customer_risk:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.majorCustomerRisk",
  invoice_paid: "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.invoicePaid",
};

function normalizeRecordTitleKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function resolveCommandBriefRecordTitleLabelKey(title: string): string | null {
  const key = normalizeRecordTitleKey(title);
  if (RECORD_TITLE_LABEL_KEYS[key]) return RECORD_TITLE_LABEL_KEYS[key];
  return null;
}

export function resolveCommandBriefRecordTitle(
  title: string,
  resolveLabel: (key: string) => string,
): string {
  const labelKey = resolveCommandBriefRecordTitleLabelKey(title);
  return labelKey ? resolveLabel(labelKey) : title;
}
