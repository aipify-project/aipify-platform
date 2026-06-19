import type { HeadquartersAction, HeadquartersCenter } from "./types";

function parseAction(raw: Record<string, unknown>): HeadquartersAction {
  return {
    action_key: String(raw.action_key ?? ""),
    action_title: String(raw.action_title ?? ""),
    owner_name: raw.owner_name ? String(raw.owner_name) : undefined,
    action_status: raw.action_status ? String(raw.action_status) : undefined,
    deadline_label: raw.deadline_label ? String(raw.deadline_label) : undefined,
    approval_required: raw.approval_required === true,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseHeadquartersCenter(raw: Record<string, unknown>): HeadquartersCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const liveActivity = Array.isArray(raw.live_activity)
    ? (raw.live_activity as Record<string, unknown>[])
    : Array.isArray(raw.live_activity_feed)
      ? (raw.live_activity_feed as Record<string, unknown>[])
      : [];

  const actions = Array.isArray(raw.actions)
    ? (raw.actions as Record<string, unknown>[]).map(parseAction)
    : Array.isArray(raw.action_coordination_board)
      ? (raw.action_coordination_board as Record<string, unknown>[]).map(parseAction)
      : [];

  const pulse = Array.isArray(raw.pulse)
    ? (raw.pulse as Record<string, unknown>[])
    : Array.isArray(raw.organizational_pulse)
      ? (raw.organizational_pulse as Record<string, unknown>[])
      : [];

  const metrics = Array.isArray(raw.metrics)
    ? (raw.metrics as Record<string, unknown>[])
    : Array.isArray(raw.live_metrics)
      ? (raw.live_metrics as Record<string, unknown>[])
      : [];

  const meetings = Array.isArray(raw.meetings)
    ? (raw.meetings as Record<string, unknown>[])
    : Array.isArray(raw.meeting_command_center)
      ? (raw.meeting_command_center as Record<string, unknown>[])
      : [];

  const coordination = Array.isArray(raw.coordination)
    ? (raw.coordination as Record<string, unknown>[])
    : Array.isArray(raw.cross_department_coordination)
      ? (raw.cross_department_coordination as Record<string, unknown>[])
      : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as HeadquartersCenter["organization"],
    overview: raw.overview as HeadquartersCenter["overview"],
    departments: Array.isArray(raw.departments) ? (raw.departments as Record<string, unknown>[]) : [],
    live_activity: liveActivity,
    live_activity_feed: liveActivity,
    metrics,
    live_metrics: metrics,
    actions,
    action_coordination_board: actions,
    alerts: Array.isArray(raw.alerts) ? (raw.alerts as Record<string, unknown>[]) : [],
    pulse,
    organizational_pulse: pulse,
    meetings,
    meeting_command_center: meetings,
    coordination,
    cross_department_coordination: coordination,
    war_room: Array.isArray(raw.war_room) ? (raw.war_room as Record<string, unknown>[]) : [],
    operations_room: raw.operations_room as Record<string, unknown>,
    executive_room: raw.executive_room as Record<string, unknown>,
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as HeadquartersCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
