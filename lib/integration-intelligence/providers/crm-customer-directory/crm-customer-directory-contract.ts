import {
  parseCustomerRelationshipCenter,
  parseLeadManagementCenter,
} from "@/lib/customer-relationship/parse";
import type { CrmCustomer } from "@/lib/customer-relationship/types";
import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import type { DirectoryRelationshipType } from "@/lib/integration-intelligence/directory/relationship-types";
import type { DirectoryCompleteness, DirectoryFreshness } from "@/lib/integration-intelligence/directory/types";
import { resolveCrmOwnershipPresentation } from "./permissions";

export const CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY = "crm_customer_directory" as const;

type RawRow = Record<string, unknown>;

function asArray(value: unknown): RawRow[] {
  return Array.isArray(value) ? (value as RawRow[]) : [];
}


function mapCustomerToCandidate(input: {
  customer: CrmCustomer;
  relationshipType: DirectoryRelationshipType;
  organizationId: string;
  sourceReference: string;
  forceOrganization?: boolean;
}): DirectoryMatchCandidate {
  const forceOrg = input.forceOrganization === true;
  const ownership = resolveCrmOwnershipPresentation({
    customer_type: input.customer.customer_type,
    assigned_seller: input.customer.assigned_employee_name ?? null,
  });

  return {
    entity_id: input.customer.id,
    entity_type: forceOrg ? "organization" : "person",
    display_name: forceOrg
      ? input.customer.company_name ?? input.customer.name
      : input.customer.name ?? input.customer.company_name ?? "Customer",
    company_name: input.customer.company_name ?? null,
    role: ownership.owner_reference,
    department: input.customer.department_name ?? null,
    team: null,
    status: input.customer.status,
    email_raw: input.customer.email ?? null,
    phone_raw: input.customer.phone ?? null,
    email_masked: input.customer.email ?? null,
    phone_masked: input.customer.phone ?? null,
    organization_number: input.customer.organization_number ?? null,
    external_id: input.customer.customer_number ?? null,
    customer_id: input.customer.id,
    owner_reference: ownership.owner_reference,
    attribution_reference: ownership.attribution_reference,
    lead_source: null,
    pipeline_stage: input.customer.lifecycle_stage ?? null,
  };
}

function mapLeadRowToCandidate(row: RawRow, organizationId: string): DirectoryMatchCandidate {
  const contactName = String(row.contact_name ?? row.name ?? "Lead").trim();
  const companyName = row.company_name ? String(row.company_name).trim() : null;
  const leadId = String(row.id ?? "").trim();

  return {
    entity_id: leadId,
    entity_type: companyName && !contactName ? "organization" : "person",
    display_name: contactName || companyName || "Lead",
    company_name: companyName,
    role: null,
    department: null,
    team: null,
    status: String(row.status ?? "open"),
    email_raw: row.email ? String(row.email) : null,
    phone_raw: row.phone ? String(row.phone) : null,
    email_masked: row.email ? String(row.email) : null,
    phone_masked: row.phone ? String(row.phone) : null,
    organization_number: null,
    external_id: row.lead_number ? String(row.lead_number) : null,
    lead_id: leadId,
    lead_source: row.lead_source ? String(row.lead_source) : null,
    pipeline_stage: row.stage ? String(row.stage) : null,
    owner_reference: row.assigned_employee_name ? String(row.assigned_employee_name) : null,
  };
}

function mapContactRowToCandidate(row: RawRow): DirectoryMatchCandidate {
  const contactId = String(row.id ?? "").trim();
  return {
    entity_id: contactId,
    entity_type: "person",
    display_name: String(row.full_name ?? row.name ?? "Contact").trim(),
    company_name: row.customer_name ? String(row.customer_name) : null,
    role: row.contact_role ? String(row.contact_role) : null,
    department: row.department ? String(row.department) : null,
    team: null,
    status: row.relationship_status ? String(row.relationship_status) : "active",
    email_raw: row.email ? String(row.email) : null,
    phone_raw: row.phone ? String(row.phone) : null,
    email_masked: row.email ? String(row.email) : null,
    phone_masked: row.phone ? String(row.phone) : null,
    organization_number: null,
    external_id: null,
    customer_id: row.customer_id ? String(row.customer_id) : null,
  };
}

export type CrmDirectoryBundle = {
  candidates: DirectoryMatchCandidate[];
  new_lead_count: number;
  lead_without_follow_up_count: number;
  customer_health_warning_count: number;
  churn_risk_count: number;
  deal_status_change_count: number;
  conversion_deviation_count: number;
  unassigned_customer_count: number;
  duplicate_customer_candidate_count: number;
  source_exact: boolean;
  freshness: DirectoryFreshness;
  completeness: DirectoryCompleteness;
  limitations: readonly string[];
};

function countDuplicateEmails(candidates: readonly DirectoryMatchCandidate[]): number {
  const emails = new Map<string, number>();
  for (const row of candidates) {
    const email = row.email_raw?.trim().toLowerCase();
    if (!email) continue;
    emails.set(email, (emails.get(email) ?? 0) + 1);
  }
  return [...emails.values()].filter((count) => count > 1).length;
}

