export type ExcellenceQualityReview = {
  id?: string;
  review_key?: string;
  review_title?: string;
  review_type?: string;
  target_scope?: string;
  status?: string;
  score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ExcellenceConsistencyCheck = {
  id?: string;
  check_key?: string;
  check_title?: string;
  check_category?: string;
  status?: string;
  severity?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExcellencePlatformStandard = {
  id?: string;
  standard_key?: string;
  standard_title?: string;
  standard_type?: string;
  status?: string;
  version?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExcellenceReviewSchedule = {
  id?: string;
  schedule_key?: string;
  schedule_title?: string;
  schedule_type?: string;
  status?: string;
  next_review_at?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExcellenceQualityScore = {
  id?: string;
  score_key?: string;
  score_title?: string;
  score_dimension?: string;
  score_value?: number;
  trend?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExcellenceIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ExcellenceAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type PlatformExcellenceCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  quality_guardian_route?: string;
  customer_experience_route?: string;
  observability_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  core_languages?: string[];
  quality_guardian_targets?: string[];
  quality_reviews?: ExcellenceQualityReview[];
  consistency_checks?: ExcellenceConsistencyCheck[];
  platform_standards?: ExcellencePlatformStandard[];
  review_schedules?: ExcellenceReviewSchedule[];
  quality_scores?: ExcellenceQualityScore[];
  intelligence_signals?: ExcellenceIntelligenceSignal[];
  advisor_signals?: ExcellenceAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
