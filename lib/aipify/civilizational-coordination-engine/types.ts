export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  phase?: number;
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
  description?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type SharedActionProgram = {
  id: string;
  program_key?: string;
  program_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type CoordinationPartnership = {
  id: string;
  partnership_key?: string;
  partnership_type?: string;
  partner_org_label?: string;
  title?: string;
  summary?: string;
  status?: string;
  opt_in?: boolean;
  created_at?: string;
};

export type CoordinationMilestone = {
  id: string;
  milestone_key?: string;
  milestone_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  target_date?: string;
  program_id?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type CivilizationalCoordinationEngagementSummary = {
  coordination_score?: number;
  enabled?: boolean;
  coordination_mode?: string;
  programs_count?: number;
  active_programs_count?: number;
  partnerships_count?: number;
  active_partnerships_count?: number;
  milestones_count?: number;
  cross_org_coordination_opt_in?: boolean;
  cross_links_count?: number;
  privacy_note?: string;
  voluntary_only?: boolean;
};

export type CivilizationalCoordinationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  shared_action_center?: Record<string, unknown>;
  coordination_engine?: Record<string, unknown>;
  shared_action_framework?: Record<string, unknown>;
  executive_coordination_reviews?: Record<string, unknown>;
  coordination_companion?: Record<string, unknown>;
  voluntary_alignment_engine?: Record<string, unknown>;
  collective_execution_engine?: Record<string, unknown>;
  relationship_stewardship_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CivilizationalCoordinationEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CivilizationalCoordinationCard = {
  has_customer: boolean;
  coordination_score?: number;
  enabled?: boolean;
  coordination_mode?: string;
  programs_count?: number;
  philosophy?: string;
  shared_programs_enabled?: boolean;
  partnership_opt_in_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_coordination_mission?: string;
  civilizational_coordination_abos_principle?: string;
  civilizational_coordination_engagement_summary?: CivilizationalCoordinationEngagementSummary;
  civilizational_coordination_note?: string;
  civilizational_coordination_vision_note?: string;
};

export type CivilizationalCoordinationDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  coordination_mode?: string;
  shared_programs_enabled?: boolean;
  partnership_opt_in_enabled?: boolean;
  milestone_tracking_enabled?: boolean;
  executive_coordination_reviews_enabled?: boolean;
  cross_org_coordination_opt_in?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  coordination_score?: number;
  programs_count?: number;
  active_programs_count?: number;
  partnerships_count?: number;
  active_partnerships_count?: number;
  milestones_count?: number;
  programs: SharedActionProgram[];
  partnerships: CoordinationPartnership[];
  milestones: CoordinationMilestone[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_coordination_blueprint?: CivilizationalCoordinationBlueprint;
  civilizational_coordination_mission?: string;
  civilizational_coordination_philosophy?: string;
  civilizational_coordination_abos_principle?: string;
  civilizational_coordination_objectives?: BlueprintObjective[];
  shared_action_center_meta?: Record<string, unknown>;
  coordination_engine_meta?: Record<string, unknown>;
  shared_action_framework_meta?: Record<string, unknown>;
  executive_coordination_reviews_meta?: Record<string, unknown>;
  coordination_companion_meta?: Record<string, unknown>;
  voluntary_alignment_engine_meta?: Record<string, unknown>;
  collective_execution_engine_meta?: Record<string, unknown>;
  relationship_stewardship_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  ccaebp166_integration_links?: IntegrationLink[];
  civilizational_coordination_engagement_summary?: CivilizationalCoordinationEngagementSummary;
  civilizational_coordination_success_criteria?: AbosSuccessCriterion[];
  civilizational_coordination_vision?: string;
  civilizational_coordination_vision_phrases?: string[];
  civilizational_coordination_privacy_note?: string;
  civilizational_coordination_dogfooding?: string;
  civilizational_coordination_engine_note?: string;
  civilizational_coordination_distinction_note?: string;
};
