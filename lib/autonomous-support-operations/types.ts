export type AutonomyLevel = 0 | 1 | 2 | 3;

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ConfidenceBand = "autonomous" | "draft" | "review" | "escalate";

export type TriageAction =
  | "generate_draft"
  | "reply_automatically"
  | "escalate_to_human"
  | "human_review"
  | "request_information"
  | "assign_internally";

export type AsoSettings = {
  autonomy_level: number;
  proactive_support_enabled: boolean;
  knowledge_gap_detection_enabled: boolean;
  self_healing_enabled: boolean;
  human_collaboration_mode: boolean;
  channels_enabled: Record<string, boolean>;
  confidence_auto_reply_threshold: number;
  confidence_draft_threshold: number;
  privacy_settings: Record<string, unknown>;
};

export type AutomationReadiness = {
  readiness_score: number;
  level: string;
  readiness_label: string;
  factors: Record<string, unknown>;
  recommended_autonomy_level: number;
};

export type SupportOperationsCenter = {
  has_customer: boolean;
  settings?: AsoSettings;
  autonomy_levels?: Array<{ level: number; name: string; description: string }>;
  readiness?: AutomationReadiness;
  categories?: Array<Record<string, unknown>>;
  open_cases?: Array<Record<string, unknown>>;
  performance?: Record<string, unknown>;
  knowledge_gaps?: Array<Record<string, unknown>>;
  proactive_alerts?: Array<Record<string, unknown>>;
  approval_queue?: Array<Record<string, unknown>>;
  high_risk_cases?: Array<Record<string, unknown>>;
  audit_log?: Array<Record<string, unknown>>;
  ethical_principles?: string[];
  privacy_note?: string;
  integrations?: Record<string, string>;
};

export type TriageResult = {
  has_customer: boolean;
  case_id?: string;
  category?: string;
  risk_level?: RiskLevel;
  confidence_score?: number;
  confidence_band?: ConfidenceBand;
  triage_action?: string;
  status?: string;
  escalate?: boolean;
  escalation_reason?: string | null;
  case_summary?: string;
  ethical_note?: string;
};
