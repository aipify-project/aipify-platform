import type { CompanionCoverageEntry, CompanionCoverageReadiness } from "./companion-foundation-coverage-types";

export function summarizeCoverageReadiness(
  entries: readonly CompanionCoverageEntry[],
): Record<CompanionCoverageReadiness, number> {
  const summary: Record<CompanionCoverageReadiness, number> = {
    production_ready: 0,
    production_ready_candidate: 0,
    connected: 0,
    connected_but_partial: 0,
    adapter_missing: 0,
    source_missing: 0,
    manifest_only: 0,
    specification_only: 0,
    placeholder: 0,
    disabled: 0,
    blocked_by_governance: 0,
  };

  for (const entry of entries) {
    summary[entry.readiness] += 1;
  }

  return summary;
}
