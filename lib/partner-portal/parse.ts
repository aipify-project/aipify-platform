import type {
  PartnerPortalActivity,
  PartnerPortalDashboard,
  PartnerPortalProfile,
  PartnerPortalTeam,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function asStringArray(data: unknown): string[] {
  return asArray<unknown>(data).map(String);
}

function parseTwoFactor(data: unknown) {
  const d = asRecord(data);
  return {
    enabled: Boolean(d.enabled),
    required_for: asStringArray(d.required_for),
    settings_route: String(d.settings_route ?? "/partner/settings"),
  };
}

export function parsePartnerPortalProfile(data: unknown): PartnerPortalProfile | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const profile = asRecord(d.profile);
  const onboarding = asRecord(d.onboarding);
  return {
    has_access: true,
    org_id: String(d.org_id ?? ""),
    org_name: String(d.org_name ?? ""),
    partner_type: String(d.partner_type ?? "registered"),
    activation_status: String(d.activation_status ?? "pending"),
    certification_status: String(d.certification_status ?? "pending"),
    team_role: String(d.team_role ?? "viewer"),
    permissions: asRecord(d.permissions) as Record<string, boolean>,
    two_factor: parseTwoFactor(d.two_factor),
    profile: {
      company_name: String(profile.company_name ?? ""),
      organization_number: String(profile.organization_number ?? ""),
      vat_number: String(profile.vat_number ?? ""),
      business_address: String(profile.business_address ?? ""),
      contact_email: String(profile.contact_email ?? ""),
      contact_phone: String(profile.contact_phone ?? ""),
      website: String(profile.website ?? ""),
      country_code: String(profile.country_code ?? ""),
      preferred_language: String(profile.preferred_language ?? "en"),
      bank_account_holder: String(profile.bank_account_holder ?? ""),
      bank_account_number: String(profile.bank_account_number ?? ""),
      bank_routing: String(profile.bank_routing ?? ""),
      tax_information: String(profile.tax_information ?? ""),
    },
    verifications: asArray<unknown>(d.verifications).map((row) => {
      const v = asRecord(row);
      return {
        verification_type: String(v.verification_type ?? ""),
        verification_status: String(v.verification_status ?? "pending"),
        verified_at: String(v.verified_at ?? ""),
      };
    }),
    onboarding: {
      current_step: String(onboarding.current_step ?? "create_account"),
      completion_pct: Number(onboarding.completion_pct ?? 0),
      missing_requirements: asStringArray(onboarding.missing_requirements),
      recommended_next_step: String(onboarding.recommended_next_step ?? "verify_business"),
    },
    business_verified: Boolean(d.business_verified),
  };
}

export function parsePartnerPortalDashboard(data: unknown): PartnerPortalDashboard | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const perf = asRecord(d.performance_overview);
  const onboarding = asRecord(d.onboarding);
  return {
    has_access: true,
    org_id: String(d.org_id ?? ""),
    org_name: String(d.org_name ?? ""),
    partner_type: String(d.partner_type ?? "registered"),
    activation_status: String(d.activation_status ?? "pending"),
    positioning: String(d.positioning ?? ""),
    health_score: Number(d.health_score ?? 0),
    active_opportunities: Number(d.active_opportunities ?? 0),
    customers_introduced: Number(d.customers_introduced ?? 0),
    pending_commissions: Number(d.pending_commissions ?? 0),
    pending_settlements: Number(d.pending_settlements ?? 0),
    certification_status: String(d.certification_status ?? "pending"),
    certification_progress: Number(d.certification_progress ?? 0),
    performance_overview: {
      leads_this_month: Number(perf.leads_this_month ?? 0),
      active_referrals: Number(perf.active_referrals ?? 0),
      conversion_rate_pct: Number(perf.conversion_rate_pct ?? 0),
    },
    onboarding: {
      completion_pct: Number(onboarding.completion_pct ?? 0),
      missing_requirements: asStringArray(onboarding.missing_requirements),
      recommended_next_step: String(onboarding.recommended_next_step ?? "verify_business"),
    },
    notifications_unread: Number(d.notifications_unread ?? 0),
    routes: asArray<unknown>(d.routes).map((row) => {
      const r = asRecord(row);
      return { key: String(r.key ?? ""), route: String(r.route ?? "") };
    }),
    two_factor: parseTwoFactor(d.two_factor),
  };
}

export function parsePartnerPortalTeam(data: unknown): PartnerPortalTeam | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const perf = asRecord(d.team_performance);
  return {
    has_access: true,
    org_id: String(d.org_id ?? ""),
    team_role: String(d.team_role ?? "viewer"),
    permissions: asRecord(d.permissions) as Record<string, boolean>,
    roles: asStringArray(d.roles),
    members: asArray<unknown>(d.members).map((row) => {
      const m = asRecord(row);
      return {
        id: String(m.id ?? ""),
        member_name: String(m.member_name ?? ""),
        member_email: String(m.member_email ?? ""),
        team_role: String(m.team_role ?? ""),
        member_status: String(m.member_status ?? ""),
        invited_at: String(m.invited_at ?? ""),
        joined_at: String(m.joined_at ?? ""),
        permissions: asRecord(m.permissions) as Record<string, boolean>,
      };
    }),
    team_performance: {
      active_members: Number(perf.active_members ?? 0),
      invited_members: Number(perf.invited_members ?? 0),
    },
  };
}

export function parsePartnerPortalActivity(data: unknown): PartnerPortalActivity | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    org_id: String(d.org_id ?? ""),
    activity: asArray<unknown>(d.activity).map((row) => {
      const a = asRecord(row);
      return {
        id: String(a.id ?? ""),
        activity_type: String(a.activity_type ?? ""),
        title: String(a.title ?? ""),
        summary: String(a.summary ?? ""),
        created_at: String(a.created_at ?? ""),
      };
    }),
    notifications: asArray<unknown>(d.notifications).map((row) => {
      const n = asRecord(row);
      return {
        id: String(n.id ?? ""),
        notification_type: String(n.notification_type ?? ""),
        title: String(n.title ?? ""),
        body: String(n.body ?? ""),
        read_at: String(n.read_at ?? ""),
        created_at: String(n.created_at ?? ""),
      };
    }),
  };
}
