import type {
  HostsCategoryPerformance,
  HostsExperienceMetricsRow,
  HostsExperienceTrendPoint,
  HostsGuestExperienceActionResult,
  HostsGuestExperienceDashboard,
  HostsGuestExperienceStats,
  HostsGuestFeedbackRow,
  HostsImprovementArea,
  HostsImprovementOpportunityRow,
  HostsRecoveryCaseRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseMetricsRow(data: unknown): HostsExperienceMetricsRow | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    metrics_key: typeof d.metrics_key === "string" ? d.metrics_key : "",
    property_id: d.property_id != null ? String(d.property_id) : null,
    property: typeof d.property === "string" ? d.property : "—",
    overall_satisfaction: Number(d.overall_satisfaction ?? 0),
    check_in_experience: Number(d.check_in_experience ?? 0),
    property_cleanliness: Number(d.property_cleanliness ?? 0),
    communication_quality: Number(d.communication_quality ?? 0),
    property_accuracy: Number(d.property_accuracy ?? 0),
    issue_resolution: Number(d.issue_resolution ?? 0),
    likelihood_to_return: Number(d.likelihood_to_return ?? 0),
    experience_status: typeof d.experience_status === "string" ? d.experience_status : "good",
    satisfaction_trend: Number(d.satisfaction_trend ?? 0),
    returning_guest_satisfaction: Number(d.returning_guest_satisfaction ?? 0),
  };
}

function parseMetrics(data: unknown): HostsExperienceMetricsRow[] {
  return asArray<unknown>(data).map(parseMetricsRow).filter((r): r is HostsExperienceMetricsRow => r !== null);
}

function parseFeedback(data: unknown): HostsGuestFeedbackRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        feedback_key: typeof d.feedback_key === "string" ? d.feedback_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        stay_period_start: typeof d.stay_period_start === "string" ? d.stay_period_start : "",
        stay_period_end: typeof d.stay_period_end === "string" ? d.stay_period_end : "",
        feedback_category: typeof d.feedback_category === "string" ? d.feedback_category : "",
        rating: Number(d.rating ?? 0),
        comments: typeof d.comments === "string" ? d.comments : "",
        submitted_at: typeof d.submitted_at === "string" ? d.submitted_at : "",
      };
    })
    .filter((r): r is HostsGuestFeedbackRow => r !== null);
}

function parseOpportunities(data: unknown): HostsImprovementOpportunityRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        opportunity_key: typeof d.opportunity_key === "string" ? d.opportunity_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        opportunity_type: typeof d.opportunity_type === "string" ? d.opportunity_type : "",
        category: typeof d.category === "string" ? d.category : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        severity: typeof d.severity === "string" ? d.severity : "",
        is_active: Boolean(d.is_active),
      };
    })
    .filter((r): r is HostsImprovementOpportunityRow => r !== null);
}

function parseRecovery(data: unknown): HostsRecoveryCaseRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        recovery_key: typeof d.recovery_key === "string" ? d.recovery_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        case_status: typeof d.case_status === "string" ? d.case_status : "",
        assigned_owner: typeof d.assigned_owner === "string" ? d.assigned_owner : "—",
        resolution_notes: typeof d.resolution_notes === "string" ? d.resolution_notes : "",
        due_date: typeof d.due_date === "string" ? d.due_date : "",
        opened_at: typeof d.opened_at === "string" ? d.opened_at : "",
        is_overdue: Boolean(d.is_overdue),
      };
    })
    .filter((r): r is HostsRecoveryCaseRow => r !== null);
}

function parseTrends(data: unknown): HostsExperienceTrendPoint[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.month) return null;
      return {
        month: String(d.month),
        overall_satisfaction: Number(d.overall_satisfaction ?? 0),
        returning_guest_satisfaction: Number(d.returning_guest_satisfaction ?? 0),
        category_scores: (d.category_scores as Record<string, number>) ?? {},
        property: typeof d.property === "string" ? d.property : "Portfolio",
      };
    })
    .filter((r): r is HostsExperienceTrendPoint => r !== null);
}

function parseImprovementAreas(data: unknown): HostsImprovementArea[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.category) return null;
      return {
        category: String(d.category),
        count: Number(d.count ?? 0),
        severity: typeof d.severity === "string" ? d.severity : "medium",
      };
    })
    .filter((r): r is HostsImprovementArea => r !== null);
}

function parseStats(data: unknown): HostsGuestExperienceStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    guest_satisfaction_score: Number(d.guest_satisfaction_score ?? 0),
    portfolio_status: typeof d.portfolio_status === "string" ? d.portfolio_status : "good",
    open_recovery_cases: Number(d.open_recovery_cases ?? 0),
    overdue_recovery_cases: Number(d.overdue_recovery_cases ?? 0),
    active_improvement_areas: Number(d.active_improvement_areas ?? 0),
    critical_properties: Number(d.critical_properties ?? 0),
    excellent_properties: Number(d.excellent_properties ?? 0),
    feedback_count_30d: Number(d.feedback_count_30d ?? 0),
  };
}

export function parseAipifyHostsGuestExperienceDashboard(data: unknown): HostsGuestExperienceDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "experience_overview",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    experience_metrics: asArray<string>(d.experience_metrics),
    experience_statuses: asArray<string>(d.experience_statuses),
    stats: parseStats(d.stats),
    category_performance: (d.category_performance as HostsCategoryPerformance) ?? {},
    top_improvement_areas: parseImprovementAreas(d.top_improvement_areas),
    strongest_properties: parseMetrics(d.strongest_properties),
    monthly_trends: parseTrends(d.monthly_trends),
    property_metrics: parseMetrics(d.property_metrics),
    guest_feedback: parseFeedback(d.guest_feedback),
    recovery_cases: parseRecovery(d.recovery_cases),
    improvement_opportunities: parseOpportunities(d.improvement_opportunities),
  };
}

export function parseAipifyHostsGuestExperienceActionResult(data: unknown): HostsGuestExperienceActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
