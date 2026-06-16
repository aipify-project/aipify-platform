export type ActivityEventType =
  | "follow_up_created"
  | "follow_up_completed"
  | "decision_recorded"
  | "decision_evaluated"
  | "approval_requested"
  | "approval_completed"
  | "task_updated"
  | "integration_connected"
  | "business_pack_installed"
  | "billing_event"
  | "security_event"
  | "support_event"
  | "system_recommendation";

export type ActivitySeverity = "info" | "notice" | "important" | "critical";

export type TimelineBucket = "today" | "yesterday" | "this_week" | "earlier";

export type ActivityEvent = {
  id: string;
  title: string;
  description: string;
  event_type: ActivityEventType;
  module_source: string;
  user_id?: string;
  user_name: string;
  timestamp: string;
  organization: string;
  related_entity_id?: string;
  related_entity_type?: string;
  severity: ActivitySeverity;
  action_link?: string;
};

export type ActivityHistoryResponse = {
  found: boolean;
  can_manage?: boolean;
  items: ActivityEvent[];
  principle?: string;
};

export type ActivityHistoryLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  filters: {
    title: string;
    eventType: string;
    module: string;
    user: string;
    severity: string;
    dateFrom: string;
    dateTo: string;
    search: string;
    searchPlaceholder: string;
    all: string;
  };
  timeline: {
    today: string;
    yesterday: string;
    thisWeek: string;
    earlier: string;
  };
  card: {
    user: string;
    module: string;
    viewRelated: string;
  };
  eventTypes: Record<ActivityEventType, string>;
  severities: Record<ActivitySeverity, string>;
  modules: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    whoCanSee: string;
    whoCanSeeAnswer: string;
    canDelete: string;
    canDeleteAnswer: string;
  };
};

export function getTimelineBucket(timestamp: string): TimelineBucket {
  const d = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  if (d >= startOfToday) return "today";
  if (d >= startOfYesterday) return "yesterday";
  if (d >= startOfWeek) return "this_week";
  return "earlier";
}

export function groupEventsByTimeline(items: ActivityEvent[]): Record<TimelineBucket, ActivityEvent[]> {
  const groups: Record<TimelineBucket, ActivityEvent[]> = {
    today: [],
    yesterday: [],
    this_week: [],
    earlier: [],
  };
  for (const item of items) {
    groups[getTimelineBucket(item.timestamp)].push(item);
  }
  return groups;
}
