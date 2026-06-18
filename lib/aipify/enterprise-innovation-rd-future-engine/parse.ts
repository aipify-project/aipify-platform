import type {
  EnterpriseInnovationRdFutureCenter,
  InnovationAdvisorSignal,
  InnovationCompetitiveSignal,
  InnovationExperiment,
  InnovationIdea,
  InnovationIntelligenceSignal,
  InnovationOpportunity,
  InnovationResearchProject,
  InnovationTechnologyRadar,
} from "./types";

function parseIdea(raw: unknown): InnovationIdea {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    idea_key: typeof d.idea_key === "string" ? d.idea_key : undefined,
    idea_title: typeof d.idea_title === "string" ? d.idea_title : undefined,
    source_type: typeof d.source_type === "string" ? d.source_type : undefined,
    lifecycle_stage: typeof d.lifecycle_stage === "string" ? d.lifecycle_stage : undefined,
    business_value: Number(d.business_value ?? 0),
    strategic_alignment: Number(d.strategic_alignment ?? 0),
    implementation_complexity: Number(d.implementation_complexity ?? 0),
    customer_impact: Number(d.customer_impact ?? 0),
    revenue_potential: Number(d.revenue_potential ?? 0),
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
    innovation_score: Number(d.innovation_score ?? 0),
    owner_name: typeof d.owner_name === "string" ? d.owner_name : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseResearch(raw: unknown): InnovationResearchProject {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    project_key: typeof d.project_key === "string" ? d.project_key : undefined,
    project_title: typeof d.project_title === "string" ? d.project_title : undefined,
    project_type: typeof d.project_type === "string" ? d.project_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    pipeline_stage: typeof d.pipeline_stage === "string" ? d.pipeline_stage : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseExperiment(raw: unknown): InnovationExperiment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    experiment_key: typeof d.experiment_key === "string" ? d.experiment_key : undefined,
    experiment_title: typeof d.experiment_title === "string" ? d.experiment_title : undefined,
    experiment_type: typeof d.experiment_type === "string" ? d.experiment_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    pipeline_stage: typeof d.pipeline_stage === "string" ? d.pipeline_stage : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseRadar(raw: unknown): InnovationTechnologyRadar {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    radar_key: typeof d.radar_key === "string" ? d.radar_key : undefined,
    radar_title: typeof d.radar_title === "string" ? d.radar_title : undefined,
    radar_category: typeof d.radar_category === "string" ? d.radar_category : undefined,
    maturity: typeof d.maturity === "string" ? d.maturity : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseOpportunity(raw: unknown): InnovationOpportunity {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    opportunity_key: typeof d.opportunity_key === "string" ? d.opportunity_key : undefined,
    opportunity_title: typeof d.opportunity_title === "string" ? d.opportunity_title : undefined,
    opportunity_type: typeof d.opportunity_type === "string" ? d.opportunity_type : undefined,
    priority: typeof d.priority === "string" ? d.priority : undefined,
    pipeline_stage: typeof d.pipeline_stage === "string" ? d.pipeline_stage : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseCompetitive(raw: unknown): InnovationCompetitiveSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_key: typeof d.signal_key === "string" ? d.signal_key : undefined,
    signal_title: typeof d.signal_title === "string" ? d.signal_title : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseIntelligence(raw: unknown): InnovationIntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): InnovationAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser);
}

export function parseEnterpriseInnovationRdFutureCenter(raw: unknown): EnterpriseInnovationRdFutureCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: d.found === true,
    has_access: d.has_access === true,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    innovation_lab_route: typeof d.innovation_lab_route === "string" ? d.innovation_lab_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview !== null ? (d.overview as Record<string, unknown>) : undefined,
    settings: typeof d.settings === "object" && d.settings !== null ? (d.settings as Record<string, unknown>) : undefined,
    modules: parseArray(d.modules, (m) => m as { key?: string; route?: string }),
    core_languages: Array.isArray(d.core_languages) ? d.core_languages.filter((l): l is string => typeof l === "string") : undefined,
    ideas: parseArray(d.ideas, parseIdea),
    research_projects: parseArray(d.research_projects, parseResearch),
    experiments: parseArray(d.experiments, parseExperiment),
    technology_radar: parseArray(d.technology_radar, parseRadar),
    opportunities: parseArray(d.opportunities, parseOpportunity),
    competitive_signals: parseArray(d.competitive_signals, parseCompetitive),
    intelligence_signals: parseArray(d.intelligence_signals, parseIntelligence),
    advisor_signals: parseArray(d.advisor_signals, parseAdvisor),
    audit_logs: parseArray(d.audit_logs, (l) => l as Record<string, unknown>),
    executive_dashboard:
      typeof d.executive_dashboard === "object" && d.executive_dashboard !== null
        ? (d.executive_dashboard as Record<string, unknown>)
        : undefined,
    governance:
      typeof d.governance === "object" && d.governance !== null ? (d.governance as Record<string, unknown>) : undefined,
  };
}
