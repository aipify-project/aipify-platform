import {
  classifyExternalApplicationCapabilityStatus,
  applicationSupportsWorkspace,
  resolveWorkspaceFromArtifact,
  type ExternalApplicationDiscoveryResult,
  type ExternalApplicationOperation,
  type ExternalApplicationRuntimeEntry,
  type ExternalApplicationWorkspace,
} from "@/lib/companion-runtime/external-application-orchestration";
import {
  getExternalArtifactHandoffAdapter,
  isExternalArtifactHandoffProviderRegistered,
} from "@/lib/integration-intelligence/external-artifact-handoff/registry";
import { listExternalApplicationManifests } from "./manifest-registry";

export type ExternalApplicationDiscoveryInput = {
  category: "image" | "pdf" | "document" | "text" | "other";
  mime_type: string;
  operation: ExternalApplicationOperation;
  connected_application_keys: readonly string[];
  permission_granted_by_application: Readonly<Record<string, boolean>>;
  workspace?: ExternalApplicationWorkspace;
};

function resolveHandoffAdapterRegistered(applicationKey: string): boolean {
  return isExternalArtifactHandoffProviderRegistered(applicationKey);
}

function resolveEffectiveReadiness(applicationKey: string, manifestReadiness: ExternalApplicationRuntimeEntry["readiness"]) {
  const adapter = getExternalArtifactHandoffAdapter(applicationKey);
  if (adapter?.readiness === "partial") return "partial" as const;
  if (adapter?.readiness === "adapter_available") return "production_ready_candidate" as const;
  return manifestReadiness;
}

export function buildExternalApplicationDiscovery(
  input: ExternalApplicationDiscoveryInput,
): ExternalApplicationDiscoveryResult {
  const workspace =
    input.workspace ??
    resolveWorkspaceFromArtifact({ category: input.category, mime_type: input.mime_type });

  const applications: ExternalApplicationRuntimeEntry[] = listExternalApplicationManifests()
    .filter((manifest) => applicationSupportsWorkspace(manifest.workspaces, workspace))
    .map((manifest) => {
      const operationCapabilities = manifest.capabilities.filter(
        (capability) => capability.operation === input.operation,
      );
      const operationSupported = operationCapabilities.length > 0;
      const adapterRegistered =
        input.operation === "handoff"
          ? resolveHandoffAdapterRegistered(manifest.application_key) ||
            operationCapabilities.some((capability) => capability.adapter_registered)
          : operationCapabilities.some((capability) => capability.adapter_registered);

      const permissionGranted = input.permission_granted_by_application[manifest.application_key] ?? false;
      const connectionConnected = input.connected_application_keys.includes(manifest.application_key);
      const readiness = resolveEffectiveReadiness(manifest.application_key, manifest.readiness);

      const capabilityStatus = classifyExternalApplicationCapabilityStatus({
        adapter_registered: adapterRegistered,
        readiness,
        connection_connected: connectionConnected,
        permission_granted: permissionGranted,
        operation_supported: operationSupported,
      });

      return {
        application_key: manifest.application_key,
        display_name_key: manifest.display_name_key,
        adapter_type: manifest.adapter_type,
        capability_status: capabilityStatus,
        connection_connected: connectionConnected,
        permission_granted: permissionGranted,
        supported_operations: manifest.capabilities.map((capability) => capability.operation),
        readiness,
        workspaces: manifest.workspaces,
      };
    });

  const actionable = applications.filter(
    (entry) => entry.capability_status !== "unsupported" && entry.capability_status !== "adapter_missing",
  );

  return {
    workspace,
    operation: input.operation,
    applications,
    requires_selection: actionable.length > 1,
  };
}
