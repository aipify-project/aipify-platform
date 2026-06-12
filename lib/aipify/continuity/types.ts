export const INCIDENT_LEVELS = [1, 2, 3, 4] as const;

export const READINESS_BANDS = [
  "highly_prepared",
  "prepared",
  "improvement_recommended",
  "resilience_concerns",
  "critical_gap",
] as const;

export type ContinuityPlan = {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
};

export type CriticalProcess = {
  id: string;
  process_name: string;
  process_key: string;
  criticality_level: string;
  backup?: {
    primary?: string;
    secondary?: string | null;
    tertiary?: string | null;
  } | null;
};

export type IncidentEvent = {
  id: string;
  incident_level: number;
  level_label?: string;
  category: string;
  summary: string;
  status: string;
  created_at?: string;
};

export type RecoveryAction = {
  id: string;
  action_title: string;
  assigned_role_key?: string | null;
  status: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  signal?: string;
  consideration?: string;
  description?: string;
};

export type BlueprintSection = {
  principle?: string;
  practices?: BlueprintObjective[];
  signals?: CompanionGuidanceExample[];
  dimensions?: BlueprintObjective[];
  vulnerability_patterns?: BlueprintObjective[];
  examples?: CompanionGuidanceExample[];
  pathways?: Array<BlueprintObjective & { route?: string }>;
  insight_types?: BlueprintObjective[];
  rules?: string[];
  practices_list?: string[];
};

export type ContinuityEngagementSummary = {
  critical_processes?: number;
  backup_assignments?: number;
  backup_gaps?: number;
  active_plans?: number;
  critical_process_count?: number;
  coverage_ratio?: number;
  objective_count?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ContinuityCard = {
  has_customer: boolean;
  overall_score?: number;
  readiness_band?: string;
  incident_mode_active?: boolean;
  open_incidents?: number;
  philosophy?: string;
  human_leadership_required?: boolean;
  implementation_blueprint_phase73?: ImplementationBlueprintMeta;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: ContinuityEngagementSummary;
  blueprint_note?: string;
  continuity_note?: string;
};

export type ContinuityDashboard = {
  has_customer: boolean;
  human_leadership_required?: boolean;
  overall_score?: number;
  readiness_band?: string;
  readiness_components?: Record<string, number>;
  incident_mode?: { active: boolean; incident_id?: string | null; activated_at?: string | null };
  plans: ContinuityPlan[];
  critical_processes: CriticalProcess[];
  incidents: IncidentEvent[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  incident_levels?: Array<{ level: number; label: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase73?: ImplementationBlueprintMeta;
  organizational_continuity_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  knowledge_continuity?: BlueprintSection;
  role_continuity?: BlueprintSection;
  succession_support?: BlueprintSection;
  operational_resilience?: BlueprintSection;
  companion_guidance?: BlueprintSection;
  onboarding_connection?: BlueprintSection;
  blueprint_self_love_connection?: BlueprintSection & { journey_phrase?: string; self_love_route?: string; boundary_note?: string };
  blueprint_leadership_insights?: BlueprintSection;
  blueprint_trust_connection?: BlueprintSection & { users_should_see?: string[]; operators_should_understand?: string[]; audit_note?: string };
  privacy_principles?: BlueprintSection & { strengthen_systems_note?: string };
  blueprint_dogfooding?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: ContinuityEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
};

export type IncidentDetail = {
  incident: IncidentEvent & { description?: string | null; incident_mode_active?: boolean };
  recovery_actions: RecoveryAction[];
  human_leadership_required?: boolean;
};

export type IncidentModeResult = {
  incident_id?: string;
  incident_mode_active?: boolean;
  incident_level?: number;
  level_label?: string;
  human_leadership_required?: boolean;
  note?: string;
};
