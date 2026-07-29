/** Allowlisted Kompis Operator V1 tools — server-only contract. */

export const KOMPIS_OPERATOR_TOOL_KEYS = [
  "customer_profile_read",
  "agreement_status_read",
  "license_status_read",
  "domain_installation_status_read",
  "website_kompis_status_read",
  "app_access_status_read",
  "support_cases_read",
  "notifications_read",
  "organization_members_read",
  "activity_summary_read",
  "support_case_create",
  "support_case_reply",
  "notification_mark_read",
  "organization_profile_draft",
  "content_draft_create",
] as const;

export type KompisOperatorToolKey = (typeof KOMPIS_OPERATOR_TOOL_KEYS)[number];

export type KompisOperatorRiskClass = 0 | 1 | 2 | 3;

export type KompisOperatorToolDefinition = {
  key: KompisOperatorToolKey;
  version: string;
  riskClass: KompisOperatorRiskClass;
  kind: "read" | "write";
  available: boolean;
  unavailableReason?: string;
};

export const KOMPIS_OPERATOR_TOOL_REGISTRY: readonly KompisOperatorToolDefinition[] = [
  { key: "customer_profile_read", version: "1", riskClass: 0, kind: "read", available: true },
  { key: "agreement_status_read", version: "1", riskClass: 0, kind: "read", available: true },
  { key: "license_status_read", version: "1", riskClass: 0, kind: "read", available: true },
  { key: "domain_installation_status_read", version: "1", riskClass: 0, kind: "read", available: true },
  { key: "website_kompis_status_read", version: "1", riskClass: 0, kind: "read", available: true },
  { key: "app_access_status_read", version: "1", riskClass: 0, kind: "read", available: true },
  {
    key: "support_cases_read",
    version: "1",
    riskClass: 0,
    kind: "read",
    available: false,
    unavailableReason: "support_read_backend_not_wired_v1",
  },
  {
    key: "notifications_read",
    version: "1",
    riskClass: 0,
    kind: "read",
    available: false,
    unavailableReason: "notifications_read_backend_not_wired_v1",
  },
  {
    key: "organization_members_read",
    version: "1",
    riskClass: 0,
    kind: "read",
    available: false,
    unavailableReason: "members_read_backend_not_wired_v1",
  },
  {
    key: "activity_summary_read",
    version: "1",
    riskClass: 0,
    kind: "read",
    available: false,
    unavailableReason: "activity_read_backend_not_wired_v1",
  },
  {
    key: "support_case_create",
    version: "1",
    riskClass: 2,
    kind: "write",
    available: false,
    unavailableReason: "no_safe_draft_support_create_v1",
  },
  {
    key: "support_case_reply",
    version: "1",
    riskClass: 2,
    kind: "write",
    available: false,
    unavailableReason: "no_safe_support_reply_v1",
  },
  {
    key: "notification_mark_read",
    version: "1",
    riskClass: 1,
    kind: "write",
    available: false,
    unavailableReason: "notification_write_backend_not_wired_v1",
  },
  {
    key: "organization_profile_draft",
    version: "1",
    riskClass: 1,
    kind: "write",
    available: true,
  },
  {
    key: "content_draft_create",
    version: "1",
    riskClass: 1,
    kind: "write",
    available: true,
  },
] as const;

export function getKompisOperatorTool(
  key: string,
): KompisOperatorToolDefinition | null {
  return KOMPIS_OPERATOR_TOOL_REGISTRY.find((tool) => tool.key === key) ?? null;
}

export function isKompisOperatorToolKey(value: string): value is KompisOperatorToolKey {
  return KOMPIS_OPERATOR_TOOL_REGISTRY.some((tool) => tool.key === value);
}
