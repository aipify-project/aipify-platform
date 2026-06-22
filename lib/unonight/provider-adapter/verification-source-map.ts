import type { UnonightProviderAdapterV1Capability } from "./constants";

export type UnonightVerificationSourceStatus = "live" | "partial" | "placeholder" | "missing";

export type UnonightVerificationSourceDefinition = {
  capability_key:
    | "verification_status.read"
    | "verification_queue.read"
    | "verification_case.read";
  source_kind: "tenant_rpc" | "integration_http" | "workflow_metadata";
  source_id: string;
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: UnonightVerificationSourceStatus;
  read_only: true;
  limitations: readonly string[];
};

/**
 * Documented Unonight member verification sources — Phase 35.
 * Dedicated member verification queue RPC is not approved yet; partial proxy uses community metadata.
 */
export const UNONIGHT_VERIFICATION_SOURCE_MAP: readonly UnonightVerificationSourceDefinition[] = [
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
    limitations: [
      "Proxy count from community best_practices moderation_status — not a dedicated verification queue.",
    ],
  },
  {
    capability_key: "verification_queue.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_community_network_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: [
      "best_practices[].practice_key",
      "best_practices[].moderation_status",
      "best_practices[].status_key",
      "best_practices[].practice_type",
    ],
    required_permission: "verification.view",
    status: "partial",
    read_only: true,
    limitations: [
      "Queue summary derived from community metadata until Unonight verification queue RPC is approved.",
      "No document images, ID numbers, or moderator notes are exposed.",
    ],
  },
  {
    capability_key: "verification_case.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_community_network_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: [
      "best_practices[].practice_key",
      "best_practices[].id",
      "best_practices[].moderation_status",
      "best_practices[].status_key",
      "best_practices[].practice_type",
    ],
    required_permission: "verification.view",
    status: "partial",
    read_only: true,
    limitations: [
      "Case lookup uses metadata-only proxy records until dedicated verification case RPC exists.",
    ],
  },
  {
    capability_key: "verification_queue.read",
    source_kind: "workflow_metadata",
    source_id: "unonight.account_verification",
    auth_model: "pilot_workflow_discovery",
    tenant_filter: "organization_id",
    available_fields: ["queue_metric", "verification_metric"],
    required_permission: "verification.view",
    status: "missing",
    read_only: true,
    limitations: ["Pilot workflow metadata only — not wired as live queue source."],
  },
];

export function getUnonightVerificationSource(
  capabilityKey: UnonightProviderAdapterV1Capability | "verification_queue.read" | "verification_case.read",
): UnonightVerificationSourceDefinition | null {
  return (
    UNONIGHT_VERIFICATION_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null
  );
}

export const UNONIGHT_VERIFICATION_READINESS = {
  verification_status: "connected_but_partial" as const,
  verification_queue: "connected_but_partial" as const,
  verification_case: "connected_but_partial" as const,
  dedicated_rpc: "source_missing" as const,
  exposes_documents: false,
  exposes_member_list: false,
};
