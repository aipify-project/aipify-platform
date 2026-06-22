/** Generic community member directory contract — Core / II only (Phase 33C, 43B). */

export const COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY = "community_member_directory";

export type CommunityMemberDirectoryContract = {
  provider_key: typeof COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY;
  readiness: "source_missing";
  supported_fields: readonly ("name" | "external_id" | "status")[];
  exposes_member_list: false;
  exposes_raw_email: false;
  exposes_raw_phone: false;
  source_reference: null;
  next_required_step: string;
};

export const COMMUNITY_MEMBER_DIRECTORY_CONTRACT: CommunityMemberDirectoryContract = {
  provider_key: COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY,
  readiness: "source_missing",
  supported_fields: ["name", "external_id", "status"],
  exposes_member_list: false,
  exposes_raw_email: false,
  exposes_raw_phone: false,
  source_reference: null,
  next_required_step:
    "Connect read-only community member directory search RPC with masked contact fields and audit logging.",
};

/** Maps external member fields to generic directory record shape — adapter layer supplies input. */
export function mapCommunityMemberDirectoryFields(input: {
  member_id: string;
  display_name: string | null;
  membership_status: string | null;
  verification_status: string | null;
}): {
  entity_id: string;
  display_name: string | null;
  status: string | null;
  source_reference: string;
} {
  return {
    entity_id: input.member_id,
    display_name: input.display_name,
    status: input.membership_status ?? input.verification_status,
    source_reference: "community_member_directory:metadata",
  };
}
