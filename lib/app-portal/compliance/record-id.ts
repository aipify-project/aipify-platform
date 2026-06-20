const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Static compliance API segments — never valid policy record UUIDs. */
export const COMPLIANCE_STATIC_ROUTE_SEGMENTS = new Set([
  "dashboard",
  "overview",
  "policies",
  "controls",
  "evidence",
  "audits",
  "reports",
  "privacy-requests",
  "data-governance",
  "retention",
  "unonight",
]);

export function isCompliancePolicyRecordId(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || COMPLIANCE_STATIC_ROUTE_SEGMENTS.has(trimmed.toLowerCase())) {
    return false;
  }
  return UUID_REGEX.test(trimmed);
}
