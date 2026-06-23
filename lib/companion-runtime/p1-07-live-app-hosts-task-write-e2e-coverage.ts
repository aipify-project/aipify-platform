import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1_07LiveAppHostsTaskWriteE2eCertificationArtifact } from "./p1-07-live-app-hosts-task-write-e2e-types";

export const P1_07_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<Record<string, readonly string[]>> = {
  "hosts.task_write": [
    "hosts.write.host_task",
    "hosts.write.cleaning_assign",
    "hosts.write.maintenance_create",
    "hosts.write.confirmation",
    "hosts.write.approval",
    "hosts.write.idempotency",
    "hosts.write.isolation",
    "hosts.write.access",
    "hosts.write.audit",
    "hosts.write.blocked",
    "hosts.write.cleanup",
  ],
};

export function deriveP1_07LiveE2eCoverageUpdates(
  artifact: P1_07LiveAppHostsTaskWriteE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_07_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1_07LiveAppHostsTaskWriteE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1_07LiveAppHostsTaskWriteE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1_07LiveE2eCoverageUpdates(artifact));
  if (moduleUpdates.size === 0) return [...entries];

  return entries.map((entry) => {
    if (!moduleUpdates.has(entry.module_id)) return entry;
    if (entry.readiness === "production_ready") return entry;

    return {
      ...entry,
      readiness: "production_ready_candidate",
      activation_status: "partial",
      schema_status: "wired",
      limitations: [
        ...entry.limitations.filter(
          (line) =>
            !line.includes("adapter is not connected") &&
            !line.includes("execution_source_missing") &&
            !line.includes("adapter_missing"),
        ),
        "Hosts task write live E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
