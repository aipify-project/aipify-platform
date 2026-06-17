export type EcosystemStatus =
  | "thriving"
  | "healthy"
  | "stable"
  | "requires_optimization"
  | "fragmented";

export type RelationshipStrength = "strong" | "moderate" | "emerging" | "underutilized";

export type CoverageCategory =
  | "operational"
  | "executive"
  | "governance"
  | "customer"
  | "knowledge"
  | "growth";

export type CoverageStatus =
  | "comprehensive"
  | "well_covered"
  | "moderate_coverage"
  | "limited_coverage"
  | "coverage_gap_identified";

export type EcosystemPriority =
  | "opportunity"
  | "recommended"
  | "important"
  | "immediate_attention";

export type EcosystemPackCard = {
  pack_key: string;
  name: string;
  adoption_score: number;
  cross_utilization_score: number;
  coverage_category: CoverageCategory | string;
  coverage_status: CoverageStatus | string;
};

export type EcosystemRelationship = {
  id: string;
  source_pack_key: string;
  target_pack_key: string;
  label: string;
  strength: RelationshipStrength | string;
};

export type EcosystemInsightItem = {
  id: string;
  key: string;
  pack_key?: string;
};

export type EcosystemRecommendation = EcosystemInsightItem & {
  priority_level: string;
};

export type EcosystemTimelineEvent = {
  id: string;
  pack_key?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type EcosystemOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  has_ecosystem_data?: boolean;
  health_score?: number;
  ecosystem_status?: EcosystemStatus | string;
  cross_utilization_score?: number;
  coverage_overview?: Record<string, number>;
  packs?: EcosystemPackCard[];
  opportunities?: EcosystemInsightItem[];
  risks?: EcosystemInsightItem[];
  recommendations?: EcosystemRecommendation[];
  executive_summary?: string;
  principle?: string;
};

export type EcosystemRelationships = {
  found: boolean;
  relationships?: EcosystemRelationship[];
};

export type EcosystemLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    packKey: string;
    coverageCategory: string;
    ecosystemStatus: string;
    relationshipStrength: string;
    priorityLevel: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    healthScore: string;
    relationshipMap: string;
    coverageOverview: string;
    crossUtilization: string;
    opportunities: string;
    risks: string;
    executiveSummary: string;
    recommendedActions: string;
    ecosystemStatus: string;
    coverageAnalysis: string;
    timeline: string;
    installedPacks: string;
  };
  card: {
    adoptionScore: string;
    crossUtilization: string;
    coverageCategory: string;
    coverageStatus: string;
  };
  ecosystemStatuses: Record<string, string>;
  relationshipStrengths: Record<string, string>;
  coverageCategories: Record<string, string>;
  coverageStatuses: Record<string, string>;
  priorityLevels: Record<string, string>;
  opportunities: Record<string, string>;
  risks: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoOptimize: string;
    autoOptimizeAnswer: string;
    whyRelationships: string;
    whyRelationshipsAnswer: string;
  };
};

export const ECOSYSTEM_STATUSES: EcosystemStatus[] = [
  "thriving", "healthy", "stable", "requires_optimization", "fragmented",
];

export const RELATIONSHIP_STRENGTHS: RelationshipStrength[] = [
  "strong", "moderate", "emerging", "underutilized",
];

export const COVERAGE_CATEGORIES: CoverageCategory[] = [
  "operational", "executive", "governance", "customer", "knowledge", "growth",
];

export const ECOSYSTEM_PRIORITIES: EcosystemPriority[] = [
  "opportunity", "recommended", "important", "immediate_attention",
];
