import type {
  ExternalApplicationCapabilityStatus,
  ExternalApplicationOperation,
  ExternalApplicationReadiness,
  ExternalApplicationRuntimeEntry,
} from "./types";

export function classifyExternalApplicationCapabilityStatus(input: {
  adapter_registered: boolean;
  readiness: ExternalApplicationReadiness;
  connection_connected: boolean;
  permission_granted: boolean;
  operation_supported: boolean;
}): ExternalApplicationCapabilityStatus {
  if (!input.operation_supported) return "unsupported";
  if (!input.permission_granted) return "permission_required";
  if (!input.adapter_registered || input.readiness === "specification_only") {
    return "adapter_missing";
  }
  if (input.readiness === "adapter_missing") return "adapter_missing";
  if (input.readiness === "partial" && !input.connection_connected) return "partial";
  if (input.connection_connected) {
    return input.readiness === "partial" ? "partial" : "connected";
  }
  if (input.readiness === "production_ready_candidate") return "partial";
  return "partial";
}

export function isExternalApplicationOperationAvailable(
  entry: ExternalApplicationRuntimeEntry,
  operation: ExternalApplicationOperation,
): boolean {
  if (!entry.supported_operations.includes(operation)) return false;
  return entry.capability_status === "connected" || entry.capability_status === "partial";
}

export function summarizeCapabilityStatus(
  entries: readonly ExternalApplicationRuntimeEntry[],
): Record<ExternalApplicationCapabilityStatus, number> {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.capability_status] += 1;
      return acc;
    },
    {
      connected: 0,
      partial: 0,
      adapter_missing: 0,
      permission_required: 0,
      unsupported: 0,
    },
  );
}
