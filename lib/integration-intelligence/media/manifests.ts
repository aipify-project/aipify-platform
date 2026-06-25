import type { MediaProviderManifest } from "./types";

const DEVICE_ECOSYSTEM_VIEW = "companion_device_ecosystem.view";
const PRESENCE_OPERATIONS_VIEW = "companion_presence_operations.view";

function readCapability(
  capability_key: MediaProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
  };
}

/** Blueprint-derived media/device manifests — capability IDs originate here, not in Core orchestrator. */
export const MEDIA_PROVIDER_MANIFESTS: readonly MediaProviderManifest[] = [
  {
    provider_key: "personal_streaming_account",
    display_name_key: "customerApp.authorizationTarget.providers.personalStreamingAccount.label",
    source_engine: "external_integration",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.authorizationTarget.searchTerms.personalStreamingAccount",
    resource_ownership: "user_owned_account",
    consent_type: "personal_oauth",
    search_terms: ["musikk", "music", "streaming", "playlist", "spilleliste", "playback", "audio"],
    capabilities: [
      {
        capability_key: "playback.status.read",
        operation: "read",
        adapter_available: false,
        approval_required: false,
        reversible: true,
        risk_level: 1,
        entity: "playback",
        required_permission: null,
      },
      {
        capability_key: "playback.start",
        operation: "write",
        adapter_available: false,
        approval_required: false,
        reversible: true,
        risk_level: 1,
        entity: "playback",
        required_permission: null,
      },
    ],
  },
  {
    provider_key: "companion_device_ecosystem",
    display_name_key: "customerApp.companionPlatformKnowledge.media.providers.companion_device_ecosystem",
    source_engine: "device_ecosystem",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.media.searchTerms.companion_device_ecosystem",
    resource_ownership: "local_device_permission",
    consent_type: "local_device_permission",
    search_terms: ["device", "enhet", "speaker", "hoyttaler"],
    capabilities: [readCapability("device.read", "device", DEVICE_ECOSYSTEM_VIEW)],
  },
  {
    provider_key: "companion_presence_devices",
    display_name_key: "customerApp.companionPlatformKnowledge.media.providers.companion_presence_devices",
    source_engine: "presence_operations",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.media.searchTerms.companion_presence_devices",
    resource_ownership: "local_device_permission",
    consent_type: "local_device_permission",
    search_terms: ["presence device", "connected device"],
    capabilities: [readCapability("device.read", "device", PRESENCE_OPERATIONS_VIEW)],
  },
];
