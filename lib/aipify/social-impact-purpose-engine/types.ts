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
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string | number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  era?: string;
};

export type InitiativeScaffold = {
  key?: string;
  label?: string;
  description?: string;
};

export type PurposeInitiative = {
  id: string;
  initiative_key: string;
  initiative_type: string;
  title: string;
  summary: string;
  status: string;
  progress_pct: number;
  participation_count: number;
};

export type PurposeCommitment = {
  id: string;
  commitment_key: string;
  commitment_area: string;
  title: string;
  summary: string;
  status: string;
  progress_pct: number;
  target_date?: string | null;
};

export type AlignmentSnapshot = {
  id: string;
  alignment_dimension: string;
  reflection_summary: string;
  alignment_signal: string;
  confidence: string;
  captured_at?: string;
};

export type ImpactIndicator = {
  id: string;
  indicator_key: string;
  indicator_type: string;
  summary: string;
  trend_pct?: number | null;
  value_numeric?: number | null;
  confidence: string;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type SocialImpactPurposeBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  purpose_center?: Record<string, unknown>;
  social_impact_initiatives?: Record<string, unknown>;
  employee_wellbeing?: Record<string, unknown>;
  purpose_alignment_engine?: Record<string, unknown>;
  impact_tracking?: Record<string, unknown>;
  companion_responsibilities?: Record<string, unknown>;
  growth_partner_participation?: Record<string, unknown>;
  self_love_in_organizations?: Record<string, unknown>;
  community_impact_programs?: Record<string, unknown>;
  executive_purpose_dashboard?: Record<string, unknown>;
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: Record<string, unknown>;
  success_metrics?: Array<Record<string, unknown>>;
  integration_links?: IntegrationLink[];
  engagement_summary?: Record<string, unknown>;
  privacy_note?: string;
};

