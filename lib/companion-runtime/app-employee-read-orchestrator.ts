import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import { directoryOutcomeKey } from "@/lib/integration-intelligence/directory/outcomes";
import type { DirectorySearchQuery, DirectorySearchResult } from "@/lib/integration-intelligence/directory/types";
import {
  APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY,
  type AppEmployeeDirectoryBundle,
} from "@/lib/integration-intelligence/providers/app-employee-directory/app-employee-directory-contract";
import {
  assertAppEmployeeDirectoryAllowed,
  resolveAppEmployeePermissionScope,
  type AppEmployeePermissionContext,
} from "@/lib/integration-intelligence/providers/app-employee-directory/permissions";
import { executeDirectorySearch, type DirectoryProviderSearchAdapter } from "./directory-search-orchestrator";

export const APP_EMPLOYEE_SUPPORTED_SEARCH_FIELDS = [
  "name",
  "email",
  "phone",
  "role",
  "department",
  "team",
  "status",
  "external_id",
] as const;

export function buildAppEmployeeDirectorySearchAdapter(
  bundle: AppEmployeeDirectoryBundle,
): DirectoryProviderSearchAdapter {
  return {
    provider_key: APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY,
    active: bundle.source_exact,
    supported_fields: [...APP_EMPLOYEE_SUPPORTED_SEARCH_FIELDS],
    search: async (input: {
      query: DirectorySearchQuery;
      candidates: readonly DirectoryMatchCandidate[];
    }) => {
      const field = input.query.search_field;
      const value = input.query.search_value?.trim().toLowerCase() ?? "";
      if (!field || !value) return bundle.candidates;

      if (field === "status" && input.query.filters.status) {
        return bundle.candidates.filter(
          (row) => String(row.status ?? "").toLowerCase() === input.query.filters.status?.toLowerCase(),
        );
      }

      if (field === "role") {
        return bundle.candidates.filter((row) =>
          String(row.role ?? "").toLowerCase().includes(value),
        );
      }
      if (field === "department") {
        return bundle.candidates.filter((row) =>
          String(row.department ?? "").toLowerCase().includes(value),
        );
      }
      if (field === "team") {
        return bundle.candidates.filter((row) =>
          String(row.team ?? "").toLowerCase().includes(value),
        );
      }

      return input.candidates.length > 0 ? input.candidates : bundle.candidates;
    },
  };
}

export async function executeAppEmployeeDirectorySearch(input: {
  query: DirectorySearchQuery;
  permission: AppEmployeePermissionContext;
  user_role: string;
  bundle: AppEmployeeDirectoryBundle;
}) {
  const block = assertAppEmployeeDirectoryAllowed(input.permission);
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
          ? ["Organization membership or employee view permission is required."]
          : [],
    };
  }

  const scope = resolveAppEmployeePermissionScope(input.permission);
  const adapter = buildAppEmployeeDirectorySearchAdapter(input.bundle);

  return executeDirectorySearch({
    query: { ...input.query, permission_scope: scope },
    permission: input.permission,
    user_role: input.user_role,
    providers: [adapter],
    candidatesByProvider: {
      [APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY]: input.bundle.candidates,
    },
  });
}

export function buildAppEmployeeCommandBriefSignals(input: {
  bundle: AppEmployeeDirectoryBundle;
  source_exact: boolean;
}): Array<{ signal_key: string; count: number | null }> {
  if (!input.source_exact || !input.bundle.source_exact) return [];

  const signals: Array<{ signal_key: string; count: number | null }> = [];

  if (input.bundle.new_employee_count > 0) {
    signals.push({ signal_key: "new_employee", count: input.bundle.new_employee_count });
  }
  if (input.bundle.pending_invitation_count > 0) {
    signals.push({
      signal_key: "pending_employee_invitation",
      count: input.bundle.pending_invitation_count,
    });
  }
  if (input.bundle.inactive_count > 0) {
    signals.push({ signal_key: "inactive_employee", count: input.bundle.inactive_count });
  }
  if (input.bundle.access_review_required_count > 0) {
    signals.push({
      signal_key: "access_review_required",
      count: input.bundle.access_review_required_count,
    });
  }
  if (input.bundle.missing_team_assignment_count > 0) {
    signals.push({
      signal_key: "missing_team_assignment",
      count: input.bundle.missing_team_assignment_count,
    });
  }
  if (input.bundle.recent_role_change_count > 0) {
    signals.push({
      signal_key: "employee_role_change",
      count: input.bundle.recent_role_change_count,
    });
  }

  return signals;
}

export function countAppEmployeeCandidates(
  bundle: AppEmployeeDirectoryBundle,
  filter?: { status?: string; role?: string },
): number {
  return bundle.candidates.filter((row) => {
    if (filter?.status && String(row.status ?? "").toLowerCase() !== filter.status.toLowerCase()) {
      return false;
    }
    if (filter?.role && !String(row.role ?? "").toLowerCase().includes(filter.role.toLowerCase())) {
      return false;
    }
    return true;
  }).length;
}
