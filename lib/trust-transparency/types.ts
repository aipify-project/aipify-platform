import type { TRUST_RISK_LEVELS } from "./constants";

export type TrustRiskLevel = (typeof TRUST_RISK_LEVELS)[number];

export type TransparencyItem = {
  item_key: string;
  section: string;
  action_title: string;
  why_summary: string;
  permissions_used: string | null;
  risk_level: TrustRiskLevel | string;
  user_control_hint: string | null;
  info_considered: string | null;
  alternatives: string | null;
  if_nothing_done: string | null;
  companion_label: string | null;
  approval_required: boolean;
  outcome: string | null;
  created_at: string | null;
};

export type SelfHealingEvent = {
  healing_key: string;
  what_failed: string;
  aipify_attempt: string;
  recovery_succeeded: boolean;
  downtime_prevented_minutes: number;
  manual_intervention_required: boolean;
  created_at: string | null;
};

export type AuditTimelineEntry = {
  audit_key: string;
  event_type: string;
  summary: string;
  actor_label: string | null;
  created_at: string | null;
};

export type GovernanceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type TrustTransparencyCenter = {
  dashboard: {
    actions_this_month: number;
    recommendations_generated: number;
    actions_approved: number;
    actions_rejected: number;
    self_healing_interventions: number;
    governance_compliance_rate: number;
  } | null;
  trust_indicators: {
    governance_score: number;
    permission_hygiene_score: number;
    approval_responsiveness: number;
    transparency_completeness: number;
    self_healing_effectiveness: number;
  } | null;
  activity_overview: TransparencyItem[];
  decision_explanations: TransparencyItem[];
  permissions_used: TransparencyItem[];
  approval_history: TransparencyItem[];
  self_healing: SelfHealingEvent[];
  recommendations_generated: TransparencyItem[];
  audit_timeline: AuditTimelineEntry[];
  governance_recommendations: GovernanceRecommendation[];
  executive_reporting: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
