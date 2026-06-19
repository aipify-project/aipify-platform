import type {
  CustomerHealthRow,
  GuidanceRow,
  OnboardingRow,
  PlatformCustomerSuccessHubCenter,
  PlaybookRow,
  RiskRow,
} from "./types";

function parseHealth(row: Record<string, unknown>): CustomerHealthRow {
  return {
    customer_id: String(row.customer_id ?? ""),
    customer_name: String(row.customer_name ?? ""),
    health_status: String(row.health_status ?? "healthy"),
    health_score: Number(row.health_score ?? 0),
    adoption_score: row.adoption_score != null ? Number(row.adoption_score) : undefined,
    success_status: row.success_status ? String(row.success_status) : undefined,
  };
}

function parseOnboarding(row: Record<string, unknown>): OnboardingRow {
  return {
    customer_id: String(row.customer_id ?? ""),
    customer_name: String(row.customer_name ?? ""),
    onboarding_pct: Number(row.onboarding_pct ?? 0),
    milestones_completed:
      row.milestones_completed != null ? Number(row.milestones_completed) : undefined,
  };
}

function parseGuidance(row: Record<string, unknown>): GuidanceRow {
  return {
    id: String(row.id ?? ""),
    customer_id: String(row.customer_id ?? ""),
    customer_name: String(row.customer_name ?? ""),
    guidance_key: String(row.guidance_key ?? ""),
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    status: String(row.status ?? ""),
    companion_message: row.companion_message ? String(row.companion_message) : undefined,
  };
}

function parseRisk(row: Record<string, unknown>): RiskRow {
  return {
    id: String(row.id ?? ""),
    customer_id: String(row.customer_id ?? ""),
    customer_name: String(row.customer_name ?? ""),
    risk_type: String(row.risk_type ?? ""),
    severity: String(row.severity ?? ""),
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    status: String(row.status ?? ""),
    companion_recommendation: row.companion_recommendation
      ? String(row.companion_recommendation)
      : undefined,
  };
}

function parsePlaybook(row: Record<string, unknown>): PlaybookRow {
  return {
    id: String(row.id ?? ""),
    playbook_key: String(row.playbook_key ?? ""),
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : undefined,
    playbook_type: String(row.playbook_type ?? ""),
    steps: row.steps,
    is_active: row.is_active === true,
  };
}

export function parsePlatformCustomerSuccessHubCenter(
  row: Record<string, unknown> | null
): PlatformCustomerSuccessHubCenter | null {
  if (!row || typeof row !== "object") return null;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    customer_health: Array.isArray(row.customer_health)
      ? row.customer_health.map((r) => parseHealth(r as Record<string, unknown>))
      : undefined,
    onboarding: Array.isArray(row.onboarding)
      ? row.onboarding.map((r) => parseOnboarding(r as Record<string, unknown>))
      : undefined,
    guidance: Array.isArray(row.guidance)
      ? row.guidance.map((r) => parseGuidance(r as Record<string, unknown>))
      : undefined,
    success_plans: Array.isArray(row.success_plans) ? row.success_plans : undefined,
    adoption: Array.isArray(row.adoption) ? row.adoption : undefined,
    business_pack_tracking: Array.isArray(row.business_pack_tracking)
      ? row.business_pack_tracking
      : undefined,
    risks: Array.isArray(row.risks)
      ? row.risks.map((r) => parseRisk(r as Record<string, unknown>))
      : undefined,
    companion_insights: row.companion_insights as Record<string, unknown> | undefined,
    proactive_assistance: row.proactive_assistance as Record<string, unknown> | undefined,
    expansion_opportunities: Array.isArray(row.expansion_opportunities)
      ? row.expansion_opportunities
      : undefined,
    growth_partners: Array.isArray(row.growth_partners) ? row.growth_partners : undefined,
    journey_timeline: Array.isArray(row.journey_timeline) ? row.journey_timeline : undefined,
    knowledge_integration: Array.isArray(row.knowledge_integration)
      ? row.knowledge_integration
      : undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    playbooks: Array.isArray(row.playbooks)
      ? row.playbooks.map((r) => parsePlaybook(r as Record<string, unknown>))
      : undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            event_type: String(e.event_type ?? ""),
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
