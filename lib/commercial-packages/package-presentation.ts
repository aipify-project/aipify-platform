/**
 * Customer-facing package / feature presentation helpers for Billing and Software Catalog.
 * Never invents product names; fails closed when only technical identifiers exist.
 */

/** English seed feature strings → stable locale keys under softwareCatalog.featureLabels. */
export const PACKAGE_FEATURE_ALIASES: Record<string, string> = {
  "aipify core": "aipify_core",
  "install engine": "install_engine",
  "support assistant": "support_assistant",
  "faq knowledge": "faq_knowledge",
  "human approval": "human_approval",
  "basic analytics": "basic_analytics",
};

export type PackageCopyLookup = {
  name?: string | null;
  description?: string | null;
} | null;

export type PackagePresentationOptions = {
  localizePackage?: (packageKey: string) => PackageCopyLookup;
  localizeFeature?: (feature: string) => string | null;
};

export function isRawTechnicalIdentifier(text: string): boolean {
  const value = text.trim();
  if (!value) return true;
  return /^[a-z0-9]+([._-][a-z0-9]+)+$/.test(value);
}

export function resolveFeatureAliasKey(feature: string): string | null {
  const normalized = feature.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return null;
  return PACKAGE_FEATURE_ALIASES[normalized] ?? null;
}

/**
 * Resolve a customer-safe feature label.
 * Prefers localized alias; hides raw technical keys; allows plain language English/locale text.
 */
export function resolveCustomerFacingFeatureLabel(
  feature: string,
  localizeFeature?: (feature: string) => string | null
): string | null {
  const raw = typeof feature === "string" ? feature.trim() : "";
  if (!raw) return null;
  if (isRawTechnicalIdentifier(raw)) return null;

  const localized = localizeFeature?.(raw)?.trim();
  if (localized) return localized;

  // Known technical product terms without a locale leaf must not surface as-is.
  if (resolveFeatureAliasKey(raw)) return null;

  return raw;
}

/**
 * Licensed `tenant_modules` rows include internal technical modules.
 * Without a proven customer-facing filter, do not display a module count.
 */
export function resolveTrustedCustomerFacingModulesCount(
  enabledModules: Array<Record<string, unknown>> | undefined
): number | null {
  // enabledModules retained for call-site symmetry; count is untrusted until a
  // customer-facing entitlement filter exists in Core.
  void enabledModules;
  return null;
}

export type LockedCapabilityCandidate = {
  id: string;
  identityKey: string;
  name: string;
  description: string;
  kind: "upgrade" | "addon" | "recommendation";
  priority: number;
};

/** Priority: active/included(1) · pending(2) · available add-on(3) · not included(4) · unavailable(5) */
export function lockedCapabilityPriority(kind: LockedCapabilityCandidate["kind"]): number {
  if (kind === "addon") return 3;
  if (kind === "recommendation") return 4;
  return 4; // upgrade = not included in current package
}

export function canonicalProductIdentityKey(input: {
  packageKey?: string | null;
  addonKey?: string | null;
  kind: LockedCapabilityCandidate["kind"];
  fallbackIndex: number;
}): string {
  const packageKey = input.packageKey?.trim().toLowerCase();
  const addonKey = input.addonKey?.trim().toLowerCase();
  if (packageKey) return `pkg:${packageKey}`;
  if (addonKey) return `pkg:${addonKey}`;
  return `${input.kind}:${input.fallbackIndex}`;
}

/**
 * Keep one card per canonical product identity. Lower priority number wins.
 * Does not merge products that only share a display name.
 */
export function dedupeLockedCapabilities(
  candidates: LockedCapabilityCandidate[],
  limit = 8
): Array<Omit<LockedCapabilityCandidate, "priority" | "identityKey">> {
  const byIdentity = new Map<string, LockedCapabilityCandidate>();
  for (const candidate of candidates) {
    if (!candidate.name.trim()) continue;
    const existing = byIdentity.get(candidate.identityKey);
    if (!existing || candidate.priority < existing.priority) {
      byIdentity.set(candidate.identityKey, candidate);
    }
  }
  return [...byIdentity.values()]
    .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ id, name, description, kind }) => ({ id, name, description, kind }));
}
