import { maskDirectoryEmail, maskDirectoryPhone } from "@/lib/integration-intelligence/directory/masking";
import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import type { DirectoryCompleteness, DirectoryFreshness } from "@/lib/integration-intelligence/directory/types";
import { COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY } from "@/lib/integration-intelligence/directory/community-member-directory-contract";

export const COMMUNITY_MEMBER_DIRECTORY_READ_RPC = "get_customer_member_directory_center" as const;

export type CommunityMemberDirectoryProviderRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export type CommunityMemberDirectoryRecord = {
  member_id: string;
  username: string;
  display_name: string;
  membership_status: string;
  membership_level: string;
  verification_status: string;
  profile_reference: string;
  email_masked: string | null;
  phone_masked: string | null;
};

export type CommunityMemberDirectoryReadBundle = {
  source_exact: boolean;
  source_reference: string;
  members: CommunityMemberDirectoryRecord[];
  candidates: DirectoryMatchCandidate[];
  total_member_count: number;
  match_count: number;
  search_field: string | null;
  search_term: string | null;
  freshness: DirectoryFreshness;
  completeness: DirectoryCompleteness;
  limitations: readonly string[];
  data_classification?: "live" | "demo" | "seed" | "test";
  source_verified?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function mapMemberRow(row: Record<string, unknown>): CommunityMemberDirectoryRecord | null {
  const memberId = String(row.member_id ?? "").trim();
  const username = String(row.username ?? "").trim();
  const displayName = String(row.display_name ?? "").trim();
  if (!memberId || !username || !displayName) return null;

  const emailMasked = row.email_masked ? String(row.email_masked) : null;
  const phoneMasked = row.phone_masked ? String(row.phone_masked) : null;

  return {
    member_id: memberId,
    username,
    display_name: displayName,
    membership_status: String(row.membership_status ?? "active"),
    membership_level: String(row.membership_level ?? "standard"),
    verification_status: String(row.verification_status ?? "pending"),
    profile_reference: String(row.profile_reference ?? "profile_ref_***"),
    email_masked:
      emailMasked && !emailMasked.includes("*")
        ? maskDirectoryEmail(emailMasked) ?? emailMasked
        : emailMasked,
    phone_masked:
      phoneMasked && !phoneMasked.includes("*")
        ? maskDirectoryPhone(phoneMasked) ?? phoneMasked
        : phoneMasked,
  };
}

function mapMemberToCandidate(member: CommunityMemberDirectoryRecord): DirectoryMatchCandidate {
  return {
    entity_id: member.member_id,
    entity_type: "person",
    display_name: member.display_name,
    company_name: null,
    role: member.membership_level,
    status: member.membership_status,
    external_id: member.username,
    email_masked: member.email_masked,
    phone_masked: member.phone_masked,
  };
}

export function mapCommunityMemberDirectoryCenterPayload(payload: unknown): CommunityMemberDirectoryReadBundle {
  const record = asRecord(payload);
  const sourceReference = COMMUNITY_MEMBER_DIRECTORY_READ_RPC;

  if (!record || record.found !== true) {
    return {
      source_exact: false,
      source_reference: sourceReference,
      members: [],
      candidates: [],
      total_member_count: 0,
      match_count: 0,
      search_field: null,
      search_term: null,
      freshness: "stale",
      completeness: "empty",
      limitations: ["community_member_directory_unavailable"],
    };
  }

  const members = asArray(record.members)
    .map((row) => mapMemberRow(row))
    .filter((row): row is CommunityMemberDirectoryRecord => row !== null);

  const search = asRecord(record.search);
  const completeness = record.completeness === "complete" ? "complete" : "empty";
  const dataClassificationRaw = typeof record.data_classification === "string"
    ? record.data_classification
    : null;
  const data_classification =
    dataClassificationRaw === "live" ||
    dataClassificationRaw === "demo" ||
    dataClassificationRaw === "seed" ||
    dataClassificationRaw === "test"
      ? dataClassificationRaw
      : undefined;
  const source_verified = record.source_verified === true;

  return {
    source_exact: true,
    source_reference: sourceReference,
    members,
    candidates: members.map(mapMemberToCandidate),
    total_member_count: Number(record.total_member_count ?? 0),
    match_count: Number(search?.match_count ?? members.length),
    search_field: search?.field ? String(search.field) : null,
    search_term: search?.term ? String(search.term) : null,
    freshness: "fresh",
    completeness,
    limitations: [],
    data_classification,
    source_verified,
  };
}

export async function fetchCommunityMemberDirectoryCenter(
  client: CommunityMemberDirectoryProviderRpcClient,
  input?: { search_term?: string | null; search_field?: string | null },
): Promise<CommunityMemberDirectoryReadBundle> {
  const { data, error } = await client.rpc(COMMUNITY_MEMBER_DIRECTORY_READ_RPC, {
    p_search_term: input?.search_term ?? null,
    p_search_field: input?.search_field ?? "name",
  });

  if (error) {
    return {
      source_exact: false,
      source_reference: COMMUNITY_MEMBER_DIRECTORY_READ_RPC,
      members: [],
      candidates: [],
      total_member_count: 0,
      match_count: 0,
      search_field: input?.search_field ?? null,
      search_term: input?.search_term ?? null,
      freshness: "stale",
      completeness: "empty",
      limitations: [error.message],
    };
  }

  return mapCommunityMemberDirectoryCenterPayload(data);
}

export function communityMemberDirectoryProviderKey(): typeof COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY {
  return COMMUNITY_MEMBER_DIRECTORY_PROVIDER_KEY;
}
