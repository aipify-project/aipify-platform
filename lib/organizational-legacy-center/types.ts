export type LegacyProject = {
  project_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type LegacyMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  documented_at: string | null;
  status: string;
};

export type PreservedValue = {
  value_key: string;
  label: string;
  principle: string;
};

export type ArchiveItem = {
  archive_key: string;
  archive_type: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type LegacyReflectionPrompt = {
  reflection_key: string;
  prompt: string;
  domain: string;
};

export type LegacyTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type LegacySnapshot = {
  snapshot_key: string;
  period_label: string;
  legacy_score: number;
  summary: string;
  captured_at: string | null;
};

export type LegacyInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type LegacyRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type LegacySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalLegacyCenter = {
  dashboard: {
    legacy_score: number;
    legacy_health_label: string;
    projects_in_progress: number;
    milestones_documented: number;
    values_preserved: number;
    archives_maintained: number;
    reflection_participation_pct: number;
    institutional_continuity_pct: number;
    values_awareness_pct: number;
    leadership_confidence: number;
  } | null;
  legacy_projects: LegacyProject[];
  milestones: LegacyMilestone[];
  values_preserved: PreservedValue[];
  legacy_archive: ArchiveItem[];
  reflection_prompts: LegacyReflectionPrompt[];
  timeline: LegacyTimelineEvent[];
  snapshots: LegacySnapshot[];
  insights: LegacyInsight[];
  recommendations: LegacyRecommendation[];
  legacy_sessions: LegacySession[];
  executive_view: {
    historical_milestones: string;
    values_continuity: string;
    reflection_trends: string;
    stewardship_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
