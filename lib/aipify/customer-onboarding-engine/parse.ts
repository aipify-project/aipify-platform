import type {
  AbosSuccessCriterion,
  CustomerOnboardingEngineCard,
  CustomerOnboardingEngineDashboard,
  CustomerSuccessObjective,
  DogfoodingBlueprint,
  EarlySuccessMoment,
  ImplementationBlueprintMeta,
  IntegrationLink,
  OnboardingEngagementSummary,
  OnboardingJourneyStage,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseImplementationBlueprint(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseOnboardingJourney(data: unknown): OnboardingJourneyStage[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as OnboardingJourneyStage[];
}

function parseEarlySuccessMoments(data: unknown): EarlySuccessMoment[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as EarlySuccessMoment[];
}

function parseCustomerSuccessObjectives(data: unknown): CustomerSuccessObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as CustomerSuccessObjective[];
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseDogfooding(data: unknown): DogfoodingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DogfoodingBlueprint;
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseEngagementSummary(data: unknown): OnboardingEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OnboardingEngagementSummary;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseStringArray(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseCustomerOnboardingEngineCard(data: unknown): CustomerOnboardingEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    current_step: typeof d.current_step === "string" ? d.current_step : undefined,
    completion_percentage: Number(d.completion_percentage ?? 0),
    completed: Boolean(d.completed),
    checklist_remaining: Number(d.checklist_remaining ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
  };
}

export function parseCustomerOnboardingEngineDashboard(
  data: unknown
): CustomerOnboardingEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: parseStringArray(d.principles),
    current_step: typeof d.current_step === "string" ? d.current_step : undefined,
    step_index: Number(d.step_index ?? 0),
    total_steps: Number(d.total_steps ?? 10),
    steps: Array.isArray(d.steps) ? (d.steps as CustomerOnboardingEngineDashboard["steps"]) : [],
    completion_percentage: Number(d.completion_percentage ?? 0),
    completed_at: typeof d.completed_at === "string" ? d.completed_at : null,
    checklist: Array.isArray(d.checklist)
      ? (d.checklist as CustomerOnboardingEngineDashboard["checklist"])
      : [],
    checklist_completed: Number(d.checklist_completed ?? 0),
    checklist_total: Number(d.checklist_total ?? 0),
    recommendations:
      typeof d.recommendations === "object" && d.recommendations
        ? (d.recommendations as CustomerOnboardingEngineDashboard["recommendations"])
        : undefined,
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    onboarding_success_note:
      typeof d.onboarding_success_note === "string" ? d.onboarding_success_note : undefined,
    blueprint_philosophy:
      typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    onboarding_journey: parseOnboardingJourney(d.onboarding_journey),
    early_success_moments: parseEarlySuccessMoments(d.early_success_moments),
    customer_success_objectives: parseCustomerSuccessObjectives(d.customer_success_objectives),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    dogfooding: parseDogfooding(d.dogfooding),
    blueprint_integration_links: parseIntegrationLinks(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}
