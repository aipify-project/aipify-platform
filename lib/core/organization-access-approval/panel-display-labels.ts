import {
  resolveProviderAccessManifest,
  ORGANIZATION_PROVIDER_ACCESS_MANIFESTS,
} from "./provider-scope-registry";
import type { OrganizationProviderAccessManifest } from "./types";

/** Maps internal capability keys to i18n label paths — never shown raw in the panel. */
export const ORGANIZATION_ACCESS_CAPABILITY_LABEL_KEYS: Record<string, string> = {
  "member.search": "customerApp.organizationAccessApproval.capabilities.memberSearch",
};

export type OrganizationAccessPanelLabelLookup = {
  providers: Record<string, string>;
  scopes: Record<string, string>;
  capabilities: Record<string, string>;
  unknownProvider: string;
  unknownScope: string;
};

function scopeLabelKeyFromManifest(
  manifest: OrganizationProviderAccessManifest,
  scopeKey: string,
): string | null {
  const scope = manifest.required_scopes.find((entry) => entry.scope_key === scopeKey);
  return scope?.label_key ?? null;
}

function resolveScopeLabelFromManifest(
  scopeKey: string,
  labels: OrganizationAccessPanelLabelLookup,
  providerKey?: string | null,
): string | null {
  const manifest =
    (providerKey ? resolveProviderAccessManifest(providerKey) : null) ??
    ORGANIZATION_PROVIDER_ACCESS_MANIFESTS.find((entry) =>
      entry.required_scopes.some((scope) => scope.scope_key === scopeKey),
    ) ??
    null;

  if (!manifest) return null;

  const labelKey = scopeLabelKeyFromManifest(manifest, scopeKey);
  if (!labelKey) return null;

  const shortKey = labelKey.split(".").pop() ?? "";
  const nested = labels.scopes[`${manifest.provider_key}.${shortKey}`];
  if (nested) return nested;
  const flat = labels.scopes[shortKey];
  if (flat) return flat;

  return null;
}

export function resolveOrganizationAccessProviderLabel(
  providerKey: string,
  labels: OrganizationAccessPanelLabelLookup,
): string {
  const manifest = resolveProviderAccessManifest(providerKey);
  if (manifest && labels.providers[manifest.provider_key]) {
    return labels.providers[manifest.provider_key]!;
  }
  if (labels.providers[providerKey]) {
    return labels.providers[providerKey]!;
  }
  return labels.providers.generic ?? labels.unknownProvider;
}

export function resolveOrganizationAccessScopeLabel(
  scopeKey: string,
  labels: OrganizationAccessPanelLabelLookup,
  providerKey?: string | null,
): string {
  const fromManifest = resolveScopeLabelFromManifest(scopeKey, labels, providerKey);
  if (fromManifest) return fromManifest;

  return labels.unknownScope;
}

export function resolveOrganizationAccessCapabilityLabel(
  capabilityKey: string | null | undefined,
  labels: OrganizationAccessPanelLabelLookup,
): string | null {
  if (!capabilityKey) return null;

  const labelPath = ORGANIZATION_ACCESS_CAPABILITY_LABEL_KEYS[capabilityKey];
  if (labelPath) {
    const shortKey = labelPath.split(".").pop() ?? "";
    if (labels.capabilities[shortKey]) {
      return labels.capabilities[shortKey]!;
    }
  }

  return labels.unknownScope;
}

export function formatOrganizationAccessScopeSummary(
  scopeKeys: readonly string[],
  labels: OrganizationAccessPanelLabelLookup,
  providerKey?: string | null,
): string {
  return scopeKeys
    .map((scopeKey) => resolveOrganizationAccessScopeLabel(scopeKey, labels, providerKey))
    .join(", ");
}
