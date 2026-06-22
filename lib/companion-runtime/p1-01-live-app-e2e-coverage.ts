import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1LiveE2eCertificationArtifact } from "./p1-01-live-app-e2e-types";

/** Module IDs eligible for production_ready_candidate after P1.01 live E2E pass. */
export const P1_01_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<
  Record<string, readonly string[]>
> = {
  "directory.app_employee": ["employee.search"],
  "directory.crm_customer": ["customer.search"],
  "directory.supplier": ["supplier.search"],
  "core.command_brief_signals": ["command_brief.read"],
};

export function deriveP1LiveE2eCoverageUpdates(
  artifact: P1LiveE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_01_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1LiveE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1LiveE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1LiveE2eCoverageUpdates(artifact));
  if (moduleUpdates.size === 0) return [...entries];

  return entries.map((entry) => {
    if (!moduleUpdates.has(entry.module_id)) return entry;
    if (entry.readiness === "production_ready") return entry;

    return {
      ...entry,
      readiness: "production_ready_candidate",
      limitations: [
        ...entry.limitations.filter((line) => !line.includes("Authenticated live APP E2E")),
        "Authenticated live APP E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
