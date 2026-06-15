import type {
  AipifyHostsReferralCard,
  AipifyHostsReferralDashboard,
  GenerateReferralLinkResult,
  HostsGrowthPartnerSummary,
  HostsReferralAsset,
  HostsReferralEvent,
  HostsReferralLink,
  HostsReferralRecord,
  HostsReferralReward,
  HostsReferralRewardCatalogItem,
  HostsReferralWidgets,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseWidgets(data: unknown): HostsReferralWidgets {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    referrals_this_month: Number(d.referrals_this_month ?? 0),
    active_referrals: Number(d.active_referrals ?? 0),
    pending_rewards: Number(d.pending_rewards ?? 0),
    lifetime_referrals: Number(d.lifetime_referrals ?? 0),
  };
}

function parseLink(data: unknown): HostsReferralLink | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.referral_code) return null;
  return {
    referral_role: typeof d.referral_role === "string" ? d.referral_role : "host",
    referral_code: String(d.referral_code),
    referral_url: typeof d.referral_url === "string" ? d.referral_url : "",
    is_active: Boolean(d.is_active ?? true),
  };
}

function parseReferral(data: unknown): HostsReferralRecord | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    referral_key: typeof d.referral_key === "string" ? d.referral_key : "",
    referral_role: typeof d.referral_role === "string" ? d.referral_role : "host",
    referred_label: typeof d.referred_label === "string" ? d.referred_label : "",
    status: typeof d.status === "string" ? d.status : "invited",
    conversion_at: typeof d.conversion_at === "string" ? d.conversion_at : null,
    created_at: typeof d.created_at === "string" ? d.created_at : "",
    updated_at: typeof d.updated_at === "string" ? d.updated_at : "",
  };
}

function parseReward(data: unknown): HostsReferralReward | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    referral_id: typeof d.referral_id === "string" ? d.referral_id : null,
    reward_type: typeof d.reward_type === "string" ? d.reward_type : "fixed",
    reward_label: typeof d.reward_label === "string" ? d.reward_label : "",
    reward_value: d.reward_value !== undefined && d.reward_value !== null ? Number(d.reward_value) : null,
    status: typeof d.status === "string" ? d.status : "pending",
    unlocked_at: typeof d.unlocked_at === "string" ? d.unlocked_at : null,
    created_at: typeof d.created_at === "string" ? d.created_at : "",
  };
}

function parseGrowthPartner(data: unknown): HostsGrowthPartnerSummary {
  const d = (data ?? {}) as Record<string, unknown>;
  const commission = (typeof d.commission_summary === "object" && d.commission_summary
    ? d.commission_summary
    : {}) as Record<string, unknown>;
  return {
    enabled: Boolean(d.enabled),
    accounts_oversight: d.accounts_oversight !== undefined ? Number(d.accounts_oversight) : undefined,
    commission_summary: d.commission_summary
      ? {
          pending: Number(commission.pending ?? 0),
          paid: Number(commission.paid ?? 0),
          currency: typeof commission.currency === "string" ? commission.currency : "NOK",
        }
      : undefined,
    conversion_rate_pct: d.conversion_rate_pct !== undefined ? Number(d.conversion_rate_pct) : undefined,
    reporting_period: typeof d.reporting_period === "string" ? d.reporting_period : undefined,
  };
}

export function parseAipifyHostsReferralDashboard(data: unknown): AipifyHostsReferralDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_5",
    referral_role: typeof d.referral_role === "string" ? d.referral_role : "host",
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    modules: asArray(d.modules),
    governance: (typeof d.governance === "object" && d.governance ? d.governance : {
      principle: "",
      audit_required: true,
      prevent_duplicate_referrals: true,
      prevent_self_referrals: true,
      reward_history_tracked: true,
    }) as AipifyHostsReferralDashboard["governance"],
    reward_catalog: asArray<HostsReferralRewardCatalogItem>(d.reward_catalog),
    knowledge_categories: asArray<string>(d.knowledge_categories),
    notification_triggers: asArray<string>(d.notification_triggers),
    referral_roles: asArray<string>(d.referral_roles),
    referral_statuses: asArray<string>(d.referral_statuses),
    reward_types: asArray<string>(d.reward_types),
    widgets: parseWidgets(d.widgets),
    referral_links: asArray<unknown>(d.referral_links).map(parseLink).filter(Boolean) as HostsReferralLink[],
    referrals: asArray<unknown>(d.referrals).map(parseReferral).filter(Boolean) as HostsReferralRecord[],
    rewards: asArray<unknown>(d.rewards).map(parseReward).filter(Boolean) as HostsReferralReward[],
    recent_events: asArray<HostsReferralEvent>(d.recent_events),
    growth_partner: parseGrowthPartner(d.growth_partner),
    referral_assets: asArray<HostsReferralAsset>(d.referral_assets),
  };
}

export function parseAipifyHostsReferralCard(data: unknown): AipifyHostsReferralCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? d.package_key : undefined,
    referral_role: typeof d.referral_role === "string" ? d.referral_role : undefined,
    widgets: d.widgets ? parseWidgets(d.widgets) : undefined,
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}

export function parseGenerateReferralLinkResult(data: unknown): GenerateReferralLinkResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    referral_role: typeof d.referral_role === "string" ? d.referral_role : undefined,
    referral_code: typeof d.referral_code === "string" ? d.referral_code : undefined,
    referral_url: typeof d.referral_url === "string" ? d.referral_url : undefined,
    download_assets_route: typeof d.download_assets_route === "string" ? d.download_assets_route : undefined,
  };
}
