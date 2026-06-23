import { isExternalApplicationOperationAvailable } from "./capability-status";
import type {
  ExternalApplicationDiscoveryResult,
  ExternalApplicationOperation,
  ExternalApplicationRuntimeEntry,
} from "./types";

const STATUS_PRIORITY: Record<ExternalApplicationRuntimeEntry["capability_status"], number> = {
  connected: 0,
  partial: 1,
  permission_required: 2,
  adapter_missing: 3,
  unsupported: 4,
};

function sortCandidates(
  entries: readonly ExternalApplicationRuntimeEntry[],
  operation: ExternalApplicationOperation,
): ExternalApplicationRuntimeEntry[] {
  return [...entries]
    .filter((entry) => isExternalApplicationOperationAvailable(entry, operation) || entry.capability_status === "partial")
    .sort((left, right) => {
      const leftPriority = STATUS_PRIORITY[left.capability_status];
      const rightPriority = STATUS_PRIORITY[right.capability_status];
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      if (left.connection_connected !== right.connection_connected) {
        return left.connection_connected ? -1 : 1;
      }
      return left.application_key.localeCompare(right.application_key);
    });
}

export function selectExternalApplications(input: {
  discovery: ExternalApplicationDiscoveryResult;
  operation?: ExternalApplicationOperation;
}): {
  selected: ExternalApplicationRuntimeEntry | null;
  candidates: readonly ExternalApplicationRuntimeEntry[];
  requires_user_selection: boolean;
} {
  const operation = input.operation ?? input.discovery.operation;
  const candidates = sortCandidates(input.discovery.applications, operation).filter(
    (entry) => entry.capability_status !== "unsupported" && entry.capability_status !== "adapter_missing",
  );

  if (candidates.length === 0) {
    return { selected: null, candidates: [], requires_user_selection: false };
  }

  if (candidates.length === 1) {
    return { selected: candidates[0]!, candidates, requires_user_selection: false };
  }

  const connected = candidates.filter((entry) => entry.connection_connected);
  if (connected.length === 1) {
    return { selected: connected[0]!, candidates, requires_user_selection: false };
  }

  return { selected: null, candidates, requires_user_selection: true };
}
