import type {
  HostsDocumentCenterActionResult,
  HostsDocumentCenterDashboard,
  HostsDocumentRow,
  HostsDocumentStats,
  HostsDocumentTemplateRow,
  HostsDocumentVersionRow,
  HostsPropertyOption,
  HostsPropertyVaultRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseDocuments(data: unknown): HostsDocumentRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        document_key: typeof d.document_key === "string" ? d.document_key : "",
        document_name: typeof d.document_name === "string" ? d.document_name : "",
        category: typeof d.category === "string" ? d.category : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        uploaded_by: typeof d.uploaded_by === "string" ? d.uploaded_by : "—",
        upload_date: typeof d.upload_date === "string" ? d.upload_date : "",
        expiration_date: typeof d.expiration_date === "string" ? d.expiration_date : null,
        status: typeof d.status === "string" ? d.status : "",
        current_version: Number(d.current_version ?? 1),
        file_label: typeof d.file_label === "string" ? d.file_label : "",
        updated_at: typeof d.updated_at === "string" ? d.updated_at : "",
      };
    })
    .filter((r): r is HostsDocumentRow => r !== null);
}

function parseVersions(data: unknown): HostsDocumentVersionRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        document_id: String(d.document_id ?? ""),
        version_number: Number(d.version_number ?? 0),
        updated_by: typeof d.updated_by === "string" ? d.updated_by : "—",
        updated_date: typeof d.updated_date === "string" ? d.updated_date : "",
        change_notes: typeof d.change_notes === "string" ? d.change_notes : "—",
        file_label: typeof d.file_label === "string" ? d.file_label : "—",
      };
    })
    .filter((r): r is HostsDocumentVersionRow => r !== null);
}

function parseTemplates(data: unknown): HostsDocumentTemplateRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        template_key: typeof d.template_key === "string" ? d.template_key : "",
        template_name: typeof d.template_name === "string" ? d.template_name : "",
        template_type: typeof d.template_type === "string" ? d.template_type : "",
        description: typeof d.description === "string" ? d.description : "—",
      };
    })
    .filter((r): r is HostsDocumentTemplateRow => r !== null);
}

function parseVaults(data: unknown): HostsPropertyVaultRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.property_id) return null;
      return {
        property_id: String(d.property_id),
        property_name: typeof d.property_name === "string" ? d.property_name : "—",
        document_count: Number(d.document_count ?? 0),
        expiring_documents: Number(d.expiring_documents ?? 0),
        recently_updated: asArray<{ id: string; document_name: string; updated_at: string }>(d.recently_updated),
      };
    })
    .filter((r): r is HostsPropertyVaultRow => r !== null);
}

function parseProperties(data: unknown): HostsPropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        display_name: typeof d.display_name === "string" ? d.display_name : "—",
      };
    })
    .filter((r): r is HostsPropertyOption => r !== null);
}

function parseStats(data: unknown): HostsDocumentStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    total_documents: Number(d.total_documents ?? 0),
    expiring_documents: Number(d.expiring_documents ?? 0),
    archived_documents: Number(d.archived_documents ?? 0),
    template_count: Number(d.template_count ?? 0),
    property_vaults: Number(d.property_vaults ?? 0),
  };
}

export function parseAipifyHostsDocumentCenterDashboard(data: unknown): HostsDocumentCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "property_documents",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    document_categories: asArray<string>(d.document_categories),
    document_statuses: asArray<string>(d.document_statuses),
    template_types: asArray<string>(d.template_types),
    stats: parseStats(d.stats),
    property_vaults: parseVaults(d.property_vaults),
    properties: parseProperties(d.properties),
    documents: parseDocuments(d.documents),
    document_versions: parseVersions(d.document_versions),
    templates: parseTemplates(d.templates),
  };
}

export function parseAipifyHostsDocumentCenterActionResult(data: unknown): HostsDocumentCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    document_id: d.document_id != null ? String(d.document_id) : undefined,
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
