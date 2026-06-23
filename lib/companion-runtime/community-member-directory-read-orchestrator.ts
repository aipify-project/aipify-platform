import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import { directoryOutcomeKey } from "@/lib/integration-intelligence/directory/outcomes";
import type { DirectorySearchQuery, DirectorySearchResult } from "@/lib/integration-intelligence/directory/types";
import {
  COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY,
} from "@/lib/integration-intelligence/directory/community-member-directory-contract";
import type { CommunityMemberDirectoryReadBundle } from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-read-provider-adapter";
import {
  assertCommunityMemberDirectoryAllowed,
  resolveCommunityMemberDirectoryPermissionScope,
  type CommunityMemberDirectoryPermissionContext,
} from "@/lib/integration-intelligence/providers/community-member-directory/permissions";
import { executeDirectorySearch, type DirectoryProviderSearchAdapter } from "./directory-search-orchestrator";

export const COMMUNITY_MEMBER_DIRECTORY_SUPPORTED_SEARCH_FIELDS = [
  "name",
  "external_id",
  "status",
] as const;

export function buildCommunityMemberDirectorySearchAdapter(
  bundle: CommunityMemberDirectoryReadBundle,
): DirectoryProviderSearchAdapter {
  return {
    provider_key: COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY,
    active: bundle.source_exact,
    supported_fields: [...COMMUNITY_MEMBER_DIRECTORY_SUPPORTED_SEARCH_FIELDS],
    search: async (input: {
      query: DirectorySearchQuery;
      candidates: readonly DirectoryMatchCandidate[];
    }) => {
      const field = input.query.search_field;
      const value = input.query.search_value?.trim().toLowerCase() ?? "";
      if (!field || !value) return bundle.candidates;

      if (field === "name") {
        return bundle.candidates.filter((row) =>
          String(row.display_name ?? "")
            .toLowerCase()
            .includes(value),
        );
      }
      if (field === "external_id") {
        return bundle.candidates.filter(
          (row) =>
            String(row.external_id ?? "")
              .toLowerCase()
              .includes(value) ||
            String(row.entity_id ?? "")
              .toLowerCase()
              .includes(value),
        );
      }
      if (field === "status") {
        return bundle.candidates.filter((row) =>
          String(row.status ?? "")
            .toLowerCase()
            .includes(value),
        );
      }
      return bundle.candidates;
    },
  };
}

export async function executeCommunityMemberDirectorySearch(input: {
  query: DirectorySearchQuery;
  permission: CommunityMemberDirectoryPermissionContext;
  user_role: string;
  bundle: CommunityMemberDirectoryReadBundle;
}): Promise<DirectorySearchResult> {
  const block = assertCommunityMemberDirectoryAllowed(input.permission);
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
          ? ["Community view permission is required to search members."]
          : block === "provider_missing"
            ? ["No live community member directory provider is connected for this organization."]
            : [],
    };
  }

  const scope = resolveCommunityMemberDirectoryPermissionScope(input.permission);
  const adapter = buildCommunityMemberDirectorySearchAdapter(input.bundle);

  return executeDirectorySearch({
    query: { ...input.query, permission_scope: scope },
    permission: input.permission,
    user_role: input.user_role,
    providers: [adapter],
    candidatesByProvider: {
      [COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY]: input.bundle.candidates,
    },
  });
}

export function buildCommunityMemberDirectoryCommandBriefSignals(input: {
  bundle: CommunityMemberDirectoryReadBundle;
  source_exact: boolean;
}): Array<{ signal_key: string; count: number | null }> {
  if (!input.source_exact || !input.bundle.source_exact) return [];

  const signals: Array<{ signal_key: string; count: number | null }> = [];
  if (input.bundle.total_member_count > 0) {
    signals.push({ signal_key: "new_members", count: input.bundle.total_member_count });
  }
  return signals;
}
