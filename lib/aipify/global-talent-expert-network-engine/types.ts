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

export type ExpertProfile = {
  id: string;
  profile_key?: string;
  display_label?: string;
  status?: string;
  expertise_areas?: unknown;
  industry_focus?: unknown;
  languages?: unknown;
  certification_keys?: unknown;
  gp_status_flags?: Record<string, unknown>;
  regional_presence?: unknown;
  biography_summary?: string | null;
  experience_summary?: string | null;
  updated_at?: string;
};

export type ExpertEngagement = {
  id: string;
  engagement_key?: string;
  title?: string;
  status?: string;
  role_definition_summary?: string | null;
  governance_expectations_summary?: string | null;
  outcome_definition_summary?: string | null;
  confidentiality_scaffold_summary?: string | null;
  executive_sponsorship_summary?: string | null;
  joint_operations_charter_id?: string | null;
  updated_at?: string;
};

export type ExpertContribution = {
  id: string;
  contribution_key?: string;
  contribution_type?: string;
  title?: string;
  summary?: string | null;
  contribution_count?: number;
  status?: string;
  recorded_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type GlobalTalentExpertNetworkEngagementSummary = {
  network_score?: number;
  enabled?: boolean;
  discovery_maturity_level?: number;
  profiles_count?: number;
  active_profiles_count?: number;
  engagements_count?: number;
  active_engagements_count?: number;
  contributions_count?: number;
  cross_links_count?: number;
  global_expert_network_center_capabilities?: number;
  privacy_note?: string;
  procurement_disclaimer?: string;
};

export type GlobalTalentExpertNetworkBlueprint = {
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
  global_expert_network_center?: Record<string, unknown>;
  expert_discovery_engine?: Record<string, unknown>;
  executive_advisory_network_engine?: Record<string, unknown>;
  growth_partner_matching_engine?: Record<string, unknown>;
  specialist_collaboration_framework?: Record<string, unknown>;
  professional_profile_engine?: Record<string, unknown>;
  talent_companion?: Record<string, unknown>;
  professional_contribution_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: GlobalTalentExpertNetworkEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type GlobalTalentExpertNetworkCard = {
  has_customer: boolean;
  network_score?: number;
  enabled?: boolean;
  discovery_maturity_level?: number;
  profiles_count?: number;
  philosophy?: string;
  executive_approval_required?: boolean;
  procurement_disclaimer?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_talent_expert_network_mission?: string;
  global_talent_expert_network_abos_principle?: string;
  global_talent_expert_network_engagement_summary?: GlobalTalentExpertNetworkEngagementSummary;
  global_talent_expert_network_note?: string;
  global_talent_expert_network_vision_note?: string;
};

export type GlobalTalentExpertNetworkDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  discovery_maturity_level?: number;
  executive_approval_required?: boolean;
  gp_matching_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  procurement_disclaimer?: string;
  distinction_note?: string;
  network_score?: number;
  profiles_count?: number;
  active_profiles_count?: number;
  engagements_count?: number;
  active_engagements_count?: number;
  contributions_count?: number;
  expert_profiles: ExpertProfile[];
  expert_engagements: ExpertEngagement[];
  expert_contributions: ExpertContribution[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_talent_expert_network_blueprint?: GlobalTalentExpertNetworkBlueprint;
  global_talent_expert_network_mission?: string;
  global_talent_expert_network_philosophy?: string;
  global_talent_expert_network_abos_principle?: string;
  global_talent_expert_network_objectives?: BlueprintObjective[];
  global_expert_network_center_meta?: Record<string, unknown>;
  expert_discovery_engine_meta?: Record<string, unknown>;
  executive_advisory_network_engine_meta?: Record<string, unknown>;
  growth_partner_matching_engine_meta?: Record<string, unknown>;
  specialist_collaboration_framework_meta?: Record<string, unknown>;
  professional_profile_engine_meta?: Record<string, unknown>;
  talent_companion_meta?: Record<string, unknown>;
  professional_contribution_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  gtenbp147_integration_links?: IntegrationLink[];
  global_talent_expert_network_engagement_summary?: GlobalTalentExpertNetworkEngagementSummary;
  global_talent_expert_network_success_criteria?: AbosSuccessCriterion[];
  global_talent_expert_network_vision?: string;
  global_talent_expert_network_vision_phrases?: string[];
  global_talent_expert_network_privacy_note?: string;
  global_talent_expert_network_dogfooding?: string;
  global_talent_expert_network_engine_note?: string;
  global_talent_expert_network_distinction_note?: string;
};
