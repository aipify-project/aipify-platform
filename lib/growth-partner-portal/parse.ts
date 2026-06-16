import type {
  GrowthPartnerAcademyModule,
  GrowthPartnerAssetRow,
  GrowthPartnerCommissionRow,
  GrowthPartnerLeadRow,
  GrowthPartnerPayoutRow,
  GrowthPartnerPortalActionResult,
  GrowthPartnerPortalDashboard,
  GrowthPartnerPortalStats,
  GrowthPartnerReferralRow,
  GrowthPartnerTeamMember,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseLeads(data: unknown): GrowthPartnerLeadRow[] {
  return asArray<unknown>(data).map((row) => {
    const d = row as Record<string, unknown>;
    return {
      id: String(d.id),
      lead_key: String(d.lead_key ?? ""),
      company_name: String(d.company_name ?? ""),
      contact_name: String(d.contact_name ?? ""),
      contact_email: String(d.contact_email ?? ""),
      lead_status: String(d.lead_status ?? "new"),
      source: String(d.source ?? ""),
      notes: String(d.notes ?? ""),
      created_at: String(d.created_at ?? ""),
    };
  });
}

function parseReferrals(data: unknown): GrowthPartnerReferralRow[] {
  return asArray<unknown>(data).map((row) => {
    const d = row as Record<string, unknown>;
    return {
      id: String(d.id),
      referral_key: String(d.referral_key ?? ""),
      prospect_name: String(d.prospect_name ?? ""),
      prospect_email: String(d.prospect_email ?? ""),
      referral_status: String(d.referral_status ?? "invited"),
      invited_at: String(d.invited_at ?? ""),
      converted_at: String(d.converted_at ?? ""),
    };
  });
}

function parseCommissions(data: unknown): GrowthPartnerCommissionRow[] {
  return asArray<unknown>(data).map((row) => {
    const d = row as Record<string, unknown>;
    return {
      id: String(d.id),
      commission_key: String(d.commission_key ?? ""),
      customer_label: String(d.customer_label ?? ""),
      amount: Number(d.amount ?? 0),
      commission_status: String(d.commission_status ?? "pending"),
      expected_payout_date: String(d.expected_payout_date ?? ""),
      notes: String(d.notes ?? ""),
    };
  });
}

function parsePayouts(data: unknown): GrowthPartnerPayoutRow[] {
  return asArray<unknown>(data).map((row) => {
    const d = row as Record<string, unknown>;
    return {
      id: String(d.id),
      payout_key: String(d.payout_key ?? ""),
      payout_period: String(d.payout_period ?? ""),
      total_amount: Number(d.total_amount ?? 0),
      payout_status: String(d.payout_status ?? "scheduled"),
      scheduled_date: String(d.scheduled_date ?? ""),
      paid_at: String(d.paid_at ?? ""),
    };
  });
}

function parseStats(data: unknown): GrowthPartnerPortalStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    leads_this_month: Number(d.leads_this_month ?? 0),
    active_referrals: Number(d.active_referrals ?? 0),
    converted_customers: Number(d.converted_customers ?? 0),
    pending_commissions: Number(d.pending_commissions ?? 0),
    upcoming_payouts: Number(d.upcoming_payouts ?? 0),
    certification_status: String(d.certification_status ?? "pending"),
  };
}

export function parseGrowthPartnerPortalDashboard(data: unknown): GrowthPartnerPortalDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_access) return null;

  const academyRaw = d.academy as Record<string, unknown> | null;
  const settingsRaw = (d.settings ?? {}) as Record<string, unknown>;

  return {
    has_access: true,
    org_id: String(d.org_id ?? ""),
    org_name: String(d.org_name ?? ""),
    active_section: String(d.active_section ?? "dashboard"),
    team_role: String(d.team_role ?? "sales_member"),
    positioning: String(d.positioning ?? ""),
    governance: (d.governance as Record<string, boolean>) ?? {},
    lead_statuses: asArray<string>(d.lead_statuses),
    referral_statuses: asArray<string>(d.referral_statuses),
    commission_statuses: asArray<string>(d.commission_statuses),
    team_roles: asArray<string>(d.team_roles),
    stats: parseStats(d.stats),
    settings: {
      default_section: String(settingsRaw.default_section ?? "dashboard"),
      notification_email: String(settingsRaw.notification_email ?? ""),
    },
    leads: parseLeads(d.leads),
    referrals: parseReferrals(d.referrals),
    commissions: parseCommissions(d.commissions),
    payouts: parsePayouts(d.payouts),
    academy: academyRaw
      ? {
          modules: asArray<unknown>(academyRaw.modules).map((row) => {
            const m = row as Record<string, unknown>;
            return {
              id: String(m.id),
              module_key: String(m.module_key ?? ""),
              module_type: String(m.module_type ?? ""),
              title: String(m.title ?? ""),
              summary: String(m.summary ?? ""),
              progress_pct: Number(m.progress_pct ?? 0),
              completed: Boolean(m.completed),
            } satisfies GrowthPartnerAcademyModule;
          }),
          certification_progress: Number(academyRaw.certification_progress ?? 0),
        }
      : null,
    assets: asArray<unknown>(d.assets).map((row) => {
      const a = row as Record<string, unknown>;
      return {
        id: String(a.id),
        asset_key: String(a.asset_key ?? ""),
        asset_type: String(a.asset_type ?? ""),
        title: String(a.title ?? ""),
        description: String(a.description ?? ""),
        download_label: String(a.download_label ?? "Download"),
      } satisfies GrowthPartnerAssetRow;
    }),
    team: asArray<unknown>(d.team).map((row) => {
      const m = row as Record<string, unknown>;
      return {
        id: String(m.id),
        member_name: String(m.member_name ?? ""),
        member_email: String(m.member_email ?? ""),
        team_role: String(m.team_role ?? ""),
        member_status: String(m.member_status ?? ""),
        invited_at: String(m.invited_at ?? ""),
        joined_at: String(m.joined_at ?? ""),
      } satisfies GrowthPartnerTeamMember;
    }),
  };
}

export function parseGrowthPartnerPortalActionResult(data: unknown): GrowthPartnerPortalActionResult {
  if (!data || typeof data !== "object") return { success: false };
  const d = data as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
