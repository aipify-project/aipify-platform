import {
  classifyExternalApplicationHandoff,
  type ExternalApplicationHandoffClassification,
  type ExternalApplicationOperation,
} from "@/lib/companion-runtime/external-application-orchestration";
import {
  getExternalArtifactHandoffAdapter,
  getExternalArtifactHandoffProviderReadiness,
  isExternalArtifactHandoffProviderRegistered,
} from "@/lib/integration-intelligence/external-artifact-handoff/registry";
import { getExternalApplicationManifest, listExternalApplicationManifests } from "./manifest-registry";

export function classifyExternalApplicationHandoffFromRegistry(input: {
  application_key: string;
  consent_granted: boolean;
  permission_granted: boolean;
  connection_connected?: boolean;
  operation?: ExternalApplicationOperation;
}): ExternalApplicationHandoffClassification {
  const applicationKey = input.application_key.trim().toLowerCase();
  const manifest = getExternalApplicationManifest(applicationKey);
  const adapterRegistered = isExternalArtifactHandoffProviderRegistered(applicationKey);
  const adapter = getExternalArtifactHandoffAdapter(applicationKey);
  const readiness = adapter
    ? getExternalArtifactHandoffProviderReadiness(applicationKey, input.connection_connected === true) ===
      "adapter_available"
      ? "production_ready_candidate"
      : adapter.readiness === "partial"
        ? "partial"
        : (manifest?.readiness ?? "adapter_missing")
    : (manifest?.readiness ?? "adapter_missing");

  const operationSupported =
    manifest?.capabilities.some((capability) => capability.operation === (input.operation ?? "handoff")) ??
    adapterRegistered;

  return classifyExternalApplicationHandoff({
    application_key: applicationKey,
    adapter_registered: adapterRegistered,
    readiness,
    consent_granted: input.consent_granted,
    permission_granted: input.permission_granted,
    connection_connected: input.connection_connected,
    operation_supported: operationSupported,
  });
}

/** Backward-compatible alias for artifact-context handoff classification. */
export function classifyExternalProviderHandoffFromRegistry(input: {
  provider_key: string;
  consent_granted: boolean;
  permission_granted: boolean;
  connection_connected?: boolean;
}) {
  const handoff = classifyExternalApplicationHandoffFromRegistry({
    application_key: input.provider_key,
    consent_granted: input.consent_granted,
    permission_granted: input.permission_granted,
    connection_connected: input.connection_connected,
  });

  return {
    ...handoff,
    provider_key: handoff.application_key,
  };
}

export function listMissingExternalApplicationHandoffAdapters(): readonly string[] {
  return listExternalApplicationManifests()
    .filter((manifest) =>
      manifest.capabilities.some((capability) => capability.operation === "handoff"),
    )
    .filter((manifest) => !isExternalArtifactHandoffProviderRegistered(manifest.application_key))
    .map((manifest) => manifest.application_key);
}
