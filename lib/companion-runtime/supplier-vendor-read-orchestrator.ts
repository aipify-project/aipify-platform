import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import { directoryOutcomeKey } from "@/lib/integration-intelligence/directory/outcomes";
import type { DirectorySearchQuery, DirectorySearchResult } from "@/lib/integration-intelligence/directory/types";
import {
  SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY,
  type SupplierDirectoryBundle,
} from "@/lib/integration-intelligence/providers/supplier-vendor-directory/supplier-vendor-directory-contract";
import {
  assertSupplierDirectoryAllowed,
  resolveSupplierDirectoryPermissionScope,
  type SupplierDirectoryPermissionContext,
} from "@/lib/integration-intelligence/providers/supplier-vendor-directory/permissions";
import { executeDirectorySearch, type DirectoryProviderSearchAdapter } from "./directory-search-orchestrator";

export const SUPPLIER_DIRECTORY_SUPPORTED_SEARCH_FIELDS = [
  "company_name",
  "contact_name",
  "name",
  "email",
  "phone",
  "organization_number",
  "supplier_id",
  "external_id",
  "category",
  "product",
  "service",
  "country",
  "status",
  "preferred_supplier",
  "assigned_buyer",
  "contract_status",
  "manufacturer",
  "distributor",
] as const;

export function buildSupplierDirectorySearchAdapter(
  bundle: SupplierDirectoryBundle,
): DirectoryProviderSearchAdapter {
  return {
    provider_key: SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY,
    active: bundle.source_exact,
    supported_fields: [...SUPPLIER_DIRECTORY_SUPPORTED_SEARCH_FIELDS],
    search: async (input: {
      query: DirectorySearchQuery;
      candidates: readonly DirectoryMatchCandidate[];
    }) => {
      const field = input.query.search_field;
      const value = input.query.search_value?.trim().toLowerCase() ?? "";
      if (!field || !value) return bundle.candidates;

      let scopedCandidates = bundle.candidates;
      if (input.query.entity_type) {
        scopedCandidates = scopedCandidates.filter((row) => row.entity_type === input.query.entity_type);
      }

      if (input.query.relationship_type) {
        const filtered = scopedCandidates.filter((row) => {
          if (input.query.relationship_type === "supplier_contact") {
            return row.entity_type === "person" && row.role === "supplier_contact";
          }
          if (input.query.relationship_type === "manufacturer") {
            return row.supplier_subtype === "manufacturer";
          }
          if (input.query.relationship_type === "distributor") {
            return row.supplier_subtype === "distributor";
          }
          if (input.query.relationship_type === "subcontractor") {
            return row.supplier_subtype === "subcontractor";
          }
          if (input.query.relationship_type === "service_provider") {
            return row.supplier_subtype === "service_provider";
          }
          if (input.query.relationship_type === "supplier" || input.query.relationship_type === "vendor") {
            return row.entity_type === "organization" && Boolean(row.supplier_id);
          }
          return true;
        });
        if (filtered.length > 0) scopedCandidates = filtered;
      }

      if (field === "preferred_supplier") {
        const wantsPreferred = ["true", "yes", "1", "preferred", "foretrukket", "godkjent", "approved", "active"].includes(
          value,
        );
        return scopedCandidates.filter((row) => Boolean(row.is_preferred) === wantsPreferred);
      }

      if (field === "country") {
        return scopedCandidates.filter((row) =>
          String(row.country ?? "")
            .toLowerCase()
            .includes(value),
        );
      }

      if (field === "category" || field === "product" || field === "service") {
        return scopedCandidates.filter((row) => {
          const haystack = `${row.category ?? ""} ${row.services ?? ""}`.toLowerCase();
          return haystack.includes(value);
        });
      }

      if (field === "assigned_buyer") {
        return scopedCandidates.filter((row) =>
          String(row.assigned_buyer ?? row.owner_reference ?? "")
            .toLowerCase()
            .includes(value),
        );
      }

      if (field === "contract_status") {
        return scopedCandidates.filter((row) =>
          String(row.contract_status ?? row.status ?? "")
            .toLowerCase()
            .includes(value),
        );
      }

      if (field === "supplier_id" || field === "external_id" || field === "email" || field === "phone") {
        const personScoped = scopedCandidates.filter((row) => row.entity_type === "person");
        if (field === "email" || field === "phone") {
          if (personScoped.length > 0) return personScoped;
        }
        if (field === "supplier_id" || field === "external_id") {
          const orgScoped = scopedCandidates.filter((row) => row.entity_type === "organization");
          if (orgScoped.length > 0) return orgScoped;
        }
      }

      if (field === "contact_name") {
        return scopedCandidates.filter((row) => row.entity_type === "person");
      }

      return scopedCandidates;
    },
  };
}

