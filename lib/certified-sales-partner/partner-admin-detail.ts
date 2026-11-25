import { createServiceRoleClient } from "@/lib/supabase/service-role";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BASE_COLUMNS = "id, auth_user_id, display_name, country, status, created_at, updated_at";
const OPTIONAL_COLUMNS = ["legal_business_name", "business_registration_number", "business_address", "phone"] as const;
const ACTIVITY_LIMIT = 20;

export type CspPartnerAdminActivity = {
  id: string;
  action: string;
  actorKind: string | null;
  createdAt: string | null;
};

export type CspPartnerAdminDetail = {
  partner: {
    id: string;
    status: string;
    displayName: string;
    country: string;
    createdAt: string | null;
    updatedAt: string | null;
    email: string | null;
    emailVerified: boolean;
    /** `null` = not persisted (UI shows "Not saved yet"). */
    legalBusinessName: string | null;
    businessRegistrationNumber: string | null;
    businessAddress: string | null;
    phone: string | null;
  };
  activity: CspPartnerAdminActivity[];
  persistence: { businessIdentityStored: boolean };
};

export type CspPartnerAdminDetailResult =
  | { kind: "found"; detail: CspPartnerAdminDetail }
  | { kind: "not_found" }
  | { kind: "error" };

/** Minimal contact data for status notifications. Never contains tokens. */
export type CspPartnerEmailContact = {
  email: string;
  emailVerified: boolean;
  displayName: string | null;
  locale: string | null;
  authUserId: string | null;
};

type Row = Record<string, unknown>;
type ServiceClient = ReturnType<typeof createServiceRoleClient>;

export function isCspPartnerId(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

async function loadOptionalColumns(admin: ServiceClient, partnerId: string): Promise<Row | null> {
  const all = await admin
    .from("csp_partner_profiles")
    .select(OPTIONAL_COLUMNS.join(", "))
    .eq("id", partnerId)
    .maybeSingle();
  if (!all.error) return (all.data as unknown as Row | null) ?? {};

  // At least one column is missing — probe individually and keep what exists.
  const merged: Row = {};
  let anyExists = false;
  for (const column of OPTIONAL_COLUMNS) {
    const one = await admin.from("csp_partner_profiles").select(column).eq("id", partnerId).maybeSingle();
    if (one.error) continue;
    anyExists = true;
    Object.assign(merged, (one.data as unknown as Row | null) ?? {});
  }
  return anyExists ? merged : null;
}

async function loadAuthIdentity(admin: ServiceClient, authUserId: string | null) {
  if (!authUserId) return { email: null, emailVerified: false, locale: null };
  try {
    const { data, error } = await admin.auth.admin.getUserById(authUserId);
    if (error || !data?.user) return { email: null, emailVerified: false, locale: null };
    const meta = (data.user.user_metadata ?? {}) as Row;
    return {
      email: data.user.email ?? null,
      emailVerified: Boolean(data.user.email_confirmed_at),
      locale: str(meta.preferred_locale) ?? str(meta.locale),
    };
  } catch {
    return { email: null, emailVerified: false, locale: null };
  }
}

async function loadActivity(admin: ServiceClient, partnerId: string): Promise<CspPartnerAdminActivity[]> {
  try {
    const { data, error } = await admin
      .from("csp_audit_events")
      .select("id, action, actor_kind, created_at")
      .eq("subject_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_LIMIT);
    if (error || !Array.isArray(data)) return [];
    return (data as Row[]).map((row) => ({
      id: String(row.id ?? ""),
      action: String(row.action ?? ""),
      actorKind: str(row.actor_kind),
      createdAt: str(row.created_at),
    }));
  } catch {
    return [];
  }
}

/** Server-only. Uses the service role; callers must have passed the platform privileged guard first. */
export async function fetchCspPartnerAdminDetail(partnerId: string): Promise<CspPartnerAdminDetailResult> {
  if (!isCspPartnerId(partnerId)) return { kind: "not_found" };
  try {
    const admin = createServiceRoleClient();
    const base = await admin.from("csp_partner_profiles").select(BASE_COLUMNS).eq("id", partnerId).maybeSingle();
    if (base.error) return { kind: "error" };
    const row = base.data as unknown as Row | null;
    if (!row) return { kind: "not_found" };

    const optional = await loadOptionalColumns(admin, partnerId);
    const identity = await loadAuthIdentity(admin, str(row.auth_user_id));
    const activity = await loadActivity(admin, partnerId);

    return {
      kind: "found",
      detail: {
        partner: {
          id: String(row.id),
          status: String(row.status ?? ""),
          displayName: String(row.display_name ?? ""),
          country: String(row.country ?? ""),
          createdAt: str(row.created_at),
          updatedAt: str(row.updated_at),
          email: identity.email,
          emailVerified: identity.emailVerified,
          legalBusinessName: str(optional?.legal_business_name),
          businessRegistrationNumber: str(optional?.business_registration_number),
          businessAddress: str(optional?.business_address),
          phone: str(optional?.phone),
        },
        activity,
        persistence: { businessIdentityStored: optional !== null },
      },
    };
  } catch {
    return { kind: "error" };
  }
}

export type CspPlatformPartnerListRow = {
  id: string;
  status: string;
  display_name: string | null;
  country: string | null;
  created_at: string | null;
};

export type CspPlatformPartnerListResult =
  | { kind: "ok"; partners: CspPlatformPartnerListRow[] }
  | { kind: "error" };

const LIST_LIMIT = 500;

/**
 * Server-only. Lists CSP partner profiles for Platform Admin directory.
 * Callers must have already passed the platform privileged guard.
 * Uses service role because `csp_get_platform_overview` currently returns aggregates only.
 */
export async function listCspPlatformPartners(): Promise<CspPlatformPartnerListResult> {
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_partner_profiles")
      .select("id, display_name, country, status, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT);
    if (error) return { kind: "error" };
    const rows = Array.isArray(data) ? (data as Row[]) : [];
    return {
      kind: "ok",
      partners: rows.flatMap((row) => {
        const id = str(row.id);
        if (!id || !isCspPartnerId(id)) return [];
        return [
          {
            id,
            status: str(row.status) ?? "unknown",
            display_name: str(row.display_name),
            country: str(row.country),
            created_at: str(row.created_at),
          },
        ];
      }),
    };
  } catch {
    return { kind: "error" };
  }
}

/** True when the auth user already has a CSP partner profile (any status). */
export async function authUserHasCspPartnerProfile(authUserId: string): Promise<boolean> {
  if (!authUserId) return false;
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_partner_profiles")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    return !error && Boolean(data);
  } catch {
    return false;
  }
}

/** Server-only. Resolves the recipient for a partner status notification; `null` when unavailable. */
export async function fetchCspPartnerEmailContact(partnerId: string): Promise<CspPartnerEmailContact | null> {
  if (!isCspPartnerId(partnerId)) return null;
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_partner_profiles")
      .select("auth_user_id, display_name")
      .eq("id", partnerId)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as unknown as Row;
    const identity = await loadAuthIdentity(admin, str(row.auth_user_id));
    if (!identity.email) return null;
    return {
      email: identity.email,
      emailVerified: identity.emailVerified,
      displayName: str(row.display_name),
      locale: identity.locale,
      authUserId: str(row.auth_user_id),
    };
  } catch {
    return null;
  }
}
