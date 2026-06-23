export type MemberVerificationSourceStatus = "live" | "partial" | "missing";

export type MemberVerificationSourceDefinition = {
  capability_key: "verification_status.read" | "verification_queue.read" | "verification_case.read";
  source_kind: "tenant_rpc";
  source_id: string;
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string;
  status: MemberVerificationSourceStatus;
  read_only: true;
  limitations: readonly string[];
};

export const MEMBER_VERIFICATION_V1_SOURCE_MAP: readonly MemberVerificationSourceDefinition[] = [
  {
    capability_key: "verification_queue.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_member_verification_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / organization_id",
    available_fields: [
      "queue.total_pending",
      "queue.needs_information",
      "queue.in_review",
      "queue.high_priority",
      "queue.oldest_pending_at",
      "cases[].status",
      "cases[].priority",
      "cases[].missing_requirements",
      "cases[].created_at",
      "cases[].updated_at",
    ],
    required_permission: "unonight_verification_read",
    status: "live",
    read_only: true,
    limitations: [
      "Exact read-only member verification metadata — no documents or identity numbers.",
    ],
  },
  {
    capability_key: "verification_case.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_member_verification_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / organization_id",
    available_fields: [
      "case.case_id",
      "case.status",
      "case.priority",
      "case.missing_requirements",
      "case.created_at",
      "case.updated_at",
      "case.subject_reference",
    ],
    required_permission: "unonight_verification_read",
    status: "live",
    read_only: true,
    limitations: [
      "Exact case lookup with masked subject reference — no document exposure.",
    ],
  },
  {
    capability_key: "verification_status.read",
    source_kind: "tenant_rpc",
    source_id: "get_customer_member_verification_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / organization_id",
    available_fields: ["queue.total_pending", "queue.needs_information", "queue.high_priority"],
    required_permission: "unonight_verification_read",
    status: "live",
    read_only: true,
    limitations: [
      "Aggregate verification status from authoritative queue summary only.",
    ],
  },
];

export function getMemberVerificationSourceDefinition(
  capabilityKey: MemberVerificationSourceDefinition["capability_key"],
): MemberVerificationSourceDefinition | null {
  return MEMBER_VERIFICATION_V1_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null;
}

export function isMemberVerificationReadSourceConnected(
  capabilityKey: MemberVerificationSourceDefinition["capability_key"],
): boolean {
  const definition = getMemberVerificationSourceDefinition(capabilityKey);
  return definition?.status === "live" && definition.read_only;
}
