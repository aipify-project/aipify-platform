export type CommitmentType =
  | "customer_commitment"
  | "employee_commitment"
  | "executive_commitment"
  | "team_commitment"
  | "vendor_commitment"
  | "regulatory_commitment"
  | "strategic_commitment"
  | "operational_commitment"
  | "partnership_commitment"
  | "custom_commitment";

export type CommitmentStatus =
  | "proposed"
  | "accepted"
  | "in_progress"
  | "at_risk"
  | "fulfilled"
  | "cancelled"
  | "archived";

export type CommitmentPriority = "low" | "medium" | "high" | "critical";

export type CommitmentItem = {
  id: string;
  title: string;
  description?: string;
  description_full?: string;
  commitment_type: CommitmentType;
  owner_id?: string | null;
  owner_name: string;
  recipient: string;
  contributor_ids?: string[];
  status: CommitmentStatus;
  priority: CommitmentPriority;
  commitment_date?: string | null;
  due_date?: string | null;
  fulfillment_criteria?: string;
  fulfillment_criteria_full?: string;
  progress_percent: number;
  milestones_achieved?: string;
  delays_encountered?: string;
  obstacles_identified?: string;
  completion_evidence?: string;
  lessons_learned?: string;
  is_overdue?: boolean;
  is_at_risk?: boolean;
  notes?: string;
  notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type CommitmentProgressRecord = {
  id: string;
  progress_percent?: number;
  milestones_achieved?: string;
  delays_encountered?: string;
  obstacles_identified?: string;
  progress_update?: string;
  completion_evidence?: string;
  lessons_learned?: string;
  created_at: string;
  performed_by: string;
};

export type CommitmentRecommendation = {
  id: string;
  key: string;
  priority: string;
  commitment_id?: string;
};

export type CommitmentDashboard = {
  active: number;
  at_risk: CommitmentItem[];
  recently_fulfilled: CommitmentItem[];
  overdue: number;
  high_priority: CommitmentItem[];
  completion_trends: CommitmentItem[];
};

export type CommitmentListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: CommitmentItem[];
  dashboard?: CommitmentDashboard;
  recommendations?: CommitmentRecommendation[];
  principle?: string;
};

export type CommitmentDetail = {
  found: boolean;
  can_manage?: boolean;
  commitment?: CommitmentItem;
  progress_history?: CommitmentProgressRecord[];
  related_goals?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  related_decisions?: Array<{ id: string; title: string; status: string }>;
  related_communications?: Array<{ id: string; title: string; status: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: CommitmentRecommendation[];
};

export type CommitmentTrackingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: {
    search: string;
    type: string;
    status: string;
    owner: string;
    recipient: string;
    priority: string;
    dueFrom: string;
    dueTo: string;
    all: string;
  };
  dashboard: {
    active: string;
    atRisk: string;
    recentlyFulfilled: string;
    overdue: string;
    highPriority: string;
    completionTrends: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    type: string;
    recipient: string;
    priority: string;
    dueDate: string;
    fulfillmentCriteria: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    recipient: string;
    priority: string;
    progress: string;
    dueDate: string;
    view: string;
  };
  detail: {
    overview: string;
    ownership: string;
    fulfillmentCriteria: string;
    fulfillmentTracking: string;
    milestonesAchieved: string;
    delaysEncountered: string;
    obstaclesIdentified: string;
    progressUpdate: string;
    completionEvidence: string;
    lessonsLearned: string;
    progressHistory: string;
    relatedGoals: string;
    relatedFollowUps: string;
    relatedDecisions: string;
    relatedCommunications: string;
    activityTimeline: string;
    audit: string;
    save: string;
    saved: string;
    recordProgress: string;
    progressRecorded: string;
    recommendations: string;
    status: string;
    notes: string;
  };
  types: Record<CommitmentType, string>;
  statuses: Record<CommitmentStatus, string>;
  priorities: Record<CommitmentPriority, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    whyTrack: string;
    whyTrackAnswer: string;
    autoFulfill: string;
    autoFulfillAnswer: string;
  };
};
