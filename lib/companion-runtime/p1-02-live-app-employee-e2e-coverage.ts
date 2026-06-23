import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1_02LiveAppEmployeeE2eCertificationArtifact } from "./p1-02-live-app-employee-e2e-types";

/** Module promotion after dedicated APP Employee Directory live E2E pass. */
export const P1_02_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<
  Record<string, readonly string[]>
> = {
  "directory.app_employee": [
    "employee.search.live",
    "employee.search.role_status",
    "employee.contact.masking",
    "employee.permission.owner_admin",
    "employee.search.unknown_empty",
    "employee.access.denied",
    "employee.isolation",
  ],
};

export function deriveP1_02LiveE2eCoverageUpdates(
  artifact: P1_02LiveAppEmployeeE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_02_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1_02LiveAppEmployeeE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1_02LiveAppEmployeeE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1_02LiveE2eCoverageUpdates(artifact));
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
            !line.includes("APP Employee Directory live E2E") &&
            !line.includes("Authenticated live APP E2E"),
        ),
        "APP Employee Directory live E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
