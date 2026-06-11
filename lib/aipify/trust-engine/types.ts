export const DECISION_TYPES = [
  "governance",
  "policy",
  "marketplace",
  "blueprint",
  "desktop",
  "action",
  "briefing",
  "support",
  "knowledge_gap",
  "automation",
  "value",
  "evolution",
  "learning",
  "security",
  "agent_collaboration",
] as const;

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export const FEEDBACK_RATINGS = ["helpful", "unclear", "incorrect", "needs_more_detail"] as const;

export type DecisionExplanation = {
  id: string;
  decision_id: string;
  decision_type: string;
  source_module: string;
  summary: string;
  reasoning?: string | null;
  information_used: string[];
  rules_applied: string[];
  confidence_level: string;
  alternatives_considered: string[];
  recommended_actions: string[];
  explanation_layers?: Record<string, string>;
  overridden?: boolean;
  escalated?: boolean;
  created_at?: string;
};

export type ExplanationEvent = {
  event_type: string;
  actor?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type TrustMetric = {
  metric_key: string;
  metric_value: number;
  recorded_at?: string;
};

export type TrustCard = {
  has_customer: boolean;
  trust_score?: number;
  explanation_count?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type TrustDashboard = {
  has_customer: boolean;
  trust_score?: number;
  coverage?: number;
  view_rate?: number;
  override_rate?: number;
  escalations?: number;
  explanations: DecisionExplanation[];
  metrics: TrustMetric[];
  recent_feedback: Array<{ rating: string; comment?: string | null; created_at?: string }>;
};

export type ExplanationDetail = {
  explanation: DecisionExplanation;
  events: ExplanationEvent[];
};

export type TrustScoreResult = {
  trust_score?: number;
  explanation_coverage?: number;
  view_rate?: number;
  satisfaction?: number;
  override_rate?: number;
  escalations?: number;
  total_explanations?: number;
};
