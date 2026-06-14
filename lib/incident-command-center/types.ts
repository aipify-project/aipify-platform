export type IncidentEntry = {
  incident_key: string;
  title: string;
  summary: string;
  category: string;
  severity: string;
  status: string;
  workflow_stage: string;
  owner: string;
  impact_summary: string;
  systems_involved: string[];
  stakeholders_affected: string[];
  detected_at: string | null;
  resolved_at: string | null;
};

export type TimelineEvent = {
  timeline_key: string;
  incident_key: string;
  event_label: string;
  event_summary: string;
  occurred_at: string | null;
};

export type IncidentCommunication = {
  communication_key: string;
  incident_key: string;
  audience: string;
  title: string;
  content: string;
  status: string;
  created_at: string | null;
};

export type RecoveryAction = {
  action_key: string;
  incident_key: string;
  label: string;
  status: string;
};

export type SelfHealingEvent = {
  healing_key: string;
  incident_key: string | null;
  message: string;
  outcome: string;
  created_at: string | null;
};

export type IncidentInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type IncidentRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type PostIncidentReview = {
  review_key: string;
  incident_key: string;
  what_happened: string;
  root_causes: string;
  recovery_effectiveness: string;
  lessons_learned: string;
  improvements_required: string;
  status: string;
};

export type ExecutiveIncidentView = {
  active_major_incidents: number;
  business_impact_summary: string;
  recovery_confidence: string;
  strategic_implication: string;
};

export type IncidentCommandCenter = {
  dashboard: {
    active_incidents: number;
    major_incidents: number;
    severity_distribution: Record<string, number>;
    mean_time_to_recovery_minutes: number;
    mean_time_to_detection_minutes: number;
    mean_time_to_acknowledgment_minutes: number;
    self_healing_interventions: number;
    self_healing_success_rate: number;
    recovery_progress_pct: number;
    communication_responsiveness_score: number;
    executive_confidence: number;
    operational_resilience_score: number;
  } | null;
  incidents: IncidentEntry[];
  timeline: TimelineEvent[];
  communications: IncidentCommunication[];
  recovery_actions: RecoveryAction[];
  self_healing: SelfHealingEvent[];
  insights: IncidentInsight[];
  recommendations: IncidentRecommendation[];
  post_reviews: PostIncidentReview[];
  executive_view: ExecutiveIncidentView | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
