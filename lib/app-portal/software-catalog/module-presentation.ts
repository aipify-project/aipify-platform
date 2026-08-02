/**
 * Customer-safe module presentation helpers for the read-only software catalog.
 * Technical identifiers must never appear as product titles.
 */

const OPERATIVE_MODULE_STATUSES = new Set(["enabled", "trial", "beta"]);

export function isTechnicalIdentifier(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.includes(".")) return true;
  // snake_case / engine keys (additional_automation, aipify_companion_*)
  if (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(trimmed)) return true;
  if (/_engine$/i.test(trimmed)) return true;
  if (/^aipify_companion_/i.test(trimmed)) return true;
  return false;
}

export function resolveCustomerFacingModuleName(input: {
  moduleKey: string;
  moduleName?: string | null;
  name?: string | null;
  localizedName?: string | null;
}): string | null {
  const candidates = [input.localizedName, input.moduleName, input.name];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    if (isTechnicalIdentifier(trimmed)) continue;
    if (trimmed === input.moduleKey) continue;
    return trimmed;
  }
  return null;
}

/**
 * Canonical included proof aligned with Core `_cpa_read_module_enabled`:
 * licensed AND enabled AND status in enabled|trial|beta.
 */
export function resolveModuleCatalogStatus(mod: Record<string, unknown>): {
  status: "included" | "available" | "pending_approval" | "unavailable";
  entitled: boolean;
} {
  const hasLicensed = typeof mod.licensed === "boolean";
  const licensed = mod.licensed === true;
  const enabled = mod.enabled === true;
  const statusRaw = typeof mod.status === "string" ? mod.status.trim().toLowerCase() : "";
  const statusOk = statusRaw.length === 0 || OPERATIVE_MODULE_STATUSES.has(statusRaw);

  if (licensed && enabled && statusOk) {
    return { status: "included", entitled: true };
  }

  // Pending activation / approval style states — never "included"
  if (
    statusRaw === "pending" ||
    statusRaw === "pending_approval" ||
    statusRaw === "pending_activation" ||
    statusRaw === "validating"
  ) {
    return { status: "pending_approval", entitled: false };
  }

  // Licensed but not enabled → unavailable (fail closed for included)
  if (licensed && !enabled) {
    return { status: "unavailable", entitled: false };
  }

  // Explicitly unlicensed / available upgrade path — never "included"
  if (mod.available === true || (hasLicensed && !licensed) || statusRaw === "available") {
    return { status: "available", entitled: false };
  }

  // Unknown state fails closed — never invent included
  return { status: "unavailable", entitled: false };
}

export function unwrapBusinessPackIdentityPayload(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  if (row.found === false) return null;
  if (row.identity && typeof row.identity === "object") {
    return row.identity as Record<string, unknown>;
  }
  if (typeof row.pack_key === "string") {
    return row;
  }
  return null;
}
