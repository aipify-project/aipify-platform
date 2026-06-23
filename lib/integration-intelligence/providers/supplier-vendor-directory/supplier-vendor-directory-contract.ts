import { parseProcurementOperationsCenter } from "@/lib/procurement-operations/parse";
import type { Contract, Vendor } from "@/lib/procurement-operations/types";
import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import type { DirectoryRelationshipType } from "@/lib/integration-intelligence/directory/relationship-types";
import type { DirectoryCompleteness, DirectoryFreshness } from "@/lib/integration-intelligence/directory/types";

export const SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY = "supplier_vendor_directory" as const;

function normalizeToken(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function classifySupplierRelationship(vendor: Vendor): DirectoryRelationshipType {
  const category = normalizeToken(vendor.category_key);
  const services = normalizeToken(vendor.services);

  if (category.includes("manufacturer") || services.includes("manufacturer") || services.includes("produsent")) {
    return "manufacturer";
  }
  if (category.includes("distributor") || services.includes("distributor") || services.includes("grossist")) {
    return "distributor";
  }
  if (category.includes("subcontract") || services.includes("subcontract") || services.includes("underlever")) {
    return "subcontractor";
  }
  if (
    category.includes("service") ||
    services.includes("rengjøring") ||
    services.includes("cleaning") ||
    services.includes("vedlikehold")
  ) {
    return "service_provider";
  }
  return "supplier";
}

function contractStatusForVendor(vendor: Vendor, contracts: readonly Contract[]): string | null {
  const vendorName = normalizeToken(vendor.vendor_name);
  const matches = contracts.filter((row) => normalizeToken(row.vendor_name) === vendorName);
  if (matches.length === 0) return null;
  const active = matches.find((row) => ["active", "approved", "expiring"].includes(row.status));
  return active?.status ?? matches[0]?.status ?? null;
}

function mapVendorOrganizationCandidate(input: {
  vendor: Vendor;
  relationshipType: DirectoryRelationshipType;
  contractStatus: string | null;
}): DirectoryMatchCandidate {
  return {
    entity_id: input.vendor.id,
    entity_type: "organization",
    display_name: input.vendor.vendor_name,
    company_name: input.vendor.vendor_name,
    role: null,
    department: null,
    team: null,
    status: input.vendor.status,
    email_raw: input.vendor.email ?? null,
    phone_raw: input.vendor.phone ?? null,
    email_masked: input.vendor.email ?? null,
    phone_masked: input.vendor.phone ?? null,
    organization_number: input.vendor.organization_number ?? null,
    external_id: input.vendor.vendor_number ?? null,
    supplier_id: input.vendor.id,
    category: input.vendor.category_key ?? null,
    services: input.vendor.services ?? null,
    country: input.vendor.country ?? null,
    is_preferred: input.vendor.is_preferred,
    assigned_buyer: null,
    contract_status: input.contractStatus,
    supplier_subtype: input.relationshipType,
    owner_reference: null,
    lead_source: null,
    pipeline_stage: input.vendor.health_status ?? null,
  };
}

function mapVendorContactCandidate(vendor: Vendor): DirectoryMatchCandidate | null {
  const contactName = vendor.contact_person?.trim();
  if (!contactName) return null;

  return {
    entity_id: `${vendor.id}:contact`,
    entity_type: "person",
    display_name: contactName,
    company_name: vendor.vendor_name,
    role: "supplier_contact",
    department: null,
    team: null,
    status: vendor.status,
    email_raw: vendor.email ?? null,
    phone_raw: vendor.phone ?? null,
    email_masked: vendor.email ?? null,
    phone_masked: vendor.phone ?? null,
    organization_number: null,
    external_id: vendor.vendor_number ?? null,
    supplier_id: vendor.id,
    category: vendor.category_key ?? null,
    services: vendor.services ?? null,
    country: vendor.country ?? null,
    is_preferred: vendor.is_preferred,
    contract_status: null,
    supplier_subtype: "supplier_contact",
  };
}

export type SupplierDirectoryBundle = {
  candidates: DirectoryMatchCandidate[];
  new_supplier_count: number;
  supplier_contract_expiring_count: number;
  supplier_contract_expired_count: number;
  supplier_delivery_delay_count: number;
  supplier_performance_warning_count: number;
  supplier_risk_attention_count: number;
  supplier_contact_missing_count: number;
  supplier_without_category_count: number;
  duplicate_supplier_candidate_count: number;
  preferred_supplier_unavailable_count: number;
  purchase_order_attention_count: number;
  source_exact: boolean;
  freshness: DirectoryFreshness;
  completeness: DirectoryCompleteness;
  limitations: readonly string[];
};

function countDuplicateOrgNumbers(candidates: readonly DirectoryMatchCandidate[]): number {
  const orgNumbers = new Map<string, number>();
  for (const row of candidates) {
    const orgNo = row.organization_number?.trim();
    if (!orgNo) continue;
    orgNumbers.set(orgNo, (orgNumbers.get(orgNo) ?? 0) + 1);
  }
  return [...orgNumbers.values()].filter((count) => count > 1).length;
}

export function mapSupplierDirectoryBundle(input: {
  organizationId: string;
  procurementCenterData?: unknown;
}): SupplierDirectoryBundle {
  const limitations: string[] = [];
  const center = parseProcurementOperationsCenter(input.procurementCenterData ?? null);
  const centerFound = center?.found === true;

  if (!centerFound) {
    limitations.push("Procurement operations sources returned no supplier records.");
  }

  const vendors = center?.vendors ?? center?.suppliers ?? [];
  const contracts = center?.contracts ?? [];
  const candidates: DirectoryMatchCandidate[] = [];

  for (const vendor of vendors) {
    const relationshipType = classifySupplierRelationship(vendor);
    const contractStatus = contractStatusForVendor(vendor, contracts);
    candidates.push(
      mapVendorOrganizationCandidate({
        vendor,
        relationshipType,
        contractStatus,
      }),
    );
    const contact = mapVendorContactCandidate(vendor);
    if (contact) candidates.push(contact);
  }

  const uniqueByEntity = new Map<string, DirectoryMatchCandidate>();
  for (const row of candidates) {
    const key = `${row.entity_type}:${row.entity_id}`;
    if (!uniqueByEntity.has(key)) uniqueByEntity.set(key, row);
  }
  const dedupedCandidates = [...uniqueByEntity.values()];

  const overview = (center?.overview ?? {}) as Record<string, unknown>;
  const expiringContracts =
    typeof overview.expiring_contracts_30d === "number" ? overview.expiring_contracts_30d : 0;
  const highRisk =
    typeof overview.high_risk_suppliers === "number"
      ? overview.high_risk_suppliers
      : dedupedCandidates.filter((row) =>
          ["high", "critical", "high_risk"].includes(String(row.status ?? row.pipeline_stage ?? "")),
        ).length;
  const pendingReceiving =
    typeof overview.pending_receiving === "number" ? overview.pending_receiving : 0;
  const ordersInTransit =
    typeof overview.orders_in_transit === "number" ? overview.orders_in_transit : 0;

  const contactMissing = vendors.filter((vendor) => !vendor.contact_person?.trim() && !vendor.email?.trim()).length;
  const withoutCategory = vendors.filter((vendor) => !vendor.category_key?.trim()).length;
  const preferredUnavailable = vendors.filter(
    (vendor) => vendor.is_preferred && ["high_risk", "high", "critical"].includes(vendor.health_status ?? vendor.risk_status ?? ""),
  ).length;
  const expiredContracts = contracts.filter((row) => row.status === "expired").length;
  const duplicateOrgNumbers = countDuplicateOrgNumbers(dedupedCandidates);

  if (dedupedCandidates.length > 0) {
    limitations.push("Suppliers are organization-owned procurement records — not Aipify Partners or customers.");
    limitations.push("Marketplace or product candidates are excluded unless explicitly sourced as org vendors.");
  }

  return {
    candidates: dedupedCandidates,
    new_supplier_count: 0,
    supplier_contract_expiring_count: expiringContracts,
    supplier_contract_expired_count: expiredContracts,
    supplier_delivery_delay_count: pendingReceiving,
    supplier_performance_warning_count: highRisk,
    supplier_risk_attention_count: highRisk,
    supplier_contact_missing_count: contactMissing,
    supplier_without_category_count: withoutCategory,
    duplicate_supplier_candidate_count: duplicateOrgNumbers,
    preferred_supplier_unavailable_count: preferredUnavailable,
    purchase_order_attention_count: ordersInTransit,
    source_exact: centerFound,
    freshness: centerFound ? "fresh" : "unknown",
    completeness: vendors.length > 0 ? "partial" : "empty",
    limitations,
  };
}

export function classifySupplierCandidateRelationship(
  candidate: DirectoryMatchCandidate,
): DirectoryRelationshipType {
  if (candidate.entity_type === "person" && candidate.role === "supplier_contact") {
    return "supplier_contact";
  }
  const subtype = candidate.supplier_subtype;
  if (subtype === "manufacturer" || subtype === "distributor" || subtype === "subcontractor") {
    return subtype;
  }
  if (subtype === "service_provider") return "service_provider";
  return "supplier";
}

export function isMarketplaceSupplierCandidate(sourceProvider: string): boolean {
  return sourceProvider !== SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY;
}
