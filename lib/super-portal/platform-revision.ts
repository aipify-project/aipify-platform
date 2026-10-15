import type { SuperGlobalAuditEntry } from "./types";

/** Compact read-only summary of JSON state — never invents events. */
export function summarizeAuditState(
  state: Record<string, unknown>,
  emptyLabel: string,
): string {
  const keys = Object.keys(state);
  if (keys.length === 0) return emptyLabel;
  try {
    const raw = JSON.stringify(state);
    if (raw.length <= 120) return raw;
    return `${raw.slice(0, 117)}…`;
  } catch {
    return emptyLabel;
  }
}

export function isSuperRevisionEntry(value: unknown): value is SuperGlobalAuditEntry {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.id === "string" && typeof row.action === "string";
}
