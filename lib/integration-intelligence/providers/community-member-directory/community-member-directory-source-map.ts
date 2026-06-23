export type CommunityMemberDirectorySourceStatus = "live" | "partial" | "missing";

export type CommunityMemberDirectorySourceDefinition = {
  capability_key: "member.search";
  source_kind: "tenant_rpc";
  source_id: string;
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string;
  status: CommunityMemberDirectorySourceStatus;
  read_only: true;
  limitations: readonly string[];
};

export const COMMUNITY_MEMBER_DIRECTORY_V1_SOURCE_MAP: readonly CommunityMemberDirectorySourceDefinition[] = [
  {
    capability_key: "member.search",
    source_kind: "tenant_rpc",
    source_id: "get_customer_member_directory_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / organization_id",
    available_fields: [
      "members[].member_id",
      "members[].username",
      "members[].display_name",
      "members[].membership_status",
      "members[].membership_level",
      "members[].verification_status",
      "members[].profile_reference",
      "members[].email_masked",
      "members[].phone_masked",
      "total_member_count",
    ],
    required_permission: "customer_community.view",
    status: "live",
    read_only: true,
    limitations: [
      "Exact read-only community member directory — admin/system/test/demo excluded; contact fields masked.",
    ],
  },
];

export function getCommunityMemberDirectorySourceDefinition(
  capabilityKey: CommunityMemberDirectorySourceDefinition["capability_key"],
): CommunityMemberDirectorySourceDefinition | null {
  return (
    COMMUNITY_MEMBER_DIRECTORY_V1_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null
  );
}

export function isCommunityMemberDirectoryReadSourceConnected(
  capabilityKey: CommunityMemberDirectorySourceDefinition["capability_key"],
): boolean {
  const definition = getCommunityMemberDirectorySourceDefinition(capabilityKey);
  return definition?.status === "live" && definition.read_only;
}
