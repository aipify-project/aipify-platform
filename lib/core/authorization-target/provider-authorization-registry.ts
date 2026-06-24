import { ORGANIZATION_PROVIDER_ACCESS_MANIFESTS } from "@/lib/core/organization-access-approval/provider-scope-registry";
import type { OrganizationProviderAccessManifest } from "@/lib/core/organization-access-approval/types";
import type { ProviderAuthorizationDescriptor } from "./types";

/** Generic search terms for personal media accounts — adapters register provider-specific metadata elsewhere. */
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

/** Authorization metadata owned by authorization-target — not coupled to media integration WIP. */
const AUTHORIZATION_TARGET_PROVIDER_REGISTRY: readonly ProviderAuthorizationDescriptor[] = [
  {
    provider_key: "personal_streaming_account",
    resource_ownership: "user_owned_account",
    consent_type: "personal_oauth",
    capability_keys: ["playback.status.read", "playback.start", "playback.pause"],
    search_terms: PERSONAL_STREAMING_ACCOUNT_TERMS,
    connection_readiness: "oauth_required",
    provider_label_key: "customerApp.authorizationTarget.providers.personalStreamingAccount.label",
  },
  {
    provider_key: "companion_device_ecosystem",
    resource_ownership: "local_device_permission",
    consent_type: "local_device_permission",
    capability_keys: ["device.read"],
    search_terms: ["device", "enhet", "speaker", "hoyttaler", "mikrofon", "microphone"],
    connection_readiness: "permission_required",
    provider_label_key:
      "customerApp.companionPlatformKnowledge.media.providers.companion_device_ecosystem",
  },
  {
    provider_key: "companion_presence_devices",
    resource_ownership: "local_device_permission",
    consent_type: "local_device_permission",
    capability_keys: ["device.read"],
    search_terms: ["presence device", "connected device", "tilkoblet enhet"],
    connection_readiness: "permission_required",
    provider_label_key:
      "customerApp.companionPlatformKnowledge.media.providers.companion_presence_devices",
  },
];

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

export function collectProviderAuthorizationDescriptors(
  extraManifests: readonly ProviderAuthorizationDescriptor[] = [],
): ProviderAuthorizationDescriptor[] {
  const organizationDescriptors = ORGANIZATION_PROVIDER_ACCESS_MANIFESTS.map(
    organizationManifestToDescriptor,
  );
  return [...organizationDescriptors, ...AUTHORIZATION_TARGET_PROVIDER_REGISTRY, ...extraManifests];
}

export function getDefaultPersonalStreamingAccountDescriptor(): ProviderAuthorizationDescriptor {
  return (
    AUTHORIZATION_TARGET_PROVIDER_REGISTRY.find(
      (entry) => entry.provider_key === "personal_streaming_account",
    ) ?? {
      provider_key: "personal_streaming_account",
      resource_ownership: "user_owned_account",
      consent_type: "personal_oauth",
      capability_keys: ["playback.status.read", "playback.start", "playback.pause"],
      search_terms: PERSONAL_STREAMING_ACCOUNT_TERMS,
      connection_readiness: "oauth_required",
      provider_label_key: "customerApp.authorizationTarget.providers.personalStreamingAccount.label",
    }
  );
}
