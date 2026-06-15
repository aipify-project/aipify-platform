export type HostsPropertyCenterSectionKey =
  | "overview"
  | "details"
  | "amenities"
  | "team"
  | "documents"
  | "tasks"
  | "incidents"
  | "timeline";

export type HostsPropertySummary = {
  id: string;
  display_name: string;
  health_score: number;
  status: string;
  platform_source: string | null;
};

export type HostsPropertyOverview = {
  property_id: string;
  property_name: string;
  property_key: string;
  property_type: string;
  address: string | null;
  status: string;
  legacy_status: string;
  assigned_team: Array<{ role_key: string; assignee_name: string; assignee_contact: string | null }>;
  occupancy_status: string;
  property_health_score: number;
  platform_source: string | null;
};

export type HostsPropertyDetails = {
  description: string | null;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  check_in_time: string;
  check_out_time: string;
  property_type: string;
  operational_status: string;
  address: string | null;
};

export type HostsPropertyDocument = {
  id: string;
  doc_type: string;
  title: string;
  reference_label: string;
};

export type HostsPropertyTask = {
  id: string;
  title: string;
  category: string;
  due?: string;
  completed_at?: string;
};

export type HostsPropertyTasksBoard = {
  open: HostsPropertyTask[];
  upcoming: HostsPropertyTask[];
  completed: HostsPropertyTask[];
};

export type HostsPropertyIncident = {
  id: string;
  summary: string;
  severity: string;
  owner: string;
  resolved_at?: string;
};

export type HostsPropertyIncidentsBoard = {
  open: HostsPropertyIncident[];
  resolved: HostsPropertyIncident[];
};

export type HostsPropertyTimelineEvent = {
  type: string;
  label: string;
  when: string;
  property: string;
};

export type HostsPropertyCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  selected_property_id: string | null;
  positioning: string;
  governance: Record<string, boolean>;
  licensing: Record<string, unknown>;
  sections: Array<{ key: string; label: string }>;
  property_types: Array<{ key: string; label: string }>;
  property_statuses: Array<{ key: string; label: string }>;
  amenity_catalog: string[];
  task_categories: string[];
  properties: HostsPropertySummary[];
  overview?: HostsPropertyOverview;
  details?: HostsPropertyDetails;
  amenities?: string[];
  team?: Array<{ role_key: string; assignee_name: string; assignee_contact: string | null }>;
  documents?: HostsPropertyDocument[];
  tasks?: HostsPropertyTasksBoard;
  incidents?: HostsPropertyIncidentsBoard;
  timeline?: HostsPropertyTimelineEvent[];
  routes?: { reports: string; operations: string };
};

export type HostsPropertyCenterActionResult = {
  success: boolean;
  property_id?: string;
  error_code?: string;
  upgrade_required?: boolean;
  licensing?: Record<string, unknown>;
};
