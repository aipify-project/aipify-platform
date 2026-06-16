export type ResponsibilityArea =
  | "goals"
  | "follow_ups"
  | "decisions"
  | "approvals"
  | "support_requests"
  | "integrations"
  | "business_packs"
  | "billing"
  | "security"
  | "operations";

export type ResponsibilityStatus = "active" | "needs_review" | "unassigned" | "inactive";
export type ReviewFrequency = "monthly" | "quarterly" | "semi_annual" | "annual";
export type WorkloadIndicator = "balanced" | "moderate" | "high";

export type ResponsibilityItem = {
  id: string;
  title: string;
  description: string;
  description_full?: string;
  area: ResponsibilityArea;
  primary_owner_id?: string | null;
  primary_owner_name: string;
  backup_owner_id?: string | null;
  backup_owner_name: string;
  contributor_ids?: string[];
  status: ResponsibilityStatus;
  related_module?: string | null;
  last_reviewed_date?: string | null;
  review_frequency?: ReviewFrequency | null;
  notes?: string;
  notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type ResponsibilityRecommendation = {
  id: string;
  key: string;
  priority: string;
  responsibility_id?: string;
};

export type ResponsibilitiesDashboard = {
  assigned: number;
  unassigned: number;
  needs_review: number;
  critical_no_backup: number;
  overloaded_owners: Array<{ user_id: string; name: string; count: number }>;
  recently_updated: ResponsibilityItem[];
};

export type ResponsibilityListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: ResponsibilityItem[];
  dashboard?: ResponsibilitiesDashboard;
  recommendations?: ResponsibilityRecommendation[];
  principle?: string;
};

export type ResponsibilityDetail = {
  found: boolean;
  can_manage?: boolean;
  responsibility?: ResponsibilityItem;
  contributors?: Array<{ user_id: string; name: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: ResponsibilityRecommendation[];
};

export type OwnerDetailResponse = {
  found: boolean;
  user_id: string;
  user_name: string;
  owned_responsibilities: ResponsibilityItem[];
  backup_responsibilities: ResponsibilityItem[];
  assigned_follow_ups: Array<{ id: string; title: string; status: string }>;
  assigned_goals: Array<{ id: string; title: string; status: string }>;
  pending_approvals: number;
  open_support_requests: number;
  workload_indicator: WorkloadIndicator;
  workload_total: number;
};

export type ResponsibilitiesLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: { search: string; area: string; status: string; owner: string; hasBackup: string; all: string; yes: string; no: string };
  dashboard: { assigned: string; unassigned: string; needsReview: string; noBackup: string; overloaded: string; recent: string };
  form: { createTitle: string; title: string; description: string; area: string; primaryOwner: string; backupOwner: string; reviewFrequency: string; notes: string; submit: string; cancel: string };
  card: { primaryOwner: string; backupOwner: string; lastReviewed: string; view: string; viewOwner: string };
  detail: { overview: string; audit: string; save: string; saved: string; recommendations: string };
  owner: { title: string; owned: string; backup: string; followUps: string; goals: string; approvals: string; support: string; workload: string };
  areas: Record<ResponsibilityArea, string>;
  statuses: Record<ResponsibilityStatus, string>;
  frequencies: Record<ReviewFrequency, string>;
  workload: Record<WorkloadIndicator, string>;
  recommendations: Record<string, string>;
  faq: { title: string; whatIs: string; whatIsAnswer: string; backup: string; backupAnswer: string; autoAssign: string; autoAssignAnswer: string };
};
