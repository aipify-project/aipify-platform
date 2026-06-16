export type DecisionCategory =
  | "strategic"
  | "financial"
  | "operational"
  | "customer_experience"
  | "human_resources"
  | "security"
  | "technology"
  | "compliance"
  | "marketing"
  | "growth";

export type DecisionStatus =
  | "proposed"
  | "under_review"
  | "approved"
  | "rejected"
  | "implemented"
  | "evaluated";

export type DecisionImpactLevel = "low" | "moderate" | "high" | "critical";

export type WouldRepeat = "yes" | "partially" | "no";

export type DecisionItem = {
  id: string;
  title: string;
  description: string;
  description_full?: string;
  category: DecisionCategory;
  decision_owner_id?: string;
  decision_owner: string;
  contributors: Array<{ id?: string; name?: string }>;
  decision_date: string;
  status: DecisionStatus;
  impact_level: DecisionImpactLevel;
  expected_outcome: string;
  supporting_evidence: Array<{ title?: string; reference?: string; url?: string }>;
  related_business_packs: string[];
  linked_follow_up_ids: string[];
  outcome_rating?: number;
  lessons_learned?: string;
  unexpected_consequences?: string;
  would_repeat?: WouldRepeat;
  evaluated_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type DecisionSuggestion = {
  id: string;
  title: string;
  category: DecisionCategory;
  impact_level: DecisionImpactLevel;
  requires_review: boolean;
};

export type DecisionListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: DecisionItem[];
  suggestions: DecisionSuggestion[];
  principle?: string;
};

export type DecisionTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  performed_by: string;
};

export type DecisionOutcomeEvaluation = {
  outcome_rating?: number;
  lessons_learned?: string;
  unexpected_consequences?: string;
  would_repeat?: WouldRepeat;
  evaluated_at?: string;
};

export type DecisionDetail = {
  found: boolean;
  can_manage?: boolean;
  decision?: DecisionItem;
  timeline?: DecisionTimelineEvent[];
  linked_follow_ups?: Array<{ id: string; title: string; status: string }>;
  related_approvals?: Array<{ id: string; title: string; status: string }>;
  outcome_evaluation?: DecisionOutcomeEvaluation | null;
  audit_history?: DecisionTimelineEvent[];
};

export type DecisionFilters = {
  category?: string;
  status?: string;
  owner_id?: string;
  impact_level?: string;
  date_from?: string;
  date_to?: string;
  outcome_rating?: number;
  search?: string;
};

export type DecisionCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  recordDecision: string;
  back: string;
  notFound: string;
  readOnly: string;
  filters: {
    title: string;
    category: string;
    status: string;
    owner: string;
    impact: string;
    dateFrom: string;
    dateTo: string;
    outcomeRating: string;
    search: string;
    searchPlaceholder: string;
    all: string;
  };
  card: {
    owner: string;
    date: string;
    status: string;
    impact: string;
    expectedOutcome: string;
    category: string;
  };
  detail: {
    description: string;
    contributors: string;
    supportingEvidence: string;
    relatedApprovals: string;
    linkedFollowUps: string;
    timeline: string;
    outcomeEvaluation: string;
    auditHistory: string;
    expectedOutcome: string;
    businessPacks: string;
    save: string;
    saved: string;
    evaluate: string;
    outcomeRating: string;
    lessonsLearned: string;
    unexpectedConsequences: string;
    wouldRepeat: string;
  };
  sections: {
    items: string;
    suggestions: string;
  };
  suggestions: {
    accept: string;
    requiresReview: string;
  };
  categories: Record<DecisionCategory, string>;
  statuses: Record<DecisionStatus, string>;
  impactLevels: Record<DecisionImpactLevel, string>;
  wouldRepeat: Record<WouldRepeat, string>;
  form: {
    title: string;
    titlePlaceholder: string;
    description: string;
    category: string;
    impact: string;
    expectedOutcome: string;
    status: string;
    submit: string;
    cancel: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    whyDocument: string;
    whyDocumentAnswer: string;
    autoDecide: string;
    autoDecideAnswer: string;
  };
};
