import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1_03LiveAppCrmCustomerE2eCertificationArtifact } from "./p1-03-live-app-crm-customer-e2e-types";

export const P1_03_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<Record<string, readonly string[]>> = {
  "directory.crm_customer": [
    "customer.search.live",
    "customer.search.company",
    "customer.search.email",
    "customer.search.phone",
    "customer.search.organization_number",
    "customer.search.lead_prospect",
    "customer.search.contact_company",
    "customer.search.owner",
    "customer.partner.attribution",
    "customer.contact.masking",
    "customer.search.unknown_empty",
    "customer.search.clarification",
    "customer.access.denied",
    "customer.isolation",
  ],
};

export function deriveP1_03LiveE2eCoverageUpdates(
  artifact: P1_03LiveAppCrmCustomerE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_03_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1_03LiveAppCrmCustomerE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1_03LiveAppCrmCustomerE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1_03LiveE2eCoverageUpdates(artifact));
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
            !line.includes("CRM Customer Directory live E2E") &&
            !line.includes("Authenticated live APP E2E") &&
            !line.includes("connected_but_partial"),
        ),
        "CRM Customer Directory live E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
