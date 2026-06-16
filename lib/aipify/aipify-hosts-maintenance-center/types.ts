export type HostsMaintenanceSectionKey =
  | "open_work_orders"
  | "preventive_maintenance"
  | "scheduled_maintenance"
  | "completed_maintenance"
  | "contractors";

export type HostsWorkOrderRow = {
  id: string;
  work_order_key: string;
  property_id: string | null;
  property: string;
  contractor_id: string | null;
  contractor: string;
  category: string;
  description: string;
  priority: string;
  assigned_to: string;
  due_date: string;
  wo_status: string;
  scheduled_at: string;
  started_at: string;
  completed_at: string;
  issue_reported_at: string;
  is_overdue: boolean;
};

export type HostsPreventiveScheduleRow = {
  id: string;
  schedule_key: string;
  task_name: string;
  property_id: string | null;
  property: string;
  category: string;
  recurrence: string;
  next_due_date: string;
  last_completed_at: string;
  is_active: boolean;
  is_due: boolean;
};

export type HostsMaintenanceContractorRow = {
  id: string;
  contractor_key: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  trade_category: string;
  coverage_area: string;
  contractor_status: string;
};

export type HostsMaintenanceTimelineRow = {
  id: string;
  work_order_id: string;
  event_type: string;
  summary: string;
  occurred_at: string;
};

export type HostsMaintenanceStats = {
  open_work_orders: number;
  critical_items: number;
  upcoming_preventive: number;
  overdue_tasks: number;
  scheduled_count: number;
  active_contractors: number;
};

export type HostsMaintenanceCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  stats: HostsMaintenanceStats;
  properties: Array<{ id: string; display_name: string }>;
  work_orders: HostsWorkOrderRow[];
  preventive_schedules: HostsPreventiveScheduleRow[];
  contractors: HostsMaintenanceContractorRow[];
  timeline: HostsMaintenanceTimelineRow[];
};

export type HostsMaintenanceCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
  work_order_id?: string;
};
