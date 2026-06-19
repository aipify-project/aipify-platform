import type {
  Contract,
  Delivery,
  ProcurementOperationsCenter,
  PurchaseOrder,
  PurchaseRequest,
  Vendor,
} from "./types";

function parseRequest(row: Record<string, unknown>): PurchaseRequest {
  return {
    id: String(row.id ?? ""),
    request_number: typeof row.request_number === "string" ? row.request_number : null,
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    requester_name: typeof row.requester_name === "string" ? row.requester_name : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    category_key: typeof row.category_key === "string" ? row.category_key : null,
    vendor_name: typeof row.vendor_name === "string" ? row.vendor_name : null,
    estimated_cost: Number(row.estimated_cost ?? 0),
    currency: String(row.currency ?? "NOK"),
    priority: String(row.priority ?? "normal"),
    required_date: typeof row.required_date === "string" ? row.required_date : null,
    status: String(row.status ?? "draft"),
    approval_status: String(row.approval_status ?? "none"),
    budget_check_status: typeof row.budget_check_status === "string" ? row.budget_check_status : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseVendor(row: Record<string, unknown>): Vendor {
  return {
    id: String(row.id ?? ""),
    vendor_number: typeof row.vendor_number === "string" ? row.vendor_number : null,
    vendor_name: String(row.vendor_name ?? ""),
    contact_person: typeof row.contact_person === "string" ? row.contact_person : null,
    email: typeof row.email === "string" ? row.email : null,
    phone: typeof row.phone === "string" ? row.phone : null,
    country: typeof row.country === "string" ? row.country : null,
    services: typeof row.services === "string" ? row.services : null,
    status: String(row.status ?? "active"),
    is_preferred: row.is_preferred === true,
    vendor_rating: row.vendor_rating != null ? Number(row.vendor_rating) : null,
    delivery_reliability_score:
      row.delivery_reliability_score != null ? Number(row.delivery_reliability_score) : null,
    response_time_score: row.response_time_score != null ? Number(row.response_time_score) : null,
    invoice_accuracy_score: row.invoice_accuracy_score != null ? Number(row.invoice_accuracy_score) : null,
    contract_compliance_score:
      row.contract_compliance_score != null ? Number(row.contract_compliance_score) : null,
    risk_status: typeof row.risk_status === "string" ? row.risk_status : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseContract(row: Record<string, unknown>): Contract {
  return {
    id: String(row.id ?? ""),
    contract_number: typeof row.contract_number === "string" ? row.contract_number : null,
    contract_name: String(row.contract_name ?? ""),
    vendor_name: typeof row.vendor_name === "string" ? row.vendor_name : null,
    contract_value: Number(row.contract_value ?? 0),
    currency: String(row.currency ?? "NOK"),
    start_date: typeof row.start_date === "string" ? row.start_date : null,
    end_date: typeof row.end_date === "string" ? row.end_date : null,
    renewal_date: typeof row.renewal_date === "string" ? row.renewal_date : null,
    status: String(row.status ?? "active"),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseOrder(row: Record<string, unknown>): PurchaseOrder {
  return {
    id: String(row.id ?? ""),
    order_number: typeof row.order_number === "string" ? row.order_number : null,
    vendor_name: typeof row.vendor_name === "string" ? row.vendor_name : null,
    total_cost: Number(row.total_cost ?? 0),
    currency: String(row.currency ?? "NOK"),
    status: String(row.status ?? "pending"),
    approval_status: typeof row.approval_status === "string" ? row.approval_status : null,
    invoice_status: typeof row.invoice_status === "string" ? row.invoice_status : null,
    expected_delivery: typeof row.expected_delivery === "string" ? row.expected_delivery : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseDelivery(row: Record<string, unknown>): Delivery {
  return {
    id: String(row.id ?? ""),
    order_id: String(row.order_id ?? ""),
    order_number: typeof row.order_number === "string" ? row.order_number : null,
    expected_delivery: typeof row.expected_delivery === "string" ? row.expected_delivery : null,
    actual_delivery: typeof row.actual_delivery === "string" ? row.actual_delivery : null,
    delivery_status: String(row.delivery_status ?? "pending"),
    inspection_results: typeof row.inspection_results === "string" ? row.inspection_results : null,
  };
}

export function parseProcurementOperationsCenter(data: unknown): ProcurementOperationsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapArr = (arr: unknown) => (Array.isArray(arr) ? (arr as Record<string, unknown>[]) : []);

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    purchase_requests: mapArr(row.purchase_requests).map(parseRequest),
    pending_approvals: mapArr(row.pending_approvals).map(parseRequest),
    vendors: mapArr(row.vendors).map(parseVendor),
    contracts: mapArr(row.contracts).map(parseContract),
    orders: mapArr(row.orders).map(parseOrder),
    deliveries: mapArr(row.deliveries).map(parseDelivery),
    categories: mapArr(row.categories).map((c) => ({
      id: String(c.id ?? ""),
      category_key: String(c.category_key ?? ""),
      name: String(c.name ?? ""),
    })),
    reports: row.reports as Record<string, unknown> | undefined,
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
