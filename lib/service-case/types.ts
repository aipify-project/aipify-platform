export type ServiceCase = {
  id: string;
  case_number?: string | null;
  title: string;
  description?: string | null;
  customer_id?: string | null;
  customer_name?: string | null;
  assigned_employee_name?: string | null;
  department_name?: string | null;
  priority: string;
  status: string;
  domain_name?: string | null;
  business_pack_key?: string | null;
  due_date?: string | null;
  resolution_due_at?: string | null;
};

export type ServiceCaseCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  open_cases?: ServiceCase[];
  assigned_cases?: ServiceCase[];
  escalations?: Record<string, unknown>[];
  completed_cases?: ServiceCase[];
  sla?: Record<string, unknown>;
  timeline?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};

export type ServiceCustomerSuccessCenter = {
  found: boolean;
  principle?: string;
  summary?: Record<string, unknown>;
  customer_health?: Record<string, unknown>[];
  success_actions?: Record<string, unknown>[];
  feedback?: Record<string, unknown>[];
  routes?: Record<string, string>;
};
