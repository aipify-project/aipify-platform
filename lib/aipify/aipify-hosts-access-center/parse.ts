import type {
  HostsAccessCenterActionResult,
  HostsAccessCenterDashboard,
  HostsAccessEventRow,
  HostsAccessInstructionRow,
  HostsAccessNotification,
  HostsAccessOverviewRow,
  HostsAccessTimelineEvent,
  HostsLockboxRow,
  HostsPropertyAccessProfile,
  HostsSmartLockRow,
  HostsTemporaryCodeRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseNotifications(data: unknown): HostsAccessNotification[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        active: Boolean(d.active),
        count: Number(d.count ?? 0),
        message: typeof d.message === "string" ? d.message : "",
      };
    })
    .filter((r): r is HostsAccessNotification => r !== null);
}

function parseOverview(data: unknown): HostsAccessOverviewRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.property_id) return null;
      return {
        property_id: String(d.property_id),
        property: typeof d.property === "string" ? d.property : "",
        access_method: typeof d.access_method === "string" ? d.access_method : "",
        access_ready: Boolean(d.access_ready),
        missing_instructions: Boolean(d.missing_instructions),
        expiring_codes: Number(d.expiring_codes ?? 0),
        upcoming_arrivals: Number(d.upcoming_arrivals ?? 0),
        backup_contact: typeof d.backup_contact === "string" ? d.backup_contact : null,
      };
    })
    .filter((r): r is HostsAccessOverviewRow => r !== null);
}

function parseSmartLocks(data: unknown): HostsSmartLockRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "",
        provider: typeof d.provider === "string" ? d.provider : "",
        device_label: typeof d.device_label === "string" ? d.device_label : "",
        integration_status: typeof d.integration_status === "string" ? d.integration_status : "",
        auto_activation_ready: Boolean(d.auto_activation_ready),
      };
    })
    .filter((r): r is HostsSmartLockRow => r !== null);
}

function parseLockboxes(data: unknown): HostsLockboxRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property_id: String(d.property_id ?? ""),
        property: typeof d.property === "string" ? d.property : "",
        lockbox_location: typeof d.lockbox_location === "string" ? d.lockbox_location : "",
        access_instructions: typeof d.access_instructions === "string" ? d.access_instructions : null,
        verification_status: typeof d.verification_status === "string" ? d.verification_status : "",
      };
    })
    .filter((r): r is HostsLockboxRow => r !== null);
}

function parseInstructions(data: unknown): HostsAccessInstructionRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.property_id) return null;
      return {
        property_id: String(d.property_id),
        property: typeof d.property === "string" ? d.property : "",
        check_in_guidance: typeof d.check_in_guidance === "string" ? d.check_in_guidance : null,
        parking_guidance: typeof d.parking_guidance === "string" ? d.parking_guidance : null,
        building_entry_instructions: typeof d.building_entry_instructions === "string" ? d.building_entry_instructions : null,
        wifi_information: typeof d.wifi_information === "string" ? d.wifi_information : null,
        complete: Boolean(d.complete),
      };
    })
    .filter((r): r is HostsAccessInstructionRow => r !== null);
}

function parseCodes(data: unknown): HostsTemporaryCodeRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property_id: String(d.property_id ?? ""),
        property: typeof d.property === "string" ? d.property : "",
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        code_masked: typeof d.code_masked === "string" ? d.code_masked : "",
        generated_at: typeof d.generated_at === "string" ? d.generated_at : "",
        valid_from: typeof d.valid_from === "string" ? d.valid_from : "",
        valid_until: typeof d.valid_until === "string" ? d.valid_until : "",
        status: typeof d.status === "string" ? d.status : "",
      };
    })
    .filter((r): r is HostsTemporaryCodeRow => r !== null);
}

function parseEvents(data: unknown): HostsAccessEventRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        summary: typeof d.summary === "string" ? d.summary : null,
        property: typeof d.property === "string" ? d.property : "",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsAccessEventRow => r !== null);
}

function parseProfile(data: unknown): HostsPropertyAccessProfile | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.property_id) return null;
  return {
    property_id: String(d.property_id),
    property: typeof d.property === "string" ? d.property : "",
    access_method: typeof d.access_method === "string" ? d.access_method : "",
    access_instructions: typeof d.access_instructions === "string" ? d.access_instructions : null,
    emergency_access_procedure: typeof d.emergency_access_procedure === "string" ? d.emergency_access_procedure : null,
    backup_contact: typeof d.backup_contact === "string" ? d.backup_contact : null,
    access_ready: Boolean(d.access_ready),
  };
}

function parseTimeline(data: unknown): HostsAccessTimelineEvent[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.type) return null;
      return {
        type: String(d.type),
        label: typeof d.label === "string" ? d.label : "",
        when: typeof d.when === "string" ? d.when : "",
      };
    })
    .filter((r): r is HostsAccessTimelineEvent => r !== null);
}

export function parseAipifyHostsAccessCenterDashboard(data: unknown): HostsAccessCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "access_overview",
    active_filter: typeof d.active_filter === "string" ? d.active_filter : "all_properties",
    selected_property_id: d.selected_property_id != null ? String(d.selected_property_id) : null,
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    future_capabilities: (d.future_capabilities as Record<string, boolean>) ?? {},
    integration_providers: asArray<string>(d.integration_providers),
    access_methods: asArray<string>(d.access_methods),
    code_statuses: asArray<string>(d.code_statuses),
    sections: asArray<{ key: string; label: string }>(d.sections),
    filters: asArray<{ key: string; label: string }>(d.filters),
    notifications: parseNotifications(d.notifications),
    access_overview: parseOverview(d.access_overview),
    smart_locks: parseSmartLocks(d.smart_locks),
    lockboxes: parseLockboxes(d.lockboxes),
    access_instructions: parseInstructions(d.access_instructions),
    temporary_codes: parseCodes(d.temporary_codes),
    access_events: parseEvents(d.access_events),
    property_access_profile: parseProfile(d.property_access_profile),
    access_timeline: parseTimeline(d.access_timeline),
  };
}

export function parseAipifyHostsAccessCenterActionResult(data: unknown): HostsAccessCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    property_id: d.property_id != null ? String(d.property_id) : undefined,
    code_id: d.code_id != null ? String(d.code_id) : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}
