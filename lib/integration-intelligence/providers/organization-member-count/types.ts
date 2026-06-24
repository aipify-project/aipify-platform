export const ORGANIZATION_MEMBER_COUNT_CAPABILITY = "organization.member_count" as const;

export type OrganizationMemberCountDataClassification = "live" | "demo" | "seed" | "test";

export type OrganizationMemberCountReadiness = "ready" | "unavailable" | "uncertified";

export type OrganizationMemberCountFreshness = "fresh" | "stale" | "unknown";

export type OrganizationMemberCountGapReason =
  | "adapter_missing"
  | "permission_required"
  | "source_unavailable"
  | "registry_not_connected"
  | "demo_data_not_presentable";

export type OrganizationMemberCountResult = {
  capability: typeof ORGANIZATION_MEMBER_COUNT_CAPABILITY;
  provider_key: string;
  readiness: OrganizationMemberCountReadiness;
  data_classification: OrganizationMemberCountDataClassification;
  source_verified: boolean;
  freshness: OrganizationMemberCountFreshness;
  source_reference: string;
  total_count: number | null;
  generated_at: string | null;
  gap_reason: OrganizationMemberCountGapReason | null;
};

export type OrganizationMemberCountReadInput = {
  organization_id: string;
  tenant_id: string;
  supabase: import("@supabase/supabase-js").SupabaseClient;
};

export type OrganizationMemberCountProvider = {
  provider_key: string;
  priority: number;
  readMemberCount: (
    input: OrganizationMemberCountReadInput,
  ) => Promise<OrganizationMemberCountResult | null>;
};

export function isPresentableMemberCountResult(
  result: OrganizationMemberCountResult,
): boolean {
  return (
    result.readiness === "ready" &&
    result.data_classification === "live" &&
    result.source_verified &&
    result.total_count !== null &&
    result.gap_reason === null
  );
}
