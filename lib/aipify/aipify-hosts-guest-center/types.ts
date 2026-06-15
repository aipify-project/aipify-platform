export type HostsGuestCenterSectionKey =
  | "active_guests"
  | "upcoming_guests"
  | "guest_history"
  | "guest_requests"
  | "guest_notes"
  | "guest_timeline";

export type HostsGuestRow = {
  id: string;
  guest_key: string;
  full_name: string;
  property: string;
  property_id: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  status: string;
  guest_tier: string;
  requires_attention: boolean;
  contact_email: string | null;
  contact_phone: string | null;
};

export type HostsGuestRequestRow = {
  id: string;
  guest_id: string;
  guest_name: string;
  property: string;
  request_type: string;
  status: string;
  summary: string | null;
  assigned_to: string | null;
  submitted_at: string;
};

export type HostsGuestNoteRow = {
  id: string;
  guest_id: string;
  guest_name: string;
  note_text: string;
  created_at: string;
};

export type HostsGuestTimelineEvent = {
  type: string;
  label: string;
  when: string;
};

export type HostsGuestNotification = {
  key: string;
  active: boolean;
  count: number;
  message: string;
};

export type HostsGuestCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  active_filter: string;
  selected_guest_id: string | null;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  filters: Array<{ key: string; label: string }>;
  guest_tiers: string[];
  request_types: string[];
  request_statuses: string[];
  stay_statuses: string[];
  notifications: HostsGuestNotification[];
  guests: HostsGuestRow[];
  active_guests: HostsGuestRow[];
  upcoming_guests: HostsGuestRow[];
  guest_history: HostsGuestRow[];
  guest_requests: HostsGuestRequestRow[];
  guest_notes: HostsGuestNoteRow[];
  guest_profile: HostsGuestRow | null;
  guest_timeline: HostsGuestTimelineEvent[];
};

export type HostsGuestCenterActionResult = {
  success: boolean;
  note_id?: string;
  request_id?: string;
  status?: string;
};
