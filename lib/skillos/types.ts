/** Phase 22 — Skill Operating System types. */

export const SKILLOS_PLATFORM_ROUTE = "/platform/skills";
export const SKILLOS_CUSTOMER_ROUTE = "/app/skills";
export const SKILLOS_HEALTH_API = "/api/install/skill-health";

export const SKILLOS_CATEGORIES = [
  "Operational",
  "Support",
  "Executive",
  "Commerce",
  "Marketing",
  "Moderation",
  "Communication",
  "Analytics",
  "Companion",
  "Custom",
] as const;

export type SkillOSCategory = (typeof SKILLOS_CATEGORIES)[number];

export const SKILL_DEFINITION_STATUSES = [
  "planned",
  "beta",
  "active",
  "deprecated",
  "retired",
] as const;

export type SkillDefinitionStatus = (typeof SKILL_DEFINITION_STATUSES)[number];

export const TENANT_SKILL_STATUSES = [
  "installed",
  "active",
  "paused",
  "warning",
  "failed",
  "disabled",
] as const;

export type TenantSkillStatus = (typeof TENANT_SKILL_STATUSES)[number];

export const SKILL_LEARNING_MODES = ["disabled", "assisted", "adaptive"] as const;

export type SkillLearningMode = (typeof SKILL_LEARNING_MODES)[number];

export const SKILL_HEALTH_STATUSES = ["healthy", "warning", "failed", "paused"] as const;

export type SkillHealthStatus = (typeof SKILL_HEALTH_STATUSES)[number];

export const SKILL_RELEASE_TYPES = ["patch", "minor", "major", "security"] as const;

export const SKILL_LIFECYCLE_STAGES = [
  "installed",
  "configured",
  "awaiting_approval",
  "active",
  "learning",
  "updated",
  "paused",
  "disabled",
  "archived",
] as const;

export const SKILL_RELEASE_PIPELINE = [
  "aipify_internal",
  "unonight_pilot",
  "beta_customers",
  "stable_release",
] as const;

export const DEFAULT_LEARNING_MODE: SkillLearningMode = "assisted";

export const MINIMUM_SUCCESS_SCORE = 0;
export const MAXIMUM_SUCCESS_SCORE = 100;

export type PlatformSkillOSDashboard = {
  skill_count: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  version_count: number;
  tenant_install_count: number;
  release_pipeline: string[];
  principle?: string;
};

export type CustomerSkillWorkspace = {
  tenant_id: string;
  plan: string;
  installed_skills: Array<{
    tenant_skill_id: string;
    key: string;
    name: string;
    category: string;
    version: string;
    status: string;
    learning_mode: string;
    health_score: number;
    health_status: string;
    success_score: number;
  }>;
  available_skills: Array<{
    key: string;
    name: string;
    category: string;
    minimum_plan: string;
    status: string;
    requires_approval: boolean;
  }>;
  learning_default: string;
  principle?: string;
};
