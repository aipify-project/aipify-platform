import type {
  ExecutivePortfolioDetail,
  ExecutivePortfolioOverview,
  ExecutivePortfolioPackCard,
  ExecutivePortfolioReviewResult,
  PortfolioInsights,
  PortfolioOverviewSummary,
  PortfolioRecommendation,
  PortfolioReview,
  PortfolioTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): PortfolioRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key) || undefined };
  });
}

function parseInsightItems(raw: unknown): { pack_key?: string; name?: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { pack_key: str(d.pack_key) || undefined, name: str(d.name) || undefined };
  });
}

function parseInsights(raw: unknown): PortfolioInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    highest_performing: parseInsightItems(d.highest_performing),
    underutilized: parseInsightItems(d.underutilized),
    strongest_roi: parseInsightItems(d.strongest_roi),
    governance_attention: parseInsightItems(d.governance_attention),
    optimization_opportunities: parseInsightItems(d.optimization_opportunities),
    maturity_observations: parseStringArray(d.maturity_observations),
  };
}

function parseOverview(raw: unknown): PortfolioOverviewSummary | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    installed_packs: num(d.installed_packs),
    active_packs: num(d.active_packs),
    adoption_overview: num(d.adoption_overview),
    governance_overview: num(d.governance_overview),
    compliance_overview: str(d.compliance_overview),
    value_overview: num(d.value_overview),
    lifecycle_overview: str(d.lifecycle_overview),
    ecosystem_overview: str(d.ecosystem_overview),
  };
}

function parsePackCard(raw: unknown): ExecutivePortfolioPackCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id || d.pack_key),
    pack_key: str(d.pack_key),
    name: str(d.name),
    portfolio_status: str(d.portfolio_status),
    maturity_level: str(d.maturity_level),
    priority_level: str(d.priority_level),
    adoption_score: num(d.adoption_score),
    value_score: num(d.value_score),
    governance_score: num(d.governance_score),
    compliance_status: str(d.compliance_status),
    lifecycle_stage: str(d.lifecycle_stage),
    executive_sponsor: str(d.executive_sponsor),
    recommended_action: str(d.recommended_action),
    estimated_value: num(d.estimated_value),
    is_active: d.is_active === true,
  };
}

function parseReviews(raw: unknown): PortfolioReview[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      review_type: str(d.review_type),
      review_outcome: str(d.review_outcome),
      reviewer_name: str(d.reviewer_name),
      governance_notes: str(d.governance_notes),
      reviewed_at: str(d.reviewed_at) || undefined,
    };
  });
}

function parseTimeline(raw: unknown): PortfolioTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      pack_key: str(d.pack_key) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parseExecutivePortfolioOverview(data: unknown): ExecutivePortfolioOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    can_review: d.can_review === true,
    has_portfolio_data: d.has_portfolio_data === true,
    portfolio_health_score: num(d.portfolio_health_score),
    total_installed: num(d.total_installed),
    total_active: num(d.total_active),
    total_value_realized: num(d.total_value_realized),
    packs_requiring_attention: num(d.packs_requiring_attention),
    portfolio_growth_trend: str(d.portfolio_growth_trend),
    portfolio_maturity_level: str(d.portfolio_maturity_level),
    executive_summary: str(d.executive_summary),
    portfolio_overview: parseOverview(d.portfolio_overview),
    packs: Array.isArray(d.packs) ? d.packs.map((p) => parsePackCard(p)).filter(Boolean) as ExecutivePortfolioPackCard[] : [],
    insights: parseInsights(d.insights),
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseExecutivePortfolioDetail(data: unknown): ExecutivePortfolioDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", pack_key: "", name: "", portfolio_status: "", maturity_level: "",
      priority_level: "", adoption_score: 0, value_score: 0, governance_score: 0,
      compliance_status: "", lifecycle_stage: "", executive_sponsor: "", recommended_action: "",
      estimated_value: 0,
    };
  }
  const d = data as Record<string, unknown>;
  const card = parsePackCard(d);
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.pack_key), pack_key: str(d.pack_key), name: str(d.name),
      portfolio_status: str(d.portfolio_status), maturity_level: str(d.maturity_level),
      priority_level: str(d.priority_level), adoption_score: num(d.adoption_score),
      value_score: num(d.value_score), governance_score: num(d.governance_score),
      compliance_status: str(d.compliance_status), lifecycle_stage: str(d.lifecycle_stage),
      executive_sponsor: str(d.executive_sponsor), recommended_action: str(d.recommended_action),
      estimated_value: num(d.estimated_value),
    }),
    review_history: parseReviews(d.review_history),
    can_review: d.can_review === true,
    recommendations: parseRecommendations(d.recommendations),
  };
}

export function parseExecutivePortfolioRecommendations(data: unknown): PortfolioRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parseExecutivePortfolioTimeline(data: unknown): PortfolioTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parseExecutivePortfolioReviewResult(data: unknown): ExecutivePortfolioReviewResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    review_id: str(d.review_id) || undefined,
    pack_key: str(d.pack_key) || undefined,
    review_outcome: str(d.review_outcome) || undefined,
    message: str(d.message) || undefined,
  };
}
