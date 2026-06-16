export type CommunicationType =
  | "company_announcement"
  | "operational_update"
  | "policy_update"
  | "security_notice"
  | "executive_message"
  | "team_update"
  | "maintenance_notification"
  | "celebration_recognition"
  | "emergency_communication"
  | "custom_communication";

export type CommunicationStatus = "draft" | "scheduled" | "published" | "expired" | "archived";

export type CommunicationPriority = "informational" | "important" | "high_priority" | "critical";

export type AudienceType =
  | "entire_organization"
  | "specific_departments"
  | "administrators_only"
  | "executives_only"
  | "custom_groups"
  | "individual_users";

export type CommunicationItem = {
  id: string;
  title: string;
  summary?: string;
  summary_full?: string;
  full_message?: string;
  communication_type: CommunicationType;
  author_id?: string | null;
  author_name: string;
  publish_date?: string | null;
  expiration_date?: string | null;
  audience_type: AudienceType;
  audience_target_ids?: string[];
  priority: CommunicationPriority;
  status: CommunicationStatus;
  requires_acknowledgement?: boolean;
  related_modules?: string[];
  related_policy_ids?: string[];
  expiring_soon?: boolean;
  user_acknowledged?: boolean;
  acknowledgement_count?: number;
  created_at: string;
  updated_at: string;
};

export type CommunicationRecommendation = {
  id: string;
  key: string;
  priority: string;
  communication_id?: string;
};

export type CommunicationsDashboard = {
  active: number;
  scheduled: number;
  critical: number;
  expiring: number;
  recently_published: CommunicationItem[];
  drafts: number;
};

export type CommunicationListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: CommunicationItem[];
  dashboard?: CommunicationsDashboard;
  recommendations?: CommunicationRecommendation[];
  principle?: string;
};

export type CommunicationDetail = {
  found: boolean;
  can_manage?: boolean;
  communication?: CommunicationItem;
  related_policies?: Array<{ id: string; title: string; status: string }>;
  delivery_status?: { acknowledged_count: number; outstanding_note?: string };
  acknowledgements?: Array<{ user_id: string; user_name: string; acknowledged_at: string }>;
  user_acknowledgement?: { acknowledged: boolean; pending: boolean };
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: CommunicationRecommendation[];
};

export type CommunicationsLabels = {
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
    priority: string;
    audience: string;
    publishFrom: string;
    publishTo: string;
    all: string;
  };
  dashboard: {
    active: string;
    scheduled: string;
    critical: string;
    expiring: string;
    recentlyPublished: string;
    drafts: string;
  };
  form: {
    createTitle: string;
    title: string;
    summary: string;
    message: string;
    type: string;
    audience: string;
    priority: string;
    publishDate: string;
    expirationDate: string;
    requiresAck: string;
    submit: string;
    cancel: string;
    publish: string;
  };
  card: {
    author: string;
    publishDate: string;
    priority: string;
    audience: string;
    acknowledged: string;
    pending: string;
    view: string;
  };
  detail: {
    overview: string;
    message: string;
    audience: string;
    delivery: string;
    acknowledgements: string;
    acknowledge: string;
    acknowledged: string;
    pendingAck: string;
    relatedPolicies: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    outstanding: string;
  };
  types: Record<CommunicationType, string>;
  statuses: Record<CommunicationStatus, string>;
  priorities: Record<CommunicationPriority, string>;
  audiences: Record<AudienceType, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    acknowledgements: string;
    acknowledgementsAnswer: string;
    autoCommunicate: string;
    autoCommunicateAnswer: string;
  };
};
