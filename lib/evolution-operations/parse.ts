import type {
  DepartmentEvolution,
  EvolutionAdoptionItem,
  EvolutionOperationsCenter,
  EvolutionRecommendation,
} from "./types";

function parseRecommendation(row: Record<string, unknown>): EvolutionRecommendation {
  return {
    id: String(row.id ?? ""),
    recommendation_type: row.recommendation_type ? String(row.recommendation_type) : undefined,
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    department: row.department ? String(row.department) : undefined,
    status: row.status ? String(row.status) : undefined,
    estimated_value: row.estimated_value ? String(row.estimated_value) : undefined,
    measured_result: row.measured_result ? String(row.measured_result) : undefined,
    value_generated: row.value_generated ? String(row.value_generated) : undefined,
    training_assigned: row.training_assigned === true,
    created_at: row.created_at ? String(row.created_at) : undefined,
    resolved_at: row.resolved_at ? String(row.resolved_at) : undefined,
  };
}

function parseAdoption(row: Record<string, unknown>): EvolutionAdoptionItem {
  return {
    id: String(row.id ?? ""),
    item_type: row.item_type ? String(row.item_type) : undefined,
    item_key: row.item_key ? String(row.item_key) : undefined,
    title: String(row.title ?? ""),
    status: row.status ? String(row.status) : undefined,
    usage_pct: row.usage_pct != null ? Number(row.usage_pct) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    domain_scope: row.domain_scope ? String(row.domain_scope) : undefined,
  };
}

export function parseEvolutionOperationsCenter(row: Record<string, unknown>): EvolutionOperationsCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    maturity_engine: row.maturity_engine as Record<string, unknown> | undefined,
    adoption: Array.isArray(row.adoption) ? row.adoption.map((a) => parseAdoption(a as Record<string, unknown>)) : undefined,
    feature_adoption_engine: row.feature_adoption_engine as Record<string, unknown> | undefined,
    business_pack_adoption: Array.isArray(row.business_pack_adoption) ? row.business_pack_adoption : undefined,
    health_review: row.health_review as Record<string, unknown> | undefined,
    training_integration: row.training_integration as Record<string, unknown> | undefined,
    process_optimization: row.process_optimization as Record<string, unknown> | undefined,
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => parseRecommendation(r as Record<string, unknown>))
      : undefined,
    companion_insights: row.companion_insights as Record<string, unknown> | undefined,
    success_tracking: row.success_tracking as Record<string, unknown> | undefined,
    learning_loop: row.learning_loop as Record<string, unknown> | undefined,
    department_evolution: Array.isArray(row.department_evolution)
      ? row.department_evolution.map((d) => {
          const item = d as Record<string, unknown>;
          return {
            department_name: String(item.department_name ?? ""),
            automation_score: item.automation_score != null ? Number(item.automation_score) : undefined,
            knowledge_score: item.knowledge_score != null ? Number(item.knowledge_score) : undefined,
            training_score: item.training_score != null ? Number(item.training_score) : undefined,
            maturity_score: item.maturity_score != null ? Number(item.maturity_score) : undefined,
            adoption_score: item.adoption_score != null ? Number(item.adoption_score) : undefined,
            suggestions: item.suggestions,
          } satisfies DepartmentEvolution;
        })
      : undefined,
    domain_awareness: Array.isArray(row.domain_awareness) ? row.domain_awareness : undefined,
    business_pack_integration: row.business_pack_integration as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseEvolutionSearchResults(row: Record<string, unknown>): EvolutionRecommendation[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parseRecommendation(r as Record<string, unknown>));
}
