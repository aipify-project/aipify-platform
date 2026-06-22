import type { CommercialCapabilityStatus } from "./v1-commercial-capability-matrix";
import type {
  CompanionCanonicalCoverageSummary,
  CompanionCoverageEntry,
  CompanionCoverageGap,
  CompanionCoverageReadiness,
  CompanionCoverageReconciledEntry,
  CompanionCoverageSourceClassification,
} from "./companion-foundation-coverage-types";
import type { CommercialCapabilityEntry } from "./v1-commercial-capability-matrix";
import { summarizeCommercialCapabilityMatrix } from "./v1-commercial-capability-matrix";
import { countGapsByPriority } from "./companion-foundation-coverage-gaps";
import { summarizeCoverageReadiness } from "./companion-foundation-coverage-readiness";

export const COMPANION_CANONICAL_COUNTING_MODEL = "companion-canonical-coverage-summary-v1" as const;

/**
 * Canonical coverage counting model — Phase 43C.
 *
 * **Modules** — one row per `CompanionCoverageEntry` (178 rows).
 * **Capabilities** — one row per II commercial matrix entry (449 rows).
 *
 * Phase 43 conversational totals (connected:10, manifest_only:71, …) did not match
 * committed artifacts — they conflated pre-audit estimates with module registry fields.
 * Commits `1a7bb8ac` and `1e720d71` share identical module readiness totals.
 */
export function buildCanonicalCoverageSummaryFromParts(input: {
  modules: readonly CompanionCoverageEntry[];
  reconciled: readonly CompanionCoverageReconciledEntry[];
  commercial: readonly CommercialCapabilityEntry[];
  gaps: readonly CompanionCoverageGap[];
  uniqueCapabilityIdsInModules: number;
  sourceClassification: Record<CompanionCoverageSourceClassification, number>;
}): CompanionCanonicalCoverageSummary {
  const moduleReadiness = summarizeCoverageReadiness(input.modules);
  assertModuleReadinessSums(moduleReadiness, input.modules.length);

  const scopeTotals = summarizeReadinessScopes(input.reconciled);
  assertScopeReadSums(scopeTotals.read, input.modules.length);

  const capabilityStatus = summarizeCommercialCapabilityMatrix(input.commercial);
  const gapCounts = countGapsByPriority(input.gaps);

  return {
    counting_model: COMPANION_CANONICAL_COUNTING_MODEL,
    source_of_truth: {
      modules: "buildCompanionFoundationCoverageRegistry()",
      capabilities: "mergeCommunityExternalAdapterIntoCommercial(buildCommercialCapabilityMatrix())",
      reconciled_entries: "reconcileCoverageRegistry(modules)",
      gaps: "buildCompanionFoundationCoverageGaps(modules)",
    },
    totals: {
      modules: input.modules.length,
      commercial_capabilities: input.commercial.length,
      reconciled_entries: input.reconciled.length,
      unique_capability_ids_in_modules: input.uniqueCapabilityIdsInModules,
      providers: new Set(input.modules.map((entry) => entry.provider_key)).size,
    },
    module_readiness: moduleReadiness,
    capability_status: capabilityStatus,
    source_classification: input.sourceClassification,
    readiness_scope: scopeTotals,
    gap_priority: gapCounts,
    reconciliation_notes: [
      "module_readiness counts registry modules — sum equals total_modules",
      "capability_status counts II commercial matrix rows — sum equals total_commercial_capabilities",
      "readiness_scope.read mirrors module readiness for reconciled entries in Phase 43C",
      "Do not mix module_readiness and capability_status in one readiness table",
    ],
  };
}

function summarizeReadinessScopes(
  reconciled: readonly CompanionCoverageReconciledEntry[],
): CompanionCanonicalCoverageSummary["readiness_scope"] {
  const empty = (): Record<CompanionCoverageReadiness, number> => ({
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
  });

  const read = empty();
  const draft = empty();
  const write = empty();
  const approval = empty();

  for (const entry of reconciled) {
    read[entry.readiness_scope.read] += 1;
    if (entry.readiness_scope.draft) draft[entry.readiness_scope.draft] += 1;
    if (entry.readiness_scope.write) write[entry.readiness_scope.write] += 1;
    if (entry.readiness_scope.approval) approval[entry.readiness_scope.approval] += 1;
  }

  return { read, draft, write, approval };
}

function assertModuleReadinessSums(
  readiness: Record<CompanionCoverageReadiness, number>,
  totalModules: number,
): void {
  const sum = Object.values(readiness).reduce((a, b) => a + b, 0);
  if (sum !== totalModules) {
    throw new Error(`module_readiness sum ${sum} !== total_modules ${totalModules}`);
  }
}

function assertScopeReadSums(
  read: Record<CompanionCoverageReadiness, number>,
  totalModules: number,
): void {
  const sum = Object.values(read).reduce((a, b) => a + b, 0);
  if (sum !== totalModules) {
    throw new Error(`readiness_scope.read sum ${sum} !== total_modules ${totalModules}`);
  }
}

export function assertCapabilityStatusSums(
  status: Record<CommercialCapabilityStatus, number>,
  totalCapabilities: number,
): boolean {
  const sum = Object.values(status).reduce((a, b) => a + b, 0);
  return sum === totalCapabilities;
}

export function assertSourceClassificationSums(
  classification: Record<CompanionCoverageSourceClassification, number>,
  totalReconciled: number,
): boolean {
  const sum = Object.values(classification).reduce((a, b) => a + b, 0);
  return sum === totalReconciled;
}
