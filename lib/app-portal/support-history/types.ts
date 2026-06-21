import type {
  SupportRequestCategory,
  SupportRequestItem,
  SupportRequestPriority,
  SupportRequestStatus,
} from "@/lib/app-portal/support-requests";

export type HistoricalSupportStatus = "resolved" | "closed" | "reopened" | "archived";

export type SupportHistoryChannel =
  | "app_portal"
  | "email"
  | "chat"
  | "phone"
  | "assistant";

export type SupportHistorySortOption =
  | "updated_desc"
  | "updated_asc"
  | "created_desc"
  | "created_asc"
  | "priority_desc"
  | "title_asc";

export type SupportHistoryCase = SupportRequestItem & {
  channel?: SupportHistoryChannel;
  resolved_at?: string;
};

export type SupportHistoryOverview = {
  total_historical: number;
  resolved: number;
  closed: number;
  reopened: number;
  archived: number;
  avg_resolution_days: number;
};

export type SupportHistoryCategoryInsight = {
  category: SupportRequestCategory;
  count: number;
};

export type SupportHistoryInsights = {
  top_categories: SupportHistoryCategoryInsight[];
  reopen_rate_percent: number;
  most_recent_resolution_at?: string;
};

export type SupportHistoryPagination = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type SupportHistoryResponse = {
  found: boolean;
  can_manage?: boolean;
  can_reopen?: boolean;
  overview?: SupportHistoryOverview;
  insights?: SupportHistoryInsights;
  items: SupportHistoryCase[];
  pagination?: SupportHistoryPagination;
  principle?: string;
};

export type SupportHistoryFilterState = {
  status: SupportRequestStatus | "";
  category: SupportRequestCategory | "";
  priority: SupportRequestPriority | "";
  channel: SupportHistoryChannel | "";
  assigned: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  sort: SupportHistorySortOption;
  page: number;
};

export type SupportHistoryLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  breadcrumbSupport: string;
  breadcrumbHistory: string;
  backToSupport: string;
  createRequest: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  sections: {
    overview: string;
    filters: string;
    cases: string;
    insights: string;
    understanding: string;
  };
  overview: {
    totalHistorical: string;
    resolved: string;
    closed: string;
    reopened: string;
    archived: string;
    avgResolutionDays: string;
    daysUnit: string;
  };
  filters: {
    search: string;
    searchPlaceholder: string;
    status: string;
    category: string;
    priority: string;
    channel: string;
    assigned: string;
    dateFrom: string;
    dateTo: string;
    sort: string;
    all: string;
    apply: string;
    clear: string;
  };
  sortOptions: Record<SupportHistorySortOption, string>;
  card: {
    viewCase: string;
    createdBy: string;
    created: string;
    updated: string;
    resolved: string;
    status: string;
    priority: string;
    category: string;
    channel: string;
    assignee: string;
    module: string;
  };
  pagination: {
    previous: string;
    next: string;
    page: string;
  };
  insights: {
    topCategories: string;
    reopenRate: string;
    recentResolution: string;
    noInsights: string;
  };
  understanding: {
    title: string;
    body: string;
    auditTitle: string;
    auditBody: string;
    reopenTitle: string;
    reopenBody: string;
  };
  categories: Record<SupportRequestCategory, string>;
  priorities: Record<SupportRequestPriority, string>;
  statuses: Record<SupportRequestStatus | HistoricalSupportStatus, string>;
  channels: Record<SupportHistoryChannel, string>;
  detail: {
    reopen: string;
    reopenTitle: string;
    reopenReason: string;
    reopenReasonPlaceholder: string;
    reopenConfirm: string;
    reopenCancel: string;
    reopenSuccess: string;
    resolution: string;
    resolutionSummary: string;
    backToHistory: string;
    backToRequests: string;
  };
};
