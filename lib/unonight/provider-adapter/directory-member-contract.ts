/** Unonight member directory adapter contract — provider layer only (Phase 33C). */

export const UNONIGHT_DIRECTORY_MEMBER_PROVIDER_KEY = "unonight_community_member_directory";

export type UnonightDirectoryMemberContract = {
  provider_key: typeof UNONIGHT_DIRECTORY_MEMBER_PROVIDER_KEY;
  readiness: "source_missing";
  supported_fields: readonly ("name" | "external_id" | "status")[];
  exposes_member_list: false;
  exposes_raw_email: false;
  exposes_raw_phone: false;
  source_reference: null;
  next_required_step: string;
};

export const UNONIGHT_DIRECTORY_MEMBER_CONTRACT: UnonightDirectoryMemberContract = {
  provider_key: UNONIGHT_DIRECTORY_MEMBER_PROVIDER_KEY,
  readiness: "source_missing",
  supported_fields: ["name", "external_id", "status"],
  exposes_member_list: false,
  exposes_raw_email: false,
  exposes_raw_phone: false,
  source_reference: null,
  next_required_step:
    "Connect read-only Unonight member directory search RPC with masked contact fields and audit logging.",
};

/** Maps Unonight member fields to generic directory record shape — adapter only. */
export function mapUnonightMemberDirectoryFields(input: {
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
    source_reference: "unonight_member_directory:metadata",
  };
}