export function mapCrmDirectoryBundle(input: {
  organizationId: string;
  relationshipCenterData?: unknown;
  leadCenterData?: unknown;
  searchData?: unknown;
}): CrmDirectoryBundle {
  const limitations: string[] = [];
  const candidates: DirectoryMatchCandidate[] = [];

  const center = parseCustomerRelationshipCenter(input.relationshipCenterData ?? null);
  const leadCenter = parseLeadManagementCenter(input.leadCenterData ?? null);

  const centerFound = center?.found === true;
  const leadFound = leadCenter?.found === true;

  if (!centerFound && !leadFound) {
    limitations.push("CRM relationship sources returned no records.");
  }

  if (center) {
    for (const customer of center.customers ?? []) {
      const relationshipType: DirectoryRelationshipType =
        customer.status === "prospect" ? "prospect" : "customer";
      candidates.push(
        mapCustomerToCandidate({
          customer,
          relationshipType,
          organizationId: input.organizationId,
          sourceReference: "get_customer_relationship_center",
        }),
      );
    }
    for (const prospect of center.prospects ?? []) {
      candidates.push(
        mapCustomerToCandidate({
          customer: prospect,
          relationshipType: "prospect",
          organizationId: input.organizationId,
          sourceReference: "get_customer_relationship_center",
        }),
      );
    }
    for (const org of center.organizations ?? []) {
      candidates.push(
        mapCustomerToCandidate({
          customer: org,
          relationshipType: "customer",
          organizationId: input.organizationId,
          sourceReference: "get_customer_relationship_center",
          forceOrganization: true,
        }),
      );
    }
    for (const contact of center.contacts ?? []) {
      candidates.push(mapContactRowToCandidate(contact));
    }
    for (const lead of center.leads ?? []) {
      candidates.push(mapLeadRowToCandidate(lead, input.organizationId));
    }
  }

  if (leadCenter?.leads) {
    for (const lead of leadCenter.leads) {
      candidates.push(mapLeadRowToCandidate(lead, input.organizationId));
    }
  }

  if (input.searchData && typeof input.searchData === "object") {
    const search = input.searchData as Record<string, unknown>;
    if (search.found !== false) {
      for (const customer of asArray(search.customers)) {
        candidates.push(
          mapCustomerToCandidate({
            customer: customer as CrmCustomer,
            relationshipType: "customer",
            organizationId: input.organizationId,
            sourceReference: "search_customer_relationship_records",
          }),
        );
      }
      for (const contact of asArray(search.contacts)) {
        candidates.push(mapContactRowToCandidate(contact));
      }
      for (const lead of asArray(search.leads)) {
        candidates.push(mapLeadRowToCandidate(lead, input.organizationId));
      }
    }
  }

  const uniqueByEntity = new Map<string, DirectoryMatchCandidate>();
  for (const row of candidates) {
    const key = `${row.entity_type}:${row.entity_id}:${row.status ?? ""}`;
    if (!uniqueByEntity.has(key)) uniqueByEntity.set(key, row);
  }
  const dedupedCandidates = [...uniqueByEntity.values()];

  const overview = (center?.overview ?? {}) as Record<string, unknown>;
  const followUpsDue =
    typeof overview.follow_ups_due === "number" ? overview.follow_ups_due : 0;
  const atRisk =
    typeof overview.at_risk === "number"
      ? overview.at_risk
      : dedupedCandidates.filter((row) =>
          ["at_risk", "requires_attention"].includes(String(row.status ?? "")),
        ).length;
  const unassigned = dedupedCandidates.filter(
    (row) =>
      row.customer_id &&
      !row.owner_reference &&
      row.status === "active" &&
      !row.lead_id,
  ).length;
  const duplicateEmails = countDuplicateEmails(dedupedCandidates);

  if (dedupedCandidates.some((row) => row.attribution_reference)) {
    limitations.push("Partner attribution is metadata — platform retains customer ownership.");
  }

  return {
    candidates: dedupedCandidates,
    new_lead_count: typeof overview.open_leads === "number" ? Math.min(overview.open_leads, 5) : 0,
    lead_without_follow_up_count: followUpsDue,
    customer_health_warning_count: atRisk,
    churn_risk_count: atRisk,
    deal_status_change_count: 0,
    conversion_deviation_count: 0,
    unassigned_customer_count: unassigned,
    duplicate_customer_candidate_count: duplicateEmails,
    source_exact: centerFound || leadFound,
    freshness: centerFound || leadFound ? "fresh" : "unknown",
    completeness: "partial",
    limitations,
  };
}

export function classifyCrmRelationship(candidate: DirectoryMatchCandidate): DirectoryRelationshipType {
  if (candidate.lead_id && !candidate.customer_id) return "lead";
  if (candidate.status === "prospect") return "prospect";
  if (candidate.customer_id && candidate.company_name && candidate.role?.includes("contact")) return "contact";
  if (candidate.customer_id && !candidate.lead_id && candidate.company_name && candidate.entity_type === "organization") {
    return "customer";
  }
  if (candidate.lead_id) return "lead";
  if (candidate.status === "prospect") return "prospect";
  if (candidate.role && candidate.customer_id && !candidate.lead_id) return "contact";
  return "customer";
}
