import { AsyncTimeoutError, withAsyncTimeout } from "@/lib/core/async-with-timeout";
import { registerOrganizationMemberCountProvider } from "@/lib/integration-intelligence/providers/organization-member-count/registry";
import {
  ORGANIZATION_MEMBER_COUNT_CAPABILITY,
  type OrganizationMemberCountDataClassification,
  type OrganizationMemberCountResult,
} from "@/lib/integration-intelligence/providers/organization-member-count/types";
import {
  fetchUnonightMemberStatistics,
} from "./member-statistics";

const READ_TIMEOUT_MS = 1_500;

function classifyUnonightSnapshot(
  snapshot: Awaited<ReturnType<typeof fetchUnonightMemberStatistics>>,
): OrganizationMemberCountDataClassification {
  if (snapshot.data_classification) return snapshot.data_classification;
  if (snapshot.error || !snapshot.found) return "test";
  return "live";
}

async function readUnonightMemberCount(
  input: import("@/lib/integration-intelligence/providers/organization-member-count/types").OrganizationMemberCountReadInput,
): Promise<OrganizationMemberCountResult | null> {
  try {
    const snapshot = await withAsyncTimeout(
      fetchUnonightMemberStatistics(input.supabase),
      READ_TIMEOUT_MS,
      "organization_member_count_provider",
    );

    const dataClassification = classifyUnonightSnapshot(snapshot);
    const sourceVerified =
      snapshot.source_verified ??
      (snapshot.found && !snapshot.error && dataClassification === "live" && snapshot.total_members !== null);

    if (!snapshot.found || snapshot.error) {
      return {
        capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
        provider_key: "unonight_community_adapter",
        readiness: "unavailable",
        data_classification: "test",
        source_verified: false,
        freshness: "unknown",
        source_reference: snapshot.source_reference,
        total_count: null,
        generated_at: snapshot.generated_at,
        gap_reason: "registry_not_connected",
      };
    }

    if (dataClassification !== "live") {
      return {
        capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
        provider_key: "unonight_community_adapter",
        readiness: "ready",
        data_classification: dataClassification,
        source_verified: false,
        freshness: snapshot.completeness === "complete" ? "fresh" : "stale",
        source_reference: snapshot.source_reference,
        total_count: snapshot.total_members,
        generated_at: snapshot.generated_at,
        gap_reason: "demo_data_not_presentable",
      };
    }

    return {
      capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
      provider_key: "unonight_community_adapter",
      readiness: "ready",
      data_classification: "live",
      source_verified: sourceVerified,
      freshness: snapshot.completeness === "complete" ? "fresh" : "stale",
      source_reference: snapshot.source_reference,
      total_count: snapshot.total_members,
      generated_at: snapshot.generated_at,
      gap_reason: sourceVerified ? null : "registry_not_connected",
    };
  } catch (error) {
    if (error instanceof AsyncTimeoutError) {
      return {
        capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
        provider_key: "unonight_community_adapter",
        readiness: "unavailable",
        data_classification: "test",
        source_verified: false,
        freshness: "unknown",
        source_reference: "rpc:get_unonight_member_statistics",
        total_count: null,
        generated_at: null,
        gap_reason: "registry_not_connected",
      };
    }
    return null;
  }
}

registerOrganizationMemberCountProvider({
  provider_key: "unonight_community_adapter",
  priority: 100,
  readMemberCount: readUnonightMemberCount,
});
