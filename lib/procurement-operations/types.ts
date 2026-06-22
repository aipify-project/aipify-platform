export type PurchaseRequest = {
  id: string;
  request_number?: string | null;
  title: string;
  description?: string | null;
  requester_name?: string | null;
  department_name?: string | null;
  domain_name?: string | null;
  category_key?: string | null;
  vendor_name?: string | null;
  estimated_cost: number;
  currency: string;
  priority: string;
  required_date?: string | null;
  status: string;
  approval_status: string;
  budget_check_status?: string | null;
  business_pack_key?: string | null;
  updated_at?: string | null;
};

export type Vendor = {
  id: string;
  vendor_number?: string | null;
  vendor_name: string;
  supplier_name?: string | null;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  address?: string | null;
  website?: string | null;
  organization_number?: string | null;
  category_key?: string | null;
  services?: string | null;
  status: string;
  is_preferred: boolean;
  vendor_rating?: number | null;
  delivery_reliability_score?: number | null;
  response_time_score?: number | null;
  invoice_accuracy_score?: number | null;
  contract_compliance_score?: number | null;
  quality_rating_score?: number | null;
  cost_efficiency_score?: number | null;
  health_score?: number | null;
  health_status?: string | null;
  issue_history_count?: number | null;
  risk_status?: string | null;
  updated_at?: string | null;
};

export type Quotation = {
  id: string;
  rfq_number?: string | null;
  title: string;
  status: string;
  required_quotes?: number | null;
  quotes_received?: number | null;
  created_at?: string | null;
};

export type Contract = {
  id: string;
  contract_number?: string | null;
  contract_name: string;
  vendor_name?: string | null;
  contract_value: number;
  currency: string;
  start_date?: string | null;
  end_date?: string | null;
  renewal_date?: string | null;
  status: string;
  updated_at?: string | null;
};

export type PurchaseOrder = {
  id: string;
  order_number?: string | null;
  vendor_name?: string | null;
  total_cost: number;
  currency: string;
  status: string;
  approval_status?: string | null;
  invoice_status?: string | null;
  expected_delivery?: string | null;
  department_name?: string | null;
  updated_at?: string | null;
};

export type Delivery = {
  id: string;
  order_id: string;
  order_number?: string | null;
  expected_delivery?: string | null;
  actual_delivery?: string | null;
  delivery_status: string;
  inspection_results?: string | null;
  quantity_received?: number | null;
  condition_status?: string | null;
  exception_notes?: string | null;
};

export type ProcurementOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, unknown>;
  purchase_requests?: PurchaseRequest[];
  purchases?: PurchaseRequest[];
  pending_approvals?: PurchaseRequest[];
  vendors?: Vendor[];
  suppliers?: Vendor[];
  contracts?: Contract[];
  orders?: PurchaseOrder[];
  deliveries?: Delivery[];
  incoming_goods?: Delivery[];
  quotations?: Quotation[];
  spend_analysis?: Record<string, unknown>;
  risk_management?: Record<string, unknown>;
  categories?: { id: string; category_key: string; name: string }[];
  reports?: Record<string, unknown>;
  companion_insights?: Record<string, unknown>;
  subscription_awareness?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};

export type ProcurementOperationsTab =
  | "overview"
  | "purchase_requests"
  | "approvals"
  | "vendors"
  | "suppliers"
  | "contracts"
  | "orders"
  | "deliveries"
  | "incoming_goods"
  | "quotations"
  | "spend_analysis"
  | "reports";
