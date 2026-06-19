import type {
  SalesOpportunity,
  SalesPipeline,
  SalesQuote,
  SalesRevenuePipelineCenter,
} from "./types";

function parseOpportunity(row: Record<string, unknown>): SalesOpportunity {
  return {
    id: String(row.id ?? ""),
    opportunity_number: typeof row.opportunity_number === "string" ? row.opportunity_number : null,
    name: String(row.name ?? ""),
    customer_id: typeof row.customer_id === "string" ? row.customer_id : null,
    customer_name: String(row.customer_name ?? ""),
    contact_name: String(row.contact_name ?? ""),
    contact_email: typeof row.contact_email === "string" ? row.contact_email : null,
    owner_name: typeof row.owner_name === "string" ? row.owner_name : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    pipeline_key: typeof row.pipeline_key === "string" ? row.pipeline_key : null,
    value_amount: Number(row.value_amount ?? 0),
    currency: String(row.currency ?? "NOK"),
    expected_close_date: typeof row.expected_close_date === "string" ? row.expected_close_date : null,
    stage: String(row.stage ?? "new"),
    probability: Number(row.probability ?? 0),
    weighted_value: Number(row.weighted_value ?? 0),
    health_status: String(row.health_status ?? "stable"),
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    scope_type: String(row.scope_type ?? "organization"),
    lost_reason: typeof row.lost_reason === "string" ? row.lost_reason : null,
    last_activity_at: typeof row.last_activity_at === "string" ? row.last_activity_at : null,
  };
}

function parseQuote(row: Record<string, unknown>): SalesQuote {
  return {
    id: String(row.id ?? ""),
    quote_number: typeof row.quote_number === "string" ? row.quote_number : null,
    opportunity_id: typeof row.opportunity_id === "string" ? row.opportunity_id : null,
    customer_name: String(row.customer_name ?? ""),
    title: String(row.title ?? ""),
    total_amount: Number(row.total_amount ?? 0),
    currency: String(row.currency ?? "NOK"),
    status: String(row.status ?? "draft"),
    revision_number: Number(row.revision_number ?? 1),
    valid_until: typeof row.valid_until === "string" ? row.valid_until : null,
  };
}

function parsePipeline(row: Record<string, unknown>): SalesPipeline {
  return {
    id: String(row.id ?? ""),
    pipeline_key: String(row.pipeline_key ?? ""),
    name: String(row.name ?? ""),
    pipeline_type: String(row.pipeline_type ?? "sales"),
    is_default: row.is_default === true,
    opportunity_count: Number(row.opportunity_count ?? 0),
    pipeline_value: Number(row.pipeline_value ?? 0),
  };
}

export function parseSalesRevenuePipelineCenter(data: unknown): SalesRevenuePipelineCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapArr = (arr: unknown) => (Array.isArray(arr) ? (arr as Record<string, unknown>[]) : []);

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    pipelines: mapArr(row.pipelines).map(parsePipeline),
    opportunities: mapArr(row.opportunities).map(parseOpportunity),
    top_opportunities: mapArr(row.top_opportunities).map(parseOpportunity),
    at_risk_opportunities: mapArr(row.at_risk_opportunities).map(parseOpportunity),
    quotes: mapArr(row.quotes).map(parseQuote),
    activities: mapArr(row.activities),
    playbooks: mapArr(row.playbooks),
    forecasting: mapArr(row.forecasting),
    customers: mapArr(row.customers),
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
