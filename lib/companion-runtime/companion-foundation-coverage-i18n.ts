import type { CompanionCoverageReadiness } from "./companion-foundation-coverage-types";

/** i18n key paths for customer-visible coverage readiness labels — Phase 34. */
export const COMPANION_COVERAGE_READINESS_I18N_KEYS: Record<CompanionCoverageReadiness, string> = {
  production_ready: "customerApp.companionPlatformKnowledge.coverage.readiness.productionReady",
  production_ready_candidate:
    "customerApp.companionPlatformKnowledge.coverage.readiness.productionReadyCandidate",
  connected: "customerApp.companionPlatformKnowledge.coverage.readiness.connected",
  connected_but_partial: "customerApp.companionPlatformKnowledge.coverage.readiness.connectedButPartial",
  adapter_missing: "customerApp.companionPlatformKnowledge.coverage.readiness.adapterMissing",
  source_missing: "customerApp.companionPlatformKnowledge.coverage.readiness.sourceMissing",
  manifest_only: "customerApp.companionPlatformKnowledge.coverage.readiness.manifestOnly",
  specification_only: "customerApp.companionPlatformKnowledge.coverage.readiness.specificationOnly",
  placeholder: "customerApp.companionPlatformKnowledge.coverage.readiness.placeholder",
  disabled: "customerApp.companionPlatformKnowledge.coverage.readiness.disabled",
  blocked_by_governance: "customerApp.companionPlatformKnowledge.coverage.readiness.blockedByGovernance",
};

export const COMPANION_COVERAGE_GAP_PRIORITY_I18N_KEYS = {
  P0: "customerApp.companionPlatformKnowledge.coverage.gapPriority.p0",
  P1: "customerApp.companionPlatformKnowledge.coverage.gapPriority.p1",
  P2: "customerApp.companionPlatformKnowledge.coverage.gapPriority.p2",
  P3: "customerApp.companionPlatformKnowledge.coverage.gapPriority.p3",
} as const;

export const COMPANION_COVERAGE_LOCALES = ["en", "no", "sv", "da", "es", "pl", "uk"] as const;

export type CompanionCoverageLocale = (typeof COMPANION_COVERAGE_LOCALES)[number];

export function coverageReadinessKey(readiness: CompanionCoverageReadiness): string {
  return COMPANION_COVERAGE_READINESS_I18N_KEYS[readiness];
}
