export type SupportRequestCategory =
  | "technical"
  | "billing"
  | "integrations"
  | "business_packs"
  | "account"
  | "security"
  | "general";

export type SupportRequestPriority = "low" | "medium" | "high" | "urgent";

export type SupportRequestStatus =
  | "open"
  | "in_review"
  | "waiting_for_customer"
  | "waiting_for_aipify"
  | "resolved"
  | "closed";

export type SupportRequestItem = {
  id: string;
  title: string;
  description: string;
  description_full?: string;
  category: SupportRequestCategory;
  priority: SupportRequestPriority;
  status: SupportRequestStatus;
  created_by_id?: string;
  created_by: string;
  assigned_support_owner_id?: string;
  assigned_support_owner: string;
  related_module?: string;
  attachments?: unknown[];
  internal_notes?: string;
  internal_notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type SupportRequestListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: SupportRequestItem[];
  principle?: string;
};

export type SupportRequestStatusHistoryEntry = {
  status: string;
  at: string;
  description?: string;
};

export type SupportRequestAuditEntry = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  performed_by: string;
};

export type SupportRequestDetail = {
  found: boolean;
  can_manage?: boolean;
  request?: SupportRequestItem;
  status_history?: SupportRequestStatusHistoryEntry[];
  timeline?: SupportRequestAuditEntry[];
  audit_history?: SupportRequestAuditEntry[];
  related_activity?: SupportRequestAuditEntry[];
  comments_placeholder?: boolean;
  internal_notes_placeholder?: boolean;
  attachments_placeholder?: boolean;
};

export type SupportRequestsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  createRequest: string;
  back: string;
  notFound: string;
  filters: {
    title: string;
    category: string;
    status: string;
    priority: string;
    search: string;
    searchPlaceholder: string;
    all: string;
  };
  card: {
    createdBy: string;
    created: string;
    updated: string;
    status: string;
    priority: string;
    category: string;
    assignee: string;
    module: string;
  };
  detail: {
    description: string;
    statusHistory: string;
    timeline: string;
    auditHistory: string;
    relatedActivity: string;
    comments: string;
    commentsPlaceholder: string;
    internalNotes: string;
    internalNotesPlaceholder: string;
    attachments: string;
    attachmentsPlaceholder: string;
    save: string;
    saved: string;
  };
  categories: Record<SupportRequestCategory, string>;
  priorities: Record<SupportRequestPriority, string>;
  statuses: Record<SupportRequestStatus, string>;
  form: {
    title: string;
    titlePlaceholder: string;
    description: string;
    category: string;
    priority: string;
    module: string;
    submit: string;
    cancel: string;
  };
  faq: {
    title: string;
    howContact: string;
    howContactAnswer: string;
    canTrack: string;
    canTrackAnswer: string;
    whoCanSee: string;
    whoCanSeeAnswer: string;
  };
};
