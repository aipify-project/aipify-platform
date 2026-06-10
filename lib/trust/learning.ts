/** Global learning restrictions (Phase 19 §19). */

export const ALLOWED_LEARNING_INPUTS = [
  "anonymized_operational_metadata",
  "automation_outcomes",
  "support_volume_trends",
  "health_score_patterns",
  "recommendation_acceptance_rates",
] as const;

export const FORBIDDEN_LEARNING_INPUTS = [
  "customer_identities",
  "customer_communications",
  "sensitive_business_records",
  "payment_details",
  "personal_identifiers",
] as const;

export function isForbiddenLearningInput(category: string): boolean {
  return (FORBIDDEN_LEARNING_INPUTS as readonly string[]).includes(category);
}
