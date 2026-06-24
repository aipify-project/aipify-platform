import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  collectProviderAuthorizationDescriptors,
  getDefaultPersonalStreamingAccountDescriptor,
} from "./provider-authorization-registry";
import {
  hasExplicitOrganizationMemberCountSignal,
  hasOrganizationDataDomainSignal,
  isLocalDevicePermissionQuery,
  isUserOwnedAccountControlQuery,
  normalizeAuthorizationQuery,
  queryMentionsProviderKey,
} from "./query-classifiers";
import type { AuthorizationTargetResolution, ProviderAuthorizationDescriptor } from "./types";

function matchDescriptorInQuery(
  normalized: string,
  descriptors: readonly ProviderAuthorizationDescriptor[],
): ProviderAuthorizationDescriptor | null {
  let best: ProviderAuthorizationDescriptor | null = null;
  let bestScore = 0;

  for (const descriptor of descriptors) {
    let score = 0;
    if (queryMentionsProviderKey(normalized, descriptor.provider_key)) {
      score += 50;
    }
    for (const term of descriptor.search_terms) {
      const normalizedTerm = normalizeAuthorizationQuery(term);
      if (!normalizedTerm || normalizedTerm.length < 3) continue;
      if (normalized.includes(normalizedTerm)) {
        score += 20 + Math.min(normalizedTerm.length, 12);
      }
    }
    if (score > bestScore) {
      best = descriptor;
      bestScore = score;
    }
  }

  return bestScore >= 20 ? best : null;
}

function resolveClassifierTarget(
  query: string,
  descriptors: readonly ProviderAuthorizationDescriptor[],
): AuthorizationTargetResolution | null {
  const normalized = normalizeAuthorizationQuery(query);

  if (isLocalDevicePermissionQuery(query)) {
    const deviceDescriptor =
      descriptors.find(
        (entry) => entry.resource_ownership === "local_device_permission",
      ) ?? null;
    return {
      ownership: "local_device_permission",
      consent_type: "local_device_permission",
      provider_key: deviceDescriptor?.provider_key ?? "companion_device_ecosystem",
      capability_key: deviceDescriptor?.capability_keys[0] ?? "device.read",
      connection_readiness: deviceDescriptor?.connection_readiness ?? "permission_required",
      confidence: "moderate",
      resolution_source: "query_classifier",
    };
  }

  if (isUserOwnedAccountControlQuery(query)) {
    const matched =
      matchDescriptorInQuery(
        normalized,
        descriptors.filter((entry) => entry.resource_ownership === "user_owned_account"),
      ) ?? getDefaultPersonalStreamingAccountDescriptor();

    return {
      ownership: "user_owned_account",
      consent_type: "personal_oauth",
      provider_key: matched.provider_key,
      capability_key: matched.capability_keys[0] ?? null,
      connection_readiness: matched.connection_readiness,
      confidence: "moderate",
      resolution_source: "query_classifier",
    };
  }

  if (hasOrganizationDataDomainSignal(query) || hasExplicitOrganizationMemberCountSignal(query)) {
    const matched = matchDescriptorInQuery(
      normalized,
      descriptors.filter((entry) => entry.resource_ownership === "organization_owned_resource"),
    );
    if (matched) {
      return {
        ownership: "organization_owned_resource",
        consent_type: "organization_access_approval",
        provider_key: matched.provider_key,
        capability_key: matched.capability_keys[0] ?? null,
        connection_readiness: matched.connection_readiness,
        confidence: hasExplicitOrganizationMemberCountSignal(query) ? "high" : "moderate",
        resolution_source: "query_classifier",
      };
    }
  }

  return null;
}

/** Resolve who owns the resource before choosing consent / approval flow. */
export function resolveAuthorizationTargetFromQuery(
  query: string,
  _locale: CustomerActiveLocale = "en",
  extraDescriptors: readonly ProviderAuthorizationDescriptor[] = [],
): AuthorizationTargetResolution | null {
  const normalized = normalizeAuthorizationQuery(query);
  if (!normalized.trim()) return null;

  const descriptors = collectProviderAuthorizationDescriptors(extraDescriptors);
  const manifestMatch = matchDescriptorInQuery(normalized, descriptors);
  if (manifestMatch) {
    return {
      ownership: manifestMatch.resource_ownership,
      consent_type: manifestMatch.consent_type,
      provider_key: manifestMatch.provider_key,
      capability_key: manifestMatch.capability_keys[0] ?? null,
      connection_readiness: manifestMatch.connection_readiness,
      confidence: "high",
      resolution_source: "provider_manifest",
    };
  }

  return resolveClassifierTarget(query, descriptors);
}

export function isOrganizationOwnedAuthorizationTarget(
  resolution: AuthorizationTargetResolution | null,
): boolean {
  return resolution?.ownership === "organization_owned_resource";
}
