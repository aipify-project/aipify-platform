import type { UnonightProviderAdapterV1Capability } from "./constants";

export type UnonightAdapterSourceStatus = "live" | "partial" | "placeholder" | "missing";

export type UnonightAdapterSourceDefinition = {
  capability_key: UnonightProviderAdapterV1Capability;
  source_kind: "tenant_rpc" | "integration_http";
  source_id: string;
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: UnonightAdapterSourceStatus;
  read_only: true;
};

/**
 * Documented Unonight V1 source map — no new Unonight systems in this phase.
 * Live HTTP endpoints remain metadata-only per UNONIGHT_API_INTEGRATION_V1 freeze.
 */
export const UNONIGHT_ADAPTER_SOURCE_MAP: readonly UnonightAdapterSourceDefinition[] = [
  {
    capability_key: "member.read",
    source_kind: "tenant_rpc",
    source_id: "get_unonight_member_statistics",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_ccn464_access() / organization_id",
    available_fields: [
      "total_members",
      "active_members",
      "new_members_today",
      "new_members_7d",
      "new_members_30d",
      "new_members_since",
      "member_growth",
    ],
    required_permission: "customer_community.view",
    status: "live",
    read_only: true,
  },
  {
    capability_key: "activity.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_community_network_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["statistics.discussion_count", "statistics.group_count"],
    required_permission: "customer_community.view",
    status: "partial",
    read_only: true,
  },
  {
    capability_key: "moderation_queue.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_moderation_dashboard",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["metrics.pending_review", "items[].status"],
    required_permission: "moderation.view",
    status: "live",
    read_only: true,
  },
  {
    capability_key: "report.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_moderation_dashboard",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["metrics.high_risk_pending", "items[].is_reported"],
    required_permission: "moderation.view",
    status: "live",
    read_only: true,
  },
  {
    capability_key: "verification_status.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_community_network_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["best_practices[].moderation_status"],
    required_permission: "customer_community.view",
    status: "partial",
    read_only: true,
  },
  {
    capability_key: "listing.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_community_network_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["marketplace_prep[].moderation_status"],
    required_permission: "customer_community.view",
    status: "partial",
    read_only: true,
  },
];

export function getUnonightAdapterSource(
  capabilityKey: UnonightProviderAdapterV1Capability,
): UnonightAdapterSourceDefinition | null {
  return UNONIGHT_ADAPTER_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null;
}
