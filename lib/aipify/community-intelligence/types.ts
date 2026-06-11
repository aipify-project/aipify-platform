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

export type CommunityIntelligenceCard = {
  has_customer: boolean;
  health_score?: number;
  intelligence_score?: number;
  contribution_score?: number;
  pending_reviews?: number;
  philosophy?: string;
  participation_voluntary?: boolean;
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
