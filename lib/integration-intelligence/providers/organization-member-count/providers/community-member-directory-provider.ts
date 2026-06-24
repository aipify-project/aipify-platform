import { AsyncTimeoutError, withAsyncTimeout } from "@/lib/core/async-with-timeout";
import { fetchCommunityMemberDirectoryCenter } from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-read-provider-adapter";
import {
  ORGANIZATION_MEMBER_COUNT_CAPABILITY,
  type OrganizationMemberCountDataClassification,
  type OrganizationMemberCountResult,
} from "../types";
import { registerOrganizationMemberCountProvider } from "../registry";

const READ_TIMEOUT_MS = 2_000;

function parseDataClassification(value: unknown): OrganizationMemberCountDataClassification {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (
    normalized === "live" ||
    normalized === "demo" ||
    normalized === "seed" ||
    normalized === "test"
  ) {
    return normalized;
  }
  return "test";
}

function toRpcClient(supabase: import("@supabase/supabase-js").SupabaseClient) {
  return {
    rpc: async (fn: string, params?: Record<string, unknown>) => {
      const result = await supabase.rpc(fn, params ?? {});
      return { data: result.data, error: result.error };
    },
  };
}

async function readCommunityMemberDirectoryCount(
  input: import("../types").OrganizationMemberCountReadInput,
): Promise<OrganizationMemberCountResult | null> {
  try {
    const bundle = await withAsyncTimeout(
      fetchCommunityMemberDirectoryCenter(toRpcClient(input.supabase)),
      READ_TIMEOUT_MS,
      "community_member_directory_member_count",
    );

    const dataClassification = bundle.data_classification;
    const sourceVerified = bundle.source_verified === true;

    if (!bundle.source_exact) {
      return {
        capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
        provider_key: "community_member_directory",
        readiness: "unavailable",
        data_classification: dataClassification ?? "test",
        source_verified: false,
        freshness: bundle.freshness === "fresh" ? "fresh" : "stale",
        source_reference: bundle.source_reference,
        total_count: null,
        generated_at: null,
        gap_reason: "source_unavailable",
      };
    }

    if (!dataClassification || dataClassification !== "live" || !sourceVerified) {
      return {
        capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
        provider_key: "community_member_directory",
        readiness: dataClassification ? "ready" : "uncertified",
        data_classification: dataClassification ?? "test",
        source_verified: sourceVerified,
        freshness: bundle.freshness === "fresh" ? "fresh" : "stale",
        source_reference: bundle.source_reference,
        total_count: bundle.total_member_count,
        generated_at: new Date().toISOString(),
        gap_reason: "demo_data_not_presentable",
      };
    }

    return {
      capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
      provider_key: "community_member_directory",
      readiness: "ready",
      data_classification: "live",
      source_verified: true,
      freshness: bundle.freshness === "fresh" ? "fresh" : "stale",
      source_reference: bundle.source_reference,
      total_count: bundle.total_member_count,
      generated_at: new Date().toISOString(),
      gap_reason: null,
    };
  } catch (error) {
    if (error instanceof AsyncTimeoutError) {
      return {
        capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
        provider_key: "community_member_directory",
        readiness: "unavailable",
        data_classification: "test",
        source_verified: false,
        freshness: "unknown",
        source_reference: "get_customer_member_directory_center",
        total_count: null,
        generated_at: null,
        gap_reason: "source_unavailable",
      };
    }
    return null;
  }
}

registerOrganizationMemberCountProvider({
  provider_key: "community_member_directory",
  priority: 10,
  readMemberCount: readCommunityMemberDirectoryCount,
});
