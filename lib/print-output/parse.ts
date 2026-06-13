import type { PrintJob, PrintOutputCenter, PrintPolicy, PrintPrinter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parsePrintPrinter(raw: unknown): PrintPrinter {
  const row = asRecord(raw);
  return {
    id: String(row.id ?? ""),
    printer_key: String(row.printer_key ?? ""),
    name: String(row.name ?? "Printer"),
    location: row.location ? String(row.location) : null,
    department: row.department ? String(row.department) : null,
    connection_type: (row.connection_type as PrintPrinter["connection_type"]) ?? "network",
    default_paper_size: String(row.default_paper_size ?? "A4"),
    supports_color: Boolean(row.supports_color ?? true),
    supports_duplex: Boolean(row.supports_duplex ?? true),
    status: (row.status as PrintPrinter["status"]) ?? "unknown",
    is_default: Boolean(row.is_default),
  };
}

export function parsePrintPolicy(raw: unknown): PrintPolicy {
  const row = asRecord(raw);
  return {
    enabled: Boolean(row.enabled ?? true),
    printing_disabled: Boolean(row.printing_disabled ?? false),
    require_approval_sensitive: Boolean(row.require_approval_sensitive ?? true),
    restrict_office_network: Boolean(row.restrict_office_network ?? false),
    approved_printers_only: Boolean(row.approved_printers_only ?? false),
    force_watermark_confidential: Boolean(row.force_watermark_confidential ?? true),
    default_permission_level:
      (row.default_permission_level as PrintPolicy["default_permission_level"]) ?? "own_documents",
  };
}

export function parsePrintJob(raw: unknown): PrintJob {
  const row = asRecord(raw);
  return {
    id: String(row.id ?? ""),
    job_key: String(row.job_key ?? ""),
    document_title: String(row.document_title ?? "Untitled document"),
    document_type: String(row.document_type ?? "general"),
    printer_id: row.printer_id ? String(row.printer_id) : null,
    printer_name: row.printer_name ? String(row.printer_name) : null,
    status: (row.status as PrintJob["status"]) ?? "draft",
    sensitivity_level: (row.sensitivity_level as PrintJob["sensitivity_level"]) ?? "standard",
    copies: Number(row.copies ?? 1),
    color_mode: String(row.color_mode ?? "auto"),
    duplex: Boolean(row.duplex ?? true),
    paper_size: String(row.paper_size ?? "A4"),
    page_count: Number(row.page_count ?? 1),
    approval_status: String(row.approval_status ?? "not_required"),
    pdf_fallback_available: Boolean(row.pdf_fallback_available ?? true),
    error_summary: row.error_summary ? String(row.error_summary) : null,
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function parsePrintOutputCenter(raw: unknown): PrintOutputCenter {
  const row = asRecord(raw);
  return {
    printers: Array.isArray(row.printers) ? row.printers.map(parsePrintPrinter) : [],
    recent_jobs: Array.isArray(row.recent_jobs) ? row.recent_jobs.map(parsePrintJob) : [],
    policy: parsePrintPolicy(row.policy),
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map((entry) => {
          const e = asRecord(entry);
          return {
            id: String(e.id ?? ""),
            action_type: String(e.action_type ?? ""),
            document_title: e.document_title ? String(e.document_title) : null,
            document_type: e.document_type ? String(e.document_type) : null,
            printer_name: e.printer_name ? String(e.printer_name) : null,
            status: e.status ? String(e.status) : null,
            sensitivity_level: e.sensitivity_level ? String(e.sensitivity_level) : null,
            approval_status: e.approval_status ? String(e.approval_status) : null,
            summary: e.summary ? String(e.summary) : null,
            created_at: String(e.created_at ?? ""),
          };
        })
      : [],
    metrics: asRecord(row.metrics) as PrintOutputCenter["metrics"],
  };
}
