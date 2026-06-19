import type { FinanceExpense, FinanceInvoice, FinanceOperationsCenter, FinanceRevenue } from "./types";

function parseRevenue(row: Record<string, unknown>): FinanceRevenue {
  return {
    id: String(row.id ?? ""),
    revenue_number: typeof row.revenue_number === "string" ? row.revenue_number : null,
    title: String(row.title ?? ""),
    category_key: String(row.category_key ?? "services"),
    amount: Number(row.amount ?? 0),
    currency: String(row.currency ?? "NOK"),
    revenue_type: String(row.revenue_type ?? "one_time"),
    source_type: String(row.source_type ?? "service"),
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    occurred_at: typeof row.occurred_at === "string" ? row.occurred_at : null,
  };
}

function parseExpense(row: Record<string, unknown>): FinanceExpense {
  return {
    id: String(row.id ?? ""),
    expense_number: typeof row.expense_number === "string" ? row.expense_number : null,
    vendor_name: String(row.vendor_name ?? ""),
    category_key: String(row.category_key ?? "operations"),
    amount: Number(row.amount ?? 0),
    currency: String(row.currency ?? "NOK"),
    expense_date: typeof row.expense_date === "string" ? row.expense_date : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    owner_name: typeof row.owner_name === "string" ? row.owner_name : null,
    status: String(row.status ?? "draft"),
    approval_status: String(row.approval_status ?? "none"),
  };
}

function parseInvoice(row: Record<string, unknown>): FinanceInvoice {
  return {
    id: String(row.id ?? ""),
    invoice_number: typeof row.invoice_number === "string" ? row.invoice_number : null,
    title: String(row.title ?? ""),
    direction: String(row.direction ?? "outgoing"),
    customer_name: String(row.customer_name ?? ""),
    amount: Number(row.amount ?? 0),
    currency: String(row.currency ?? "NOK"),
    status: String(row.status ?? "draft"),
    due_date: typeof row.due_date === "string" ? row.due_date : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    approval_status: String(row.approval_status ?? "none"),
  };
}

export function parseFinanceOperationsCenter(data: unknown): FinanceOperationsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapArr = (arr: unknown) =>
    Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    revenue: mapArr(row.revenue).map(parseRevenue),
    expenses: mapArr(row.expenses).map(parseExpense),
    invoices: mapArr(row.invoices).map(parseInvoice),
    subscriptions: mapArr(row.subscriptions),
    approvals: mapArr(row.approvals),
    budgets: mapArr(row.budgets),
    forecasting: mapArr(row.forecasting),
    vendors: mapArr(row.vendors),
    reports: row.reports as Record<string, unknown> | undefined,
    integrations: mapArr(row.integrations),
    categories: mapArr(row.categories),
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
