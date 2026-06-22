import {
  classifyDirectoryMatches,
  matchDirectoryRecord,
  type DirectoryMatchBaseRecord,
  type DirectoryMatchCandidate,
  type DirectoryMatchResult,
} from "@/lib/integration-intelligence/directory/matching";
import {
  assertCrossTenantDirectorySearch,
  assertDirectorySearchAllowed,
  isDirectorySearchFieldAllowed,
  type DirectoryPermissionContext,
} from "@/lib/integration-intelligence/directory/permissions";
import { filterDirectoryRecordsForScope } from "@/lib/integration-intelligence/directory/masking";
import { directoryOutcomeKey } from "@/lib/integration-intelligence/directory/outcomes";
import type {
  DirectorySearchQuery,
  DirectorySearchResult,
} from "@/lib/integration-intelligence/directory/types";
import { createDirectorySearchAuditEvent } from "./directory-audit";
import { dedupeDirectoryRecords } from "./directory-dedupe";

export type DirectoryProviderSearchAdapter = {
  provider_key: string;
  active: boolean;
  supported_fields: readonly NonNullable<DirectorySearchQuery["search_field"]>[];
  search: (input: {
    query: DirectorySearchQuery;
    candidates: readonly DirectoryMatchCandidate[];
  }) => Promise<readonly DirectoryMatchCandidate[]>;
};

function emptyResult(
  outcome: DirectorySearchResult["outcome"],
  limitations: readonly string[] = [],
): DirectorySearchResult {
  return {
    outcome,
    records: [],
    total_count: 0,
    clarification_required: outcome === "multiple_matches" || outcome === "ambiguous_query",
    outcome_key: directoryOutcomeKey(outcome),
    providers_queried: [],
    audit_id: null,
    limitations,
  };
}

export async function executeDirectorySearch(input: {
  query: DirectorySearchQuery;
  permission: DirectoryPermissionContext;
  user_role: string;
  providers: readonly DirectoryProviderSearchAdapter[];
  candidatesByProvider?: Record<string, readonly DirectoryMatchCandidate[]>;
}): Promise<DirectorySearchResult> {
  if (
    !assertCrossTenantDirectorySearch({
      queryOrganizationId: input.query.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyResult("permission_denied", ["Cross-tenant directory search is forbidden."]);
  }

  const permissionBlock = assertDirectorySearchAllowed(input.permission);
  if (permissionBlock) {
    return emptyResult(permissionBlock as DirectorySearchResult["outcome"]);
  }

  if (!input.query.search_field || !input.query.search_value) {
    return emptyResult("ambiguous_query");
  }

  if (!isDirectorySearchFieldAllowed(input.query.search_field, input.query.permission_scope)) {
    return emptyResult("unsupported_search_field");
  }

  const activeProviders = input.providers.filter((provider) => provider.active);
  if (activeProviders.length === 0) {
    return emptyResult("provider_missing");
  }

  const unsupportedProvider = activeProviders.every(
    (provider) => !provider.supported_fields.includes(input.query.search_field!),
  );
  if (unsupportedProvider) {
    return emptyResult("unsupported_search_field");
  }

  const allMatches: DirectoryMatchResult[] = [];
  const providersQueried: string[] = [];

  for (const provider of activeProviders) {
    if (!input.query.search_field || !provider.supported_fields.includes(input.query.search_field)) {
      continue;
    }
    providersQueried.push(provider.provider_key);
    const candidates = input.candidatesByProvider?.[provider.provider_key] ?? [];
    const providerCandidates = await provider.search({ query: input.query, candidates });
    for (const candidate of providerCandidates) {
      const baseRecord: DirectoryMatchBaseRecord = {
        entity_id: candidate.entity_id,
        entity_type: candidate.entity_type,
        display_name: candidate.display_name,
        company_name: candidate.company_name,
        role: null,
        status: null,
        email_masked: candidate.email_masked ?? null,
        phone_masked: candidate.phone_masked ?? null,
        organization_number: candidate.organization_number ?? null,
        relationship_type: input.query.relationship_type ?? "contact",
        source_provider: provider.provider_key,
        source_reference: `${provider.provider_key}:search`,
        organization_id: input.query.organization_id,
        freshness: "fresh",
        completeness: "partial",
        permission_scope: input.query.permission_scope,
      };
      const matched = matchDirectoryRecord({
        field: input.query.search_field,
        queryValue: input.query.search_value,
        candidate,
        baseRecord,
      });
      if (matched) allMatches.push(matched);
    }
  }

  const classification = classifyDirectoryMatches(allMatches);
  const deduped = dedupeDirectoryRecords(allMatches.map((match) => match.record));
  const masked = filterDirectoryRecordsForScope(deduped, input.query.permission_scope);

  const result: DirectorySearchResult = {
    outcome: classification.outcome,
    records: masked.slice(0, classification.clarification_required ? 5 : 1),
    total_count: masked.length,
    clarification_required: classification.clarification_required,
    outcome_key: directoryOutcomeKey(classification.outcome),
    providers_queried: providersQueried,
    audit_id: null,
    limitations:
      classification.outcome === "ambiguous_query"
        ? ["Fuzzy identity match requires clarification before presenting a certain match."]
        : [],
  };

  const audit = createDirectorySearchAuditEvent({
    query: input.query,
    user_role: input.user_role,
    outcome: result,
    provider_keys: providersQueried,
  });
  return { ...result, audit_id: audit.audit_id };
}
