import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import { directoryOutcomeKey } from "@/lib/integration-intelligence/directory/outcomes";
import type { DirectorySearchQuery, DirectorySearchResult } from "@/lib/integration-intelligence/directory/types";
import {
  CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY,
  type CrmDirectoryBundle,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/crm-customer-directory-contract";
import {
  assertCrmDirectoryAllowed,
  resolveCrmDirectoryPermissionScope,
  type CrmDirectoryPermissionContext,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/permissions";
import { executeDirectorySearch, type DirectoryProviderSearchAdapter } from "./directory-search-orchestrator";

export const CRM_DIRECTORY_SUPPORTED_SEARCH_FIELDS = [
  "name",
  "company_name",
  "email",
  "phone",
  "organization_number",
  "external_id",
  "customer_id",
  "lead_id",
  "role",
  "status",
  "pipeline_stage",
  "owner",
  "lead_source",
  "location",
] as const;

export function buildCrmDirectorySearchAdapter(bundle: CrmDirectoryBundle): DirectoryProviderSearchAdapter {
  return {
    provider_key: CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY,
    active: bundle.source_exact,
    supported_fields: [...CRM_DIRECTORY_SUPPORTED_SEARCH_FIELDS],
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
          if (input.query.relationship_type === "lead") return Boolean(row.lead_id);
          if (input.query.relationship_type === "prospect") return row.status === "prospect";
          if (input.query.relationship_type === "contact") return row.role && row.customer_id && !row.lead_id;
          if (input.query.relationship_type === "customer") {
            return Boolean(row.customer_id) && !row.lead_id && row.entity_id === row.customer_id;
          }
          return true;
        });
        if (filtered.length > 0) scopedCandidates = filtered;
      }

      if (field === "owner") {
        return scopedCandidates.filter((row) =>
          String(row.owner_reference ?? row.role ?? "")
            .toLowerCase()
            .includes(value),
        );
      }
      if (field === "lead_source") {
        return scopedCandidates.filter((row) =>
          String(row.lead_source ?? "")
            .toLowerCase()
            .includes(value),
        );
      }
      if (field === "pipeline_stage") {
        return scopedCandidates.filter((row) =>
          String(row.pipeline_stage ?? row.status ?? "")
            .toLowerCase()
            .includes(value),
        );
      }

      if (field === "customer_id" || field === "external_id" || field === "email" || field === "phone") {
        const personScoped = scopedCandidates.filter((row) => row.entity_type === "person");
        if (personScoped.length > 0) return personScoped;
      }

      return scopedCandidates;
    },
  };
}

export async function executeCrmDirectorySearch(input: {
  query: DirectorySearchQuery;
  permission: CrmDirectoryPermissionContext;
  user_role: string;
  bundle: CrmDirectoryBundle;
}) {
  const block = assertCrmDirectoryAllowed(input.permission);
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
          ? ["CRM or Sales entitlement is required to search customers and leads."]
          : block === "provider_missing"
            ? ["No live CRM directory provider is connected for this organization."]
            : [],
    };
  }

  const scope = resolveCrmDirectoryPermissionScope(input.permission);
  const adapter = buildCrmDirectorySearchAdapter(input.bundle);

  return executeDirectorySearch({
    query: { ...input.query, permission_scope: scope },
    permission: input.permission,
    user_role: input.user_role,
    providers: [adapter],
    candidatesByProvider: {
      [CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY]: input.bundle.candidates,
    },
  });
}

export function buildCrmDirectoryCommandBriefSignals(input: {
  bundle: CrmDirectoryBundle;
  source_exact: boolean;
}): Array<{ signal_key: string; count: number | null }> {
  if (!input.source_exact || !input.bundle.source_exact) return [];

  const signals: Array<{ signal_key: string; count: number | null }> = [];

  if (input.bundle.new_lead_count > 0) {
    signals.push({ signal_key: "new_lead", count: input.bundle.new_lead_count });
  }
  if (input.bundle.lead_without_follow_up_count > 0) {
    signals.push({
      signal_key: "lead_without_follow_up",
      count: input.bundle.lead_without_follow_up_count,
    });
  }
  if (input.bundle.customer_health_warning_count > 0) {
    signals.push({
      signal_key: "customer_health_warning",
      count: input.bundle.customer_health_warning_count,
    });
  }
  if (input.bundle.churn_risk_count > 0) {
    signals.push({ signal_key: "churn_risk", count: input.bundle.churn_risk_count });
  }
  if (input.bundle.unassigned_customer_count > 0) {
    signals.push({
      signal_key: "unassigned_customer",
      count: input.bundle.unassigned_customer_count,
    });
  }
  if (input.bundle.duplicate_customer_candidate_count > 0) {
    signals.push({
      signal_key: "duplicate_customer_candidate",
      count: input.bundle.duplicate_customer_candidate_count,
    });
  }

  return signals;
}

export function countCrmCandidates(
  bundle: CrmDirectoryBundle,
  filter?: { relationship_type?: string; status?: string },
): number {
  return bundle.candidates.filter((row) => {
    if (filter?.relationship_type === "lead" && !row.lead_id) return false;
    if (filter?.relationship_type === "customer" && (!row.customer_id || row.lead_id)) return false;
    if (filter?.status && String(row.status ?? "").toLowerCase() !== filter.status.toLowerCase()) {
      return false;
    }
    return true;
  }).length;
}
