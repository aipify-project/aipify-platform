import { isCommunityMemberDirectoryReadSourceConnected } from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-source-map";
import {
  mapCommunityMemberDirectoryCenterPayload,
  COMMUNITY_MEMBER_DIRECTORY_READ_RPC,
} from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-read-provider-adapter";
import {
  buildCommunityMemberDirectoryPermissionContext,
} from "@/lib/integration-intelligence/providers/community-member-directory/permissions";
import type { DirectorySearchQuery } from "@/lib/integration-intelligence/directory/types";
import {
  buildCommunityMemberDirectoryCommandBriefSignals,
  executeCommunityMemberDirectorySearch,
} from "./community-member-directory-read-orchestrator";
import { createCommunityMemberDirectoryReadProviderBridge } from "./community-member-directory-read-provider-bridge";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  createP1IsolationSession,
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import { P1_09_AUTHORITATIVE_DIRECTORY_SOURCE } from "./p1-09-live-app-community-member-directory-e2e-types";
import type {
  P1_09LiveE2eCertificationFlowResult,
  P1_09LiveE2eTenantIsolationResult,
} from "./p1-09-live-app-community-member-directory-e2e-types";

const UNKNOWN_MEMBER_QUERY = "zzzzz-p1-09-no-member-match-token";
const writeSource = "source_exact" as const;

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_09LiveE2eCertificationFlowResult["source_classification"],
  status: P1_09LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_09LiveE2eCertificationFlowResult {
  return {
    flow_id,
    capability,
    source_classification,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function isolationResult(
  check_id: string,
  status: P1_09LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_09LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function ownerPermission(
  session: P1LiveE2eAuthenticatedSession,
  providerActive: boolean,
  overrides: Partial<ReturnType<typeof buildCommunityMemberDirectoryPermissionContext>> = {},
) {
  return buildCommunityMemberDirectoryPermissionContext({
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: providerActive,
    can_view_community: true,
    ...overrides,
  });
}

function buildMemberQuery(
  session: P1LiveE2eAuthenticatedSession,
  input: {
    search_field: NonNullable<DirectorySearchQuery["search_field"]>;
    search_value: string;
  },
): DirectorySearchQuery {
  return {
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    entity_type: "person",
    relationship_type: "member",
    search_field: input.search_field,
    search_value: input.search_value,
    filters: {},
    requested_fields: [input.search_field],
    requested_detail_level: "summary",
    permission_scope: "basic",
    capability_candidates: ["member.search"],
    locale: "en",
  };
}

export async function runP1_09LiveAppCommunityMemberDirectoryE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_09LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_09LiveE2eTenantIsolationResult[];
  liveMemberCount: number;
  rpcPayload: unknown;
}> {
  const flows: P1_09LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_09LiveE2eTenantIsolationResult[] = [];

  const orgId = input.session.organizationId!;
  const tenantId = input.session.tenantId ?? orgId;
  const bridge = createCommunityMemberDirectoryReadProviderBridge(input.session.supabase);

  const searchConnected = isCommunityMemberDirectoryReadSourceConnected("member.search");
  flows.push(
    flowResult(
      "provider_connected",
      "member.provider.connected",
      searchConnected ? writeSource : "source_unknown",
      searchConnected ? "pass" : "fail",
      searchConnected ? null : "Community member directory authoritative source must be marked live.",
    ),
  );

  const { data: rpcPayload, error: rpcError } = await input.session.supabase.rpc(
    P1_09_AUTHORITATIVE_DIRECTORY_SOURCE,
    { p_search_term: null, p_search_field: "name" },
  );
  if (rpcError) {
    throw new Error(redactSecretsFromMessage(rpcError.message));
  }

  const countBundle = mapCommunityMemberDirectoryCenterPayload(rpcPayload);
  const record =
    rpcPayload && typeof rpcPayload === "object" ? (rpcPayload as Record<string, unknown>) : null;
  const hasDirectory = record?.found === true;
  const liveMemberCount = countBundle.total_member_count;

  flows.push(
    flowResult(
      "live_directory_source_available",
      "member.search.live",
      countBundle.source_exact ? writeSource : "source_partial",
      hasDirectory && countBundle.source_exact ? "pass" : "fail",
      hasDirectory && countBundle.source_exact
        ? null
        : "Authoritative member directory block missing from get_customer_member_directory_center.",
    ),
  );

  flows.push(
    flowResult(
      "exact_member_count",
      "member.search.count",
      countBundle.source_exact ? writeSource : "source_partial",
      liveMemberCount >= 3 ? "pass" : "fail",
      liveMemberCount >= 3
        ? null
        : "Exact member count must reflect eligible members only (admin/system/test excluded).",
    ),
  );

  const nameSearchBundle = await bridge.fetchDirectory({ search_term: "Jane", search_field: "name" });
  flows.push(
    flowResult(
      "search_by_name",
      "member.search.live",
      nameSearchBundle.source_exact ? writeSource : "source_partial",
      nameSearchBundle.match_count >= 1 ? "pass" : "fail",
      nameSearchBundle.match_count >= 1 ? null : "Name search must return at least one member.",
    ),
  );

  const sampleMember = nameSearchBundle.members[0];
  if (sampleMember) {
    flows.push(
      flowResult(
        "membership_status_present",
        "member.search.status",
        writeSource,
        Boolean(sampleMember.membership_status) ? "pass" : "fail",
        Boolean(sampleMember.membership_status) ? null : "Membership status must be present.",
      ),
    );
    flows.push(
      flowResult(
        "membership_level_present",
        "member.search.level",
        writeSource,
        Boolean(sampleMember.membership_level) ? "pass" : "fail",
        Boolean(sampleMember.membership_level) ? null : "Membership level must be present.",
      ),
    );
    flows.push(
      flowResult(
        "verification_status_present",
        "member.search.verification",
        writeSource,
        Boolean(sampleMember.verification_status) ? "pass" : "fail",
        Boolean(sampleMember.verification_status) ? null : "Verification status must be present.",
      ),
    );
    flows.push(
      flowResult(
        "profile_reference_present",
        "member.search.profile",
        writeSource,
        sampleMember.profile_reference.startsWith("profile_ref_") ? "pass" : "fail",
        sampleMember.profile_reference.startsWith("profile_ref_")
          ? null
          : "Profile reference must be masked metadata only.",
      ),
    );
  } else {
    for (const [flowId, capability] of [
      ["membership_status_present", "member.search.status"],
      ["membership_level_present", "member.search.level"],
      ["verification_status_present", "member.search.verification"],
      ["profile_reference_present", "member.search.profile"],
    ] as const) {
      flows.push(flowResult(flowId, capability, writeSource, "fail", "Expected sample member for field checks."));
    }
  }

  const usernameBundle = await bridge.fetchDirectory({
    search_term: sampleMember?.username ?? "jane_community",
    search_field: "username",
  });
  flows.push(
    flowResult(
      "search_by_username",
      "member.search.live",
      usernameBundle.source_exact ? writeSource : "source_partial",
      usernameBundle.match_count >= 1 ? "pass" : "fail",
      usernameBundle.match_count >= 1 ? null : "Username search must resolve member.",
    ),
  );

  const noAdminPass = nameSearchBundle.members.every(
    (member) =>
      !member.username.includes("admin") &&
      !member.display_name.toLowerCase().includes("system admin") &&
      !member.display_name.toLowerCase().includes("demo member"),
  );
  flows.push(
    flowResult(
      "exclude_admin_system_users",
      "member.search.no_admin",
      writeSource,
      noAdminPass ? "pass" : "fail",
      noAdminPass ? null : "Admin/system/test/demo users must not appear in member search results.",
    ),
  );

  const maskedPass = nameSearchBundle.members.every((member) => {
    const serialized = JSON.stringify(member);
    return (
      !serialized.includes("email_raw") &&
      !serialized.includes("phone_raw") &&
      (!member.email_masked || member.email_masked.includes("*")) &&
      (!member.phone_masked || member.phone_masked.includes("*"))
    );
  });
  flows.push(
    flowResult(
      "masked_contact_fields",
      "member.search.masked_contact",
      writeSource,
      maskedPass ? "pass" : "fail",
      maskedPass ? null : "Email and phone must remain masked in directory results.",
    ),
  );

  const unknownBundle = await bridge.fetchDirectory({
    search_term: UNKNOWN_MEMBER_QUERY,
    search_field: "name",
  });
  const unknownSearch = await executeCommunityMemberDirectorySearch({
    query: buildMemberQuery(input.session, {
      search_field: "name",
      search_value: UNKNOWN_MEMBER_QUERY,
    }),
    permission: ownerPermission(input.session, unknownBundle.source_exact),
    user_role: input.session.userRole,
    bundle: unknownBundle,
  });
  flows.push(
    flowResult(
      "unknown_member_no_match",
      "member.search.no_match",
      unknownBundle.source_exact ? writeSource : "source_partial",
      unknownBundle.match_count === 0 && unknownSearch.outcome === "no_match" && unknownSearch.total_count === 0
        ? "pass"
        : "fail",
      unknownBundle.match_count === 0 && unknownSearch.outcome === "no_match"
        ? null
        : "Unknown member must return no_match with zero records.",
    ),
  );

  const proxyPartial = {
    source_exact: false,
    source_reference: "rpc:get_customer_community_network_center:best_practices",
    members: [],
    candidates: [],
    total_member_count: 1,
    match_count: 0,
    search_field: null,
    search_term: null,
    freshness: "stale" as const,
    completeness: "partial" as const,
    limitations: ["community_proxy"],
  };
  const noProxyPass =
    countBundle.source_exact &&
    countBundle.source_reference === COMMUNITY_MEMBER_DIRECTORY_READ_RPC &&
    proxyPartial.source_reference.includes("community_network_center");
  flows.push(
    flowResult(
      "no_proxy_as_exact",
      "member.search.no_proxy",
      countBundle.source_exact ? writeSource : "source_partial",
      noProxyPass ? "pass" : "fail",
      noProxyPass ? null : "Community member directory must not use community network proxy as exact source.",
    ),
  );

  const briefPartial = buildCommunityMemberDirectoryCommandBriefSignals({
    bundle: proxyPartial,
    source_exact: false,
  });
  const briefExact = buildCommunityMemberDirectoryCommandBriefSignals({
    bundle: countBundle,
    source_exact: countBundle.source_exact,
  });
  const expectedExactSignals = countBundle.source_exact && liveMemberCount > 0 ? 1 : 0;
  flows.push(
    flowResult(
      "command_brief_member_signals_exact_only",
      "member.command_brief.exact_only",
      countBundle.source_exact ? writeSource : "source_partial",
      briefPartial.length === 0 && briefExact.length === expectedExactSignals ? "pass" : "fail",
      briefPartial.length === 0 && briefExact.length === expectedExactSignals
        ? null
        : "Member directory Command Brief signals require source_exact — proxy counts excluded.",
    ),
  );

  const permission = ownerPermission(input.session, countBundle.source_exact);
  const nameSearch = await executeCommunityMemberDirectorySearch({
    query: buildMemberQuery(input.session, {
      search_field: "name",
      search_value: sampleMember?.display_name?.split(" ")[0] ?? "Jane",
    }),
    permission,
    user_role: input.session.userRole,
    bundle: nameSearchBundle,
  });
  flows.push(
    flowResult(
      "orchestrator_member_search",
      "member.search.live",
      countBundle.source_exact ? writeSource : "source_partial",
      ["exact_match", "multiple_matches"].includes(nameSearch.outcome) ? "pass" : "fail",
      ["exact_match", "multiple_matches"].includes(nameSearch.outcome)
        ? null
        : `Member directory orchestrator search failed: ${nameSearch.outcome}.`,
    ),
  );

  const deniedSearch = await executeCommunityMemberDirectorySearch({
    query: buildMemberQuery(input.session, { search_field: "name", search_value: "Jane" }),
    permission: ownerPermission(input.session, true, { can_view_community: false }),
    user_role: input.session.userRole,
    bundle: nameSearchBundle,
  });
  flows.push(
    flowResult(
      "permission_denied_search",
      "member.search.access",
      writeSource,
      deniedSearch.outcome === "permission_denied" ? "pass" : "fail",
      deniedSearch.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${deniedSearch.outcome}.`,
    ),
  );

  const suspendedSearch = await executeCommunityMemberDirectorySearch({
    query: buildMemberQuery(input.session, { search_field: "name", search_value: "Jane" }),
    permission: ownerPermission(input.session, true, { app_suspended: true }),
    user_role: input.session.userRole,
    bundle: nameSearchBundle,
  });
  flows.push(
    flowResult(
      "suspended_app_denied",
      "member.search.access",
      writeSource,
      suspendedSearch.outcome === "activation_pending" ? "pass" : "fail",
      suspendedSearch.outcome === "activation_pending"
        ? null
        : `Expected activation_pending, received ${suspendedSearch.outcome}.`,
    ),
  );

  const crossTenantSearch = await executeCommunityMemberDirectorySearch({
    query: {
      ...buildMemberQuery(input.session, { search_field: "name", search_value: "Jane" }),
      organization_id: "00000000-0000-4000-8000-000000000001",
      tenant_id: "00000000-0000-4000-8000-000000000001",
    },
    permission: ownerPermission(input.session, true),
    user_role: input.session.userRole,
    bundle: nameSearchBundle,
  });
  tenantIsolation.push(
    isolationResult(
      "manipulated_organization_id_rejected",
      crossTenantSearch.outcome === "permission_denied" ? "pass" : "fail",
      crossTenantSearch.outcome === "permission_denied"
        ? null
        : `Cross-tenant search must be rejected, received ${crossTenantSearch.outcome}.`,
    ),
  );

  const inactiveSearch = await executeCommunityMemberDirectorySearch({
    query: buildMemberQuery(input.session, { search_field: "name", search_value: "Jane" }),
    permission: ownerPermission(input.session, false),
    user_role: input.session.userRole,
    bundle: { ...nameSearchBundle, source_exact: false },
  });
  tenantIsolation.push(
    isolationResult(
      "inactive_provider_rejected",
      inactiveSearch.outcome === "provider_missing" ? "pass" : "fail",
      inactiveSearch.outcome === "provider_missing"
        ? null
        : `Inactive provider must return provider_missing, received ${inactiveSearch.outcome}.`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "suspended_app_no_read",
      suspendedSearch.outcome === "activation_pending" ? "pass" : "fail",
      suspendedSearch.outcome === "activation_pending"
        ? null
        : `Suspended APP must block member directory reads.`,
    ),
  );

  const isolationSession = await createP1IsolationSession(input.config);
  if (isolationSession && isolationSession.organizationId !== input.session.organizationId) {
    const foreignRpc = await isolationSession.supabase.rpc(P1_09_AUTHORITATIVE_DIRECTORY_SOURCE, {
      p_search_term: "Jane",
      p_search_field: "name",
    });
    const foreignBundle = mapCommunityMemberDirectoryCenterPayload(foreignRpc.data);
    const primaryLookup = await bridge.fetchDirectory({ search_term: "Jane", search_field: "name" });
    const foreignMemberId = foreignBundle.members[0]?.member_id ?? null;
    if (foreignMemberId) {
      tenantIsolation.push(
        isolationResult(
          "foreign_member_not_visible_in_primary_tenant",
          !primaryLookup.members.some((entry) => entry.member_id === foreignMemberId) ? "pass" : "fail",
          !primaryLookup.members.some((entry) => entry.member_id === foreignMemberId)
            ? null
            : "Foreign tenant member must not appear in primary tenant read.",
        ),
      );
    }
  }

  flows.push(
    flowResult(
      "tenant_isolation_checks",
      "member.search.isolation",
      writeSource,
      tenantIsolation.every((check) => check.status === "pass" || check.status === "skipped") ? "pass" : "fail",
      tenantIsolation.every((check) => check.status === "pass" || check.status === "skipped")
        ? null
        : "Tenant isolation checks failed.",
    ),
  );

  return { flows, tenantIsolation, liveMemberCount, rpcPayload };
}

export function collectP1_09CapabilityOutcomes(input: {
  flows: readonly P1_09LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_09LiveE2eTenantIsolationResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  for (const check of input.tenantIsolation) {
    if (check.status === "pass") passed.add("member.search.isolation");
    if (check.status === "fail") failed.add("member.search.isolation");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
