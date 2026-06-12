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

export type PartnershipCharter = {
  id: string;
  charter_key?: string;
  title?: string;
  status?: string;
  shared_objectives_summary?: string | null;
  governance_principles_summary?: string | null;
  decision_model_summary?: string | null;
  escalation_summary?: string | null;
  confidentiality_summary?: string | null;
  review_cadence_summary?: string | null;
  exit_procedures_summary?: string | null;
  joint_operations_partnership_id?: string | null;
  updated_at?: string;
};

export type DiplomacyEngagement = {
  id: string;
  engagement_key?: string;
  engagement_type?: string;
  title?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  started_at?: string | null;
  created_at?: string;
};

export type PolicyLibraryRef = {
  id: string;
  template_key?: string;
  template_category?: string;
  title?: string;
  summary?: string | null;
  kc_article_slug?: string | null;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type GlobalGovernanceDiplomacyEngagementSummary = {
  governance_score?: number;
  enabled?: boolean;
  governance_maturity_level?: number;
  charters_count?: number;
  active_charters_count?: number;
  engagements_count?: number;
  active_engagements_count?: number;
  policy_library_refs_count?: number;
  cross_links_count?: number;
  global_governance_center_capabilities?: number;
  privacy_note?: string;
  legal_disclaimer?: string;
};

export type GlobalGovernanceDiplomacyBlueprint = {
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
  global_governance_center?: Record<string, unknown>;
  digital_diplomacy_engine?: Record<string, unknown>;
  partnership_charter_engine?: Record<string, unknown>;
  executive_alignment_engine?: Record<string, unknown>;
  cross_cultural_collaboration_engine?: Record<string, unknown>;
  governance_companion?: Record<string, unknown>;
  conflict_prevention_framework?: Record<string, unknown>;
  global_policy_library?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: GlobalGovernanceDiplomacyEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type GlobalGovernanceDiplomacyCard = {
  has_customer: boolean;
  governance_score?: number;
  enabled?: boolean;
  governance_maturity_level?: number;
  charters_count?: number;
  philosophy?: string;
  executive_approval_required?: boolean;
  legal_disclaimer?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_governance_diplomacy_mission?: string;
  global_governance_diplomacy_abos_principle?: string;
  global_governance_diplomacy_engagement_summary?: GlobalGovernanceDiplomacyEngagementSummary;
  global_governance_diplomacy_note?: string;
  global_governance_diplomacy_vision_note?: string;
};

export type GlobalGovernanceDiplomacyDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  governance_maturity_level?: number;
  executive_approval_required?: boolean;
  partnership_prep_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  legal_disclaimer?: string;
  distinction_note?: string;
  governance_score?: number;
  charters_count?: number;
  active_charters_count?: number;
  engagements_count?: number;
  active_engagements_count?: number;
  policy_library_refs_count?: number;
  partnership_charters: PartnershipCharter[];
  diplomacy_engagements: DiplomacyEngagement[];
  policy_library_refs: PolicyLibraryRef[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_governance_diplomacy_blueprint?: GlobalGovernanceDiplomacyBlueprint;
  global_governance_diplomacy_mission?: string;
  global_governance_diplomacy_philosophy?: string;
  global_governance_diplomacy_abos_principle?: string;
  global_governance_diplomacy_objectives?: BlueprintObjective[];
  global_governance_center_meta?: Record<string, unknown>;
  digital_diplomacy_engine_meta?: Record<string, unknown>;
  partnership_charter_engine_meta?: Record<string, unknown>;
  executive_alignment_engine_meta?: Record<string, unknown>;
  cross_cultural_collaboration_engine_meta?: Record<string, unknown>;
  governance_companion_meta?: Record<string, unknown>;
  conflict_prevention_framework_meta?: Record<string, unknown>;
  global_policy_library_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  ggdebp144_integration_links?: IntegrationLink[];
  global_governance_diplomacy_engagement_summary?: GlobalGovernanceDiplomacyEngagementSummary;
  global_governance_diplomacy_success_criteria?: AbosSuccessCriterion[];
  global_governance_diplomacy_vision?: string;
  global_governance_diplomacy_vision_phrases?: string[];
  global_governance_diplomacy_privacy_note?: string;
  global_governance_diplomacy_dogfooding?: string;
  global_governance_diplomacy_engine_note?: string;
  global_governance_diplomacy_distinction_note?: string;
};
