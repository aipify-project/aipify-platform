export const KNOWLEDGE_SOURCES = [
  "approved_support_case",
  "customer_feedback",
  "faq_update",
  "product_release",
  "internal_documentation",
  "success_playbook",
  "growth_partner_insight",
] as const;

export type KnowledgeSource = (typeof KNOWLEDGE_SOURCES)[number];

export const GAP_TYPES = [
  "unanswered_question",
  "repeated_support",
  "missing_documentation",
  "outdated_article",
  "low_confidence_response",
] as const;

export type GapType = (typeof GAP_TYPES)[number];

export const SUGGESTION_TYPES = [
  "create_article",
  "expand_article",
  "update_screenshots",
  "improve_troubleshooting",
  "add_localization",
] as const;

export type SuggestionType = (typeof SUGGESTION_TYPES)[number];

export const WORKFLOW_STATUSES = [
  "draft",
  "review_required",
  "approved",
  "published",
  "archived",
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export const HEALTH_STATUSES = ["excellent", "healthy", "needs_review", "outdated"] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export const APPROVAL_ROLES = ["super_admin", "knowledge_admin", "product_owner"] as const;

export type ApprovalRole = (typeof APPROVAL_ROLES)[number];

import { CORE_LOCALES } from "@/lib/i18n/config";

export const LOCALES = CORE_LOCALES;

export type KnowledgeLocale = (typeof LOCALES)[number];

export const TRANSLATION_STATUSES = ["complete", "pending", "review_needed"] as const;

export type TranslationStatus = (typeof TRANSLATION_STATUSES)[number];

export const HEALTH_BADGES: Record<HealthStatus, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-green-50 text-green-800 ring-green-200",
  needs_review: "bg-amber-50 text-amber-900 ring-amber-200",
  outdated: "bg-red-50 text-red-800 ring-red-200",
};

export const WORKFLOW_BADGES: Record<WorkflowStatus, string> = {
  draft: "bg-gray-100 text-gray-800 ring-gray-200",
  review_required: "bg-sky-50 text-sky-800 ring-sky-200",
  approved: "bg-teal-50 text-teal-800 ring-teal-200",
  published: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};
