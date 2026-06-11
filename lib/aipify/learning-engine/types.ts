export const LEARNING_EVENT_TYPES = [
  "suggestion_approved",
  "suggestion_rejected",
  "action_completed",
  "action_dismissed",
  "automation_success",
  "automation_failed",
  "incident_false_positive",
  "support_answer_helpful",
  "support_answer_unhelpful",
  "knowledge_gap_resolved",
  "notification_muted",
  "brief_item_opened",
  "feedback_positive",
  "feedback_negative",
] as const;

export type LearningEvent = {
  id: string;
  source_module: string;
  source_id?: string | null;
  event_type: string;
  user_decision?: string | null;
  outcome?: string | null;
  explanation: string;
  created_at: string;
};

export type LearningPattern = {
  pattern_key: string;
  source_module: string;
  current_score: number;
  positive_count: number;
  negative_count: number;
  explanation: string;
};

export type LearningEngineCard = {
  has_customer: boolean;
  enabled?: boolean;
  total_events?: number;
  positive_feedback?: number;
  negative_feedback?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type LearningEngineDashboard = {
  has_customer: boolean;
  metrics: {
    total_events: number;
    positive_feedback: number;
    negative_feedback: number;
    false_positives_reduced: number;
    suggestions_improved: number;
    automations_improved: number;
    noisy_notifications_reduced: number;
  };
  top_patterns: LearningPattern[];
  recent_priority_adjustments: LearningEvent[];
  recent_events: LearningEvent[];
};

export type LearningEngineSettings = {
  enabled: boolean;
  allow_support_learning: boolean;
  allow_quality_learning: boolean;
  allow_automation_learning: boolean;
  allow_notification_learning: boolean;
  allow_briefing_learning: boolean;
  allow_action_learning: boolean;
  require_admin_review_rules: boolean;
  retention_days: number;
};

export type LearningRule = {
  id: string;
  rule_key: string;
  source_module: string;
  title: string;
  description: string;
  requires_review: boolean;
  is_active: boolean;
  updated_at: string;
};

export type LearningAuditEntry = {
  id: string;
  action_type: string;
  action_summary: string;
  created_at: string;
};
