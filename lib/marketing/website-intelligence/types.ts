import type { WebsiteIntelligenceSection } from "./constants";

export type WebsiteIntelligenceOverview = {
  visitors: number;
  page_views: number;
  conversions: number;
  demo_requests: number;
  partner_applications: number;
  organic_sessions: number;
};

export type FunnelStageRow = {
  stage: string;
  count: number;
  rate: number;
};

export type CtaPerformanceRow = {
  label: string;
  views: number;
  clicks: number;
  conversion_rate: number;
};

export type ContentPerformanceRow = {
  content_type: string;
  views: number;
  engagement_events: number;
  conversions: number;
};

export type LeadSourceRow = {
  source: string;
  sessions: number;
  conversions: number;
};

export type PageMetricRow = {
  page_path: string;
  views?: number;
  sessions?: number;
  exit_events?: number;
  exit_rate?: number;
};

export type CompanionAdvisorRow = {
  question: string;
  recommendation: string;
  priority: string;
};

export type WebsiteIntelligenceBundle = {
  section: WebsiteIntelligenceSection;
  privacy_note: string;
  period_days: number;
  overview: WebsiteIntelligenceOverview;
  traffic: {
    top_pages: PageMetricRow[];
    landing_pages: PageMetricRow[];
    exit_pages: PageMetricRow[];
  };
  conversions: {
    total: number;
    demo_requests: number;
    partner_applications: number;
  };
  funnels: { stages: FunnelStageRow[] };
  ctas: CtaPerformanceRow[];
  content: ContentPerformanceRow[];
  partners: {
    applications: number;
    by_country: Array<{ country: string; count: number }>;
  };
  campaigns: Array<{ campaign: string; events: number }>;
  lead_sources: LeadSourceRow[];
  demos: {
    total_requests: number;
    by_industry: Array<{ industry: string; count: number }>;
    by_country: Array<{ country: string; count: number }>;
    by_pack_interest: Array<{ pack: string; count: number }>;
  };
  content_gaps: PageMetricRow[];
  companion_advisor: CompanionAdvisorRow[];
  heatmap: Record<string, unknown>;
  reports: {
    available: string[];
    optimization_rule: string;
  };
  growth_loop: string[];
};

export type MarketingWebsiteEventPayload = {
  session_id: string;
  event_type: string;
  page_path?: string;
  previous_path?: string;
  cta_label?: string;
  scroll_depth?: number;
  content_type?: string;
  funnel_stage?: string;
  lead_source?: string;
  campaign_source?: string;
  locale?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
};

export type WebsiteIntelligenceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  privacyNote: string;
  optimizationRule: string;
  growthLoopTitle: string;
  periodLabel: string;
  sections: Record<WebsiteIntelligenceSection, string>;
  overview: Record<string, string>;
  traffic: Record<string, string>;
  conversions: Record<string, string>;
  funnels: Record<string, string>;
  ctas: Record<string, string>;
  content: Record<string, string>;
  partners: Record<string, string>;
  campaigns: Record<string, string>;
  reports: Record<string, string>;
  advisor: Record<string, string>;
  heatmap: Record<string, string>;
  demos: Record<string, string>;
  leadSources: Record<string, string>;
};
