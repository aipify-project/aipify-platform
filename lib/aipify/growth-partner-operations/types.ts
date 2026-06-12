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

export type PortfolioCustomer = {
  id: string;
  customer_org_key: string;
  org_profile_summary: string;
  industry_classification: string;
  companions_deployed_count: number;
  implementation_status: string;
  training_progress_pct: number;
  renewal_date?: string | null;
  health_score: number;
  growth_opportunities_count: number;
  risk_signals_count: number;
};

export type ImplementationRecord = {
  id: string;
  current_stage: string;
  progress_pct: number;
  milestones?: Array<Record<string, unknown>>;
  tasks?: Array<Record<string, unknown>>;
  owners?: Array<Record<string, unknown>>;
};

export type RenewalItem = {
  id: string;
  renewal_type: string;
  title: string;
  summary: string;
  due_date?: string | null;
  priority: string;
  status: string;
};

export type HealthSnapshot = {
  partner_health_score?: number;
  customer_retention_score?: number;
  implementation_success_score?: number;
  training_effectiveness_score?: number;
  support_quality_score?: number;
  customer_satisfaction_score?: number;
  governance_compliance_score?: number;
  revenue_stability_score?: number;
  community_contributions_score?: number;
  knowledge_sharing_score?: number;
  partner_growth_score?: number;
  summary?: string;
  captured_at?: string;
};

export type StageTemplate = {
  key?: string;
  label?: string;
  order?: number;
  description?: string;
};

export type TrainingProgram = {
  key?: string;
  label?: string;
};

export type CertificationLevel = {
  key?: string;
  label?: string;
  maps_to_tier?: string;
  maps_to_tier_label?: string;
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

export type GrowthPartnerOperationsBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  operations_center_modules?: Array<Record<string, unknown>>;
  partner_dashboard?: Record<string, unknown>;
  customer_portfolio?: Record<string, unknown>;
  implementation_center?: Record<string, unknown>;
  companion_deployment_center?: Record<string, unknown>;
  customer_success_metrics?: Record<string, unknown>;
  partner_health_scores?: Record<string, unknown>;
  training_academy?: Record<string, unknown>;
  certification_framework?: Record<string, unknown>;
  knowledge_distribution?: Record<string, unknown>;
  renewal_center?: Record<string, unknown>;
  partner_insights?: Record<string, unknown>;
  marketplace_integration?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: Record<string, unknown>;
  success_metrics?: Array<Record<string, unknown>>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  integration_links?: IntegrationLink[];
  engagement_summary?: Record<string, unknown>;
  privacy_note?: string;
};

export type GrowthPartnerOperationsEngagementSummary = {
  partner_health_score?: number;
  active_customers?: number;
  upcoming_renewals?: number;
  open_renewal_items?: number;
  operations_modules_count?: number;
  training_programs_count?: number;
  implementation_stages_count?: number;
  certification_levels_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type GrowthPartnerOperationsCard = {
  has_customer: boolean;
  partner_health_score?: number;
  active_customers?: number;
  upcoming_renewals?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase114?: ImplementationBlueprintMeta;
  growth_partner_operations_mission?: string;
  growth_partner_operations_abos_principle?: string;
  growth_partner_operations_engagement_summary?: GrowthPartnerOperationsEngagementSummary;
  growth_partner_operations_note?: string;
  growth_partner_operations_vision_note?: string;
};

export type GrowthPartnerOperationsDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  operations_enabled?: boolean;
  portfolio_segmentation_enabled?: boolean;
  mandatory_2fa_for_sensitive_roles?: boolean;
  philosophy?: string;
  safety_note?: string;
  partner_health_score?: number;
  active_customers?: number;
  upcoming_renewals?: number;
  implementations_in_progress?: number;
  open_renewal_items?: number;
  risk_signals_count?: number;
  training_programs_count?: number;
  implementation_stages_count?: number;
  certification_levels_count?: number;
  portfolio_customers: PortfolioCustomer[];
  implementations: ImplementationRecord[];
  renewal_items: RenewalItem[];
  health_snapshot?: HealthSnapshot;
  implementation_stage_templates: StageTemplate[];
  training_programs: TrainingProgram[];
  certification_levels: CertificationLevel[];
  integration_links: IntegrationLink[];
  implementation_blueprint_phase114?: ImplementationBlueprintMeta;
  growth_partner_operations_engine_note?: string;
  growth_partner_operations_blueprint?: GrowthPartnerOperationsBlueprint;
  growth_partner_operations_distinction_note?: string;
  growth_partner_operations_mission?: string;
  growth_partner_operations_philosophy?: string;
  growth_partner_operations_abos_principle?: string;
  growth_partner_operations_objectives?: BlueprintObjective[];
  operations_center_modules?: Array<Record<string, unknown>>;
  partner_dashboard_meta?: Record<string, unknown>;
  customer_portfolio_meta?: Record<string, unknown>;
  implementation_center_meta?: Record<string, unknown>;
  companion_deployment_center_meta?: Record<string, unknown>;
  customer_success_metrics_meta?: Record<string, unknown>;
  partner_health_scores_meta?: Record<string, unknown>;
  training_academy_meta?: Record<string, unknown>;
  certification_framework_meta?: Record<string, unknown>;
  knowledge_distribution_meta?: Record<string, unknown>;
  renewal_center_meta?: Record<string, unknown>;
  partner_insights_meta?: Record<string, unknown>;
  marketplace_integration_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  gpocbp114_cross_links?: IntegrationLink[];
  growth_partner_operations_limitation_principles?: LimitationPrinciples;
  growth_partner_operations_companion_adaptation?: {
    principle?: string;
    examples?: CompanionAdaptationExample[];
    boundary_note?: string;
  };
  gpocbp114_integration_links?: IntegrationLink[];
  growth_partner_operations_engagement_summary?: GrowthPartnerOperationsEngagementSummary;
  growth_partner_operations_success_criteria?: AbosSuccessCriterion[];
  growth_partner_operations_success_metrics?: Array<Record<string, unknown>>;
  growth_partner_operations_vision?: string;
  growth_partner_operations_privacy_note?: string;
};
