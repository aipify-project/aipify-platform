import type {
  CustomerExperienceAdoptionDelightCenter,
  ExperienceAdoptionMetric,
  ExperienceAdvisorSignal,
  ExperienceCompanionMoment,
  ExperienceDelightMoment,
  ExperienceFirstImpression,
  ExperienceGettingStarted,
  ExperienceIntelligenceSignal,
  ExperienceOnboardingStep,
  ExperienceRetentionSignal,
  ExperienceSuccessJourney,
  ExperienceSuccessMoment,
} from "./types";

function parseOnboardingStep(raw: unknown): ExperienceOnboardingStep {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    step_key: typeof d.step_key === "string" ? d.step_key : undefined,
    step_title: typeof d.step_title === "string" ? d.step_title : undefined,
    step_category: typeof d.step_category === "string" ? d.step_category : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    progress_percent: Number(d.progress_percent ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseFirstImpression(raw: unknown): ExperienceFirstImpression {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    impression_key: typeof d.impression_key === "string" ? d.impression_key : undefined,
    impression_title: typeof d.impression_title === "string" ? d.impression_title : undefined,
    impression_type: typeof d.impression_type === "string" ? d.impression_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseGettingStarted(raw: unknown): ExperienceGettingStarted {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    progress_key: typeof d.progress_key === "string" ? d.progress_key : undefined,
    progress_title: typeof d.progress_title === "string" ? d.progress_title : undefined,
    progress_category: typeof d.progress_category === "string" ? d.progress_category : undefined,
    progress_percent: Number(d.progress_percent ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseSuccessMoment(raw: unknown): ExperienceSuccessMoment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    moment_key: typeof d.moment_key === "string" ? d.moment_key : undefined,
    moment_title: typeof d.moment_title === "string" ? d.moment_title : undefined,
    moment_type: typeof d.moment_type === "string" ? d.moment_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    celebration_level: typeof d.celebration_level === "string" ? d.celebration_level : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseCompanionMoment(raw: unknown): ExperienceCompanionMoment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    moment_key: typeof d.moment_key === "string" ? d.moment_key : undefined,
    moment_title: typeof d.moment_title === "string" ? d.moment_title : undefined,
    moment_type: typeof d.moment_type === "string" ? d.moment_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseAdoptionMetric(raw: unknown): ExperienceAdoptionMetric {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    metric_key: typeof d.metric_key === "string" ? d.metric_key : undefined,
    metric_title: typeof d.metric_title === "string" ? d.metric_title : undefined,
    metric_category: typeof d.metric_category === "string" ? d.metric_category : undefined,
    adoption_percent: Number(d.adoption_percent ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseSuccessJourney(raw: unknown): ExperienceSuccessJourney {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    journey_key: typeof d.journey_key === "string" ? d.journey_key : undefined,
    journey_title: typeof d.journey_title === "string" ? d.journey_title : undefined,
    journey_stage: typeof d.journey_stage === "string" ? d.journey_stage : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    progress_percent: Number(d.progress_percent ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseRetentionSignal(raw: unknown): ExperienceRetentionSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_key: typeof d.signal_key === "string" ? d.signal_key : undefined,
    signal_title: typeof d.signal_title === "string" ? d.signal_title : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseDelightMoment(raw: unknown): ExperienceDelightMoment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    delight_key: typeof d.delight_key === "string" ? d.delight_key : undefined,
    delight_title: typeof d.delight_title === "string" ? d.delight_title : undefined,
    delight_type: typeof d.delight_type === "string" ? d.delight_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseIntelligence(raw: unknown): ExperienceIntelligenceSignal {
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

function parseAdvisor(raw: unknown): ExperienceAdvisorSignal {
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

export function parseCustomerExperienceAdoptionDelightCenter(raw: unknown): CustomerExperienceAdoptionDelightCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: d.found === true,
    has_access: d.has_access === true,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    customer_onboarding_route: typeof d.customer_onboarding_route === "string" ? d.customer_onboarding_route : undefined,
    customer_success_route: typeof d.customer_success_route === "string" ? d.customer_success_route : undefined,
    install_route: typeof d.install_route === "string" ? d.install_route : undefined,
    assistant_route: typeof d.assistant_route === "string" ? d.assistant_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview !== null ? (d.overview as Record<string, unknown>) : undefined,
    settings: typeof d.settings === "object" && d.settings !== null ? (d.settings as Record<string, unknown>) : undefined,
    modules: parseArray(d.modules, (m) => m as { key?: string; route?: string }),
    core_languages: Array.isArray(d.core_languages) ? d.core_languages.filter((l): l is string => typeof l === "string") : undefined,
    loading_experience_principles: Array.isArray(d.loading_experience_principles)
      ? d.loading_experience_principles.filter((l): l is string => typeof l === "string")
      : undefined,
    empty_state_framework:
      typeof d.empty_state_framework === "object" && d.empty_state_framework !== null
        ? (d.empty_state_framework as Record<string, unknown>)
        : undefined,
    trust_framework:
      typeof d.trust_framework === "object" && d.trust_framework !== null
        ? (d.trust_framework as Record<string, unknown>)
        : undefined,
    onboarding_steps: parseArray(d.onboarding_steps, parseOnboardingStep),
    first_impressions: parseArray(d.first_impressions, parseFirstImpression),
    getting_started: parseArray(d.getting_started, parseGettingStarted),
    success_moments: parseArray(d.success_moments, parseSuccessMoment),
    companion_moments: parseArray(d.companion_moments, parseCompanionMoment),
    adoption_metrics: parseArray(d.adoption_metrics, parseAdoptionMetric),
    success_journeys: parseArray(d.success_journeys, parseSuccessJourney),
    retention_signals: parseArray(d.retention_signals, parseRetentionSignal),
    delight_moments: parseArray(d.delight_moments, parseDelightMoment),
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
