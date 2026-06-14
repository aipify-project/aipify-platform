export type DomainMetric = {
  metric_key: string;
  domain: string;
  label: string;
  value_label: string;
  health_status: string;
};

export type StructuralNode = {
  node_key: string;
  node_type: string;
  label: string;
  summary: string;
  status: string;
};

export type StructuralRelationship = {
  relationship_key: string;
  from_node_key: string;
  to_node_key: string;
  relationship_type: string;
  summary: string;
};

export type CriticalDependency = {
  dependency_key: string;
  label: string;
  systems_involved: string[];
  risk_level: string;
  summary: string;
};

export type VisualizationEntry = {
  visualization_key: string;
  viz_type: string;
  title: string;
  description: string;
};

export type ImpactScenario = {
  scenario_key: string;
  question: string;
  affected_areas: string[];
  impact_summary: string;
  confidence: string;
};

export type StructuralSnapshot = {
  snapshot_key: string;
  snapshot_type: string;
  label: string;
  summary: string;
  captured_at: string | null;
};

export type ChangeComparison = {
  comparison_key: string;
  before_label: string;
  after_label: string;
  finding: string;
  trend: string;
};

export type TwinInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type TwinRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type TwinReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ExecutiveTwinView = {
  complexity_indicator: string;
  dependency_risks: string;
  workflow_maturity: string;
  structural_opportunities: string;
  executive_priorities: string;
};

export type OrganizationalDigitalTwinCenter = {
  dashboard: {
    structural_nodes: number;
    relationships_mapped: number;
    critical_dependencies: number;
    workflow_health_score: number;
    automation_coverage_pct: number;
    knowledge_distribution_score: number;
    complexity_index: number;
    dependency_risk_score: number;
    workflow_maturity_score: number;
    leadership_confidence: number;
    companion_usefulness_rating: number;
  } | null;
  domain_metrics: DomainMetric[];
  nodes: StructuralNode[];
  relationships: StructuralRelationship[];
  dependencies: CriticalDependency[];
  visualizations: VisualizationEntry[];
  impact_scenarios: ImpactScenario[];
  snapshots: StructuralSnapshot[];
  comparisons: ChangeComparison[];
  insights: TwinInsight[];
  recommendations: TwinRecommendation[];
  governance_reviews: TwinReview[];
  executive_view: ExecutiveTwinView | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
