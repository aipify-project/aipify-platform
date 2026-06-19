import type {
  Assessment,
  ContinuityPlan,
  Dependency,
  MitigationPlan,
  RiskIncident,
  RiskItem,
  RiskOperationsCenter,
  VendorDependency,
} from "./types";

function parseRisk(row: Record<string, unknown>): RiskItem {
  return {
    id: String(row.id ?? ""),
    risk_number: row.risk_number ? String(row.risk_number) : undefined,
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : undefined,
    category: String(row.category ?? "operational"),
    likelihood: String(row.likelihood ?? "medium"),
    impact: String(row.impact ?? "medium"),
    risk_score: typeof row.risk_score === "number" ? row.risk_score : undefined,
    risk_level: row.risk_level ? String(row.risk_level) : undefined,
    risk_control_status: row.risk_control_status ? String(row.risk_control_status) : undefined,
    status: String(row.status ?? "open"),
    mitigation_plan: row.mitigation_plan ? String(row.mitigation_plan) : undefined,
    review_date: row.review_date ? String(row.review_date) : undefined,
  };
}

function parseList<T>(value: unknown, parser: (row: Record<string, unknown>) => T): T[] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => parser(row as Record<string, unknown>));
}

export function parseRiskOperationsCenter(row: Record<string, unknown>): RiskOperationsCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overall_risk: row.overall_risk as Record<string, unknown> | undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    risk_register: parseList(row.risk_register, parseRisk),
    assessments: parseList(row.assessments, (r) => ({
      id: String(r.id ?? ""),
      assessment_number: r.assessment_number ? String(r.assessment_number) : undefined,
      title: String(r.title ?? ""),
      assessment_type: String(r.assessment_type ?? "organization"),
      status: String(r.status ?? "identify"),
    })) as Assessment[],
    mitigation_plans: parseList(row.mitigation_plans, (r) => ({
      id: String(r.id ?? ""),
      plan_number: r.plan_number ? String(r.plan_number) : undefined,
      title: String(r.title ?? ""),
      status: String(r.status ?? "open"),
      due_date: r.due_date ? String(r.due_date) : undefined,
      risk_id: r.risk_id ? String(r.risk_id) : undefined,
    })) as MitigationPlan[],
    continuity_plans: parseList(row.continuity_plans, (r) => ({
      id: String(r.id ?? ""),
      plan_number: r.plan_number ? String(r.plan_number) : undefined,
      title: String(r.title ?? ""),
      status: String(r.status ?? "draft"),
      recovery_time_objective: r.recovery_time_objective ? String(r.recovery_time_objective) : undefined,
      review_date: r.review_date ? String(r.review_date) : undefined,
      process_count: typeof r.process_count === "number" ? r.process_count : undefined,
    })) as ContinuityPlan[],
    vendor_dependencies: parseList(row.vendor_dependencies, (r) => ({
      id: String(r.id ?? ""),
      vendor_name: String(r.vendor_name ?? ""),
      dependency_level: String(r.dependency_level ?? "medium"),
      replacement_available: r.replacement_available === true,
      contract_status: String(r.contract_status ?? "active"),
      risk_score: typeof r.risk_score === "number" ? r.risk_score : undefined,
      business_impact: String(r.business_impact ?? "medium"),
    })) as VendorDependency[],
    dependencies: parseList(row.dependencies, (r) => ({
      id: String(r.id ?? ""),
      dependency_type: String(r.dependency_type ?? "system"),
      dependency_name: String(r.dependency_name ?? ""),
      criticality: String(r.criticality ?? "high"),
      failure_impact: r.failure_impact ? String(r.failure_impact) : undefined,
    })) as Dependency[],
    incidents: parseList(row.incidents, (r) => ({
      id: String(r.id ?? ""),
      incident_number: r.incident_number ? String(r.incident_number) : undefined,
      title: String(r.title ?? ""),
      incident_type: String(r.incident_type ?? "operational"),
      severity: String(r.severity ?? "high"),
      status: String(r.status ?? "declared"),
    })) as RiskIncident[],
    heat_map: Array.isArray(row.heat_map) ? (row.heat_map as Record<string, unknown>[]) : [],
    executive_risk: row.executive_risk as Record<string, unknown> | undefined,
    governance_link: row.governance_link as Record<string, string> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    companion_insights: row.companion_insights as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
