export type SkillsMarketplaceScope = "customer" | "platform";

export type SkillsMarketplaceDisplayStatus =
  | "operational"
  | "pilot"
  | "beta"
  | "paused"
  | "requires_attention";

export type SkillsMarketplaceReleaseStage =
  | "internal_development"
  | "customer_zero"
  | "pilot_customers"
  | "growth_partners"
  | "stable_release";

export type SkillsMarketplaceActivationMethod =
  | "activate"
  | "request_access"
  | "coming_soon"
  | "active";

export type SkillsMarketplaceCategory =
  | "executive"
  | "support"
  | "commerce"
  | "operations"
  | "knowledge"
  | "growth"
  | "compliance"
  | "automation"
  | "companion";

export type SkillsMarketplaceOverview = {
  installed_count: number;
  available_count: number;
  pilot_count: number;
  pending_reviews: number;
};

export type SkillsMarketplaceInstalledSkill = {
  tenant_skill_id?: string;
  key: string;
  name: string;
  description: string;
  display_status: SkillsMarketplaceDisplayStatus;
  version: string;
  environment: string;
  owner: string;
  category: SkillsMarketplaceCategory;
  release_stage: SkillsMarketplaceReleaseStage;
  success_rate?: number;
  health_score?: number;
  install_count?: number;
};

export type SkillsMarketplaceRecommendation = {
  key: string;
  name: string;
  description: string;
  category: SkillsMarketplaceCategory;
  reason_key: string;
  impact_key: string;
  activation_method: SkillsMarketplaceActivationMethod;
  plan_allowed?: boolean;
};

export type SkillsMarketplaceCatalogItem = {
  key: string;
  name: string;
  description: string;
  category: SkillsMarketplaceCategory;
  operational_status: string;
  estimated_value_key: string;
  activation_method: SkillsMarketplaceActivationMethod;
  release_stage: SkillsMarketplaceReleaseStage;
  minimum_plan: string;
  requires_approval: boolean;
  installed?: boolean;
  plan_allowed?: boolean;
};

export type SkillsMarketplacePipelineStage = {
  key: SkillsMarketplaceReleaseStage;
  order: number;
};

export type SkillsMarketplaceGovernanceItem = {
  key: string;
  name: string;
  tenant_skill_id?: string;
  permission_scope: string;
  risk_level: string;
  owner: string;
  requires_approval: boolean;
  last_review_at?: string;
  status: string;
  unapproved_permissions?: number;
};

export type SkillsMarketplacePerformanceItem = {
  key: string;
  name: string;
  tenant_skill_id?: string;
  success_rate: number;
  usage_frequency: number;
  business_impact_key: string;
  avg_execution_ms: number;
  satisfaction_score: number;
};

export type SkillsMarketplaceExperience = {
  scope: SkillsMarketplaceScope;
  tenant_id?: string;
  plan?: string;
  overview: SkillsMarketplaceOverview;
  installed_skills: SkillsMarketplaceInstalledSkill[];
  recommended_skills: SkillsMarketplaceRecommendation[];
  marketplace: SkillsMarketplaceCatalogItem[];
  pipeline: SkillsMarketplacePipelineStage[];
  governance: SkillsMarketplaceGovernanceItem[];
  performance: SkillsMarketplacePerformanceItem[];
  principle?: string;
};

export type SkillsMarketplaceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  principle: string;
  privacy: string;
  sections: {
    overview: string;
    installed: string;
    recommended: string;
    marketplace: string;
    pipeline: string;
    governance: string;
    performance: string;
  };
  overview: {
    installed: string;
    available: string;
    pilot: string;
    pendingReviews: string;
  };
  status: Record<SkillsMarketplaceDisplayStatus, string>;
  environment: { production: string; testing: string };
  categories: Record<SkillsMarketplaceCategory, string>;
  pipelineStages: Record<SkillsMarketplaceReleaseStage, string>;
  activation: Record<SkillsMarketplaceActivationMethod, string>;
  actions: {
    activate: string;
    learnMore: string;
    requestAccess: string;
    comingSoon: string;
    viewDetails: string;
    manage: string;
    history: string;
  };
  installed: {
    version: string;
    environment: string;
    owner: string;
    status: string;
    empty: string;
  };
  recommended: {
    why: string;
    impact: string;
    empty: string;
  };
  marketplace: {
    allCategories: string;
    estimatedValue: string;
    empty: string;
  };
  governance: {
    permissionScope: string;
    riskLevel: string;
    owner: string;
    lastReview: string;
    empty: string;
    pendingApproval: string;
    underReview: string;
  };
  performance: {
    successRate: string;
    usage: string;
    satisfaction: string;
    actionsPerWeek: string;
    empty: string;
  };
  reasons: Record<string, string>;
  impacts: Record<string, string>;
  detail: {
    overview: string;
    capabilities: string;
    permissions: string;
    audit: string;
    performance: string;
    deployment: string;
    faq: string;
    controls: string;
    back: string;
    notFound: string;
    install: string;
    installWithApproval: string;
    disable: string;
    noPermissions: string;
    noAudit: string;
  };
};
