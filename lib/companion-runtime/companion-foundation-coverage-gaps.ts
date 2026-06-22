import type {
  CompanionCoverageEntry,
  CompanionCoverageGap,
  CompanionCoverageGapPriority,
  CompanionCoverageReadiness,
} from "./companion-foundation-coverage-types";

const LIVE_SOURCE_MARKERS = ["rpc:", "get_", "live", "adapter", "apply-external-provider"];

function hasLiveSourceReference(entry: CompanionCoverageEntry): boolean {
  if (!entry.source_reference) return false;
  const ref = entry.source_reference.toLowerCase();
  return LIVE_SOURCE_MARKERS.some((marker) => ref.includes(marker));
}

function isProductionReadyIntegrityViolation(entry: CompanionCoverageEntry): boolean {
  if (entry.readiness !== "production_ready") return false;
  if (entry.schema_status === "missing") return true;
  if (entry.test_status === "missing") return true;
  if (!hasLiveSourceReference(entry)) return true;
  return false;
}

export function buildCompanionFoundationCoverageGaps(
  entries: readonly CompanionCoverageEntry[],
): CompanionCoverageGap[] {
  const gaps: CompanionCoverageGap[] = [];

  for (const entry of entries) {
    if (isProductionReadyIntegrityViolation(entry)) {
      gaps.push({
        priority: "P0",
        module_id: entry.module_id,
        provider_key: entry.provider_key,
        capability_ids: entry.capability_ids,
        reason: "Marked production_ready without live source, schema, or phase test.",
        next_required_step: "Downgrade readiness or connect live source with regression test.",
      });
      continue;
    }

    if (entry.readiness === "production_ready_candidate" && entry.test_status === "missing") {
      gaps.push({
        priority: "P0",
        module_id: entry.module_id,
        provider_key: entry.provider_key,
        capability_ids: entry.capability_ids,
        reason: "Production ready candidate missing authenticated E2E test coverage.",
        next_required_step: "Complete live authenticated Companion E2E before promotion.",
      });
    }

    if (entry.domain === "member_verification" && entry.readiness === "source_missing") {
      gaps.push({
        priority: "P1",
        module_id: entry.module_id,
        provider_key: entry.provider_key,
        capability_ids: entry.capability_ids,
        reason: "Member verification capability has no live read source.",
        next_required_step: entry.next_required_step ?? "Connect read-only verification source with audit metadata.",
      });
    }

    if (entry.domain === "appointment_service" && entry.readiness === "source_missing") {
      gaps.push({
        priority: "P1",
        module_id: entry.module_id,
        provider_key: entry.provider_key,
        capability_ids: entry.capability_ids,
        reason: "Appointment/service booking capability missing live adapter.",
        next_required_step: entry.next_required_step ?? "Wire services provider adapter with approval flow.",
      });
    }

    if (entry.readiness === "adapter_missing" && entry.activation_status !== "disabled") {
      gaps.push({
        priority: "P1",
        module_id: entry.module_id,
        provider_key: entry.provider_key,
        capability_ids: entry.capability_ids,
        reason: "Connected manifest without live provider adapter.",
        next_required_step: entry.next_required_step ?? `Implement adapter for ${entry.provider_key}.`,
      });
    }

    if (entry.readiness === "connected_but_partial" && entry.command_brief_status === "none" && entry.panel === "app") {
      gaps.push({
        priority: "P2",
        module_id: entry.module_id,
        provider_key: entry.provider_key,
        capability_ids: entry.capability_ids,
        reason: "Partial runtime without Command Brief linkage.",
        next_required_step: "Add Command Brief signals when live metrics are available.",
      });
    }

    if (entry.readiness === "specification_only") {
      gaps.push({
        priority: "P3",
        module_id: entry.module_id,
        provider_key: entry.provider_key,
        capability_ids: entry.capability_ids,
        reason: "Specification-only — no runtime wiring.",
        next_required_step: entry.next_required_step ?? "Implement provider manifest and loader wiring.",
      });
    }
  }

  return sortGapsByPriority(gaps);
}

export function sortGapsByPriority(gaps: readonly CompanionCoverageGap[]): CompanionCoverageGap[] {
  const order: Record<CompanionCoverageGapPriority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
  return [...gaps].sort((a, b) => order[a.priority] - order[b.priority]);
}

export function assertNoFalseProductionReady(entries: readonly CompanionCoverageEntry[]): boolean {
  return !entries.some(isProductionReadyIntegrityViolation);
}

export function assertMemberVerificationCoverageExists(entries: readonly CompanionCoverageEntry[]): boolean {
  const required = ["verification_status.read", "verification_queue.read", "verification_case.read"];
  const present = new Set(entries.flatMap((entry) => entry.capability_ids));
  return required.every((cap) => present.has(cap));
}

export function assertHairdresserServiceCoverageExists(entries: readonly CompanionCoverageEntry[]): boolean {
  const required = [
    "service.read",
    "availability.read",
    "booking.read",
    "vacation_mode.read",
    "absence.read",
  ];
  const present = new Set(entries.flatMap((entry) => entry.capability_ids));
  return required.every((cap) => present.has(cap));
}

export function assertFourPanelCoverage(entries: readonly CompanionCoverageEntry[]): boolean {
  const panels = new Set(entries.filter((e) => e.module_id.startsWith("panel.")).map((e) => e.panel));
  return panels.has("super_admin") && panels.has("platform") && panels.has("partners") && panels.has("app");
}

export function countGapsByPriority(gaps: readonly CompanionCoverageGap[]): Record<CompanionCoverageGapPriority, number> {
  return gaps.reduce(
    (acc, gap) => {
      acc[gap.priority] += 1;
      return acc;
    },
    { P0: 0, P1: 0, P2: 0, P3: 0 } as Record<CompanionCoverageGapPriority, number>,
  );
}

export const PRODUCTION_READY_ALLOWED: readonly CompanionCoverageReadiness[] = [
  "production_ready",
  "production_ready_candidate",
];
