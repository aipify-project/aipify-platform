export const BLUEPRINT_STATUSES = ["draft", "published", "deprecated", "archived"] as const;
export const BLUEPRINT_RISK_LEVELS = ["low", "medium", "high"] as const;
export const RECOMMENDATION_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "applied",
  "dismissed",
] as const;
export const RECOMMENDATION_TYPES = [
  "skill",
  "marketplace_item",
  "workflow",
  "knowledge_pack",
  "automation_template",
  "quality_check",
  "integration",
  "governance_setting",
  "briefing_template",
] as const;

export type IndustryBlueprint = {
  id: string;
  blueprint_key: string;
  slug: string;
  title: string;
  short_description?: string | null;
  long_description?: string | null;
  industry_category: string;
  risk_level: string;
  version: string;
  business_size_fit: string[];
  supported_deployment_modes: string[];
  blueprint_manifest?: Record<string, unknown>;
};

export type BlueprintRecommendation = {
  id: string;
  recommendation_type: string;
  title: string;
  summary?: string | null;
  reason?: string | null;
  priority: number;
  risk_level: string;
  status: string;
  target_ref?: string | null;
  metadata?: Record<string, unknown>;
};

export type TenantIndustryProfile = {
  id: string;
  tenant_id: string;
  selected_blueprint_id?: string | null;
  industry_category?: string | null;
  business_model?: string | null;
  business_size?: string | null;
  primary_goals: string[];
  auto_recommend_packs: boolean;
  notify_new_packs: boolean;
  discovery_answers?: Record<string, unknown>;
};

export type BlueprintCard = {
  has_customer: boolean;
  completeness_score?: number;
  has_blueprint?: boolean;
  blueprint_title?: string;
  philosophy?: string;
  privacy_note?: string;
};

export type BlueprintDashboard = {
  has_customer: boolean;
  profile?: TenantIndustryProfile;
  completeness?: {
    has_blueprint: boolean;
    score: number;
    total_recommendations?: number;
    applied_count?: number;
    pending_count?: number;
    blueprint?: IndustryBlueprint;
  };
  pending_recommendations: BlueprintRecommendation[];
  applied_installs: Array<{
    id: string;
    status: string;
    applied_at?: string | null;
    blueprint?: IndustryBlueprint;
  }>;
};

export type BlueprintPrecheck = {
  allowed: boolean;
  reason?: string;
  requires_approval?: boolean;
  blueprint?: IndustryBlueprint;
  policy?: Record<string, unknown>;
  pending_recommendations?: number;
};

export type BlueprintApplyResult = {
  status: string;
  install_id?: string;
  applied?: number;
  installed?: unknown[];
  failed?: unknown[];
  precheck?: BlueprintPrecheck;
};

export type BlueprintInstall = {
  id: string;
  status: string;
  applied_at?: string | null;
  install_summary?: string | null;
  installed_items?: unknown;
  blueprint?: IndustryBlueprint;
};
