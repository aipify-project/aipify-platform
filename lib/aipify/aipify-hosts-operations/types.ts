export type HostsOperationsSectionKey =
  | "today"
  | "arrivals"
  | "departures"
  | "cleaning"
  | "maintenance"
  | "guest_requests"
  | "incidents"
  | "approvals";

export type HostsOperationsFilterKey =
  | "all_properties"
  | "individual_property"
  | "today"
  | "upcoming"
  | "overdue";

export type HostsTodaySnapshot = {
  arrivals_today: number;
  departures_today: number;
  open_guest_requests: number;
  pending_approvals: number;
  cleaning_status: string;
  maintenance_status: string;
  active_incidents: number;
};

export type HostsArrivalRow = {
  id: string;
  guest_name: string;
  property: string;
  property_id: string;
  arrival_time: string;
  check_in_status: string;
  cleaning_status: string;
  property_readiness: string;
};

export type HostsDepartureRow = {
  id: string;
  guest_name: string;
  property: string;
  property_id: string;
  departure_time: string;
  checkout_status: string;
  inspection_status: string;
  cleaning_assigned: string;
};

export type HostsCleaningRow = {
  id: string;
  property: string;
  property_id: string;
  assigned_cleaner: string;
  scheduled_time: string;
  completion_status: string;
  reported_issues: string | null;
};

export type HostsMaintenanceRow = {
  id: string;
  property: string;
  property_id: string;
  issue_summary: string;
  priority: string;
  assigned_to: string | null;
  due_date: string;
};

export type HostsGuestRequestRow = {
  id: string;
  property: string;
  property_id: string;
  request_type: string;
  submitted_time: string;
  assigned_to: string | null;
  status: string;
};

export type HostsIncidentRow = {
  id: string;
  property: string;
  property_id: string;
  incident_type: string;
  severity: string;
  status: string;
  owner: string;
};

export type HostsApprovalRow = {
  id: string;
  request_type: string;
  property: string;
  property_id: string;
  submitted_by: string;
  waiting_since: string;
  approval_status: string;
};

export type HostsOperationsNotification = {
  key: string;
  active: boolean;
  count: number;
  message: string;
};

export type HostsOperationsDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  active_filter: string;
  selected_property_id: string | null;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  filters: Array<{ key: string; label: string }>;
  notification_triggers: Array<{ key: string; label: string }>;
  properties: Array<{ id: string; name: string }>;
  today_snapshot: HostsTodaySnapshot;
  notifications: HostsOperationsNotification[];
  boards: {
    arrivals: HostsArrivalRow[];
    departures: HostsDepartureRow[];
    cleaning: HostsCleaningRow[];
    maintenance: HostsMaintenanceRow[];
    guest_requests: HostsGuestRequestRow[];
    incidents: HostsIncidentRow[];
    approvals: HostsApprovalRow[];
  };
};

export type HostsOperationsActionResult = {
  success: boolean;
  action?: string;
  item_id?: string;
  status?: string;
};
