import type {
  HostsCorrectiveActionRow,
  HostsInspectionRow,
  HostsPhotoEvidenceRow,
  HostsPropertyOption,
  HostsQualityCenterActionResult,
  HostsQualityCenterDashboard,
  HostsQualityReviewRow,
  HostsQualityStats,
  HostsStandardItem,
  HostsTimelineRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseInspections(data: unknown): HostsInspectionRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        inspection_key: typeof d.inspection_key === "string" ? d.inspection_key : "",
        property: typeof d.property === "string" ? d.property : "—",
        property_id: d.property_id != null ? String(d.property_id) : null,
        inspection_type: typeof d.inspection_type === "string" ? d.inspection_type : "",
        status: typeof d.status === "string" ? d.status : "",
        assigned_inspector: typeof d.assigned_inspector === "string" ? d.assigned_inspector : "—",
        scheduled_date: typeof d.scheduled_date === "string" ? d.scheduled_date : null,
        completion_date: typeof d.completion_date === "string" ? d.completion_date : null,
        outcome: typeof d.outcome === "string" ? d.outcome : null,
        checklist_results: (d.checklist_results as Record<string, unknown>) ?? {},
        photo_count: Number(d.photo_count ?? 0),
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsInspectionRow => r !== null);
}

function parseReviews(data: unknown): HostsQualityReviewRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property: typeof d.property === "string" ? d.property : "—",
        property_id: d.property_id != null ? String(d.property_id) : null,
        inspection_id: d.inspection_id != null ? String(d.inspection_id) : null,
        property_score: Number(d.property_score ?? 0),
        inspector_notes: typeof d.inspector_notes === "string" ? d.inspector_notes : null,
        recommended_actions: typeof d.recommended_actions === "string" ? d.recommended_actions : null,
        improvement_opportunities: typeof d.improvement_opportunities === "string" ? d.improvement_opportunities : null,
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsQualityReviewRow => r !== null);
}

function parseCorrectiveActions(data: unknown): HostsCorrectiveActionRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        inspection_id: String(d.inspection_id ?? ""),
        action_summary: typeof d.action_summary === "string" ? d.action_summary : "",
        assigned_owner: typeof d.assigned_owner === "string" ? d.assigned_owner : null,
        due_date: typeof d.due_date === "string" ? d.due_date : null,
        escalated: Boolean(d.escalated),
        action_status: typeof d.action_status === "string" ? d.action_status : "",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsCorrectiveActionRow => r !== null);
}

function parsePhotoEvidence(data: unknown): HostsPhotoEvidenceRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        inspection_id: String(d.inspection_id ?? ""),
        checklist_category: typeof d.checklist_category === "string" ? d.checklist_category : "",
        reference_label: typeof d.reference_label === "string" ? d.reference_label : "",
        caption: typeof d.caption === "string" ? d.caption : null,
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsPhotoEvidenceRow => r !== null);
}

function parseStandards(data: unknown): HostsStandardItem[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        title: typeof d.title === "string" ? d.title : String(d.key),
        expectation: typeof d.expectation === "string" ? d.expectation : "",
      };
    })
    .filter((r): r is HostsStandardItem => r !== null);
}

function parseTimeline(data: unknown): HostsTimelineRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        inspection_id: String(d.inspection_id ?? ""),
        timeline_type: typeof d.timeline_type === "string" ? d.timeline_type : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsTimelineRow => r !== null);
}

function parseProperties(data: unknown): HostsPropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return { id: String(d.id), display_name: typeof d.display_name === "string" ? d.display_name : "" };
    })
    .filter((r): r is HostsPropertyOption => r !== null);
}

function parseStats(data: unknown): HostsQualityStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    upcoming_count: Number(d.upcoming_count ?? 0),
    active_count: Number(d.active_count ?? 0),
    overdue_count: Number(d.overdue_count ?? 0),
    failed_count: Number(d.failed_count ?? 0),
    avg_property_score: Number(d.avg_property_score ?? 0),
  };
}

export function parseAipifyHostsQualityCenterDashboard(data: unknown): HostsQualityCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "upcoming_inspections",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    inspection_types: asArray<string>(d.inspection_types),
    inspection_statuses: asArray<string>(d.inspection_statuses),
    checklist_categories: asArray<string>(d.checklist_categories),
    inspection_outcomes: asArray<string>(d.inspection_outcomes),
    standards_library: parseStandards(d.standards_library),
    stats: parseStats(d.stats),
    properties: parseProperties(d.properties),
    timeline: parseTimeline(d.timeline),
    upcoming_inspections: parseInspections(d.upcoming_inspections),
    active_inspections: parseInspections(d.active_inspections),
    completed_inspections: parseInspections(d.completed_inspections),
    quality_reviews: parseReviews(d.quality_reviews),
    corrective_actions: parseCorrectiveActions(d.corrective_actions),
    photo_evidence: parsePhotoEvidence(d.photo_evidence),
  };
}

export function parseAipifyHostsQualityCenterActionResult(data: unknown): HostsQualityCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    inspection_id: d.inspection_id != null ? String(d.inspection_id) : undefined,
    action_id: d.action_id != null ? String(d.action_id) : undefined,
    evidence_id: d.evidence_id != null ? String(d.evidence_id) : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    outcome: typeof d.outcome === "string" ? d.outcome : undefined,
  };
}
