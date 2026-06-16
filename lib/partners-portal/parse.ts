import type {
  PartnersPortalAccess,
  PartnersPortalDashboard,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parsePartnersPortalAccess(raw: unknown): PartnersPortalAccess {
  const row = asRecord(raw) ?? {};
  return {
    has_access: row.has_access === true,
    role: asString(row.role, "none"),
  };
}

export function parsePartnersPortalDashboard(raw: unknown): PartnersPortalDashboard | null {
  const row = asRecord(raw);
  if (!row) return null;

  const conversion = asRecord(row.conversion_metrics) ?? {};
  const monthly = asRecord(row.monthly_performance_summary) ?? {};
  const referrals = asRecord(row.referral_statistics) ?? {};

  const pipeline = Array.isArray(row.pipeline_overview)
    ? row.pipeline_overview.map((item) => {
        const s = asRecord(item) ?? {};
        return { stage: asString(s.stage), count: asNumber(s.count) };
      })
    : [];

  const followUps = Array.isArray(row.upcoming_follow_ups)
    ? row.upcoming_follow_ups.map((item) => {
        const f = asRecord(item) ?? {};
        return {
          id: asString(f.id),
          company_name: asString(f.company_name),
          contact_name: asString(f.contact_name),
          lead_status: asString(f.lead_status),
          follow_up_at: asString(f.follow_up_at),
        };
      })
    : [];

  const rankings = Array.isArray(row.partner_rankings)
    ? row.partner_rankings.map((item) => {
        const r = asRecord(item) ?? {};
        return {
          rank: asNumber(r.rank),
          label: asString(r.label),
          score: asNumber(r.score),
        };
      })
    : [];

  return {
    principle: asString(row.principle),
    access_role: asString(row.access_role),
    leads_assigned: asNumber(row.leads_assigned),
    conversion_metrics: {
      conversion_rate_pct: asNumber(conversion.conversion_rate_pct),
      converted: asNumber(conversion.converted),
      total_leads: asNumber(conversion.total_leads),
    },
    pipeline_overview: pipeline,
    upcoming_follow_ups: followUps,
    partner_rankings: rankings,
    monthly_performance_summary: {
      leads_this_month: asNumber(monthly.leads_this_month),
      converted_customers: asNumber(monthly.converted_customers),
      pending_commissions: asNumber(monthly.pending_commissions),
      upcoming_payouts: asNumber(monthly.upcoming_payouts),
    },
    referral_statistics: {
      active: asNumber(referrals.active),
      converted: asNumber(referrals.converted),
      invited: asNumber(referrals.invited),
    },
    certification_progress: asNumber(row.certification_progress),
    certification_status: asString(row.certification_status, "pending"),
    privacy_note: asString(row.privacy_note),
  };
}
