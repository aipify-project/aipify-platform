import type {
  FormRecord,
  FormsDataCollectionCenter,
  FormSubmission,
  FormTemplate,
} from "./types";

function parseForm(row: Record<string, unknown>): FormRecord {
  return {
    id: String(row.id ?? ""),
    form_number: typeof row.form_number === "string" ? row.form_number : null,
    name: String(row.name ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    form_type: String(row.form_type ?? "general"),
    status: String(row.status ?? "draft"),
    version: Number(row.version ?? 1),
    is_public: row.is_public === true,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    owner_name: typeof row.owner_name === "string" ? row.owner_name : null,
    field_count: Number(row.field_count ?? 0),
    submission_count: Number(row.submission_count ?? 0),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseSubmission(row: Record<string, unknown>): FormSubmission {
  return {
    id: String(row.id ?? ""),
    submission_number: typeof row.submission_number === "string" ? row.submission_number : null,
    form_id: String(row.form_id ?? ""),
    form_name: typeof row.form_name === "string" ? row.form_name : null,
    submitter_name: typeof row.submitter_name === "string" ? row.submitter_name : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    status: String(row.status ?? "draft"),
    approval_status: String(row.approval_status ?? "none"),
    scan_reference: typeof row.scan_reference === "string" ? row.scan_reference : null,
    submitted_at: typeof row.submitted_at === "string" ? row.submitted_at : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseTemplate(row: Record<string, unknown>): FormTemplate {
  return {
    id: String(row.id ?? ""),
    template_key: String(row.template_key ?? ""),
    name: String(row.name ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    template_type: String(row.template_type ?? "general"),
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    field_count: Number(row.field_count ?? 0),
  };
}

export function parseFormsDataCollectionCenter(data: unknown): FormsDataCollectionCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapArr = (arr: unknown) => (Array.isArray(arr) ? (arr as Record<string, unknown>[]) : []);

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    forms: mapArr(row.forms).map(parseForm),
    submissions: mapArr(row.submissions).map(parseSubmission),
    pending_approvals: mapArr(row.pending_approvals).map(parseSubmission),
    templates: mapArr(row.templates).map(parseTemplate),
    automation: mapArr(row.automation),
    reports: row.reports as Record<string, unknown> | undefined,
    field_types: Array.isArray(row.field_types) ? (row.field_types as string[]) : [],
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
