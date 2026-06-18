/** Coerce RPC overview metric values for safe React rendering. */
export function formatOverviewMetric(value: unknown): string | number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") return value;
  return 0;
}

/** Coerce executive dashboard values for safe React rendering. */
export function formatExecutiveMetric(value: unknown, fallback = "—"): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.length > 0) return value;
  return fallback;
}
