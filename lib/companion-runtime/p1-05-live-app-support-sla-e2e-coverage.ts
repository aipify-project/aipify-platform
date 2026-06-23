import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1_05LiveAppSupportSlaE2eCertificationArtifact } from "./p1-05-live-app-support-sla-e2e-types";

export const P1_05_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<Record<string, readonly string[]>> = {
  "support.queue_read": [
    "support.sla.live",
    "support.sla.policy",
    "support.sla.status_mapping",
    "support.sla.unavailable",
    "support.sla.no_fabrication",
    "support.sla.empty_source",
    "support.sla.isolation",
    "support.sla.access",
  ],
  "support.command_brief_signals": [
    "support.sla.command_brief",
    "support.sla.no_fabrication",
  ],
};

export function deriveP1_05LiveE2eCoverageUpdates(
  artifact: P1_05LiveAppSupportSlaE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_05_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1_05LiveAppSupportSlaE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1_05LiveAppSupportSlaE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1_05LiveE2eCoverageUpdates(artifact));
  if (moduleUpdates.size === 0) return [...entries];

  return entries.map((entry) => {
    if (!moduleUpdates.has(entry.module_id)) return entry;
    if (entry.readiness === "production_ready") return entry;

    return {
      ...entry,
      readiness: "production_ready_candidate",
      limitations: [
        ...entry.limitations.filter(
          (line) =>
            !line.includes("Support SLA live E2E") &&
            !line.includes("SLA fields are partial") &&
            !line.includes("Partial SLA proxy") &&
            !line.includes("connected_but_partial"),
        ),
        "Support SLA exact source live E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
