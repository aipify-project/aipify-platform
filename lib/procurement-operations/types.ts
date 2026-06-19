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
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  services?: string | null;
  status: string;
  is_preferred: boolean;
  vendor_rating?: number | null;
  delivery_reliability_score?: number | null;
  response_time_score?: number | null;
  invoice_accuracy_score?: number | null;
  contract_compliance_score?: number | null;
  risk_status?: string | null;
  updated_at?: string | null;
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
};

export type ProcurementOperationsCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  purchase_requests?: PurchaseRequest[];
  pending_approvals?: PurchaseRequest[];
  vendors?: Vendor[];
  contracts?: Contract[];
  orders?: PurchaseOrder[];
  deliveries?: Delivery[];
  categories?: { id: string; category_key: string; name: string }[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};
