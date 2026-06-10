/**
 * Non-negotiable Aipify Core Foundation constants.
 * See CORE_FOUNDATION.md
 */

/** Capabilities every customer receives regardless of paid tier. */
export const AIPIFY_CORE_MODULES = [
  "executive_dashboard",
  "presence_center",
  "executive_briefing_basic",
  "support_ai_basic",
  "knowledge_base",
  "install_management",
  "recommendations",
  "health_monitoring",
] as const;

export type AipifyCoreModule = (typeof AIPIFY_CORE_MODULES)[number];

/** Action lifecycle per Core Foundation §11. */
export const ACTION_SEQUENCE = [
  "observe",
  "recommend",
  "prepare",
  "approve",
  "execute",
  "verify",
  "document",
  "learn",
] as const;

/** Approved learning sources per Core Foundation §7. */
export const APPROVED_LEARNING_SOURCES = [
  "operational_outcomes",
  "automation_performance",
  "support_categories",
  "installation_events",
  "system_reliability_trends",
] as const;

/** Prohibited learning sources per Core Foundation §7. */
export const PROHIBITED_LEARNING_SOURCES = [
  "customer_conversations",
  "uploaded_documents",
  "payment_details",
  "personal_communications",
  "private_files",
  "camera_access",
  "microphone_access",
] as const;

/** Modular capabilities beyond core — examples per Core Foundation §16. */
export const MODULAR_CAPABILITY_KEYS = [
  "action_center",
  "automations_basic",
  "self_healing",
  "advanced_insights",
  "support_ai_advanced",
  "teams",
  "executive_center",
  "commerce_ai",
  "moderation_ai",
  "marketing_ai",
  "analytics_ai",
  "dedicated_intelligence",
  "advanced_permissions",
  "custom_modules",
  "enterprise_privacy",
  "dedicated_support",
] as const;

/** Questions required before new capabilities (Core Foundation §18). */
export const CAPABILITY_VALIDATION_QUESTIONS = [
  "Does it align with Aipify's identity?",
  "Does it respect human control?",
  "Does it protect privacy?",
  "Which architectural layer does it belong to?",
  "Is it appropriate for Core or should it be modular?",
] as const;

export function isCoreModule(moduleKey: string): moduleKey is AipifyCoreModule {
  return (AIPIFY_CORE_MODULES as readonly string[]).includes(moduleKey);
}

export function mergeCoreModules(modules: string[]): string[] {
  return [...new Set([...AIPIFY_CORE_MODULES, ...modules])];
}
