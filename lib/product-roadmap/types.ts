import type {
  EffortLevel,
  IdeaSource,
  ImpactLevel,
  InitiativeStatus,
  PriorityLevel,
  ReleaseChannel,
  RequestSource,
  RoadmapCategory,
  RoadmapView,
} from "./constants";

export type RoadmapFilters = {
  category?: RoadmapCategory | "";
  priority?: PriorityLevel | "";
  status?: InitiativeStatus | "";
  source?: IdeaSource | "";
  roadmap_view?: RoadmapView | "";
  release_window?: string;
};

export type InitiativeScores = {
  customer_demand: number;
  revenue_potential: number;
  strategic_alignment: number;
  implementation_complexity: number;
  risk_reduction: number;
  competitive_advantage: number;
  composite: number;
};

export type RequestLink = {
  id: string;
  request_source: RequestSource;
  request_label: string;
  company_name: string;
};

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  category: RoadmapCategory;
  source: IdeaSource;
  roadmap_view: RoadmapView;
  strategic_value: ImpactLevel;
  customer_impact: ImpactLevel;
  estimated_effort: EffortLevel;
  priority: PriorityLevel;
  status: InitiativeStatus;
  owner: string;
  target_release: string;
  release_window: string;
  related_phases: string[];
  scores: InitiativeScores;
  deferred: boolean;
  supporting_requests: number;
  enterprise_requests: number;
  growth_partner_requests: number;
  request_links: RequestLink[];
  created_at: string;
  updated_at: string;
  released_at: string | null;
};

export type RoadmapOverview = {
  planned_initiatives: number;
  in_development: number;
  ready_for_release: number;
  customer_requested_features: number;
  recently_completed: number;
  deferred_items: number;
};

export type RoadmapViewCount = {
  key: string;
  count: number;
};

export type RoadmapAuditEntry = {
  id: string;
  roadmap_item_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type ProductRoadmapCenter = {
  principle: string;
  filters: RoadmapFilters;
  overview: RoadmapOverview;
  roadmap_views: RoadmapViewCount[];
  items: RoadmapItem[];
  audit: RoadmapAuditEntry[];
};

export type ProductRoadmapCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    views: string;
    table: string;
    scoring: string;
    requests: string;
    release: string;
    audit: string;
    filters: string;
    createIdea: string;
  };
  overview: {
    plannedInitiatives: string;
    inDevelopment: string;
    readyForRelease: string;
    customerRequested: string;
    recentlyCompleted: string;
    deferredItems: string;
  };
  table: {
    initiative: string;
    category: string;
    priority: string;
    status: string;
    owner: string;
    targetRelease: string;
    source: string;
    view: string;
    score: string;
    supportingRequests: string;
    enterpriseRequests: string;
    partnerRequests: string;
    relatedPhases: string;
    actions: string;
  };
  categories: Record<RoadmapCategory, string>;
  views: Record<RoadmapView, string>;
  sources: Record<IdeaSource, string>;
  priorities: Record<PriorityLevel, string>;
  statuses: Record<InitiativeStatus, string>;
  efforts: Record<EffortLevel, string>;
  impacts: Record<ImpactLevel, string>;
  requestSources: Record<RequestSource, string>;
  releaseChannels: Record<ReleaseChannel, string>;
  scoring: {
    customerDemand: string;
    revenuePotential: string;
    strategicAlignment: string;
    implementationComplexity: string;
    riskReduction: string;
    competitiveAdvantage: string;
    composite: string;
  };
  filters: {
    category: string;
    priority: string;
    status: string;
    source: string;
    view: string;
    releaseWindow: string;
    allCategories: string;
    allPriorities: string;
    allStatuses: string;
    allSources: string;
    allViews: string;
    allWindows: string;
    apply: string;
  };
  actions: {
    approve: string;
    plan: string;
    startDevelopment: string;
    moveToTesting: string;
    publishRelease: string;
    decline: string;
    linkRequest: string;
    moveToNow: string;
    moveToNext: string;
    applying: string;
  };
  create: {
    title: string;
    description: string;
    submit: string;
    placeholderTitle: string;
    placeholderDescription: string;
  };
};
