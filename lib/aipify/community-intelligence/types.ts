export const CONTRIBUTION_CATEGORIES = [
  "knowledge",
  "operational",
  "governance",
  "customer_success",
  "industry",
  "marketplace",
] as const;

export const CONTRIBUTION_TYPES = [
  "knowledge_article",
  "implementation_guide",
  "blueprint_enhancement",
  "business_pack_review",
  "operational_lesson",
  "governance_recommendation",
  "adoption_success_story",
  "risk_mitigation_practice",
] as const;

export type CommunityContribution = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  category_label?: string;
  contribution_type: string;
  type_label?: string;
  status?: string;
  governance_flag?: boolean;
  source_module?: string | null;
  rating_avg?: number;
  rating_count?: number;
  published_at?: string;
  created_at?: string;
};

export type CommunityObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CollectiveInsightCategory = {
  domain?: string;
  label?: string;
  signals?: string[];
};

export type CollectiveInsightExamples = {
  principle?: string;
  categories?: CollectiveInsightCategory[];
};

export type PrivacyPrinciples = {
  principle?: string;
  must?: string[];
  must_not?: string[];
};

export type CommunityContributionsBlueprint = {
  principle?: string;
  contribution_types?: Array<{ key?: string; label?: string; description?: string }>;
  participation_note?: string;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  focus?: string[];
};

export type CommunityEngagementSummary = {
  contributions_total?: number;
  published_contributions?: number;
  pending_reviews?: number;
  draft_contributions?: number;
  briefings_total?: number;
  briefings_last_30d?: number;
  ratings_total?: number;
  avg_health_score?: number;
  avg_intelligence_score?: number;
  categories_used?: number;
  participation_enabled?: boolean;
  allow_contributions?: boolean;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: number | string;
  title?: string;
  engine_phase?: string;
  doc?: string;
  route?: string;
  admin_route?: string;
  mapping_note?: string;
};

export type CommunityIntelligenceCard = {
  has_customer: boolean;
  health_score?: number;
  intelligence_score?: number;
  contribution_score?: number;
  pending_reviews?: number;
  philosophy?: string;
  participation_voluntary?: boolean;
  mission?: string;
  abos_principle?: string;
  core_principle?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  engagement_summary?: CommunityEngagementSummary;
  blueprint_note?: string;
};

export type CommunityIntelligenceDashboard = {
  has_customer: boolean;
  participation_enabled?: boolean;
  participation_voluntary?: boolean;
  anonymization_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  health_score?: number;
  intelligence_score?: number;
  contribution_score?: number;
  score_components?: Record<string, number>;
  featured_learnings: CommunityContribution[];
  featured_insights: CommunityContribution[];
  best_practices: CommunityContribution[];
  top_rated: CommunityContribution[];
  popular_resources: CommunityContribution[];
  recently_validated: CommunityContribution[];
  blueprint_recommendations: CommunityContribution[];
  blueprint_discussions: CommunityContribution[];
  industry_insights: CommunityContribution[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  intelligence_categories?: Array<{ key: string; label: string }>;
  contribution_types?: Array<{ key: string; label: string }>;
  approval_workflow?: Array<{ step: string; label: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  community_philosophy?: string;
  abos_principle?: string;
  core_principle?: string;
  vision?: string;
  community_intelligence_note?: string;
  distinction_note?: string;
  community_objectives?: CommunityObjective[];
  collective_insight_examples?: CollectiveInsightExamples;
  privacy_principles?: PrivacyPrinciples;
  community_contributions_blueprint?: CommunityContributionsBlueprint;
  companion_examples?: CompanionExample[];
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  integration_links?: IntegrationLink[];
  engagement_summary?: CommunityEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  principles?: string[];
};

export type CommunityIntelligenceAdmin = {
  has_customer: boolean;
  participation_enabled?: boolean;
  require_governance_review?: boolean;
  health_score?: number;
  intelligence_score?: number;
  contribution_score?: number;
  pending_reviews: CommunityContribution[];
  governance_queue: CommunityContribution[];
  contribution_queue: CommunityContribution[];
  governance_flags: CommunityContribution[];
  contribution_trends: Array<{
    health_score: number;
    intelligence_score?: number;
    contribution_score: number;
    calculated_at?: string;
  }>;
  intelligence_trends: Array<{
    health_score: number;
    intelligence_score?: number;
    contribution_score: number;
    calculated_at?: string;
  }>;
  intelligence_categories: Array<{ category: string; label: string; count: number }>;
  participation_insights?: {
    participation_enabled?: boolean;
    allow_contributions?: boolean;
    published_count?: number;
    draft_count?: number;
    pending_count?: number;
  };
  pending_count?: number;
  queue_count?: number;
};

export type CommunityActionResult = {
  contribution_id?: string;
  status?: string;
  decision?: string;
  rating_avg?: number;
  rating_count?: number;
  governance_required?: boolean;
  error?: string;
};

export type CommunityBriefingResult = {
  briefing_id?: string;
  summary?: string;
  content?: Record<string, unknown>;
  error?: string;
};
