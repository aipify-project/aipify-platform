export type ImportedProduct = {
  id: string;
  product_key: string;
  title: string;
  description?: string | null;
  source_type: string;
  status: string;
  price?: number | null;
  currency?: string;
  category?: string | null;
  readiness_score?: number | null;
  readiness_status?: string | null;
};

export type SeoRecommendation = {
  id: string;
  product_id: string;
  product_title?: string;
  recommendation_type: string;
  title: string;
  suggestion: string;
  rationale: string;
  priority: string;
  applied?: boolean;
};

export type QualityWarning = {
  id: string;
  product_id: string;
  product_title?: string;
  check_type: string;
  severity: string;
  title: string;
  explanation: string;
};

export type CategorySuggestion = {
  id: string;
  product_id: string;
  product_title?: string;
  primary_category: string;
  secondary_categories?: string[];
  suggested_tags?: string[];
  collection_assignments?: string[];
  confidence: string;
  rationale: string;
};

export type ApprovalRequest = {
  id: string;
  product_id: string;
  product_title?: string;
  request_type: string;
  summary: string;
  status: string;
};

export type BulkJob = {
  id: string;
  action_type: string;
  product_count: number;
  status: string;
  summary?: string | null;
  completed_at?: string | null;
};

export type TranslationPreview = {
  id: string;
  product_id: string;
  product_title?: string;
  field_name: string;
  target_language: string;
  translated_preview?: string;
};

export type RewritePreview = {
  id: string;
  product_id: string;
  product_title?: string;
  rewriting_mode: string;
  rewritten_preview?: string;
};

export type BrandVoice = {
  writing_style?: string;
  tone_preference?: string;
  rewriting_mode?: string;
  personality_guidelines?: string | null;
};

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
};

export type ImplementationBlueprintMeta = {
  phase?: string | number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidance = {
  principle?: string;
  companion_name?: string;
  not_label?: string;
  examples?: CompanionGuidanceExample[];
  boundary_note?: string;
  approvals_route?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  quotes?: string[];
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type WorkflowPipelineStep = {
  step?: number;
  key?: string;
  label?: string;
  description?: string;
};

export type ApprovalMode = {
  key?: string;
  label?: string;
  description?: string;
};

export type ProductAutomationEngagementSummary = {
  automation_score?: number;
  imported_products_count?: number;
  awaiting_approval_count?: number;
  avg_readiness_score?: number;
  seo_recommendations_open?: number;
  translation_versions?: number;
  rewriting_versions?: number;
  products_tracked?: number;
  objectives_documented?: number;
  pipeline_steps?: number;
  primary_locales?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type ProductAutomationBlueprint = {
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
  product_import_automation?: Record<string, unknown>;
  product_translation?: Record<string, unknown>;
  product_rewriting?: Record<string, unknown>;
  seo_optimization?: Record<string, unknown>;
  category_recommendations?: Record<string, unknown>;
  product_quality_checks?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  workflow_automation?: {
    principle?: string;
    pipeline_steps?: WorkflowPipelineStep[];
    bulk_actions?: string[];
    workflow_orchestration_route?: string;
    boundary_note?: string;
  };
  approval_principles?: {
    principle?: string;
    modes?: ApprovalMode[];
    trust_action_route?: string;
    workflow_orchestration_route?: string;
    must_avoid?: string[];
    boundary_note?: string;
  };
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: ProductAutomationEngagementSummary;
  privacy_note?: string;
};

export type ProductAutomationCard = {
  has_customer: boolean;
  automation_score?: number;
  awaiting_approval_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase102?: ImplementationBlueprintMeta;
  product_automation_mission?: string;
  product_automation_abos_principle?: string;
  product_automation_engagement_summary?: ProductAutomationEngagementSummary;
  product_automation_note?: string;
  product_automation_vision_note?: string;
};

export type ProductAutomationDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_publish_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  engine_enabled?: boolean;
  default_target_language?: string;
  default_rewriting_mode?: string;
  automation_score?: number;
  imported_products_count?: number;
  awaiting_approval_count?: number;
  avg_readiness_score?: number;
  seo_recommendations_count?: number;
  quality_warnings_count?: number;
  pending_approvals?: number;
  translation_opportunities?: number;
  brand_voice?: BrandVoice;
  imported_products: ImportedProduct[];
  awaiting_approval: ImportedProduct[];
  translation_opportunities_list: Array<{ id: string; title: string; category?: string; has_translation?: boolean }>;
  seo_recommendations: SeoRecommendation[];
  quality_warnings: QualityWarning[];
  category_suggestions: CategorySuggestion[];
  approval_requests: ApprovalRequest[];
  bulk_jobs: BulkJob[];
  recent_translations: TranslationPreview[];
  recent_rewrites: RewritePreview[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase102?: ImplementationBlueprintMeta;
  product_automation_engine_note?: string;
  product_automation_blueprint?: ProductAutomationBlueprint;
  product_automation_distinction_note?: string;
  product_automation_mission?: string;
  product_automation_philosophy?: string;
  product_automation_abos_principle?: string;
  product_automation_objectives?: BlueprintObjective[];
  product_import_automation?: Record<string, unknown>;
  product_translation?: Record<string, unknown>;
  product_rewriting?: Record<string, unknown>;
  seo_optimization?: Record<string, unknown>;
  category_recommendations?: Record<string, unknown>;
  product_quality_checks?: Record<string, unknown>;
  product_companion_guidance?: CompanionGuidance;
  workflow_automation?: ProductAutomationBlueprint["workflow_automation"];
  approval_principles?: ProductAutomationBlueprint["approval_principles"];
  product_automation_self_love_connection?: SelfLoveConnection;
  product_automation_trust_connection?: TrustConnection;
  product_automation_dogfooding?: Record<string, unknown>;
  paebp102_integration_links?: IntegrationLink[];
  product_automation_engagement_summary?: ProductAutomationEngagementSummary;
  product_automation_success_criteria?: AbosSuccessCriterion[];
  product_automation_vision?: string;
  product_automation_vision_phrases?: string[];
  product_automation_privacy_note?: string;
};

export type ProductAutomationActionResult = {
  status?: string;
  error?: string;
  requires_approval?: boolean;
  requires_manual_publish?: boolean;
  [key: string]: unknown;
};

export type ProductAutomationBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
