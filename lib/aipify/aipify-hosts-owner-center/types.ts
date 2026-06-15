export type HostsOwnerCenterSectionKey =
  | "owner_stays"
  | "property_blocks"
  | "availability_overrides"
  | "block_history";

export type HostsOwnerBlockRow = {
  id: string;
  block_key: string;
  property_id: string | null;
  property: string;
  start_date: string;
  end_date: string;
  block_type: string;
  block_status: string;
  notes: string;
  prevents_reservations: boolean;
  visible_in_operations: boolean;
  include_in_occupancy: boolean;
  night_count: number;
};

export type HostsOwnerOverrideRow = {
  id: string;
  override_key: string;
  property_id: string | null;
  property: string;
  start_date: string;
  end_date: string;
  override_type: string;
  notes: string;
  is_active: boolean;
  owner_block_id: string | null;
};

export type HostsOwnerStats = {
  upcoming_personal_stays: number;
  active_property_blocks: number;
  seasonal_closures: number;
  blocked_nights: number;
  properties_affected: number;
  block_conflicts: number;
  availability_impact_pct: number;
};

export type HostsOwnerCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  block_types: string[];
  block_statuses: string[];
  override_types: string[];
  stats: HostsOwnerStats;
  calendar_integration: Record<string, boolean>;
  owner_blocks: HostsOwnerBlockRow[];
  availability_overrides: HostsOwnerOverrideRow[];
};

export type HostsOwnerCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
  block_id?: string;
};
