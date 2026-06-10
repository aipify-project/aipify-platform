import type { PlanType } from "@/lib/platform/types";
import type { RiskLevel } from "../risk";

export const SKILL_CATEGORIES = [
  "operational",
  "customer",
  "executive",
  "installation",
  "companion",
  "future",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILL_STATES = [
  "active",
  "disabled",
  "beta",
  "internal_only",
  "deprecated",
  "planned",
] as const;

export type SkillState = (typeof SKILL_STATES)[number];

export const LEARNING_BEHAVIOURS = [
  "none",
  "operational_metadata",
  "approved_only",
] as const;

export type LearningBehaviour = (typeof LEARNING_BEHAVIOURS)[number];

export const SKILL_RELEASE_STAGES = [
  "aipify_internal",
  "unonight_pilot",
  "limited_rollout",
  "general_availability",
] as const;

export type SkillReleaseStage = (typeof SKILL_RELEASE_STAGES)[number];

/** Full skill definition per Skill Engine §8–10. */
export type SkillDefinition = {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  purpose: string;
  dataSources: string[];
  permissionsRequired: string[];
  approvalRequirements: string;
  riskClassification?: RiskLevel;
  learningBehaviour: LearningBehaviour;
  tenantIsolation: "global" | "tenant" | "installation";
  escalationRules: string[];
  rollbackSupport: boolean;
  ownerTeam: string;
  status: SkillState;
  enabledByDefault: boolean;
  requiresApproval: boolean;
  supportsLearning: boolean;
  requiresInstallation: boolean;
  minimumPlan: PlanType;
  core: boolean;
  tenantScoped: boolean;
  version: string;
  layers: Array<"platform" | "customer_app" | "embedded">;
  moduleKey?: string;
  releaseStage: SkillReleaseStage;
  actionCapable?: boolean;
};

export type SkillRegistrySummary = {
  total: number;
  byCategory: Record<SkillCategory, number>;
  byState: Record<SkillState, number>;
  coreCount: number;
};
