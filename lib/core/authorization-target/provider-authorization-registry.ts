import { listMediaProviderManifests } from "@/lib/integration-intelligence/media/registry";
import { ORGANIZATION_PROVIDER_ACCESS_MANIFESTS } from "@/lib/core/organization-access-approval/provider-scope-registry";
import type { OrganizationProviderAccessManifest } from "@/lib/core/organization-access-approval/types";
import type { MediaProviderManifest } from "@/lib/integration-intelligence/media/types";
import type { ProviderAuthorizationDescriptor } from "./types";

/** Generic search terms for personal media accounts — adapters may register provider-specific manifests. */
const PERSONAL_STREAMING_ACCOUNT_TERMS = [
  "musikk",
  "music",
  "streaming",
  "playlist",
  "spilleliste",
  "playback",
  "audio",
  "media account",
  "musikkonto",
] as const;

function organizationManifestToDescriptor(
  manifest: OrganizationProviderAccessManifest,
): ProviderAuthorizationDescriptor {
  return {
    provider_key: manifest.provider_key,
    resource_ownership: manifest.resource_ownership ?? "organization_owned_resource",
    consent_type: manifest.consent_type ?? "organization_access_approval",
    capability_keys: manifest.required_scopes.map((scope) => scope.scope_key),
    search_terms: manifest.search_terms ?? [],
    connection_readiness: "adapter_missing",
    provider_label_key: manifest.provider_label_key,
  };
}

function mediaManifestToDescriptor(manifest: MediaProviderManifest): ProviderAuthorizationDescriptor {
  const searchTerms = [
    ...(manifest.search_terms ?? []),
    ...manifest.provider_key.split("_").filter((token) => token.length >= 4),
  ];

  return {
    provider_key: manifest.provider_key,
    resource_ownership: manifest.resource_ownership,
    consent_type: manifest.consent_type,
    capability_keys: manifest.capabilities.map((capability) => capability.capability_key),
    search_terms: searchTerms,
    connection_readiness:
      manifest.implementation_status === "connected" ? "connected" : "adapter_missing",
    provider_label_key: manifest.display_name_key,
  };
}

export function collectProviderAuthorizationDescriptors(
  extraManifests: readonly ProviderAuthorizationDescriptor[] = [],
): ProviderAuthorizationDescriptor[] {
  const organizationDescriptors = ORGANIZATION_PROVIDER_ACCESS_MANIFESTS.map(
    organizationManifestToDescriptor,
  );
  const mediaDescriptors = listMediaProviderManifests().map(mediaManifestToDescriptor);
  return [...organizationDescriptors, ...mediaDescriptors, ...extraManifests];
}

export function getDefaultPersonalStreamingAccountDescriptor(): ProviderAuthorizationDescriptor {
  return {
    provider_key: "personal_streaming_account",
    resource_ownership: "user_owned_account",
    consent_type: "personal_oauth",
    capability_keys: ["playback.status.read", "playback.start", "playback.pause"],
    search_terms: PERSONAL_STREAMING_ACCOUNT_TERMS,
    connection_readiness: "oauth_required",
    provider_label_key: "customerApp.authorizationTarget.providers.personalStreamingAccount.label",
  };
}
