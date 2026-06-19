export type PlatformCustomerSuccessHubTab =
  | "overview"
  | "customer_health"
  | "onboarding"
  | "guidance"
  | "success_plans"
  | "adoption"
  | "risks"
  | "companion_insights"
  | "reports"
  | "executive";

export type CustomerHealthRow = {
  customer_id: string;
  customer_name: string;
  health_status: string;
  health_score: number;
  adoption_score?: number;
  success_status?: string;
};

export type OnboardingRow = {
  customer_id: string;
  customer_name: string;
  onboarding_pct: number;
  milestones_completed?: number;
};

export type GuidanceRow = {
  id: string;
  customer_id: string;
  customer_name: string;
  guidance_key: string;
  title: string;
  summary?: string;
  status: string;
  companion_message?: string;
};

export type RiskRow = {
  id: string;
  customer_id: string;
  customer_name: string;
  risk_type: string;
  severity: string;
  title: string;
  summary?: string;
  status: string;
  companion_recommendation?: string;
};

export type PlaybookRow = {
  id: string;
  playbook_key: string;
  title: string;
  description?: string;
  playbook_type: string;
  steps?: unknown;
  is_active?: boolean;
};

export type PlatformCustomerSuccessHubCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  overview?: Record<string, string | number | undefined>;
  customer_health?: CustomerHealthRow[];
  onboarding?: OnboardingRow[];
  guidance?: GuidanceRow[];
  success_plans?: Record<string, unknown>[];
  adoption?: Record<string, unknown>[];
  business_pack_tracking?: Record<string, unknown>[];
  risks?: RiskRow[];
  companion_insights?: Record<string, unknown>;
  proactive_assistance?: Record<string, unknown>;
  expansion_opportunities?: Record<string, unknown>[];
  growth_partners?: Record<string, unknown>[];
  journey_timeline?: Record<string, unknown>[];
  knowledge_integration?: Record<string, unknown>[];
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  playbooks?: PlaybookRow[];
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type PlatformCustomerSuccessHubLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<PlatformCustomerSuccessHubTab, string>;
  overview: Record<string, string>;
  health: Record<string, string>;
  onboarding: Record<string, string>;
  guidance: Record<string, string>;
  risks: Record<string, string>;
  companion: Record<string, string>;
  executive: Record<string, string>;
  reports: Record<string, string>;
  playbooks: Record<string, string>;
  actions: Record<string, string>;
  healthStatuses: Record<string, string>;
  riskTypes: Record<string, string>;
  severities: Record<string, string>;
  playbookTypes: Record<string, string>;
  legacyLink: string;
};
