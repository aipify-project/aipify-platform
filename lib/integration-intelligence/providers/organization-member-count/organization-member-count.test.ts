import assert from "node:assert/strict";
import {
  clearOrganizationMemberCountProvidersForTests,
  registerOrganizationMemberCountProvider,
} from "./registry";
import { resolveOrganizationMemberCount, resolveMemberCountGapReason } from "./resolve";
import {
  isPresentableMemberCountResult,
  ORGANIZATION_MEMBER_COUNT_CAPABILITY,
  type OrganizationMemberCountResult,
} from "./types";

function fixtureResult(input: Partial<OrganizationMemberCountResult>): OrganizationMemberCountResult {
  return {
    capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
    provider_key: input.provider_key ?? "fixture",
    readiness: input.readiness ?? "ready",
    data_classification: input.data_classification ?? "live",
    source_verified: input.source_verified ?? true,
    freshness: input.freshness ?? "fresh",
    source_reference: input.source_reference ?? "fixture:member_count",
    total_count: input.total_count ?? null,
    generated_at: input.generated_at ?? "2026-06-24T12:00:00.000Z",
    gap_reason: input.gap_reason ?? null,
  };
}

clearOrganizationMemberCountProvidersForTests();

async function run() {
  registerOrganizationMemberCountProvider({
    provider_key: "fixture_alpha_registry",
    priority: 50,
    readMemberCount: async () =>
      fixtureResult({
        provider_key: "fixture_alpha_registry",
        total_count: 128,
        source_reference: "fixture_alpha:member_statistics_aggregate",
      }),
  });

  registerOrganizationMemberCountProvider({
    provider_key: "fixture_beta_directory",
    priority: 10,
    readMemberCount: async () =>
      fixtureResult({
        provider_key: "fixture_beta_directory",
        readiness: "ready",
        data_classification: "seed",
        source_verified: false,
        total_count: 3,
        source_reference: "fixture_beta:member_directory_center",
        gap_reason: "demo_data_not_presentable",
      }),
  });

  const supabase = {} as import("@supabase/supabase-js").SupabaseClient;

  const live = await resolveOrganizationMemberCount({
    supabase,
    organizationId: "org-alpha",
    tenantId: "tenant-alpha",
  });

  assert.equal(live.provider_key, "fixture_alpha_registry");
  assert.equal(live.total_count, 128);
  assert.equal(live.capability, "organization.member_count");
  assert.equal(isPresentableMemberCountResult(live), true);
  assert.equal(live.gap_reason, null);

  clearOrganizationMemberCountProvidersForTests();

  registerOrganizationMemberCountProvider({
    provider_key: "fixture_beta_directory",
    priority: 10,
    readMemberCount: async () =>
      fixtureResult({
        provider_key: "fixture_beta_directory",
        data_classification: "seed",
        source_verified: false,
        total_count: 3,
        gap_reason: "demo_data_not_presentable",
      }),
  });

  const gapOnly = await resolveOrganizationMemberCount({
    supabase,
    organizationId: "org-beta",
    tenantId: "tenant-beta",
  });

  assert.equal(gapOnly.provider_key, "fixture_beta_directory");
  assert.equal(isPresentableMemberCountResult(gapOnly), false);
  assert.equal(resolveMemberCountGapReason(gapOnly), "demo_data_not_presentable");

  console.log("organization-member-count provider contract: PASS");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
