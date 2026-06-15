export type HostsCheckinCenterSectionKey =
  | "upcoming_check_ins"
  | "active_stays"
  | "upcoming_check_outs"
  | "readiness_status"
  | "checkout_reviews";

export type HostsCheckinRow = {
  id: string;
  checkin_key: string;
  guest_name: string;
  property_id: string | null;
  property: string;
  check_in_date: string;
  expected_check_out_date: string;
  checkin_status: string;
  access_instructions: string;
  team_assigned: string;
  guest_info_summary: string;
  ready_score: number;
  readiness_indicator: string;
  cleaning_completed: boolean;
  inspection_completed: boolean;
  supplies_ready: boolean;
  access_instructions_available: boolean;
  team_assigned_flag: boolean;
};

export type HostsCheckoutRow = {
  id: string;
  checkout_key: string;
  checkin_id: string | null;
  guest_name: string;
  property_id: string | null;
  property: string;
  checkout_date: string;
  checkout_status: string;
  property_status_notes: string;
  damage_observed: boolean;
  missing_items: boolean;
  maintenance_required: boolean;
  exceptional_condition: boolean;
  departure_outcome: string;
  review_notes: string;
};

export type HostsCheckinStats = {
  todays_check_ins: number;
  todays_check_outs: number;
  properties_requiring_attention: number;
  readiness_ready: number;
  readiness_attention: number;
  readiness_not_ready: number;
  active_stays: number;
};

export type HostsTaskPreparation = {
  arrival_tasks: number;
  departure_tasks: number;
  inspection_tasks: number;
  cleaning_tasks: number;
};

export type HostsCheckinCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  checkin_statuses: string[];
  checkout_statuses: string[];
  readiness_indicators: string[];
  departure_outcomes: string[];
  stats: HostsCheckinStats;
  task_preparation: HostsTaskPreparation;
  check_ins: HostsCheckinRow[];
  check_outs: HostsCheckoutRow[];
  checkout_reviews: HostsCheckoutRow[];
};

export type HostsCheckinCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
};
