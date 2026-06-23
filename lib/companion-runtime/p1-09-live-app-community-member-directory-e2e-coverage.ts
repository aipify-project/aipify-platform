import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact } from "./p1-09-live-app-community-member-directory-e2e-types";

export const P1_09_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<Record<string, readonly string[]>> = {
  "directory.community_member": [
    "member.search.live",
    "member.search.status",
    "member.search.level",
    "member.search.verification",
    "member.search.profile",
    "member.search.count",
    "member.search.no_admin",
    "member.search.masked_contact",
    "member.search.no_match",
    "member.search.no_proxy",
    "member.search.isolation",
    "member.search.access",
    "member.command_brief.exact_only",
    "member.provider.connected",
  ],
};

export function deriveP1_09LiveE2eCoverageUpdates(
  artifact: P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_09_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1_09LiveAppCommunityMemberDirectoryE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1_09LiveE2eCoverageUpdates(artifact));
  if (moduleUpdates.size === 0) return [...entries];

  return entries.map((entry) => {
    if (!moduleUpdates.has(entry.module_id)) return entry;
    if (entry.readiness === "production_ready") return entry;

    return {
      ...entry,
      readiness: "production_ready_candidate",
      activation_status: "active",
      schema_status: "wired",
      source_reference: "get_customer_member_directory_center",
      limitations: [
        ...entry.limitations.filter(
          (line) =>
            !line.includes("contract only") &&
            !line.includes("No member list exposed") &&
            !line.includes("community metadata proxy") &&
            !line.includes("best_practices"),
        ),
        "Community member directory exact source live E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
