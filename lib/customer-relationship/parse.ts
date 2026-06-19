import type { CrmCustomer, CustomerRelationshipCenter, LeadManagementCenter } from "./types";

function parseCustomer(row: Record<string, unknown>): CrmCustomer {
  return {
    id: String(row.id ?? ""),
    customer_number: typeof row.customer_number === "string" ? row.customer_number : null,
    customer_type: String(row.customer_type ?? "business"),
    name: String(row.name ?? ""),
    company_name: typeof row.company_name === "string" ? row.company_name : null,
    email: typeof row.email === "string" ? row.email : null,
    phone: typeof row.phone === "string" ? row.phone : null,
    address: typeof row.address === "string" ? row.address : null,
    country: typeof row.country === "string" ? row.country : null,
    language: typeof row.language === "string" ? row.language : null,
    website: typeof row.website === "string" ? row.website : null,
    status: String(row.status ?? "prospect"),
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    assigned_employee_name: typeof row.assigned_employee_name === "string" ? row.assigned_employee_name : null,
    tags: row.tags,
  };
}

export function parseCustomerRelationshipCenter(data: unknown): CustomerRelationshipCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    customers: Array.isArray(row.customers)
      ? (row.customers as Record<string, unknown>[]).map(parseCustomer)
      : [],
    contacts: Array.isArray(row.contacts) ? (row.contacts as Record<string, unknown>[]) : [],
    organizations: Array.isArray(row.organizations)
      ? (row.organizations as Record<string, unknown>[]).map(parseCustomer)
      : [],
    leads: Array.isArray(row.leads) ? (row.leads as Record<string, unknown>[]) : [],
    timeline: Array.isArray(row.timeline) ? (row.timeline as Record<string, unknown>[]) : [],
    communications: Array.isArray(row.communications) ? (row.communications as Record<string, unknown>[]) : [],
    documents: Array.isArray(row.documents) ? (row.documents as Record<string, unknown>[]) : [],
    reports: row.reports as Record<string, unknown> | undefined,
    companion_insights: row.companion_insights as Record<string, unknown> | undefined,
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

export function parseLeadManagementCenter(data: unknown): LeadManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    leads: Array.isArray(row.leads) ? (row.leads as Record<string, unknown>[]) : [],
    pipeline: row.pipeline as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
  };
}
