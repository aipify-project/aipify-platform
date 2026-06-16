export type HostsCommunicationSectionKey =
  | "guest_communications"
  | "team_communications"
  | "templates"
  | "announcements"
  | "communication_history";

export type HostsGuestCommunicationRow = {
  id: string;
  comm_key: string;
  guest_name: string;
  property_id: string | null;
  property: string;
  message_type: string;
  delivery_channel: string;
  comm_status: string;
  subject: string;
  body_preview: string;
  sender_name: string;
  sent_at: string;
  scheduled_at: string;
  recipient_type: string;
};

export type HostsTeamCommunicationRow = {
  id: string;
  comm_key: string;
  recipient: string;
  property_id: string | null;
  property: string;
  subject: string;
  category: string;
  comm_status: string;
  sender_name: string;
  sent_at: string;
  recipient_type: string;
};

export type HostsCommunicationTemplateRow = {
  id: string;
  template_key: string;
  template_name: string;
  template_type: string;
  subject_line: string;
  body_template: string;
  delivery_channel: string;
  is_active: boolean;
};

export type HostsCommunicationAnnouncementRow = {
  id: string;
  announcement_key: string;
  property_id: string | null;
  property: string;
  announcement_type: string;
  title: string;
  body: string;
  comm_status: string;
  is_critical: boolean;
  scheduled_at: string;
  sent_at: string;
};

export type HostsCommunicationHistoryRow = {
  id: string | null;
  sender: string;
  recipient: string;
  property: string;
  message_type: string;
  comm_status: string;
  sent_at: string;
  delivery_channel: string;
};

export type HostsCommunicationStats = {
  guest_messages_30d: number;
  team_messages_30d: number;
  scheduled_count: number;
  failed_count: number;
  active_templates: number;
  pending_critical_announcements: number;
  delivered_count: number;
};

export type HostsCommunicationCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  communication_types: string[];
  communication_statuses: string[];
  delivery_channels: string[];
  recipient_types: string[];
  stats: HostsCommunicationStats;
  properties: Array<{ id: string; display_name: string }>;
  guest_communications: HostsGuestCommunicationRow[];
  team_communications: HostsTeamCommunicationRow[];
  templates: HostsCommunicationTemplateRow[];
  announcements: HostsCommunicationAnnouncementRow[];
  communication_history: HostsCommunicationHistoryRow[];
};

export type HostsCommunicationCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
};
