export type FinanceExpense = {
  id: string;
  expense_number?: string | null;
  vendor_name: string;
  category_key: string;
  amount: number;
  currency: string;
  expense_date?: string | null;
  department_name?: string | null;
  domain_name?: string | null;
  owner_name?: string | null;
  status: string;
  approval_status: string;
};

export type FinanceInvoice = {
  id: string;
  invoice_number?: string | null;
  title: string;
  direction: string;
  customer_name: string;
  amount: number;
  currency: string;
  status: string;
  due_date?: string | null;
  domain_name?: string | null;
  business_pack_key?: string | null;
  approval_status: string;
};

export type FinanceRevenue = {
  id: string;
  revenue_number?: string | null;
  title: string;
  category_key: string;
  amount: number;
  currency: string;
  revenue_type: string;
  source_type: string;
  domain_name?: string | null;
  occurred_at?: string | null;
};

export type FinanceOperationsCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  revenue?: FinanceRevenue[];
  expenses?: FinanceExpense[];
  invoices?: FinanceInvoice[];
  subscriptions?: Record<string, unknown>[];
  approvals?: Record<string, unknown>[];
  budgets?: Record<string, unknown>[];
  forecasting?: Record<string, unknown>[];
  vendors?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  integrations?: Record<string, unknown>[];
  categories?: Record<string, unknown>[];
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};
