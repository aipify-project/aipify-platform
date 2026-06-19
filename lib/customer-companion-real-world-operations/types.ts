export type CompanionRealWorldTab =
  | "overview"
  | "requests"
  | "approvals"
  | "providers"
  | "bookings"
  | "deliveries"
  | "executions"
  | "reports"
  | "executive";

export type RealWorldApproval = {
  approval_key: string;
  approval_title: string;
  request_key?: string;
  approval_level?: string;
  approval_status?: string;
  step_order?: number;
  cost_threshold_nok?: number;
  summary?: string;
};

export type RealWorldBooking = {
  booking_key: string;
  service_title: string;
  request_key?: string;
  provider_name?: string;
  booking_status?: string;
  scheduled_at?: string;
  location_label?: string;
  estimated_cost_nok?: number;
  approval_status?: string;
  summary?: string;
};

export type CompanionRealWorldCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  requests?: Record<string, unknown>[];
  approvals?: RealWorldApproval[];
  providers?: Record<string, unknown>[];
  bookings?: RealWorldBooking[];
  deliveries?: Record<string, unknown>[];
  executions?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type CompanionRealWorldLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  bookingsTitle: string;
  tabs: Record<CompanionRealWorldTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  bookingStatuses: Record<string, string>;
  approvalLevels: Record<string, string>;
};
