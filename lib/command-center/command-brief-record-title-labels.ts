/** Maps raw backend record titles to localized label keys when available. */
const RECORD_TITLE_LABEL_KEYS: Record<string, string> = {
  critical_approval_delay:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.criticalApprovalDelay",
  pending_trust_approval:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.pendingTrustApproval",
  major_customer_risk:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.majorCustomerRisk",
  invoice_paid: "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.invoicePaid",
  kompis_website_publish:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.kompisWebsitePublish",
  kompis_website_rollback:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.kompisWebsiteRollback",
  contract_expiring:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.contractExpiring",
  revenue_alerts:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.revenueAlerts",
  new_partner_leads:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.newPartnerLeads",
  risk_detected:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.riskDetected",
  large_invoice_overdue:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.largeInvoiceOverdue",
  daily_executive_briefing:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.dailyExecutiveBriefing",
  annual_summary:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.annualSummary",
  activity_summary:
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.activitySummary",
};

function normalizeRecordTitleKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function resolveCommandBriefRecordTitleLabelKey(title: string): string | null {
  const key = normalizeRecordTitleKey(title);
  if (RECORD_TITLE_LABEL_KEYS[key]) return RECORD_TITLE_LABEL_KEYS[key];
  // Stable aliases from CORE/ECC SQL title strings
  if (key === "kompis_publish_website_draft" || key === "kompis_publish_website") {
    return RECORD_TITLE_LABEL_KEYS.kompis_website_publish;
  }
  if (key === "kompis_roll_back_website_version" || key === "kompis_website_roll_back") {
    return RECORD_TITLE_LABEL_KEYS.kompis_website_rollback;
  }
  return null;
}

export function resolveCommandBriefRecordTitle(
  title: string,
  resolveLabel: (key: string) => string,
): string {
  const labelKey = resolveCommandBriefRecordTitleLabelKey(title);
  return labelKey ? resolveLabel(labelKey) : title;
}
