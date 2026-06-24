import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  OrganizationAccessGrantRecord,
  OrganizationAccessRequestRecord,
} from "@/lib/core/organization-access-approval/types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

export function parseOrganizationAccessRequest(value: unknown): OrganizationAccessRequestRecord {
  const record = asRecord(value);
  return {
    id: asString(record.id),
    organization_id: asString(record.organization_id),
    requester_user_id: asString(record.requester_user_id),
    requester_display_name:
      typeof record.requester_display_name === "string" ? record.requester_display_name : null,
    provider_key: asString(record.provider_key),
    capability_key: typeof record.capability_key === "string" ? record.capability_key : null,
    scope_keys: asStringArray(record.scope_keys),
    access_mode: record.access_mode === "ongoing" ? "ongoing" : "one_time",
    duration_hours: typeof record.duration_hours === "number" ? record.duration_hours : null,
    risk_level: typeof record.risk_level === "number" ? record.risk_level : 1,
    status: asString(record.status) as OrganizationAccessRequestRecord["status"],
    reason_summary: asString(record.reason_summary),
    context_payload: asRecord(record.context_payload),
    idempotency_key: typeof record.idempotency_key === "string" ? record.idempotency_key : null,
    approved_by_user_id:
      typeof record.approved_by_user_id === "string" ? record.approved_by_user_id : null,
    denied_by_user_id: typeof record.denied_by_user_id === "string" ? record.denied_by_user_id : null,
    expires_at: typeof record.expires_at === "string" ? record.expires_at : null,
    created_at: asString(record.created_at),
    updated_at: asString(record.updated_at),
  };
}

export function parseOrganizationAccessRequestList(value: unknown): OrganizationAccessRequestRecord[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseOrganizationAccessRequest);
}

export type OrganizationAccessApprovalCenter = {
  requests: OrganizationAccessRequestRecord[];
  can_review: boolean;
};

export async function getOrganizationAccessApprovalCenter(
  supabase: SupabaseClient,
  status = "pending",
): Promise<OrganizationAccessApprovalCenter> {
  const [listResult, reviewResult] = await Promise.all([
    supabase.rpc("list_organization_provider_access_requests", { p_status: status }),
    supabase.rpc("can_review_organization_provider_access"),
  ]);

  if (listResult.error) throw new Error(listResult.error.message);

  return {
    requests: parseOrganizationAccessRequestList(listResult.data),
    can_review: reviewResult.data === true,
  };
}

export async function createOrganizationProviderAccessRequest(
  supabase: SupabaseClient,
  input: {
    provider_key: string;
    capability_key?: string | null;
    scope_keys: string[];
    access_mode?: "one_time" | "ongoing";
    duration_hours?: number | null;
    risk_level?: number;
    reason_summary?: string;
    context_payload?: Record<string, unknown>;
    idempotency_key?: string | null;
  },
): Promise<OrganizationAccessRequestRecord> {
  const { data, error } = await supabase.rpc("create_organization_provider_access_request", {
    p_provider_key: input.provider_key,
    p_capability_key: input.capability_key ?? null,
    p_scope_keys: input.scope_keys,
    p_access_mode: input.access_mode ?? "one_time",
    p_duration_hours: input.duration_hours ?? null,
    p_risk_level: input.risk_level ?? 1,
    p_reason_summary: input.reason_summary ?? "",
    p_context_payload: input.context_payload ?? {},
    p_idempotency_key: input.idempotency_key ?? null,
  });

  if (error) throw new Error(error.message);
  return parseOrganizationAccessRequest(data);
}

export async function grantOrganizationProviderAccessDirectly(
  supabase: SupabaseClient,
  input: {
    provider_key: string;
    capability_key?: string | null;
    scope_keys: string[];
    access_mode?: "one_time" | "ongoing";
    duration_hours?: number | null;
    risk_level?: number;
    reason_summary?: string;
    context_payload?: Record<string, unknown>;
    idempotency_key?: string | null;
  },
): Promise<{ request: OrganizationAccessRequestRecord; grant: OrganizationAccessGrantRecord }> {
  const { data, error } = await supabase.rpc("grant_organization_provider_access_directly", {
    p_provider_key: input.provider_key,
    p_capability_key: input.capability_key ?? null,
    p_scope_keys: input.scope_keys,
    p_access_mode: input.access_mode ?? "one_time",
    p_duration_hours: input.duration_hours ?? null,
    p_risk_level: input.risk_level ?? 1,
    p_reason_summary: input.reason_summary ?? "",
    p_context_payload: input.context_payload ?? {},
    p_idempotency_key: input.idempotency_key ?? null,
  });
  if (error) throw new Error(error.message);

  const record = asRecord(data);
  const request = parseOrganizationAccessRequest(record.request);
  const grant = asRecord(record.grant);
  return {
    request,
    grant: {
      id: asString(grant.id),
      organization_id: request.organization_id,
      user_id: request.requester_user_id,
      provider_key: request.provider_key,
      scope_keys: request.scope_keys,
      access_mode: request.access_mode,
      active: grant.active === true,
      granted_from_request_id: request.id,
      expires_at: typeof grant.expires_at === "string" ? grant.expires_at : null,
      revoked_at: null,
      created_at: request.created_at,
    },
  };
}

export async function approveOrganizationProviderAccessRequest(
  supabase: SupabaseClient,
  requestId: string,
): Promise<{ request: OrganizationAccessRequestRecord; grant: OrganizationAccessGrantRecord }> {
  const { data, error } = await supabase.rpc("approve_organization_provider_access_request", {
    p_request_id: requestId,
  });
  if (error) throw new Error(error.message);

  const record = asRecord(data);
  const request = parseOrganizationAccessRequest(record.request);
  const grant = asRecord(record.grant);
  return {
    request,
    grant: {
      id: asString(grant.id),
      organization_id: request.organization_id,
      user_id: request.requester_user_id,
      provider_key: request.provider_key,
      scope_keys: request.scope_keys,
      access_mode: request.access_mode,
      active: grant.active === true,
      granted_from_request_id: requestId,
      expires_at: typeof grant.expires_at === "string" ? grant.expires_at : null,
      revoked_at: null,
      created_at: request.created_at,
    },
  };
}

export async function denyOrganizationProviderAccessRequest(
  supabase: SupabaseClient,
  requestId: string,
  reason?: string,
): Promise<OrganizationAccessRequestRecord> {
  const { data, error } = await supabase.rpc("deny_organization_provider_access_request", {
    p_request_id: requestId,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
  return parseOrganizationAccessRequest(data);
}

export async function cancelOrganizationProviderAccessRequest(
  supabase: SupabaseClient,
  requestId: string,
): Promise<OrganizationAccessRequestRecord> {
  const { data, error } = await supabase.rpc("cancel_organization_provider_access_request", {
    p_request_id: requestId,
  });
  if (error) throw new Error(error.message);
  return parseOrganizationAccessRequest(data);
}

export async function revokeOrganizationProviderAccessGrant(
  supabase: SupabaseClient,
  grantId: string,
): Promise<{ id: string; active: boolean; revoked_at: string | null }> {
  const { data, error } = await supabase.rpc("revoke_organization_provider_access_grant", {
    p_grant_id: grantId,
  });
  if (error) throw new Error(error.message);
  const record = asRecord(data);
  return {
    id: asString(record.id),
    active: record.active === true,
    revoked_at: typeof record.revoked_at === "string" ? record.revoked_at : null,
  };
}
