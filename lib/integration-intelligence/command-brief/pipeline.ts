import type { CommandBriefSignal, CommandBriefSourceTier } from "./types";

const TIER_WEIGHT: Record<CommandBriefSourceTier, number> = {
  exact_live: 5,
  compatible_live: 4,
  partial_proxy: 2,
  adapter_missing: 0,
  source_missing: 0,
  specification_only: 0,
};

const SEVERITY_WEIGHT: Record<CommandBriefSignal["severity"], number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  informational: 1,
};

const FRESHNESS_WEIGHT: Record<CommandBriefSignal["freshness"], number> = {
  fresh: 3,
  stale: 1,
  unknown: 0,
};

const STATUS_WEIGHT: Record<CommandBriefSignal["status"], number> = {
  unresolved: 4,
  new: 3,
  acknowledged: 2,
  completed: 0,
  dismissed: 0,
  expired: 0,
};

const SINCE_LAST_WEIGHT: Record<CommandBriefSignal["since_last_bucket"], number> = {
  since_last: 4,
  still_unresolved: 3,
  new_recommendation: 2,
  recently_completed: 1,
  none: 0,
};

function completenessWeight(signal: CommandBriefSignal): number {
  return signal.completeness === "complete" ? 2 : signal.completeness === "partial" ? 1 : 0;
}

export function commandBriefSignalPriorityScore(signal: CommandBriefSignal): number {
  return (
    SEVERITY_WEIGHT[signal.severity] * 10 +
    STATUS_WEIGHT[signal.status] * 6 +
    SINCE_LAST_WEIGHT[signal.since_last_bucket] * 5 +
    FRESHNESS_WEIGHT[signal.freshness] * 4 +
    TIER_WEIGHT[signal.source_tier] * 3 +
    completenessWeight(signal) * 2 +
    (signal.confidence === "high" ? 3 : signal.confidence === "moderate" ? 2 : signal.confidence === "low" ? 1 : 0)
  );
}

export function prioritizeCommandBriefSignals(
  signals: readonly CommandBriefSignal[],
): CommandBriefSignal[] {
  return [...signals]
    .map((signal) => ({
      ...signal,
      priority: commandBriefSignalPriorityScore(signal),
    }))
    .sort((left, right) => right.priority - left.priority);
}

export function dedupeCommandBriefSignals(
  signals: readonly CommandBriefSignal[],
): CommandBriefSignal[] {
  const byKey = new Map<string, CommandBriefSignal>();

  for (const signal of signals) {
    const key = signal.dedupe_key || `${signal.source_module}:${signal.source_reference}:${signal.title_key}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, signal);
      continue;
    }

    const existingScore =
      TIER_WEIGHT[existing.source_tier] * 10 +
      FRESHNESS_WEIGHT[existing.freshness] * 5 +
      completenessWeight(existing) * 3 +
      (existing.detected_at ? Date.parse(existing.detected_at) : 0);

    const candidateScore =
      TIER_WEIGHT[signal.source_tier] * 10 +
      FRESHNESS_WEIGHT[signal.freshness] * 5 +
      completenessWeight(signal) * 3 +
      (signal.detected_at ? Date.parse(signal.detected_at) : 0);

    if (candidateScore >= existingScore) {
      byKey.set(key, signal);
    }
  }

  return [...byKey.values()];
}

export function filterCommandBriefSignalsForPermission(
  signals: readonly CommandBriefSignal[],
  effectivePermissions: readonly string[],
): CommandBriefSignal[] {
  return signals.filter((signal) => {
    if (!signal.required_permission) return true;
    if (effectivePermissions.includes(signal.required_permission)) return true;
    const alt = signal.required_permission.replace(/\./g, "_");
    return effectivePermissions.includes(alt);
  });
}

export function filterCommandBriefSignalsForPanel(
  signals: readonly CommandBriefSignal[],
  panel: CommandBriefSignal["panel"],
): CommandBriefSignal[] {
  return signals.filter((signal) => signal.panel === panel);
}
