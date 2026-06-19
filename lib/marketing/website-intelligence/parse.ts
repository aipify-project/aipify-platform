import type {
  CompanionAdvisorRow,
  ContentPerformanceRow,
  CtaPerformanceRow,
  FunnelStageRow,
  LeadSourceRow,
  PageMetricRow,
  WebsiteIntelligenceBundle,
  WebsiteIntelligenceOverview,
} from "./types";

function num(v: unknown): number {
  return typeof v === "number" ? v : Number(v ?? 0);
}

function str(v: unknown): string {
  return typeof v === "string" ? v : String(v ?? "");
}

function rows<T>(v: unknown, map: (row: Record<string, unknown>) => T): T[] {
  if (!Array.isArray(v)) return [];
  return v.map((row) => map((row ?? {}) as Record<string, unknown>));
}

export function parseWebsiteIntelligence(raw: unknown): WebsiteIntelligenceBundle {
  const d = (raw ?? {}) as Record<string, unknown>;
  const overviewRaw = (d.overview ?? {}) as Record<string, unknown>;
  const overview: WebsiteIntelligenceOverview = {
    visitors: num(overviewRaw.visitors),
    page_views: num(overviewRaw.page_views),
    conversions: num(overviewRaw.conversions),
    demo_requests: num(overviewRaw.demo_requests),
    partner_applications: num(overviewRaw.partner_applications),
    organic_sessions: num(overviewRaw.organic_sessions),
  };

  const trafficRaw = (d.traffic ?? {}) as Record<string, unknown>;
  const conversionsRaw = (d.conversions ?? {}) as Record<string, unknown>;
  const funnelsRaw = (d.funnels ?? {}) as Record<string, unknown>;
  const partnersRaw = (d.partners ?? {}) as Record<string, unknown>;
  const demosRaw = (d.demos ?? {}) as Record<string, unknown>;
  const reportsRaw = (d.reports ?? {}) as Record<string, unknown>;

  return {
    section: str(d.section) as WebsiteIntelligenceBundle["section"],
    privacy_note: str(d.privacy_note),
    period_days: num(d.period_days) || 30,
    overview,
    traffic: {
      top_pages: rows(trafficRaw.top_pages, (r) => ({ page_path: str(r.page_path), views: num(r.views) })),
      landing_pages: rows(trafficRaw.landing_pages, (r) => ({ page_path: str(r.page_path), sessions: num(r.sessions) })),
      exit_pages: rows(trafficRaw.exit_pages, (r) => ({
        page_path: str(r.page_path),
        exit_events: num(r.exit_events),
        views: num(r.views),
        exit_rate: num(r.exit_rate),
      })),
    },
    conversions: {
      total: num(conversionsRaw.total),
      demo_requests: num(conversionsRaw.demo_requests),
      partner_applications: num(conversionsRaw.partner_applications),
    },
    funnels: {
      stages: rows(funnelsRaw.stages, (r) => ({
        stage: str(r.stage),
        count: num(r.count),
        rate: num(r.rate),
      })) as FunnelStageRow[],
    },
    ctas: rows(d.ctas, (r) => ({
      label: str(r.label),
      views: num(r.views),
      clicks: num(r.clicks),
      conversion_rate: num(r.conversion_rate),
    })) as CtaPerformanceRow[],
    content: rows(d.content, (r) => ({
      content_type: str(r.content_type),
      views: num(r.views),
      engagement_events: num(r.engagement_events),
      conversions: num(r.conversions),
    })) as ContentPerformanceRow[],
    partners: {
      applications: num(partnersRaw.applications),
      by_country: rows(partnersRaw.by_country, (r) => ({ country: str(r.country), count: num(r.count) })),
    },
    campaigns: rows(d.campaigns, (r) => ({ campaign: str(r.campaign), events: num(r.events) })),
    lead_sources: rows(d.lead_sources, (r) => ({
      source: str(r.source),
      sessions: num(r.sessions),
      conversions: num(r.conversions),
    })) as LeadSourceRow[],
    demos: {
      total_requests: num(demosRaw.total_requests),
      by_industry: rows(demosRaw.by_industry, (r) => ({ industry: str(r.industry), count: num(r.count) })),
      by_country: rows(demosRaw.by_country, (r) => ({ country: str(r.country), count: num(r.count) })),
      by_pack_interest: rows(demosRaw.by_pack_interest, (r) => ({ pack: str(r.pack), count: num(r.count) })),
    },
    content_gaps: rows(d.content_gaps, (r) => ({
      page_path: str(r.page_path),
      exit_events: num(r.exit_events),
      views: num(r.views),
      exit_rate: num(r.exit_rate),
    })) as PageMetricRow[],
    companion_advisor: rows(d.companion_advisor, (r) => ({
      question: str(r.question),
      recommendation: str(r.recommendation),
      priority: str(r.priority),
    })) as CompanionAdvisorRow[],
    heatmap: (d.heatmap ?? {}) as Record<string, unknown>,
    reports: {
      available: Array.isArray(reportsRaw.available) ? reportsRaw.available.map(String) : [],
      optimization_rule: str(reportsRaw.optimization_rule),
    },
    growth_loop: Array.isArray(d.growth_loop) ? d.growth_loop.map(String) : [],
  };
}
