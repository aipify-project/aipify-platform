import type {
  EnterpriseTransformationChangeCenter,
  ReadinessDimension,
  ReadinessStatus,
  ResistanceSignal,
  TransformationCategoryKey,
  TransformationProgram,
} from "./types";

const READY = new Set<ReadinessStatus>([
  "ready",
  "mostly_ready",
  "partially_ready",
  "not_ready",
  "critical_concerns",
]);

const CATS = new Set<TransformationCategoryKey>([
  "digital_transformation",
  "organizational_restructuring",
  "process_transformation",
  "technology_adoption",
  "cultural_transformation",
  "compliance_transformation",
  "customer_experience_transformation",
  "strategic_pivot_initiatives",
  "growth_transformation",
  "operational_excellence_programs",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}
function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}
function bool(v: unknown): boolean {
  return v === true;
}
function parseReady(v: unknown): ReadinessStatus {
  const s = str(v, "partially_ready");
  return READY.has(s as ReadinessStatus) ? (s as ReadinessStatus) : "partially_ready";
}
function parseDim(raw: unknown): ReadinessDimension {
  if (!raw || typeof raw !== "object") return { score: 70, status: "mostly_ready" };
  const d = raw as Record<string, unknown>;
  return { score: num(d.score, 70), status: parseReady(d.status) };
}
function parseProgram(raw: unknown): TransformationProgram {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id),
    title: str(d.title),
    category: str(d.category),
    status: str(d.status),
    health: str(d.health),
    adoption_progress: num(d.adoption_progress),
    sponsorship_status: str(d.sponsorship_status),
    milestones_achieved: num(d.milestones_achieved),
    created_at: str(d.created_at) || undefined,
  };
}
function parseResistance(raw: unknown): ResistanceSignal | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!str(d.signal)) return null;
  return {
    signal: str(d.signal),
    severity: str(d.severity),
    supportive_note: str(d.supportive_note),
  };
}
function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : [];
}

