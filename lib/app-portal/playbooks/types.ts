export type PlaybookCategory =
  | "customer_support"
  | "employee_onboarding"
  | "incident_response"
  | "security_procedures"
  | "billing_operations"
  | "approval_processes"
  | "business_pack_operations"
  | "integration_management"
  | "executive_processes"
  | "custom";

export type PlaybookStatus = "draft" | "active" | "under_review" | "archived";

import type { ReviewFrequency as AppReviewFrequency } from "../responsibilities/types";
type ReviewFrequency = AppReviewFrequency;

export type PlaybookStep = {
  id: string;
  step_order: number;
  title: string;
  description: string;
  responsible_role: string;
  requires_approval: boolean;
  related_resources: string[];
  checklist_items: string[];
};

export type PlaybookItem = {
  id: string;
  title: string;
  description: string;
  description_full?: string;
  category: PlaybookCategory;
  owner_id?: string | null;
  owner_name: string;
  contributor_ids?: string[];
  status: PlaybookStatus;
  version_number: number;
  review_frequency?: ReviewFrequency | null;
  last_reviewed_date?: string | null;
  related_modules?: string[];
  related_knowledge_articles?: string[];
  notes?: string;
  notes_full?: string;
  access_count: number;
  needs_review?: boolean;
  created_at: string;
  updated_at: string;
};

export type PlaybookRecommendation = {
  id: string;
  key: string;
  priority: string;
  playbook_id?: string;
};

export type PlaybooksDashboard = {
  active: number;
  draft: number;
  archived: number;
  needs_review: number;
  recently_updated: PlaybookItem[];
  most_accessed: PlaybookItem[];
};

export type PlaybookListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: PlaybookItem[];
  dashboard?: PlaybooksDashboard;
  recommendations?: PlaybookRecommendation[];
  principle?: string;
};

export type PlaybookVersionSummary = {
  id: string;
  version_number: number;
  change_summary: string;
  updated_by: string;
  updated_by_id?: string | null;
  created_at: string;
  snapshot?: unknown;
};

export type PlaybookAuditEntry = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  performed_by: string;
};

export type PlaybookDetail = {
  found: boolean;
  can_manage?: boolean;
  playbook?: PlaybookItem;
  steps?: PlaybookStep[];
  contributors?: Array<{ user_id: string; name: string }>;
  version_history?: PlaybookVersionSummary[];
  activity_timeline?: PlaybookAuditEntry[];
  audit_history?: PlaybookAuditEntry[];
  recommendations?: PlaybookRecommendation[];
};

export type PlaybookVersionsResponse = {
  found: boolean;
  playbook_id?: string;
  current_version?: number;
  versions: PlaybookVersionSummary[];
};

export type PlaybooksLabels = {
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
    category: string;
    status: string;
    owner: string;
    recentlyUpdated: string;
    relatedModule: string;
    all: string;
    yes: string;
    no: string;
  };
  dashboard: {
    active: string;
    draft: string;
    archived: string;
    needsReview: string;
    recent: string;
    mostAccessed: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    category: string;
    owner: string;
    reviewFrequency: string;
    notes: string;
    stepTitle: string;
    stepDescription: string;
    responsibleRole: string;
    requiresApproval: string;
    addStep: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    version: string;
    lastReviewed: string;
    view: string;
    steps: string;
  };
  detail: {
    overview: string;
    steps: string;
    versionHistory: string;
    contributors: string;
    relatedModules: string;
    relatedArticles: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    changeSummary: string;
    checklist: string;
    resources: string;
  };
  categories: Record<PlaybookCategory, string>;
  statuses: Record<PlaybookStatus, string>;
  frequencies: Record<ReviewFrequency, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    versions: string;
    versionsAnswer: string;
    autoCreate: string;
    autoCreateAnswer: string;
  };
};