export type SocialImpactPurposeEngagementSummary = {
  active_initiatives?: number;
  active_commitments?: number;
  avg_initiative_progress?: number;
  total_participation?: number;
  alignment_snapshots?: number;
  impact_indicators?: number;
  purpose_center_components_count?: number;
  initiative_types_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type CommunityInitiative = {
  id: string;
  initiative_key: string;
  initiative_type: string;
  title: string;
  summary: string;
  status: string;
  participation_count: number;
};

export type WellbeingProgram = {
  id: string;
  program_key: string;
  program_type: string;
  title: string;
  summary: string;
  status: string;
  adoption_count: number;
};

export type ImpactReport = {
  id: string;
  report_key: string;
  report_type: string;
  title: string;
  summary: string;
  status: string;
};

export type ExecutiveImpactReview = {
  id: string;
  review_key: string;
  review_dimension: string;
  title: string;
  reflection_summary: string;
  status: string;
};

export type Phase149Sections = {
  community_initiatives: CommunityInitiative[];
  wellbeing_programs: WellbeingProgram[];
  impact_reports: ImpactReport[];
  executive_reviews: ExecutiveImpactReview[];
};

export type Gisrb149EngagementSummary = {
  active_initiatives?: number;
  active_commitments?: number;
  community_initiatives?: number;
  wellbeing_programs?: number;
  impact_reports?: number;
  executive_reviews?: number;
  global_impact_capabilities_count?: number;
  social_responsibility_domains_count?: number;
  community_impact_types_count?: number;
  wellbeing_framework_areas_count?: number;
  impact_reporting_types_count?: number;
  executive_review_dimensions_count?: number;
  gp_impact_program_types_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type GlobalImpactSocialResponsibilityBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  era?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  global_impact_center?: Record<string, unknown>;
  social_responsibility_engine?: Array<Record<string, unknown>>;
  community_impact_engine?: Array<Record<string, unknown>>;
  employee_wellbeing_framework?: Record<string, unknown>;
  impact_reporting_engine?: Array<Record<string, unknown>>;
  impact_companion?: Record<string, unknown>;
  growth_partner_impact_program?: Record<string, unknown>;
  executive_impact_reviews?: Record<string, unknown>;
  companion_limitations?: string[];
  self_love_connection?: Record<string, unknown>;
  security_requirements?: string[];
  integration_links?: IntegrationLink[];
  dogfooding?: Record<string, unknown>;
  engagement_summary?: Gisrb149EngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
};

export type SocialImpactPurposeCard = {
  has_customer: boolean;
  active_initiatives?: number;
  active_commitments?: number;
  avg_initiative_progress?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase118?: ImplementationBlueprintMeta;
  social_impact_purpose_mission?: string;
  social_impact_purpose_abos_principle?: string;
  social_impact_purpose_engagement_summary?: SocialImpactPurposeEngagementSummary;
  social_impact_purpose_note?: string;
  social_impact_purpose_vision_note?: string;
  implementation_blueprint_phase149?: ImplementationBlueprintMeta;
  gisrb149_mission?: string;
  gisrb149_abos_principle?: string;
  gisrb149_engagement_summary?: Gisrb149EngagementSummary;
  gisrb149_note?: string;
  gisrb149_companion_note?: string;
};

export type SocialImpactPurposeDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  enabled?: boolean;
  purpose_visibility?: string;
  wellbeing_programs_enabled?: boolean;
  community_programs_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  active_initiatives?: number;
  active_commitments?: number;
  avg_initiative_progress?: number;
  total_participation?: number;
  alignment_snapshots?: number;
  impact_indicators_count?: number;
  initiatives: PurposeInitiative[];
  commitments: PurposeCommitment[];
  alignment_snapshots_list: AlignmentSnapshot[];
  impact_indicators: ImpactIndicator[];
  initiative_type_scaffolds: InitiativeScaffold[];
  integration_links: IntegrationLink[];
  implementation_blueprint_phase118?: ImplementationBlueprintMeta;
  social_impact_purpose_engine_note?: string;
  social_impact_purpose_blueprint?: SocialImpactPurposeBlueprint;
  social_impact_purpose_distinction_note?: string;
  social_impact_purpose_mission?: string;
  social_impact_purpose_philosophy?: string;
  social_impact_purpose_abos_principle?: string;
  social_impact_purpose_objectives?: BlueprintObjective[];
  purpose_center_meta?: Record<string, unknown>;
  social_impact_initiatives_meta?: Record<string, unknown>;
  employee_wellbeing_meta?: Record<string, unknown>;
  purpose_alignment_meta?: Record<string, unknown>;
  impact_tracking_meta?: Record<string, unknown>;
  companion_responsibilities_meta?: Record<string, unknown>;
  growth_partner_participation_meta?: Record<string, unknown>;
  self_love_in_organizations_meta?: Record<string, unknown>;
  community_impact_programs_meta?: Record<string, unknown>;
  executive_purpose_dashboard_meta?: Record<string, unknown>;
  sipbp118_cross_links?: IntegrationLink[];
  social_impact_purpose_limitation_principles?: LimitationPrinciples;
  social_impact_purpose_companion_adaptation?: {
    principle?: string;
    examples?: CompanionAdaptationExample[];
    boundary_note?: string;
  };
  sipbp118_integration_links?: IntegrationLink[];
  social_impact_purpose_engagement_summary?: SocialImpactPurposeEngagementSummary;
  social_impact_purpose_success_criteria?: AbosSuccessCriterion[];
  social_impact_purpose_success_metrics?: Array<Record<string, unknown>>;
  social_impact_purpose_vision?: string;
  social_impact_purpose_privacy_note?: string;
  implementation_blueprint_phase149?: ImplementationBlueprintMeta;
  global_impact_social_responsibility_note?: string;
  gisrb149_distinction_note?: string;
  gisrb149_mission?: string;
  gisrb149_philosophy?: string;
  gisrb149_abos_principle?: string;
  gisrb149_vision?: string;
  gisrb149_objectives?: BlueprintObjective[];
  global_impact_center?: Record<string, unknown>;
  social_responsibility_engine?: Array<Record<string, unknown>>;
  community_impact_engine?: Array<Record<string, unknown>>;
  employee_wellbeing_framework?: Record<string, unknown>;
  impact_reporting_engine?: Array<Record<string, unknown>>;
  impact_companion?: Record<string, unknown>;
  growth_partner_impact_program?: Record<string, unknown>;
  executive_impact_reviews_meta?: Record<string, unknown>;
  gisrb149_companion_limitations?: string[];
  gisrb149_self_love_connection?: Record<string, unknown>;
  gisrb149_security_requirements?: string[];
  gisrb149_integration_links?: IntegrationLink[];
  gisrb149_dogfooding?: Record<string, unknown>;
  gisrb149_blueprint?: GlobalImpactSocialResponsibilityBlueprint;
  gisrb149_engagement_summary?: Gisrb149EngagementSummary;
  gisrb149_success_criteria?: AbosSuccessCriterion[];
  gisrb149_vision_phrases?: string[];
  gisrb149_privacy_note?: string;
  phase149_sections?: Phase149Sections;
};
