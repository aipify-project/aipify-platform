import type {
  AutomationCenter,
  AutomationExecution,
  AutomationItem,
  AutomationSettings,
  AutomationSuggestion,
  AutomationTemplate,
} from "./types";

export function parseAutomationCenter(data: unknown): AutomationCenter {
  const o = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(o.has_customer),
    has_access: Boolean(o.has_access),
    enabled: o.enabled == null ? undefined : Boolean(o.enabled),
    upgrade_required: Boolean(o.upgrade_required),
    plan: o.plan == null ? undefined : String(o.plan),
    privacy_note: o.privacy_note == null ? undefined : String(o.privacy_note),
    settings_url: o.settings_url == null ? undefined : String(o.settings_url),
    metrics: o.metrics as AutomationCenter["metrics"],
    automations: parseAutomations(o.automations),
    suggestions: parseSuggestions(o.suggestions),
    pending_approvals_list: o.pending_approvals_list as AutomationCenter["pending_approvals_list"],
    recent_executions: parseExecutions(o.recent_executions),
  };
}

export function parseAutomationSettings(data: unknown): {
  has_customer: boolean;
  has_access: boolean;
  upgrade_required: boolean;
  settings: AutomationSettings | null;
} {
  const o = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const s = o.settings && typeof o.settings === "object" ? (o.settings as Record<string, unknown>) : null;
  return {
    has_customer: Boolean(o.has_customer),
    has_access: Boolean(o.has_access),
    upgrade_required: Boolean(o.upgrade_required),
    settings: s
      ? {
          enabled: Boolean(s.enabled),
          allow_automation_discovery: Boolean(s.allow_automation_discovery),
          allow_ai_generated_drafts: Boolean(s.allow_ai_generated_drafts),
          allow_low_risk_auto_execution: Boolean(s.allow_low_risk_auto_execution),
          require_approval_for_medium_risk: Boolean(s.require_approval_for_medium_risk),
          require_approval_for_high_risk: Boolean(s.require_approval_for_high_risk),
          max_daily_executions: Number(s.max_daily_executions ?? 100),
          max_external_messages_per_day: Number(s.max_external_messages_per_day ?? 25),
          enable_value_estimation: Boolean(s.enable_value_estimation),
          notification_channel: String(s.notification_channel ?? "admin"),
        }
      : null,
  };
}

export function parseSuggestions(data: unknown): AutomationSuggestion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((s) => s && typeof s === "object").map((s) => {
    const o = s as Record<string, unknown>;
    return {
      id: String(o.id),
      suggestion_type: String(o.suggestion_type ?? ""),
      title: String(o.title),
      summary: String(o.summary ?? ""),
      evidence: (o.evidence as Record<string, unknown>) ?? {},
      estimated_time_saved_minutes_per_week:
        o.estimated_time_saved_minutes_per_week == null
          ? null
          : Number(o.estimated_time_saved_minutes_per_week),
      confidence_score: Number(o.confidence_score ?? 0.7),
      risk_level: o.risk_level as AutomationSuggestion["risk_level"],
      recommended_template_id:
        o.recommended_template_id == null ? null : String(o.recommended_template_id),
      status: o.status as AutomationSuggestion["status"],
      created_at: String(o.created_at ?? ""),
    };
  });
}

export function parseAutomations(data: unknown): AutomationItem[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((a) => a && typeof a === "object").map((a) => {
    const o = a as Record<string, unknown>;
    return {
      id: String(o.id),
      name: String(o.name),
      automation_key: String(o.automation_key ?? ""),
      description: o.description == null ? null : String(o.description),
      category: String(o.category ?? "internal"),
      status: o.status as AutomationItem["status"],
      risk_level: o.risk_level as AutomationItem["risk_level"],
      template_id: o.template_id == null ? null : String(o.template_id),
      last_run_at: o.last_run_at == null ? null : String(o.last_run_at),
      created_by_ai: Boolean(o.created_by_ai),
      created_at: String(o.created_at ?? ""),
    };
  });
}

export function parseTemplates(data: unknown): AutomationTemplate[] {
  if (!Array.isArray(data)) return [];
  return data.filter((t) => t && typeof t === "object").map((t) => {
    const o = t as Record<string, unknown>;
    return {
      id: String(o.id),
      template_key: String(o.template_key),
      template_name: String(o.template_name),
      category: String(o.category ?? "internal"),
      description: o.description == null ? null : String(o.description),
      risk_level: o.risk_level as AutomationTemplate["risk_level"],
      is_global: Boolean(o.is_global),
      trigger_definition: (o.trigger_definition as Record<string, unknown>) ?? {},
      condition_definition: (o.condition_definition as Record<string, unknown>) ?? {},
      action_definition: (o.action_definition as Record<string, unknown>) ?? {},
    };
  });
}

export function parseExecutions(data: unknown): AutomationExecution[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((e) => e && typeof e === "object").map((e) => {
    const o = e as Record<string, unknown>;
    return {
      id: String(o.id),
      automation_id: String(o.automation_id),
      automation_name: o.automation_name == null ? undefined : String(o.automation_name),
      status: String(o.status),
      result_summary: o.result_summary == null ? null : String(o.result_summary),
      error_message: o.error_message == null ? null : String(o.error_message),
      created_at: String(o.created_at ?? ""),
    };
  });
}
