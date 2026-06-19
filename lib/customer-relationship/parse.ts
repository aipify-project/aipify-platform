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
    industry: typeof row.industry === "string" ? row.industry : null,
    lifecycle_stage: typeof row.lifecycle_stage === "string" ? row.lifecycle_stage : null,
    organization_number: typeof row.organization_number === "string" ? row.organization_number : null,
    employee_count: typeof row.employee_count === "number" ? row.employee_count : null,
    health_score: typeof row.health_score === "number" ? row.health_score : null,
    health_status: typeof row.health_status === "string" ? row.health_status : null,
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
    philosophy: typeof row.philosophy === "string" ? row.philosophy : undefined,
    customers: Array.isArray(row.customers)
      ? (row.customers as Record<string, unknown>[]).map(parseCustomer)
      : [],
    prospects: Array.isArray(row.prospects)
      ? (row.prospects as Record<string, unknown>[]).map(parseCustomer)
      : [],
    contacts: Array.isArray(row.contacts) ? (row.contacts as Record<string, unknown>[]) : [],
    organizations: Array.isArray(row.organizations)
      ? (row.organizations as Record<string, unknown>[]).map(parseCustomer)
      : [],
    leads: Array.isArray(row.leads) ? (row.leads as Record<string, unknown>[]) : [],
    opportunities: Array.isArray(row.opportunities) ? (row.opportunities as Record<string, unknown>[]) : [],
    pipeline: row.pipeline as Record<string, unknown> | undefined,
    timeline: Array.isArray(row.timeline) ? (row.timeline as Record<string, unknown>[]) : [],
    activities: Array.isArray(row.activities) ? (row.activities as Record<string, unknown>[]) : [],
    communications: Array.isArray(row.communications) ? (row.communications as Record<string, unknown>[]) : [],
    contracts: Array.isArray(row.contracts) ? (row.contracts as Record<string, unknown>[]) : [],
    renewals: Array.isArray(row.renewals) ? (row.renewals as Record<string, unknown>[]) : [],
    documents: Array.isArray(row.documents) ? (row.documents as Record<string, unknown>[]) : [],
    reports: row.reports as Record<string, unknown> | undefined,
    subscription_awareness: row.subscription_awareness as Record<string, unknown> | undefined,
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
