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
};
