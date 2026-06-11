import type { HumanSuccessCard, HumanSuccessDashboard } from "./types";

export function parseHumanSuccessCard(data: unknown): HumanSuccessCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    adoption_score: d.adoption_score as number | undefined,
    success_score: d.success_score as number | undefined,
    value_message: d.value_message as string | null | undefined,
    philosophy: d.philosophy as string | undefined,
    human_centered: d.human_centered as boolean | undefined,
    no_surveillance: d.no_surveillance as boolean | undefined,
  };
}

export function parseHumanSuccessDashboard(data: unknown): HumanSuccessDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_centered: d.human_centered as boolean | undefined,
    no_surveillance: d.no_surveillance as boolean | undefined,
    no_employee_rankings: d.no_employee_rankings as boolean | undefined,
    adoption_features_enabled: d.adoption_features_enabled as boolean | undefined,
    show_personal_scores: d.show_personal_scores as boolean | undefined,
    org_adoption_score: d.org_adoption_score as number | undefined,
    org_adoption_band: d.org_adoption_band as string | undefined,
    personal_adoption: d.personal_adoption as HumanSuccessDashboard["personal_adoption"],
    personal_success: d.personal_success as HumanSuccessDashboard["personal_success"],
    friction_insights: Array.isArray(d.friction_insights) ? (d.friction_insights as HumanSuccessDashboard["friction_insights"]) : [],
    learning_recommendations: Array.isArray(d.learning_recommendations) ? (d.learning_recommendations as HumanSuccessDashboard["learning_recommendations"]) : [],
    success_journeys: Array.isArray(d.success_journeys) ? (d.success_journeys as HumanSuccessDashboard["success_journeys"]) : [],
    onboarding: Array.isArray(d.onboarding) ? (d.onboarding as HumanSuccessDashboard["onboarding"]) : [],
    champions: Array.isArray(d.champions) ? (d.champions as HumanSuccessDashboard["champions"]) : [],
    milestones: Array.isArray(d.milestones) ? (d.milestones as HumanSuccessDashboard["milestones"]) : [],
    value_reinforcements: Array.isArray(d.value_reinforcements) ? (d.value_reinforcements as HumanSuccessDashboard["value_reinforcements"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as HumanSuccessDashboard["briefings"]) : [],
    adoption_bands: d.adoption_bands as HumanSuccessDashboard["adoption_bands"],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}
