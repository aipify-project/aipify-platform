export type MediaProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type MediaCapabilityOperation = "read" | "write";

export type MediaCapabilityKey =
  | "playback.status.read"
  | "playback.start"
  | "playback.pause"
  | "playback.skip"
  | "playback.volume.update"
  | "playlist.read"
  | "playlist.create"
  | "playlist.items.update"
  | "device.read"
  | "device.select";

export type MediaCapabilityManifest = {
  capability_key: MediaCapabilityKey;
  operation: MediaCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
};

export type MediaProviderSourceEngine =
  | "device_ecosystem"
  | "presence_operations"
  | "external_integration";

export type MediaResourceOwnership = "user_owned_account" | "local_device_permission";

export type MediaConsentType = "personal_oauth" | "local_device_permission";

export type MediaProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: MediaProviderSourceEngine;
  implementation_status: MediaProviderImplementationStatus;
  capabilities: readonly MediaCapabilityManifest[];
  search_terms_key: string;
  resource_ownership: MediaResourceOwnership;
  consent_type: MediaConsentType;
  /** Optional inline search terms for adapter-registered manifests. */
  search_terms?: readonly string[];
};

export function buildMediaCapabilityId(
  providerKey: string,
  capabilityKey: MediaCapabilityKey,
  operation: MediaCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}
