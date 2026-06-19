export type CrmCustomer = {
  id: string;
  customer_number?: string | null;
  customer_type: string;
  name: string;
  company_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
  language?: string | null;
  website?: string | null;
  status: string;
  industry?: string | null;
  lifecycle_stage?: string | null;
  organization_number?: string | null;
  employee_count?: number | null;
  health_score?: number | null;
  health_status?: string | null;
  department_name?: string | null;
  assigned_employee_name?: string | null;
  tags?: unknown;
};

export type CustomerRelationshipCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, unknown>;
  customers?: CrmCustomer[];
  prospects?: CrmCustomer[];
  contacts?: Record<string, unknown>[];
  organizations?: CrmCustomer[];
  leads?: Record<string, unknown>[];
  opportunities?: Record<string, unknown>[];
  pipeline?: Record<string, unknown>;
  timeline?: Record<string, unknown>[];
  activities?: Record<string, unknown>[];
  communications?: Record<string, unknown>[];
  contracts?: Record<string, unknown>[];
  renewals?: Record<string, unknown>[];
  documents?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  subscription_awareness?: Record<string, unknown>;
  companion_insights?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};

export type LeadManagementCenter = {
  found: boolean;
  principle?: string;
  leads?: Record<string, unknown>[];
  pipeline?: Record<string, unknown>;
  routes?: Record<string, string>;
};

export type CustomerRelationshipTab =
  | "overview"
  | "prospects"
  | "customers"
  | "contacts"
  | "organizations"
  | "leads"
  | "opportunities"
  | "activities"
  | "renewals"
  | "contracts"
  | "relationships"
  | "communication"
  | "documents"
  | "reports";
