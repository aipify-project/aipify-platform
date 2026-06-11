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
  contribution_score?: number;
  score_components?: Record<string, number>;
  featured_insights: CommunityContribution[];
  best_practices: CommunityContribution[];
  top_rated: CommunityContribution[];
  recently_validated: CommunityContribution[];
  blueprint_discussions: CommunityContribution[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  contribution_types?: Array<{ key: string; label: string }>;
  approval_workflow?: Array<{ step: string; label: string }>;
  integrations?: Record<string, string>;
};

export type CommunityIntelligenceAdmin = {
  has_customer: boolean;
  participation_enabled?: boolean;
  require_governance_review?: boolean;
  health_score?: number;
  contribution_score?: number;
  pending_reviews: CommunityContribution[];
  contribution_queue: CommunityContribution[];
  governance_flags: CommunityContribution[];
  intelligence_trends: Array<{
    health_score: number;
    contribution_score: number;
    calculated_at?: string;
  }>;
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
