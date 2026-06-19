export type SalesOpportunity = {
  id: string;
  opportunity_number?: string | null;
  name: string;
  customer_id?: string | null;
  customer_name: string;
  contact_name: string;
  contact_email?: string | null;
  owner_name?: string | null;
  department_name?: string | null;
  domain_name?: string | null;
  pipeline_key?: string | null;
  value_amount: number;
  currency: string;
  expected_close_date?: string | null;
  stage: string;
  probability: number;
  weighted_value?: number;
  health_status: string;
  business_pack_key?: string | null;
  scope_type: string;
  lost_reason?: string | null;
  last_activity_at?: string | null;
};

export type SalesQuote = {
  id: string;
  quote_number?: string | null;
  opportunity_id?: string | null;
  customer_name: string;
  title: string;
  total_amount: number;
  currency: string;
  status: string;
  revision_number: number;
  valid_until?: string | null;
};

export type SalesPipeline = {
  id: string;
  pipeline_key: string;
  name: string;
  pipeline_type: string;
  is_default: boolean;
  opportunity_count?: number;
  pipeline_value?: number;
};

export type SalesRevenuePipelineCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  pipelines?: SalesPipeline[];
  opportunities?: SalesOpportunity[];
  top_opportunities?: SalesOpportunity[];
  at_risk_opportunities?: SalesOpportunity[];
  quotes?: SalesQuote[];
  activities?: Record<string, unknown>[];
  playbooks?: Record<string, unknown>[];
  forecasting?: Record<string, unknown>[];
  customers?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};
