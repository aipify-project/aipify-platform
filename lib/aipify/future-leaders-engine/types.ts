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

export type LeadershipPathway = {
  id: string;
  pathway_key?: string;
  pathway_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  enrolled_at?: string;
};

export type MentorshipProgram = {
  id: string;
  mentorship_key?: string;
  program_type?: string;
  title?: string;
  goals_summary?: string;
  agreement_summary?: string | null;
  status?: string;
  created_at?: string;
};

export type LeadershipMemoryEntry = {
  id: string;
  memory_key?: string;
  memory_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  recorded_at?: string;
};

export type SuccessionReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type FutureLeadersEngagementSummary = {
  development_score?: number;
  enabled?: boolean;
  development_mode?: string;
  pathways_count?: number;
  active_pathways_count?: number;
  mentorships_count?: number;
  active_mentorships_count?: number;
  leadership_memory_count?: number;
  succession_reviews_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_ranking?: boolean;
};

export type FutureLeadersBlueprint = {
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
  future_leaders_center?: Record<string, unknown>;
  intergenerational_learning_engine?: Record<string, unknown>;
  succession_preparedness_engine?: Record<string, unknown>;
  leadership_companion?: Record<string, unknown>;
  mentorship_network_engine?: Record<string, unknown>;
  leadership_memory_engine?: Record<string, unknown>;
  emerging_leader_pathways?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: FutureLeadersEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type FutureLeadersCard = {
  has_customer: boolean;
  development_score?: number;
  enabled?: boolean;
  development_mode?: string;
  pathways_count?: number;
  philosophy?: string;
  mentorship_enabled?: boolean;
  reflection_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  future_leaders_mission?: string;
  future_leaders_abos_principle?: string;
  future_leaders_engagement_summary?: FutureLeadersEngagementSummary;
  future_leaders_note?: string;
  future_leaders_vision_note?: string;
};

export type FutureLeadersDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  development_mode?: string;
  mentorship_enabled?: boolean;
  reflection_enabled?: boolean;
  succession_awareness_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  development_score?: number;
  pathways_count?: number;
  active_pathways_count?: number;
  mentorships_count?: number;
  active_mentorships_count?: number;
  leadership_memory_count?: number;
  succession_reviews_count?: number;
  pathways: LeadershipPathway[];
  mentorships: MentorshipProgram[];
  leadership_memory: LeadershipMemoryEntry[];
  succession_reviews: SuccessionReview[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  future_leaders_blueprint?: FutureLeadersBlueprint;
  future_leaders_mission?: string;
  future_leaders_philosophy?: string;
  future_leaders_abos_principle?: string;
  future_leaders_objectives?: BlueprintObjective[];
  future_leaders_center_meta?: Record<string, unknown>;
  intergenerational_learning_engine_meta?: Record<string, unknown>;
  succession_preparedness_engine_meta?: Record<string, unknown>;
  leadership_companion_meta?: Record<string, unknown>;
  mentorship_network_engine_meta?: Record<string, unknown>;
  leadership_memory_engine_meta?: Record<string, unknown>;
  emerging_leader_pathways_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  iflebp151_integration_links?: IntegrationLink[];
  future_leaders_engagement_summary?: FutureLeadersEngagementSummary;
  future_leaders_success_criteria?: AbosSuccessCriterion[];
  future_leaders_vision?: string;
  future_leaders_vision_phrases?: string[];
  future_leaders_privacy_note?: string;
  future_leaders_dogfooding?: string;
  future_leaders_engine_note?: string;
  future_leaders_distinction_note?: string;
};
