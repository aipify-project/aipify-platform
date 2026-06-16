export type HostsAccessCenterSectionKey =
  | "access_overview"
  | "smart_locks"
  | "lockboxes"
  | "access_instructions"
  | "temporary_codes"
  | "access_events"
  | "property_access_profile";

export type HostsAccessNotification = {
  key: string;
  active: boolean;
  count: number;
  message: string;
};

export type HostsAccessOverviewRow = {
  property_id: string;
  property: string;
  access_method: string;
  access_ready: boolean;
  missing_instructions: boolean;
  expiring_codes: number;
  upcoming_arrivals: number;
  backup_contact: string | null;
};

export type HostsSmartLockRow = {
  id: string;
  property_id: string | null;
  property: string;
  provider: string;
  device_label: string;
  integration_status: string;
  auto_activation_ready: boolean;
};

export type HostsLockboxRow = {
  id: string;
  property_id: string;
  property: string;
  lockbox_location: string;
  access_instructions: string | null;
  verification_status: string;
};

export type HostsAccessInstructionRow = {
  property_id: string;
  property: string;
  check_in_guidance: string | null;
  parking_guidance: string | null;
  building_entry_instructions: string | null;
  wifi_information: string | null;
  complete: boolean;
};

export type HostsTemporaryCodeRow = {
  id: string;
  property_id: string;
  property: string;
  guest_name: string;
  code_masked: string;
  generated_at: string;
  valid_from: string;
  valid_until: string;
  status: string;
};

export type HostsAccessEventRow = {
  id: string;
  event_type: string;
  summary: string | null;
  property: string;
  created_at: string;
};

export type HostsPropertyAccessProfile = {
  property_id: string;
  property: string;
  access_method: string;
  access_instructions: string | null;
  emergency_access_procedure: string | null;
  backup_contact: string | null;
  access_ready: boolean;
};

export type HostsAccessTimelineEvent = {
  type: string;
  label: string;
  when: string;
};

export type HostsAccessCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  active_filter: string;
  selected_property_id: string | null;
  positioning: string;
  governance: Record<string, boolean>;
  future_capabilities: Record<string, boolean>;
  integration_providers: string[];
  access_methods: string[];
  code_statuses: string[];
  sections: Array<{ key: string; label: string }>;
  filters: Array<{ key: string; label: string }>;
  notifications: HostsAccessNotification[];
  access_overview: HostsAccessOverviewRow[];
  smart_locks: HostsSmartLockRow[];
  lockboxes: HostsLockboxRow[];
  access_instructions: HostsAccessInstructionRow[];
  temporary_codes: HostsTemporaryCodeRow[];
  access_events: HostsAccessEventRow[];
  property_access_profile: HostsPropertyAccessProfile | null;
  access_timeline: HostsAccessTimelineEvent[];
};

export type HostsAccessCenterActionResult = {
  success: boolean;
  property_id?: string;
  code_id?: string;
  status?: string;
};
