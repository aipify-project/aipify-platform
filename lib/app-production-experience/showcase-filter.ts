/**
 * Phase 620 showcase / design-validation rows are registered in
 * `app_showcase_data_registry` and must not appear as real customer data.
 */

export const SHOWCASE_DATASET_PREFIX = "phase620_app_showcase";
export const SHOWCASE_KEY_PREFIX = /^ps620:/i;

export function isShowcaseKey(value: string | null | undefined): boolean {
  return SHOWCASE_KEY_PREFIX.test(String(value ?? "").trim());
}

export function isShowcaseTitle(title: string | null | undefined): boolean {
  const t = String(title ?? "").trim();
  if (!t) return false;
  // Known Phase 620 fixture titles (English seed copy).
  const known = [
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
  ];
  return known.some((k) => t.startsWith(k) || t.includes(k));
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
