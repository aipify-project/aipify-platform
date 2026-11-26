/**
 * Home product cards. Kompis Bedrift opens only when Core says the module is usable.
 * Unknown and false stay closed, matching the shell redirect.
 */
export function bedriftHomeCardState(available: boolean | null): "open" | "unavailable" {
  return available === true ? "open" : "unavailable";
}

/** Home and connection cards open only on a positive entitlement read. */
export function webHomeCardState(available: boolean | null): "open" | "unavailable" | "unknown" {
  if (available === true) return "open";
  if (available === false) return "unavailable";
  return "unknown";
}

/** Hide raw status enums. Real plan names with spaces or capitals stay visible. */
export function customerFacingPlanLabel(value: string | null): string | null {
  const text = value?.trim() ?? "";
  if (!text) return null;
  if (/^[a-z0-9_]+$/.test(text)) return null;
  return text;
}
