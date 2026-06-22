import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { DirectoryRelationshipType } from "./relationship-types";

export type { DirectoryRelationshipType } from "./relationship-types";

export type DirectoryEntityType = "person" | "organization";

export type DirectoryProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type DirectoryCapabilityOperation = "read" | "search";

export type DirectoryCapabilityKey =
  | "directory.search"
  | "person.read"
  | "organization.read"
  | "relationship.read"
  | "customer.search"
  | "member.search"
  | "employee.search"
  | "employee.read"
  | "role.read"
  | "team.read"
  | "department.read"
  | "lead.search"
  | "lead.read"
  | "prospect.search"
  | "contact.read"
  | "customer.read"
  | "opportunity.read"
  | "pipeline.read"
  | "customer_owner.read"
  | "attribution.read"
  | "partner.search"
  | "supplier.search"
  | "seller.search"
  | "contact.search";

export type DirectorySearchField =
  | "name"
  | "company_name"
  | "email"
  | "phone"
  | "organization_number"
  | "external_id"
  | "role"
  | "department"
  | "team"
  | "status"
  | "relationship_type"
  | "location"
  | "customer_id"
  | "lead_id"
  | "pipeline_stage"
  | "owner"
  | "lead_source";

export type DirectorySearchFieldAccess =
  | "directory.search.basic"
  | "directory.search.contact"
  | "directory.search.sensitive"
  | "directory.export";

export type DirectoryPermissionScope =
  | "basic"
  | "contact"
  | "sensitive"
  | "export";

export type DirectoryMatchKind =
  | "exact"
  | "normalized"
  | "prefix"
  | "fuzzy";

export type DirectorySearchOutcome =
  | "exact_match"
  | "multiple_matches"
  | "no_match"
  | "permission_denied"
  | "provider_missing"
  | "unsupported_search_field"
  | "activation_pending"
  | "partial_result"
  | "ambiguous_query";

export type DirectoryReadiness =
  | "production_ready"
  | "production_ready_candidate"
  | "connected_but_partial"
  | "adapter_missing"
  | "source_missing"
  | "manifest_only"
  | "specification_only"
  | "disabled"
  | "blocked_by_governance";

export type DirectoryFreshness = "fresh" | "stale" | "unknown";
export type DirectoryCompleteness = "complete" | "partial" | "empty";

export type DirectorySourceReference = {
  source_provider: string;
  source_reference: string;
  fetched_at: string | null;
};

export type DirectoryPerson = {
  entity_id: string;
  entity_type: "person";
  display_name: string | null;
  company_name: string | null;
  role: string | null;
  status: string | null;
  email_masked: string | null;
  phone_masked: string | null;
  organization_number: string | null;
  department: string | null;
  team: string | null;
  relationship_type: DirectoryRelationshipType;
  source_provider: string;
  source_reference: string;
  organization_id: string;
  freshness: DirectoryFreshness;
  completeness: DirectoryCompleteness;
  permission_scope: DirectoryPermissionScope;
  match_kind: DirectoryMatchKind;
  match_confidence: "high" | "moderate" | "low";
};

export type DirectoryOrganization = {
  entity_id: string;
  entity_type: "organization";
  display_name: string | null;
  company_name: string;
  role: string | null;
  status: string | null;
  email_masked: string | null;
  phone_masked: string | null;
  organization_number: string | null;
  department: string | null;
  team: string | null;
  relationship_type: DirectoryRelationshipType;
  source_provider: string;
  source_reference: string;
  organization_id: string;
  freshness: DirectoryFreshness;
  completeness: DirectoryCompleteness;
  permission_scope: DirectoryPermissionScope;
  match_kind: DirectoryMatchKind;
  match_confidence: "high" | "moderate" | "low";
};

export type DirectoryRecord = DirectoryPerson | DirectoryOrganization;

export type DirectoryRelationship = {
  relationship_id: string;
  relationship_type: DirectoryRelationshipType;
  entity_id: string;
  entity_type: DirectoryEntityType;
  organization_id: string;
  status: string | null;
  role: string | null;
  source_provider: string;
};

export type DirectorySearchFilters = Partial<
  Record<"relationship_type" | "status" | "role" | "location", string>
>;

export type DirectorySearchQuery = {
  organization_id: string;
  tenant_id: string;
  entity_type: DirectoryEntityType | null;
  relationship_type: DirectoryRelationshipType | null;
  search_field: DirectorySearchField | null;
  search_value: string | null;
  filters: DirectorySearchFilters;
  requested_fields: readonly DirectorySearchField[];
  requested_detail_level: "summary" | "list" | "detail";
  permission_scope: DirectoryPermissionScope;
  capability_candidates: readonly DirectoryCapabilityKey[];
  locale: CustomerActiveLocale;
};

export type DirectorySearchResult = {
  outcome: DirectorySearchOutcome;
  records: readonly DirectoryRecord[];
  total_count: number;
  clarification_required: boolean;
  outcome_key: string | null;
  providers_queried: readonly string[];
  audit_id: string | null;
  limitations: readonly string[];
};

export type DirectoryCapabilityManifest = {
  capability_key: DirectoryCapabilityKey;
  operation: DirectoryCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3 | 4;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
  supported_search_fields?: readonly DirectorySearchField[];
  relationship_types?: readonly DirectoryRelationshipType[];
  field_access?: DirectorySearchFieldAccess;
  semantic?: {
    entity: string;
    relationship_type: DirectoryRelationshipType;
    entity_type: DirectoryEntityType;
    operations?: readonly ("search" | "read" | "find" | "list" | "count" | "inspect")[];
    entity_aliases?: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
    search_field_aliases?: Partial<Record<DirectorySearchField, readonly string[]>>;
  };
};

export type DirectoryProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: string;
  implementation_status: DirectoryProviderImplementationStatus;
  business_pack_key: string | null;
  search_terms_key: string;
  capabilities: readonly DirectoryCapabilityManifest[];
};

export const DIRECTORY_BLOCKED_CAPABILITY_KEYS = ["directory.export"] as const;

export type DirectoryBlockedCapabilityKey = (typeof DIRECTORY_BLOCKED_CAPABILITY_KEYS)[number];

export function buildDirectoryCapabilityId(
  providerKey: string,
  capabilityKey: DirectoryCapabilityKey,
  operation: DirectoryCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isDirectoryCapabilityBlocked(capabilityKey: string): boolean {
  return (DIRECTORY_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
