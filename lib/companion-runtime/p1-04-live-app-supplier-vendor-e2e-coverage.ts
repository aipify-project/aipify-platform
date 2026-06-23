import type { CompanionCoverageEntry } from "./companion-foundation-coverage-types";
import type { P1_04LiveAppSupplierVendorE2eCertificationArtifact } from "./p1-04-live-app-supplier-vendor-e2e-types";

export const P1_04_LIVE_E2E_MODULE_REQUIREMENTS: Readonly<Record<string, readonly string[]>> = {
  "directory.supplier": [
    "supplier.search.live",
    "supplier.search.name",
    "supplier.search.organization_number",
    "supplier.search.contact",
    "supplier.search.category",
    "supplier.search.contract_status",
    "supplier.search.buyer",
    "supplier.search.manufacturer_distributor",
    "supplier.contact.masking",
    "supplier.search.unknown_empty",
    "supplier.search.clarification",
    "supplier.relationship.boundary",
    "supplier.marketplace.exclusion",
    "supplier.access.denied",
    "supplier.isolation",
    "supplier.empty_source_integrity",
  ],
};

export function deriveP1_04LiveE2eCoverageUpdates(
  artifact: P1_04LiveAppSupplierVendorE2eCertificationArtifact,
): string[] {
  if (artifact.overall_status !== "pass") return [];

  const passed = new Set(artifact.capabilities_passed);
  const updates: string[] = [];

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_04_LIVE_E2E_MODULE_REQUIREMENTS)) {
    if (requiredCapabilities.every((capability) => passed.has(capability))) {
      updates.push(moduleId);
    }
  }

  return updates.sort();
}

export function applyP1_04LiveAppSupplierVendorE2eCoverageOverrides(
  entries: readonly CompanionCoverageEntry[],
  artifact: P1_04LiveAppSupplierVendorE2eCertificationArtifact | null,
): CompanionCoverageEntry[] {
  if (!artifact || artifact.overall_status !== "pass") {
    return [...entries];
  }

  const moduleUpdates = new Set(deriveP1_04LiveE2eCoverageUpdates(artifact));
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
            !line.includes("Supplier Vendor Directory live E2E") &&
            !line.includes("Authenticated live APP E2E") &&
            !line.includes("connected_but_partial"),
        ),
        "Supplier Vendor Directory live E2E certification passed — production_ready requires final operator sign-off.",
      ],
      next_required_step: "Operator sign-off before production_ready promotion.",
    };
  });
}
