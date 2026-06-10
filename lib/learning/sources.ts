/** Allowed learning inputs (metadata only — Phase 29). */
export const ALLOWED_LEARNING_SOURCES = [
  "approved_recommendation",
  "approved_automation",
  "approved_response",
  "skill_health_outcome",
  "recommendation_acceptance",
  "user_preference",
  "notification_engagement",
  "support_resolution",
] as const;

export type AllowedLearningSource = (typeof ALLOWED_LEARNING_SOURCES)[number];

/** Never stored in learning memory. */
export const FORBIDDEN_LEARNING_SOURCES = [
  "sensitive_personal_information",
  "raw_email_content",
  "private_conversations",
  "payment_information",
  "passwords",
  "authentication_secrets",
  "confidential_business_records",
] as const;
