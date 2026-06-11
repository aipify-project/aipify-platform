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

export type ProductAutomationCard = {
  has_customer: boolean;
  automation_score?: number;
  awaiting_approval_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
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
