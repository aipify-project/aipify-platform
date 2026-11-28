/**
 * Home product cards. Kompis Bedrift opens only when Core says the module is usable.
 * Unknown stays distinct from unavailable — same contract as Kompis Web.
 */
export function bedriftHomeCardState(
  available: boolean | null
): "open" | "unavailable" | "unknown" {
  if (available === true) return "open";
  if (available === false) return "unavailable";
  return "unknown";
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