export async function executeSupplierDirectorySearch(input: {
  query: DirectorySearchQuery;
  permission: SupplierDirectoryPermissionContext;
  user_role: string;
  bundle: SupplierDirectoryBundle;
}) {
  const block = assertSupplierDirectoryAllowed(input.permission);
  if (block) {
    return {
      outcome: block as DirectorySearchResult["outcome"],
      records: [],
      total_count: 0,
      clarification_required: false,
      outcome_key: directoryOutcomeKey(block as DirectorySearchResult["outcome"]),
      providers_queried: [],
      audit_id: null,
      limitations:
        block === "permission_denied"
          ? ["Procurement or supplier entitlement is required to search suppliers."]
          : block === "provider_missing"
            ? ["No live supplier directory provider is connected for this organization."]
            : [],
    };
  }

  const scope = resolveSupplierDirectoryPermissionScope(input.permission);
  const adapter = buildSupplierDirectorySearchAdapter(input.bundle);

  return executeDirectorySearch({
    query: { ...input.query, permission_scope: scope },
    permission: input.permission,
    user_role: input.user_role,
    providers: [adapter],
    candidatesByProvider: {
      [SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY]: input.bundle.candidates,
    },
  });
}

export function buildSupplierDirectoryCommandBriefSignals(input: {
  bundle: SupplierDirectoryBundle;
  source_exact: boolean;
}): Array<{ signal_key: string; count: number | null }> {
  if (!input.source_exact || !input.bundle.source_exact) return [];

  const signals: Array<{ signal_key: string; count: number | null }> = [];

  if (input.bundle.supplier_contract_expiring_count > 0) {
    signals.push({
      signal_key: "supplier_contract_expiring",
      count: input.bundle.supplier_contract_expiring_count,
    });
  }
  if (input.bundle.supplier_contract_expired_count > 0) {
    signals.push({
      signal_key: "supplier_contract_expired",
      count: input.bundle.supplier_contract_expired_count,
    });
  }
  if (input.bundle.supplier_delivery_delay_count > 0) {
    signals.push({
      signal_key: "supplier_delivery_delay",
      count: input.bundle.supplier_delivery_delay_count,
    });
  }
  if (input.bundle.supplier_performance_warning_count > 0) {
    signals.push({
      signal_key: "supplier_performance_warning",
      count: input.bundle.supplier_performance_warning_count,
    });
  }
  if (input.bundle.supplier_risk_attention_count > 0) {
    signals.push({
      signal_key: "supplier_risk_attention",
      count: input.bundle.supplier_risk_attention_count,
    });
  }
  if (input.bundle.supplier_contact_missing_count > 0) {
    signals.push({
      signal_key: "supplier_contact_missing",
      count: input.bundle.supplier_contact_missing_count,
    });
  }
  if (input.bundle.supplier_without_category_count > 0) {
    signals.push({
      signal_key: "supplier_without_category",
      count: input.bundle.supplier_without_category_count,
    });
  }
  if (input.bundle.duplicate_supplier_candidate_count > 0) {
    signals.push({
      signal_key: "duplicate_supplier_candidate",
      count: input.bundle.duplicate_supplier_candidate_count,
    });
  }
  if (input.bundle.preferred_supplier_unavailable_count > 0) {
    signals.push({
      signal_key: "preferred_supplier_unavailable",
      count: input.bundle.preferred_supplier_unavailable_count,
    });
  }
  if (input.bundle.purchase_order_attention_count > 0) {
    signals.push({
      signal_key: "purchase_order_attention",
      count: input.bundle.purchase_order_attention_count,
    });
  }

  return signals;
}

export function countSupplierCandidates(
  bundle: SupplierDirectoryBundle,
  filter?: { relationship_type?: string; status?: string },
): number {
  return bundle.candidates.filter((row) => {
    if (filter?.relationship_type === "supplier_contact" && row.role !== "supplier_contact") return false;
    if (filter?.relationship_type === "manufacturer" && row.supplier_subtype !== "manufacturer") return false;
    if (filter?.relationship_type === "distributor" && row.supplier_subtype !== "distributor") return false;
    if (filter?.status && String(row.status ?? "").toLowerCase() !== filter.status.toLowerCase()) {
      return false;
    }
    return true;
  }).length;
}
