import type {
  HostsPropertyCenterActionResult,
  HostsPropertyCenterDashboard,
  HostsPropertyDetails,
  HostsPropertyDocument,
  HostsPropertyIncident,
  HostsPropertyIncidentsBoard,
  HostsPropertyOverview,
  HostsPropertySummary,
  HostsPropertyTask,
  HostsPropertyTasksBoard,
  HostsPropertyTimelineEvent,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseProperties(data: unknown): HostsPropertySummary[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        display_name: typeof d.display_name === "string" ? d.display_name : "",
        health_score: Number(d.health_score ?? 0),
        status: typeof d.status === "string" ? d.status : "active",
        platform_source: typeof d.platform_source === "string" ? d.platform_source : null,
      };
    })
    .filter((r): r is HostsPropertySummary => r !== null);
}

function parseOverview(data: unknown): HostsPropertyOverview | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  if (!d.property_id) return undefined;
  return {
    property_id: String(d.property_id),
    property_name: typeof d.property_name === "string" ? d.property_name : "",
    property_key: typeof d.property_key === "string" ? d.property_key : "",
    property_type: typeof d.property_type === "string" ? d.property_type : "",
    address: typeof d.address === "string" ? d.address : null,
    status: typeof d.status === "string" ? d.status : "",
    legacy_status: typeof d.legacy_status === "string" ? d.legacy_status : "",
    assigned_team: asArray<{ role_key: string; assignee_name: string; assignee_contact: string | null }>(d.assigned_team),
    occupancy_status: typeof d.occupancy_status === "string" ? d.occupancy_status : "",
    property_health_score: Number(d.property_health_score ?? 0),
    platform_source: typeof d.platform_source === "string" ? d.platform_source : null,
  };
}

function parseDetails(data: unknown): HostsPropertyDetails | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  return {
    description: typeof d.description === "string" ? d.description : null,
    max_guests: Number(d.max_guests ?? 0),
    bedrooms: Number(d.bedrooms ?? 0),
    bathrooms: Number(d.bathrooms ?? 0),
    check_in_time: typeof d.check_in_time === "string" ? d.check_in_time : "",
    check_out_time: typeof d.check_out_time === "string" ? d.check_out_time : "",
    property_type: typeof d.property_type === "string" ? d.property_type : "",
    operational_status: typeof d.operational_status === "string" ? d.operational_status : "",
    address: typeof d.address === "string" ? d.address : null,
  };
}

function parseDocuments(data: unknown): HostsPropertyDocument[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        doc_type: typeof d.doc_type === "string" ? d.doc_type : "",
        title: typeof d.title === "string" ? d.title : "",
        reference_label: typeof d.reference_label === "string" ? d.reference_label : "",
      };
    })
    .filter((r): r is HostsPropertyDocument => r !== null);
}

function parseTasks(data: unknown): HostsPropertyTasksBoard | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  const mapTasks = (items: unknown): HostsPropertyTask[] =>
    asArray<unknown>(items)
      .map((row) => {
        const t = row as Record<string, unknown>;
        if (!t.id) return null;
        return {
          id: String(t.id),
          title: typeof t.title === "string" ? t.title : "",
          category: typeof t.category === "string" ? t.category : "",
          due: typeof t.due === "string" ? t.due : undefined,
          completed_at: typeof t.completed_at === "string" ? t.completed_at : undefined,
        };
      })
      .filter((r): r is HostsPropertyTask => r !== null);
  return {
    open: mapTasks(d.open),
    upcoming: mapTasks(d.upcoming),
    completed: mapTasks(d.completed),
  };
}

function parseIncidents(data: unknown): HostsPropertyIncidentsBoard | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  const mapIncidents = (items: unknown): HostsPropertyIncident[] =>
    asArray<unknown>(items)
      .map((row) => {
        const t = row as Record<string, unknown>;
        if (!t.id) return null;
        return {
          id: String(t.id),
          summary: typeof t.summary === "string" ? t.summary : "",
          severity: typeof t.severity === "string" ? t.severity : "",
          owner: typeof t.owner === "string" ? t.owner : "",
          resolved_at: typeof t.resolved_at === "string" ? t.resolved_at : undefined,
        };
      })
      .filter((r): r is HostsPropertyIncident => r !== null);
  return { open: mapIncidents(d.open), resolved: mapIncidents(d.resolved) };
}

function parseTimeline(data: unknown): HostsPropertyTimelineEvent[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.type) return null;
      return {
        type: String(d.type),
        label: typeof d.label === "string" ? d.label : "",
        when: typeof d.when === "string" ? d.when : "",
        property: typeof d.property === "string" ? d.property : "",
      };
    })
    .filter((r): r is HostsPropertyTimelineEvent => r !== null);
}

export function parseAipifyHostsPropertyCenterDashboard(data: unknown): HostsPropertyCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  const routes = d.routes as Record<string, string> | undefined;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "overview",
    selected_property_id: d.selected_property_id != null ? String(d.selected_property_id) : null,
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    licensing: (d.licensing as Record<string, unknown>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    property_types: asArray<{ key: string; label: string }>(d.property_types),
    property_statuses: asArray<{ key: string; label: string }>(d.property_statuses),
    amenity_catalog: asArray<string>(d.amenity_catalog),
    task_categories: asArray<string>(d.task_categories),
    properties: parseProperties(d.properties),
    overview: parseOverview(d.overview),
    details: parseDetails(d.details),
    amenities: asArray<string>(d.amenities),
    team: asArray<{ role_key: string; assignee_name: string; assignee_contact: string | null }>(d.team),
    documents: parseDocuments(d.documents),
    tasks: parseTasks(d.tasks),
    incidents: parseIncidents(d.incidents),
    timeline: parseTimeline(d.timeline),
    routes: routes
      ? { reports: routes.reports ?? "/app/aipify-hosts/reports", operations: routes.operations ?? "/app/aipify-hosts/operations" }
      : undefined,
  };
}

export function parseAipifyHostsPropertyCenterActionResult(data: unknown): HostsPropertyCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    property_id: d.property_id != null ? String(d.property_id) : undefined,
    error_code: typeof d.error_code === "string" ? d.error_code : undefined,
    upgrade_required: Boolean(d.upgrade_required ?? false),
    licensing: (d.licensing as Record<string, unknown>) ?? undefined,
  };
}
