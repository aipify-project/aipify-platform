/**
 * Maps technical ECC / alert / activity type codes to locale label keys.
 * Components must never show raw snake_case types in primary UI.
 */

export const BUSINESS_TYPE_LABEL_KEYS: Record<string, string> = {
  approval_delay: "customerApp.executiveCommandCenter.types.approvalDelay",
  customer_risk: "customerApp.executiveCommandCenter.types.customerRisk",
  invoice_overdue: "customerApp.executiveCommandCenter.types.invoiceOverdue",
  contract_expiring: "customerApp.executiveCommandCenter.types.contractExpiring",
  revenue_alert: "customerApp.executiveCommandCenter.types.revenueAlert",
  revenue_alerts: "customerApp.executiveCommandCenter.types.revenueAlert",
  partner_lead: "customerApp.executiveCommandCenter.types.partnerLead",
  partner_leads: "customerApp.executiveCommandCenter.types.partnerLead",
  daily_executive: "customerApp.executiveCommandCenter.types.dailyExecutive",
  annual: "customerApp.executiveCommandCenter.types.annual",
  annual_summary: "customerApp.executiveCommandCenter.types.annual",
  activity_summary: "customerApp.executiveCommandCenter.types.activitySummary",
  website_publish: "customerApp.executiveCommandCenter.types.websitePublish",
  website_preview: "customerApp.executiveCommandCenter.types.websitePreview",
  approval: "customerApp.executiveCommandCenter.types.approval",
  risk: "customerApp.executiveCommandCenter.types.risk",
  opportunity: "customerApp.executiveCommandCenter.types.opportunity",
};

export function normalizeBusinessTypeCode(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function resolveBusinessTypeLabelKey(value: string | null | undefined): string | null {
  const code = normalizeBusinessTypeCode(value);
  if (!code) return null;
  return BUSINESS_TYPE_LABEL_KEYS[code] ?? null;
}

export function resolveBusinessTypeLabel(
  value: string | null | undefined,
  resolveLabel: (key: string) => string,
  fallback = "",
): string {
  const key = resolveBusinessTypeLabelKey(value);
  if (!key) return fallback;
  const label = resolveLabel(key);
  return !label || label === key ? fallback : label;
}
