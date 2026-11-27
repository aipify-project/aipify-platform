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
  | "closed"
  | "reopened"
  | "archived";

export type SupportInboxView = "all" | "open" | "waiting" | "closed";

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
  related_module_label?: string;
  channel?: string;
  resolved_at?: string;
  attachments?: unknown[];
  /** Customer-visible last message preview when Core provides it. */
  last_message_excerpt?: string;
  last_message_author?: string;
  /** Never populated for APP customers — stripped in parse. */
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

export type SupportRequestResolution = {
  status: string;
  resolved_at?: string;
  summary?: string;
};

export type SupportRequestMessage = {
  id: string;
  body: string;
  author_role?: string;
  author_name?: string;
  visibility?: string;
  created_at: string;
};

export type SupportConversationEntry = {
  id: string;
  kind: "message" | "status";
  side: "customer" | "aipify" | "system";
  author_name: string;
  body: string;
  created_at: string;
  status?: string;
};

export type SupportRequestDetail = {
  found: boolean;
  can_manage?: boolean;
  can_reopen?: boolean;
  is_historical?: boolean;
  resolution?: SupportRequestResolution;
  request?: SupportRequestItem;
  status_history?: SupportRequestStatusHistoryEntry[];
  timeline?: SupportRequestAuditEntry[];
  audit_history?: SupportRequestAuditEntry[];
  related_activity?: SupportRequestAuditEntry[];
  /** Customer-visible portal messages only (when Core returns them). */
  messages?: SupportRequestMessage[];
  comments_placeholder?: boolean;
  internal_notes_placeholder?: boolean;
  attachments_placeholder?: boolean;
};

export type SupportProductOption = {
  id: string;
  label: string;
};

export type SupportRequestsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;
  createRequest: string;
  back: string;
  backToInbox: string;
  notFound: string;
  reference: string;
  lastActivity: string;
  aipifySender: string;
  systemSender: string;
  customerSender: string;
  openingMessage: string;
  statusChanged: string;
  unreadUnavailableNote: string;
  views: {
    all: string;
    open: string;
    waiting: string;
    closed: string;
  };
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
    product: string;
  };
  detail: {
    conversation: string;
    description: string;
    sendReply: string;
    replyPlaceholder: string;
    replySending: string;
    replySent: string;
    replyError: string;
    replyHint: string;
    closeCase: string;
    reopenCase: string;
    attachments: string;
    noAttachments: string;
    metaCreated: string;
    metaUpdated: string;
    metaProduct: string;
    metaAssignee: string;
    unassigned: string;
  };
  categories: Record<SupportRequestCategory, string>;
  priorities: Record<SupportRequestPriority, string>;
  priorityHints: Record<SupportRequestPriority, string>;
  statuses: Record<SupportRequestStatus, string>;
  form: {
    title: string;
    subtitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    category: string;
    priority: string;
    product: string;
    productNone: string;
    productUnavailable: string;
    senderTitle: string;
    senderWorkspace: string;
    senderCompany: string;
    senderCustomerNumber: string;
    required: string;
    submit: string;
    cancel: string;
    submitError: string;
    successTitle: string;
    successBody: string;
    openCase: string;
    validationTitle: string;
    validationDescription: string;
    /** Prefill when opened from APP «Be om endring». */
    profileChangeTitle: string;
    profileChangeDescription: string;
  };
};
