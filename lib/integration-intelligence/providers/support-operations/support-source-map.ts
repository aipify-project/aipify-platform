import type { SupportCapabilityKey } from "@/lib/integration-intelligence/support/types";

export type SupportOperationsSourceStatus = "live" | "partial" | "placeholder" | "missing";

export type SupportOperationsSourceDefinition = {
  capability_key: SupportCapabilityKey;
  source_kind: "tenant_rpc";
  source_id: string;
  provider_key: string;
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: SupportOperationsSourceStatus;
  read_only: boolean;
  limitations: readonly string[];
};

export const SUPPORT_OPERATIONS_SOURCE_MAP: readonly SupportOperationsSourceDefinition[] = [
  {
    capability_key: "support_queue.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_support_operations_center",
    provider_key: "autonomous_support_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_presence_tenant_for_auth()",
    available_fields: [
      "performance.open_cases",
      "open_cases[]",
      "high_risk_cases[]",
      "approval_queue[]",
    ],
    required_permission: "support.view",
    status: "partial",
    read_only: true,
    limitations: [
      "Queue counts from ASO dashboard — assignment and SLA fields are partial.",
    ],
  },
  {
    capability_key: "support_case.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_support_operations_center",
    provider_key: "autonomous_support_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_presence_tenant_for_auth()",
    available_fields: ["open_cases[].id", "open_cases[].subject", "open_cases[].status"],
    required_permission: "support.view",
    status: "partial",
    read_only: true,
    limitations: ["Case metadata from support_cases table — no private message bodies."],
  },
  {
    capability_key: "support_case.read",
    source_kind: "tenant_rpc",
    source_id: "get_support_ai_engine_dashboard",
    provider_key: "support_ai_engine",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_mta_require_organization()",
    available_fields: [
      "open_cases[].case_number",
      "open_cases[].priority",
      "escalated_cases[]",
    ],
    required_permission: "support.view",
    status: "partial",
    read_only: true,
    limitations: ["Support AI cases are organization-scoped — customer identifiers are masked."],
  },
  {
    capability_key: "support_sla.read",
    source_kind: "tenant_rpc",
    source_id: "none",
    provider_key: "autonomous_support_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_presence_tenant_for_auth()",
    available_fields: [],
    required_permission: "support.view_metrics",
    status: "missing",
    read_only: true,
    limitations: ["No dedicated SLA deadline source — SLA status returns unavailable."],
  },
  {
    capability_key: "support_response.draft",
    source_kind: "tenant_rpc",
    source_id: "suggest_support_ai_response",
    provider_key: "support_ai_engine",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_mta_require_organization()",
    available_fields: ["draft_content", "grounded_sources[]"],
    required_permission: "support.reply",
    status: "partial",
    read_only: false,
    limitations: ["Draft generation only — send is blocked in Companion runtime."],
  },
  {
    capability_key: "support_case.assign",
    source_kind: "tenant_rpc",
    source_id: "assign_support_case",
    provider_key: "support_ai_engine",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_mta_require_organization()",
    available_fields: ["case_id", "assignee_user_id"],
    required_permission: "support.assign",
    status: "missing",
    read_only: false,
    limitations: ["Assignment write RPC exists but Companion runtime adapter is not connected."],
  },
  {
    capability_key: "support_case.escalate",
    source_kind: "tenant_rpc",
    source_id: "escalate_support_case",
    provider_key: "support_ai_engine",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_mta_require_organization()",
    available_fields: ["case_id", "escalation_reason"],
    required_permission: "support.escalate",
    status: "missing",
    read_only: false,
    limitations: ["Escalation write RPC exists but Companion runtime adapter is not connected."],
  },
];

export function getSupportSourceDefinition(
  capabilityKey: SupportCapabilityKey,
  providerKey?: string,
): SupportOperationsSourceDefinition | null {
  const matches = SUPPORT_OPERATIONS_SOURCE_MAP.filter(
    (entry) =>
      entry.capability_key === capabilityKey &&
      (!providerKey || entry.provider_key === providerKey),
  );
  return matches[0] ?? null;
}

export function isSupportWriteSourceConnected(capabilityKey: SupportCapabilityKey): boolean {
  const definition = getSupportSourceDefinition(capabilityKey);
  return definition?.status === "live" && !definition.read_only;
}
