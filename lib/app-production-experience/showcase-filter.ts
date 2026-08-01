/**
 * Showcase / design-validation / Phase seed rows must not appear as real customer data
 * in ordinary Production APP surfaces.
 */

export const SHOWCASE_DATASET_PREFIX = "phase620_app_showcase";
export const SHOWCASE_KEY_PREFIX = /^ps620:/i;

/** Known Phase 590 / ECC seed titles (English fixture copy). */
export const SHOWCASE_EVENT_TITLES = [
  "Improve onboarding time-to-value",
  "Reduce support escalation rate",
  "Enterprise-wide operational excellence program with extended naming for list density testing",
  "Launch Nordic partner program",
  "Bright Fjord Marketing Studio",
  "Nordic Ledger Partners AS",
  "SafeOps Insurance Cooperative",
  "Berg & Halvorsen Advokatfirma",
  "ShieldPoint Security Consulting",
  "PayFlow Europe Ltd",
  "Critical Payment Gateway Operator",
  "IntegrateX Technology Partner",
  "Arctic Route Logistics",
  "Legacy Hosting Provider",
  "CloudNorth Infrastructure",
  "Renhold Oslo",
  "Contract Expiring",
  "Revenue Alerts",
  "New Partner Leads",
  "Risk Detected",
  "Large Invoice Overdue",
  "Daily Executive Briefing",
  "Annual Summary",
  "Pending Trust Approval",
  "Activity summary",
] as const;

/** Known fixture alert/action type codes that are never customer-authoritative alone. */
export const SHOWCASE_TYPE_CODES = new Set([
  "contract_expiring",
  "revenue_alerts",
  "partner_leads",
  "daily_executive",
  "annual_summary",
  "annual",
]);

export function isShowcaseKey(value: string | null | undefined): boolean {
  return SHOWCASE_KEY_PREFIX.test(String(value ?? "").trim());
}

export function isShowcaseTitle(title: string | null | undefined): boolean {
  const t = String(title ?? "").trim();
  if (!t) return false;
  return SHOWCASE_EVENT_TITLES.some((k) => t === k || t.startsWith(k) || t.includes(k));
}

export function isShowcaseTypeCode(value: string | null | undefined): boolean {
  const code = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return SHOWCASE_TYPE_CODES.has(code);
}

export function isShowcaseCustomerRecord(record: Record<string, unknown>): boolean {
  const idFields = [
    record.alert_key,
    record.alert_id,
    record.action_key,
    record.approval_id,
    record.opportunity_key,
    record.item_key,
    record.briefing_key,
    record.report_key,
    record.source_record_id,
    record.id,
    record.notes,
  ].map((value) => String(value ?? ""));

  if (idFields.some((value) => isShowcaseKey(value))) return true;

  const titles = [
    record.alert_title,
    record.action_title,
    record.opportunity_title,
    record.item_title,
    record.briefing_title,
    record.report_title,
    record.title,
  ];
  if (titles.some((value) => isShowcaseTitle(String(value ?? "")))) return true;

  const types = [
    record.alert_type,
    record.action_type,
    record.item_type,
    record.item_category,
    record.event_type,
    record.report_type,
  ];
  if (types.some((value) => isShowcaseTypeCode(String(value ?? "")))) return true;

  return false;
}

export function filterShowcaseByNotesOrTitle<
  T extends { notes?: string | null; title?: string | null; organization_name?: string | null; name?: string | null },
>(items: T[]): T[] {
  return items.filter((item) => {
    if (isShowcaseKey(item.notes)) return false;
    const label = item.title ?? item.organization_name ?? item.name;
    if (isShowcaseTitle(label)) return false;
    return true;
  });
}
