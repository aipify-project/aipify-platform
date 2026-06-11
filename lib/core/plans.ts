import type { PlanType } from "@/lib/platform/types";
import { AIPIFY_CORE_MODULES, mergeCoreModules } from "./foundation";

export type ProductPackage = {
  plan: PlanType;
  domains: number | "custom";
  installations: number | "custom";
  users: number | "custom";
  modules: string[];
  description: string;
};

/** Tier-specific modules beyond the universal core package (CORE_FOUNDATION.md §15–16). */
const TIER_MODULES: Record<PlanType, string[]> = {
  starter: ["organizational_memory"],
  growth: ["action_center", "automations_basic"],
  business: [
    "action_center",
    "autonomous_execution",
    "adaptive_working_style",
    "business_pulse",
    "strategic_goal_engine",
    "friction_intelligence",
    "organizational_memory",
    "automations_basic",
    "self_healing",
    "advanced_insights",
    "support_ai_advanced",
    "teams",
    "executive_center",
  ],
  enterprise: [
    "action_center",
    "autonomous_execution",
    "adaptive_working_style",
    "business_pulse",
    "strategic_goal_engine",
    "friction_intelligence",
    "organizational_memory",
    "automations_basic",
    "self_healing",
    "advanced_insights",
    "support_ai_advanced",
    "teams",
    "executive_center",
    "dedicated_intelligence",
    "advanced_permissions",
    "custom_modules",
    "enterprise_privacy",
    "dedicated_support",
  ],
};

export const PRODUCT_PACKAGES: Record<PlanType, ProductPackage> = {
  starter: {
    plan: "starter",
    domains: 1,
    installations: 1,
    users: 1,
    modules: mergeCoreModules(TIER_MODULES.starter),
    description:
      "Aipify Core: executive dashboard, Presence Center, briefings, Support AI, knowledge base, installs, recommendations, health monitoring.",
  },
  growth: {
    plan: "growth",
    domains: 3,
    installations: 3,
    users: 5,
    modules: mergeCoreModules(TIER_MODULES.growth),
    description: "Core package plus Action Center and basic automations.",
  },
  business: {
    plan: "business",
    domains: 10,
    installations: 10,
    users: 25,
    modules: mergeCoreModules(TIER_MODULES.business),
    description:
      "Core package plus self-healing, advanced insights, teams, and Executive Center.",
  },
  enterprise: {
    plan: "enterprise",
    domains: "custom",
    installations: "custom",
    users: "custom",
    modules: mergeCoreModules(TIER_MODULES.enterprise),
    description:
      "Core package plus dedicated intelligence, custom modules, enterprise privacy, and dedicated support.",
  },
};

export function planIncludesModule(plan: PlanType, moduleKey: string): boolean {
  if ((AIPIFY_CORE_MODULES as readonly string[]).includes(moduleKey)) {
    return true;
  }
  return PRODUCT_PACKAGES[plan].modules.includes(moduleKey);
}

export function getPlanLimit(
  plan: PlanType,
  resource: "domains" | "installations" | "users"
): number | "custom" {
  return PRODUCT_PACKAGES[plan][resource];
}
