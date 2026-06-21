import type {
  CustomerStatus,
  FeedbackPriority,
  FeedbackType,
  WorkflowStatus,
} from "./constants";

export type FeedbackFilters = {
  feedback_type?: FeedbackType | "";
  workflow_status?: WorkflowStatus | "";
  priority?: FeedbackPriority | "";
};

export type FeedbackOverview = {
  new_feedback: number;
  bugs_reported: number;
  feature_requests: number;
  improvements_submitted: number;
  resolved_feedback: number;
  awaiting_review: number;
};

export type FeedbackRow = {
  id: string;
  feedback_type: FeedbackType;
  title: string;
  description: string;
  priority: FeedbackPriority;
  wants_response: boolean;
  workflow_status: WorkflowStatus;
  customer_status: CustomerStatus;
  assigned_to: string;
  linked_phase: string;
  page_url: string;
  browser_info: string;
  device_type: string;
  attachment_url: string;
  company_id: string;
  customer: string;
  submitted_at: string;
  created_at: string;
};

export type TrendItem = {
  title: string;
  count: number;
};

export type FeedbackTrends = {
  top_feature_requests: TrendItem[];
  top_bugs: TrendItem[];
  top_frustrations: TrendItem[];
};

export type FeedbackAuditEntry = {
  id: string;
  feedback_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type VocFeedbackCenter = {
  principle: string;
  is_empty: boolean;
  filters: FeedbackFilters;
  overview: FeedbackOverview;
  feedback: FeedbackRow[];
  trends: FeedbackTrends;
  top_improvement_requests: TrendItem[];
  audit: FeedbackAuditEntry[];
};

export type CustomerFeedbackHistory = {
  items: FeedbackRow[];
};

export type ProductInitiative = {
  id: string;
  title: string;
  summary: string;
  recommendation: string;
  feedback_count: number;
  initiative_type: string;
  status: string;
  linked_phase: string;
  created_at: string;
};

export type VocGlobalInsights = {
  principle: string;
  insights: {
    total_feedback: number;
    feature_request_themes: TrendItem[];
    onboarding_requests: number;
    recommendation: string;
  };
  initiatives: ProductInitiative[];
};

export type VocFeedbackCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    feedback: string;
    trends: string;
    topRequests: string;
    audit: string;
    filters: string;
  };
  overview: {
    newFeedback: string;
    bugs: string;
    features: string;
    improvements: string;
    resolved: string;
    awaitingReview: string;
  };
  table: {
    category: string;
    title: string;
    customer: string;
    priority: string;
    submitted: string;
    status: string;
    assignedTo: string;
    actions: string;
    event: string;
    count: string;
  };
  feedbackTypes: Record<FeedbackType, string>;
  priorities: Record<FeedbackPriority, string>;
  statuses: Record<WorkflowStatus, string>;
  actions: {
    view: string;
    assign: string;
    merge: string;
    updateStatus: string;
    linkPhase: string;
    notify: string;
    applying: string;
  };
  filters: {
    type: string;
    status: string;
    priority: string;
    allTypes: string;
    allStatuses: string;
    allPriorities: string;
    apply: string;
  };
};

export type VocWidgetLabels = {
  trigger: string;
  triggerShort: string;
  title: string;
  subtitle: string;
  type: string;
  feedbackTitle: string;
  description: string;
  priority: string;
  wantsResponse: string;
  noResponse: string;
  contactMe: string;
  includeContext: string;
  submit: string;
  submitting: string;
  acknowledgementTitle: string;
  acknowledgementBody: string;
  historyTitle: string;
  historyEmpty: string;
  feedbackTypes: Record<FeedbackType, string>;
  priorities: Record<FeedbackPriority, string>;
  customerStatuses: Record<CustomerStatus, string>;
  close: string;
  trustNote: string;
  transparencyNote: string;
  trustStatementLink: string;
  trustStatementLinkAria: string;
};

export type VocGlobalInsightsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  sections: {
    insights: string;
    initiatives: string;
    themes: string;
  };
  insights: {
    totalFeedback: string;
    onboardingRequests: string;
    recommendation: string;
  };
  table: {
    title: string;
    summary: string;
    recommendation: string;
    feedbackCount: string;
    type: string;
    phase: string;
    status: string;
    theme: string;
    count: string;
  };
  actions: {
    createInitiative: string;
    applying: string;
  };
};
