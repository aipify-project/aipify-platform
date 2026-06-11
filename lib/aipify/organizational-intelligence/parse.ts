import type {
  InsightItem,
  IntelligenceCenter,
  IntelligenceSettings,
  OrganizationUnit,
  ResponsibilityEntry,
  WorkflowDefinition,
} from "./types";

function asInsightItem(raw: unknown): InsightItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  return {
    id: o.id,
    insight_type: o.insight_type as InsightItem["insight_type"],
    severity: o.severity as InsightItem["severity"],
    title: o.title,
    summary: String(o.summary ?? ""),
    evidence: (o.evidence as Record<string, unknown>) ?? {},
    recommended_action:
      o.recommended_action == null ? null : String(o.recommended_action),
    status: o.status as InsightItem["status"],
    assigned_user_id:
      o.assigned_user_id == null ? null : String(o.assigned_user_id),
    assigned_unit_id:
      o.assigned_unit_id == null ? null : String(o.assigned_unit_id),
    confidence_score: Number(o.confidence_score ?? 0.7),
    generated_by: String(o.generated_by ?? "aipify"),
    generated_at: String(o.generated_at ?? ""),
    resolved_at: o.resolved_at == null ? null : String(o.resolved_at),
    snoozed_until: o.snoozed_until == null ? null : String(o.snoozed_until),
    created_at: String(o.created_at ?? ""),
    updated_at: String(o.updated_at ?? ""),
  };
}

export function parseIntelligenceCenter(data: unknown): IntelligenceCenter {
  const o = (data && typeof data === "object" ? data : {}) as Record<
    string,
    unknown
  >;
  const insights = Array.isArray(o.insights)
    ? o.insights.map(asInsightItem).filter((i): i is InsightItem => i !== null)
    : undefined;
  const resolved = Array.isArray(o.resolved_recent)
    ? o.resolved_recent
        .map(asInsightItem)
        .filter((i): i is InsightItem => i !== null)
    : undefined;

  return {
    has_customer: Boolean(o.has_customer),
    has_access: Boolean(o.has_access),
    enabled: o.enabled == null ? undefined : Boolean(o.enabled),
    upgrade_required: Boolean(o.upgrade_required),
    plan: o.plan == null ? undefined : String(o.plan),
    privacy_note: o.privacy_note == null ? undefined : String(o.privacy_note),
    settings_url: o.settings_url == null ? undefined : String(o.settings_url),
    health_score: o.health_score == null ? undefined : Number(o.health_score),
    health_band: o.health_band as IntelligenceCenter["health_band"],
    strongest_area:
      o.strongest_area == null ? undefined : String(o.strongest_area),
    weakest_area: o.weakest_area == null ? undefined : String(o.weakest_area),
    snapshot:
      o.snapshot && typeof o.snapshot === "object"
        ? (o.snapshot as IntelligenceCenter["snapshot"])
        : null,
    insights,
    open_risks: o.open_risks == null ? undefined : Number(o.open_risks),
    resolved_recent: resolved,
  };
}

export function parseIntelligenceSettings(data: unknown): {
  has_customer: boolean;
  has_access: boolean;
  upgrade_required: boolean;
  settings: IntelligenceSettings | null;
} {
  const o = (data && typeof data === "object" ? data : {}) as Record<
    string,
    unknown
  >;
  const s =
    o.settings && typeof o.settings === "object"
      ? (o.settings as Record<string, unknown>)
      : null;

  return {
    has_customer: Boolean(o.has_customer),
    has_access: Boolean(o.has_access),
    upgrade_required: Boolean(o.upgrade_required),
    settings: s
      ? {
          enabled: Boolean(s.enabled),
          allow_email_analysis: Boolean(s.allow_email_analysis),
          allow_calendar_analysis: Boolean(s.allow_calendar_analysis),
          allow_support_analysis: Boolean(s.allow_support_analysis),
          allow_customer_memory: Boolean(s.allow_customer_memory),
          allow_staff_workload_insights: Boolean(s.allow_staff_workload_insights),
          allow_cross_department_insights: Boolean(
            s.allow_cross_department_insights
          ),
          require_admin_approval_for_actions: Boolean(
            s.require_admin_approval_for_actions
          ),
          default_retention_days: Number(s.default_retention_days ?? 365),
        }
      : null,
  };
}

export function parseOrganizationUnits(data: unknown): OrganizationUnit[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((u) => u && typeof u === "object")
    .map((u) => {
      const o = u as Record<string, unknown>;
      return {
        id: String(o.id),
        name: String(o.name),
        unit_type: String(o.unit_type ?? "department"),
        description: o.description == null ? null : String(o.description),
        parent_unit_id:
          o.parent_unit_id == null ? null : String(o.parent_unit_id),
        manager_user_id:
          o.manager_user_id == null ? null : String(o.manager_user_id),
        active: Boolean(o.active ?? true),
      };
    });
}

export function parseWorkflowDefinitions(data: unknown): WorkflowDefinition[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((w) => w && typeof w === "object")
    .map((w) => {
      const o = w as Record<string, unknown>;
      return {
        id: String(o.id),
        name: String(o.name),
        workflow_key: String(o.workflow_key),
        description: o.description == null ? null : String(o.description),
        category: String(o.category ?? "internal"),
        expected_response_time_minutes:
          o.expected_response_time_minutes == null
            ? null
            : Number(o.expected_response_time_minutes),
        expected_completion_time_minutes:
          o.expected_completion_time_minutes == null
            ? null
            : Number(o.expected_completion_time_minutes),
        owner_unit_id:
          o.owner_unit_id == null ? null : String(o.owner_unit_id),
        owner_user_id:
          o.owner_user_id == null ? null : String(o.owner_user_id),
        active: Boolean(o.active ?? true),
        open_events:
          o.open_events == null ? undefined : Number(o.open_events),
      };
    });
}

export function parseResponsibilityMap(data: unknown): ResponsibilityEntry[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((r) => r && typeof r === "object")
    .map((r) => {
      const o = r as Record<string, unknown>;
      return {
        id: String(o.id),
        role_name: String(o.role_name),
        responsibility_type: String(o.responsibility_type),
        description: o.description == null ? null : String(o.description),
        organization_unit_id:
          o.organization_unit_id == null
            ? null
            : String(o.organization_unit_id),
        user_id: o.user_id == null ? null : String(o.user_id),
        priority: Number(o.priority ?? 0),
        active: Boolean(o.active ?? true),
      };
    });
}
