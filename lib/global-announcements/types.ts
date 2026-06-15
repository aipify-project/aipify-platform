import type {
  AnnouncementCategory,
  AnnouncementStatus,
  DeliveryChannel,
  TargetAudience,
} from "./constants";

export type AnnouncementFilters = {
  category?: AnnouncementCategory | "";
  audience?: TargetAudience | "";
  status?: AnnouncementStatus | "";
  country?: string;
  language?: string;
  plan?: string;
};

export type AnnouncementAnalytics = {
  views: number;
  email_opens: number;
  click_rate: number;
  delivery_success_rate: number;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  summary: string;
  full_content: string;
  category: AnnouncementCategory;
  audience: TargetAudience;
  status: AnnouncementStatus;
  delivery_channels: DeliveryChannel[];
  publish_at: string | null;
  expire_at: string | null;
  scheduled_at: string | null;
  requires_approval: boolean;
  approval_status: string;
  created_by: string;
  audience_filters: Record<string, string>;
  created_at: string;
  analytics: AnnouncementAnalytics | null;
};

export type AnalyticsSummaryRow = {
  announcement_id: string;
  title: string;
  views: number;
  email_opens: number;
  click_rate: number;
  delivery_success_rate: number;
};

export type AnnouncementAuditEntry = {
  id: string;
  announcement_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type AnnouncementOverview = {
  active_announcements: number;
  scheduled_messages: number;
  draft_messages: number;
  targeted_campaigns: number;
  delivery_success_rate: number;
  messages_requiring_review: number;
};

export type GlobalAnnouncementCenter = {
  principle: string;
  is_empty: boolean;
  filters: AnnouncementFilters;
  overview: AnnouncementOverview;
  announcements: AnnouncementRow[];
  analytics_summary: AnalyticsSummaryRow[];
  audit: AnnouncementAuditEntry[];
};

export type GlobalAnnouncementLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    announcements: string;
    create: string;
    analytics: string;
    audit: string;
    filters: string;
  };
  overview: {
    active: string;
    scheduled: string;
    drafts: string;
    campaigns: string;
    deliveryRate: string;
    requiringReview: string;
  };
  table: {
    title: string;
    category: string;
    audience: string;
    status: string;
    scheduledDate: string;
    createdBy: string;
    actions: string;
    views: string;
    emailOpens: string;
    clickRate: string;
    deliverySuccess: string;
    event: string;
  };
  categories: Record<AnnouncementCategory, string>;
  audiences: Record<TargetAudience, string>;
  statuses: Record<AnnouncementStatus, string>;
  channels: Record<DeliveryChannel, string>;
  form: {
    title: string;
    summary: string;
    fullContent: string;
    category: string;
    audience: string;
    channels: string;
    publishDate: string;
    expirationDate: string;
    scheduledDate: string;
    requiresApproval: string;
    create: string;
    country: string;
    language: string;
    plan: string;
  };
  actions: {
    view: string;
    edit: string;
    duplicate: string;
    publish: string;
    schedule: string;
    archive: string;
    approve: string;
    cancel: string;
    applying: string;
  };
  filters: {
    category: string;
    audience: string;
    status: string;
    country: string;
    language: string;
    plan: string;
    allCategories: string;
    allAudiences: string;
    allStatuses: string;
    apply: string;
  };
};
