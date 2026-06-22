import type { ProviderMetricBinding, ProviderMetricSemanticMatch } from "./metric-contract";
import { hasPresentableBinding } from "./metric-binding-resolution";

export type ProviderCapabilityReadinessStatus =
  | "production_ready"
  | "production_ready_candidate"
  | "connected_but_partial"
  | "adapter_missing"
  | "disabled";

export type ProviderSourceStatus = "live" | "partial" | "placeholder" | "missing";

export function resolveProviderRecordFreshness(
  fetchedAt: string,
  freshThresholdMs = 15 * 60 * 1000,
): "fresh" | "stale" | "unknown" {
  const parsed = Date.parse(fetchedAt);
  if (!Number.isFinite(parsed)) return "unknown";
  const ageMs = Date.now() - parsed;
  return ageMs <= freshThresholdMs ? "fresh" : "stale";
}

export function applyAuthenticatedE2eReadinessGate(input: {
  status: ProviderCapabilityReadinessStatus;
  capabilityKey: string;
  authenticatedE2eVerifiedCapabilities: readonly string[];
  e2eGatedCapabilities: readonly string[];
  productionReadyRequiresE2e?: boolean;
}): ProviderCapabilityReadinessStatus {
  const requiresE2e = input.productionReadyRequiresE2e ?? true;

  if (
    requiresE2e &&
    input.status === "production_ready" &&
    !input.authenticatedE2eVerifiedCapabilities.includes(input.capabilityKey)
  ) {
    return "production_ready_candidate";
  }

  if (
    input.status === "production_ready" &&
    input.e2eGatedCapabilities.includes(input.capabilityKey) &&
    !input.authenticatedE2eVerifiedCapabilities.includes(input.capabilityKey)
  ) {
    return "production_ready_candidate";
  }

  return input.status;
}

export function classifyProviderCapabilityReadiness(input: {
  gateActive: boolean;
  hasPermission: boolean;
  sourceStatus: ProviderSourceStatus;
  metricBindings: readonly ProviderMetricBinding[];
  readinessOverride?: ProviderCapabilityReadinessStatus | null;
  exactLiveReadiness?: "production_ready" | "production_ready_candidate";
}): ProviderCapabilityReadinessStatus {
  if (!input.gateActive || !input.hasPermission) return "disabled";
  if (input.sourceStatus === "missing") return "adapter_missing";
  if (input.readinessOverride) return input.readinessOverride;

  if (!hasPresentableBinding(input.metricBindings)) {
    return "connected_but_partial";
  }

  if (input.sourceStatus === "partial") return "connected_but_partial";

  if (input.sourceStatus === "live") {
    return input.exactLiveReadiness ?? "production_ready";
  }

  return "connected_but_partial";
}

export type CommandBriefSignalCandidate = {
  signal_key: string;
  count: number | null;
  semantic_match: ProviderMetricSemanticMatch;
};

/** Command Brief accepts exact signals only — never proxy or incompatible counts. */
export function selectExactCommandBriefSignals(
  candidates: readonly CommandBriefSignalCandidate[],
): Array<{ signal_key: string; count: number | null }> {
  return candidates
    .filter(
      (candidate) =>
        candidate.semantic_match === "exact" &&
        candidate.count !== null &&
        candidate.count > 0,
    )
    .map(({ signal_key, count }) => ({ signal_key, count }));
}
