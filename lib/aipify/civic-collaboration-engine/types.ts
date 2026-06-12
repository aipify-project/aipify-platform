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

export type CommunityPartnership = {
  id: string;
  partnership_key?: string;
  partnership_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type PublicValueInitiative = {
  id: string;
  initiative_key?: string;
  initiative_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type TrustReflection = {
  id: string;
  reflection_key?: string;
  reflection_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type CivicCollaborationEngagementSummary = {
  public_value_score?: number;
  enabled?: boolean;
  collaboration_mode?: string;
  partnerships_count?: number;
  active_partnerships_count?: number;
  initiatives_count?: number;
  active_initiatives_count?: number;
  trust_reflections_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_political?: boolean;
};

export type CivicCollaborationBlueprint = {
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
  public_value_center?: Record<string, unknown>;
  civic_collaboration_engine?: Record<string, unknown>;
  community_partnership_framework?: Record<string, unknown>;
  public_trust_engine?: Record<string, unknown>;
  civic_companion?: Record<string, unknown>;
  education_mentorship_engine?: Record<string, unknown>;
  collective_resilience_framework?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CivicCollaborationEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CivicCollaborationCard = {
  has_customer: boolean;
  public_value_score?: number;
  enabled?: boolean;
  collaboration_mode?: string;
  initiatives_count?: number;
  philosophy?: string;
  partnership_programs_enabled?: boolean;
  trust_reflection_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  civic_collaboration_mission?: string;
  civic_collaboration_abos_principle?: string;
  civic_collaboration_engagement_summary?: CivicCollaborationEngagementSummary;
  civic_collaboration_note?: string;
  civic_collaboration_vision_note?: string;
};

export type CivicCollaborationDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  collaboration_mode?: string;
  partnership_programs_enabled?: boolean;
  public_value_initiatives_enabled?: boolean;
  trust_reflection_enabled?: boolean;
  education_mentorship_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  public_value_score?: number;
  partnerships_count?: number;
  active_partnerships_count?: number;
  initiatives_count?: number;
  active_initiatives_count?: number;
  trust_reflections_count?: number;
  partnerships: CommunityPartnership[];
  initiatives: PublicValueInitiative[];
  trust_reflections: TrustReflection[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  civic_collaboration_blueprint?: CivicCollaborationBlueprint;
  civic_collaboration_mission?: string;
  civic_collaboration_philosophy?: string;
  civic_collaboration_abos_principle?: string;
  civic_collaboration_objectives?: BlueprintObjective[];
  public_value_center_meta?: Record<string, unknown>;
  civic_collaboration_engine_meta?: Record<string, unknown>;
  community_partnership_framework_meta?: Record<string, unknown>;
  public_trust_engine_meta?: Record<string, unknown>;
  civic_companion_meta?: Record<string, unknown>;
  education_mentorship_engine_meta?: Record<string, unknown>;
  collective_resilience_framework_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  ccvebp161_integration_links?: IntegrationLink[];
  civic_collaboration_engagement_summary?: CivicCollaborationEngagementSummary;
  civic_collaboration_success_criteria?: AbosSuccessCriterion[];
  civic_collaboration_vision?: string;
  civic_collaboration_vision_phrases?: string[];
  civic_collaboration_privacy_note?: string;
  civic_collaboration_dogfooding?: string;
  civic_collaboration_engine_note?: string;
  civic_collaboration_distinction_note?: string;
};
