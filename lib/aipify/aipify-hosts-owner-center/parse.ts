import type {
  HostsOwnerBlockRow,
  HostsOwnerCenterActionResult,
  HostsOwnerCenterDashboard,
  HostsOwnerOverrideRow,
  HostsOwnerStats,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseBlocks(data: unknown): HostsOwnerBlockRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        block_key: typeof d.block_key === "string" ? d.block_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        start_date: typeof d.start_date === "string" ? d.start_date : "",
        end_date: typeof d.end_date === "string" ? d.end_date : "",
        block_type: typeof d.block_type === "string" ? d.block_type : "",
        block_status: typeof d.block_status === "string" ? d.block_status : "",
        notes: typeof d.notes === "string" ? d.notes : "",
        prevents_reservations: Boolean(d.prevents_reservations ?? true),
        visible_in_operations: Boolean(d.visible_in_operations ?? true),
        include_in_occupancy: Boolean(d.include_in_occupancy ?? true),
        night_count: Number(d.night_count ?? 0),
      };
    })
    .filter((r): r is HostsOwnerBlockRow => r !== null);
}

function parseOverrides(data: unknown): HostsOwnerOverrideRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        override_key: typeof d.override_key === "string" ? d.override_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        start_date: typeof d.start_date === "string" ? d.start_date : "",
        end_date: typeof d.end_date === "string" ? d.end_date : "",
        override_type: typeof d.override_type === "string" ? d.override_type : "",
        notes: typeof d.notes === "string" ? d.notes : "",
        is_active: Boolean(d.is_active),
        owner_block_id: d.owner_block_id != null ? String(d.owner_block_id) : null,
      };
    })
    .filter((r): r is HostsOwnerOverrideRow => r !== null);
}

function parseStats(data: unknown): HostsOwnerStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    upcoming_personal_stays: Number(d.upcoming_personal_stays ?? 0),
    active_property_blocks: Number(d.active_property_blocks ?? 0),
    seasonal_closures: Number(d.seasonal_closures ?? 0),
    blocked_nights: Number(d.blocked_nights ?? 0),
    properties_affected: Number(d.properties_affected ?? 0),
    block_conflicts: Number(d.block_conflicts ?? 0),
    availability_impact_pct: Number(d.availability_impact_pct ?? 0),
  };
}

export function parseAipifyHostsOwnerCenterDashboard(data: unknown): HostsOwnerCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "owner_stays",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    block_types: asArray<string>(d.block_types),
    block_statuses: asArray<string>(d.block_statuses),
    override_types: asArray<string>(d.override_types),
    stats: parseStats(d.stats),
    calendar_integration: (d.calendar_integration as Record<string, boolean>) ?? {},
    owner_blocks: parseBlocks(d.owner_blocks),
    availability_overrides: parseOverrides(d.availability_overrides),
  };
}

export function parseAipifyHostsOwnerCenterActionResult(data: unknown): HostsOwnerCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    block_id: d.block_id != null ? String(d.block_id) : undefined,
  };
}
