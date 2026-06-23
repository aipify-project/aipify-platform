import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1_08LiveAppMemberVerificationE2eCertificationArtifact } from "./p1-08-live-app-member-verification-e2e-types";

export const P1_08_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<Record<string, readonly string[]>> = {
  "verification.queue_read": [
    "verification.queue.live",
    "verification.queue.status",
    "verification.queue.priority",
    "verification.queue.needs_information",
    "verification.queue.no_fabrication",
    "verification.queue.empty_source",
    "verification.queue.isolation",
    "verification.queue.access",
    "verification.command_brief.exact_only",
    "verification.blocked",
    "verification.audit",
  ],
  "verification.case_read": [
    "verification.case.live",
    "verification.case.status",
    "verification.case.no_documents",
  ],
  "verification.community_adapter_status": [
    "verification.status.exact",
    "verification.provider.connected",
  ],
};

export function deriveP1_08LiveE2eCoverageUpdates(
  artifact: P1_08LiveAppMemberVerificationE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_08_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1_08LiveAppMemberVerificationE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1_08LiveAppMemberVerificationE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1_08LiveE2eCoverageUpdates(artifact));
  if (moduleUpdates.size === 0) return [...entries];

  return entries.map((entry) => {
    if (!moduleUpdates.has(entry.module_id)) return entry;
    if (entry.readiness === "production_ready") return entry;

    return {
      ...entry,
      readiness: "production_ready_candidate",
      activation_status: "active",
      schema_status: "wired",
      source_reference: "get_customer_member_verification_center",
      limitations: [
        ...entry.limitations.filter(
          (line) =>
            !line.includes("community metadata proxy") &&
            !line.includes("moderation_status") &&
            !line.includes("best_practices") &&
            !line.includes("dedicated verification queue RPC is approved") &&
            !line.includes("metadata-only proxy"),
        ),
        "Member verification exact source live E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
