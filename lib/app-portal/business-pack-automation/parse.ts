import type {
  AutomationApproval,
  AutomationApproveResult,
  AutomationCard,
  AutomationDetail,
  AutomationInsightItem,
  AutomationInsights,
  AutomationOverview,
  AutomationRecommendation,
  AutomationTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): AutomationRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), automation_key: str(d.automation_key) || undefined };
  });
}

function parseInsightItems(raw: unknown): AutomationInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { automation_key: str(d.automation_key), name: str(d.name), estimated_value: num(d.estimated_value) || undefined };
  });
}

function parseInsights(raw: unknown): AutomationInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    most_valuable: parseInsightItems(d.most_valuable),
    underutilized: parseInsightItems(d.underutilized),
    frequently_used: parseInsightItems(d.frequently_used),
    failed_attention: parseInsightItems(d.failed_attention),
    expansion_opportunities: parseInsightItems(d.expansion_opportunities),
  };
}

function parseAutomationCard(raw: unknown): AutomationCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id || d.automation_key),
    automation_key: str(d.automation_key),
    name: str(d.name),
    pack_key: str(d.pack_key),
    category: str(d.category),
    status: str(d.status),
    health_status: str(d.health_status),
    trigger_description: str(d.trigger_description),
    action_description: str(d.action_description),
    estimated_value: num(d.estimated_value),
    time_saved_hours: num(d.time_saved_hours),
    owner: str(d.owner),
    success_rate: num(d.success_rate),
    recommended_improvements: parseStringArray(d.recommended_improvements),
    last_execution_at: str(d.last_execution_at) || null,
  };
}

function parseApprovals(raw: unknown): AutomationApproval[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      status: str(d.status),
      approver_name: str(d.approver_name),
      governance_notes: str(d.governance_notes),
      review_schedule: str(d.review_schedule),
      approved_at: str(d.approved_at) || undefined,
    };
  });
}

function parseTimeline(raw: unknown): AutomationTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      automation_key: str(d.automation_key) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parseAutomationOverview(data: unknown): AutomationOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    can_approve: d.can_approve === true,
    has_automation_data: d.has_automation_data === true,
    total_automations: num(d.total_automations),
    active_automations: num(d.active_automations),
    recommended_automations: num(d.recommended_automations),
    automations_requiring_review: num(d.automations_requiring_review),
    time_saved_hours: num(d.time_saved_hours),
    executive_summary: str(d.executive_summary),
    automations: Array.isArray(d.automations) ? d.automations.map((a) => parseAutomationCard(a)).filter(Boolean) as AutomationCard[] : [],
    insights: parseInsights(d.insights),
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseAutomationDetail(data: unknown): AutomationDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", automation_key: "", name: "", pack_key: "", category: "",
      status: "", health_status: "", trigger_description: "", action_description: "",
      estimated_value: 0, time_saved_hours: 0, owner: "", success_rate: 0,
    };
  }
  const d = data as Record<string, unknown>;
  const card = parseAutomationCard(d);
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.automation_key), automation_key: str(d.automation_key), name: str(d.name),
      pack_key: str(d.pack_key), category: str(d.category), status: str(d.status),
      health_status: str(d.health_status), trigger_description: str(d.trigger_description),
      action_description: str(d.action_description), estimated_value: num(d.estimated_value),
      time_saved_hours: num(d.time_saved_hours), owner: str(d.owner), success_rate: num(d.success_rate),
    }),
    approval_history: parseApprovals(d.approval_history),
    can_approve: d.can_approve === true,
    recommendations: parseRecommendations(d.recommendations),
  };
}

export function parseAutomationRecommendations(data: unknown): AutomationRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parseAutomationTimeline(data: unknown): AutomationTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parseAutomationApproveResult(data: unknown): AutomationApproveResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    approval_id: str(d.approval_id) || undefined,
    status: str(d.status) || undefined,
    automation_key: str(d.automation_key) || undefined,
    message: str(d.message) || undefined,
  };
}