export function parseEnterpriseTransformationChangeCenter(data: unknown): EnterpriseTransformationChangeCenter {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const td = d.transformation_dashboard as Record<string, unknown> | undefined;
  const cr = d.change_readiness as Record<string, unknown> | undefined;
  const ai = d.adoption_intelligence as Record<string, unknown> | undefined;
  const eb = d.executive_briefing as Record<string, unknown> | undefined;
  const sm = d.stakeholder_mapping as Record<string, unknown> | undefined;
  const ci = d.communication_intelligence as Record<string, unknown> | undefined;
  const te = d.training_enablement as Record<string, unknown> | undefined;
  const ms = d.milestones as Record<string, unknown> | undefined;

  return {
    found: true,
    has_access: d.has_access !== undefined ? bool(d.has_access) : undefined,
    upgrade_required: bool(d.upgrade_required),
    transformation_dashboard: td
      ? {
          active_programs: num(td.active_programs),
          health_status: str(td.health_status),
          health_score: num(td.health_score, 75),
          adoption_progress: num(td.adoption_progress),
          change_readiness_score: num(td.change_readiness_score),
          change_readiness_status: parseReady(td.change_readiness_status),
          resistance_signals_count: num(td.resistance_signals_count),
          milestones_achieved: num(td.milestones_achieved),
          executive_sponsorship_status: str(td.executive_sponsorship_status),
          active_programs_list: Array.isArray(td.active_programs_list)
            ? td.active_programs_list.map(parseProgram)
            : [],
        }
      : undefined,
    transformation_categories: Array.isArray(d.transformation_categories)
      ? d.transformation_categories.map((c) => {
          const row = c as Record<string, unknown>;
          const key = str(row.key) as TransformationCategoryKey;
          return { key: CATS.has(key) ? key : "process_transformation", count: num(row.count) };
        })
      : [],
    change_readiness: cr
      ? {
          overall_score: num(cr.overall_score),
          overall_status: parseReady(cr.overall_status),
          leadership_alignment: parseDim(cr.leadership_alignment),
          employee_understanding: parseDim(cr.employee_understanding),
          communication_effectiveness: parseDim(cr.communication_effectiveness),
          resource_availability: parseDim(cr.resource_availability),
          training_readiness: parseDim(cr.training_readiness),
          governance_readiness: parseDim(cr.governance_readiness),
        }
      : undefined,
    adoption_intelligence: ai
      ? {
          training_participation: num(ai.training_participation),
          process_adoption_rate: num(ai.process_adoption_rate),
          usage_pattern: str(ai.usage_pattern),
          support_requests: num(ai.support_requests),
          feedback_trend: str(ai.feedback_trend),
          department_adoption_notes: str(ai.department_adoption_notes),
          department_differences: Array.isArray(ai.department_differences)
            ? ai.department_differences.map((x) => {
                const row = x as Record<string, unknown>;
                return { area: str(row.area), adoption: num(row.adoption) };
              })
            : [],
        }
      : undefined,
    resistance_monitoring: Array.isArray(d.resistance_monitoring)
      ? d.resistance_monitoring.map(parseResistance).filter((x): x is ResistanceSignal => x !== null)
      : [],
    executive_briefing: eb
      ? {
          current_status: str(eb.current_status),
          achievements: strArr(eb.achievements),
          emerging_risks: strArr(eb.emerging_risks),
          adoption_trends: str(eb.adoption_trends),
          recommended_interventions: strArr(eb.recommended_interventions),
          priority_focus: strArr(eb.priority_focus),
          confidence_score: num(eb.confidence_score, 75),
          confidence_level: str(eb.confidence_level),
          disclaimer: str(eb.disclaimer),
        }
      : undefined,
    stakeholder_mapping: sm
      ? {
          executive_sponsors: strArr(sm.executive_sponsors),
          transformation_leaders: strArr(sm.transformation_leaders),
          department_champions: strArr(sm.department_champions),
          subject_matter_experts: strArr(sm.subject_matter_experts),
          impacted_teams: strArr(sm.impacted_teams),
          communication_owners: strArr(sm.communication_owners),
        }
      : undefined,
    communication_intelligence: ci
      ? {
          frequency: str(ci.frequency),
          reach_indicator: num(ci.reach_indicator),
          acknowledgement_rate: num(ci.acknowledgement_rate),
          understanding_indicator: num(ci.understanding_indicator),
          missed_audiences: strArr(ci.missed_audiences),
          recommended_actions: strArr(ci.recommended_actions),
        }
      : undefined,
    training_enablement: te
      ? {
          completion_rate: num(te.completion_rate),
          knowledge_gaps: strArr(te.knowledge_gaps),
          department_readiness: parseReady(te.department_readiness),
          follow_up_recommendations: strArr(te.follow_up_recommendations),
          learning_pathways: strArr(te.learning_pathways),
        }
      : undefined,
    milestones: ms
      ? {
          planned: Array.isArray(ms.planned)
            ? ms.planned.map((x) => {
                const row = x as Record<string, unknown>;
                return { title: str(row.title), status: str(row.status), due: str(row.due) || undefined };
              })
            : [],
          completed: Array.isArray(ms.completed)
            ? ms.completed.map((x) => {
                const row = x as Record<string, unknown>;
                return { title: str(row.title), completed_at: str(row.completed_at) || undefined };
              })
            : [],
          delayed: Array.isArray(ms.delayed)
            ? ms.delayed.map((x) => {
                const row = x as Record<string, unknown>;
                return { title: str(row.title), reason: str(row.reason) };
              })
            : [],
          blocked: Array.isArray(ms.blocked)
            ? ms.blocked.map((x) => {
                const row = x as Record<string, unknown>;
                return { title: str(row.title), reason: str(row.reason) };
              })
            : [],
          executive_review: Array.isArray(ms.executive_review)
            ? ms.executive_review.map((x) => {
                const row = x as Record<string, unknown>;
                return { title: str(row.title), risk_level: str(row.risk_level) };
              })
            : [],
        }
      : undefined,
    learning_insights:
      d.learning_insights && typeof d.learning_insights === "object"
        ? Object.fromEntries(Object.entries(d.learning_insights as Record<string, unknown>).map(([k, v]) => [k, str(v)]))
        : undefined,
    reflection_prompts: Array.isArray(d.reflection_prompts)
      ? d.reflection_prompts.map((x) => {
          const row = x as Record<string, unknown>;
          return { prompt: str(row.prompt), guidance: str(row.guidance) };
        })
      : [],
    principle: str(d.principle),
  };
}
