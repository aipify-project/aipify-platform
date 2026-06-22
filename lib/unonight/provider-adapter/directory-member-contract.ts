/** Tenant community member directory adapter contract — maps to generic Core contract (Phase 33C). */

import {
  COMMUNITY_MEMBER_DIRECTORY_CONTRACT,
  COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY,
  mapCommunityMemberDirectoryFields,
  type CommunityMemberDirectoryContract,
} from "@/lib/integration-intelligence/directory/community-member-directory-contract";

export const UNONIGHT_DIRECTORY_MEMBER_PROVIDER_KEY = COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY;

export type UnonightDirectoryMemberContract = CommunityMemberDirectoryContract;

export const UNONIGHT_DIRECTORY_MEMBER_CONTRACT: UnonightDirectoryMemberContract =
  COMMUNITY_MEMBER_DIRECTORY_CONTRACT;

/** Maps tenant member fields to generic directory record shape — adapter only. */
export function mapUnonightMemberDirectoryFields(input: {
  member_id: string;
  display_name: string | null;
  membership_status: string | null;
  verification_status: string | null;
}): ReturnType<typeof mapCommunityMemberDirectoryFields> {
  return mapCommunityMemberDirectoryFields(input);
}

export { mapCommunityMemberDirectoryFields };
