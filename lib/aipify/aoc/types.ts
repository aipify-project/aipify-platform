export const WATCHER_TYPES = [
  "support",
  "knowledge",
  "quality",
  "governance",
  "action",
  "desktop",
  "security",
  "twin",
  "marketplace",
  "value",
] as const;

export const HEALTH_BANDS = ["excellent", "healthy", "attention", "risk", "critical"] as const;

export const REVIEW_TYPES = ["daily", "weekly", "executive"] as const;

export type AocHealthComponents = {
  support?: number;
  knowledge?: number;
  quality?: number;
  governance?: number;
  action?: number;
  communication?: number;
  security?: number;
  value?: number;
  twin?: number;
};

export type WatcherFinding = {
  id: string;
  watcher_type: string;
  severity: string;
  summary: string;
  recommendation?: string | null;
  status?: string;
  created_at?: string;
};

export type OperationalRecommendation = {
  id: string;
  category: string;
  title: string;
  explanation: string;
  expected_benefit?: string | null;
  risk_level: string;
  confidence_level: string;
  status?: string;
};

export type AocReview = {
  id: string;
  review_type: string;
  summary: string;
  created_at?: string;
};

export type WatcherInfo = {
  type: string;
  purpose: string;
};

export type AocCard = {
  has_customer: boolean;
  overall_score?: number;
  health_band?: string;
  open_findings?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type AocDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  overall_score?: number;
  health_band?: string;
  health_components?: AocHealthComponents;
  findings: WatcherFinding[];
  recommendations: OperationalRecommendation[];
  reviews: AocReview[];
  watchers: WatcherInfo[];
  integrations?: Record<string, string>;
};

export type WatcherFindingDetail = {
  finding: WatcherFinding & { evidence?: Record<string, unknown> };
  recommendation?: OperationalRecommendation & { suggested_steps?: string[] } | null;
  human_oversight_required?: boolean;
};

export type AocReviewResult = {
  review_id: string;
  review_type: string;
  summary: string;
  content: Record<string, unknown>;
};
