import type { PlanType } from "@/lib/platform/types";

export type ProductPackage = {
  plan: PlanType;
  domains: number | "custom";
  installations: number | "custom";
  users: number | "custom";
  modules: string[];
  description: string;
};

export const PRODUCT_PACKAGES: Record<PlanType, ProductPackage> = {
  starter: {
    plan: "starter",
    domains: 1,
    installations: 1,
    users: 1,
    modules: [
      "presence_center",
      "executive_briefing_basic",
      "support_ai_basic",
      "knowledge_base",
    ],
    description: "Presence Center, basic executive briefing, basic Support AI, knowledge base.",
  },
  growth: {
    plan: "growth",
    domains: 3,
    installations: 3,
    users: 5,
    modules: [
      "presence_center",
      "executive_briefing_basic",
      "support_ai_basic",
      "knowledge_base",
      "action_center",
      "health_monitoring",
      "recommendations",
      "automations_basic",
    ],
    description: "Starter features plus Action Center, health monitoring, recommendations, basic automations.",
  },
  business: {
    plan: "business",
    domains: 10,
    installations: 10,
    users: 25,
    modules: [
      "presence_center",
      "executive_briefing_basic",
      "support_ai_basic",
      "knowledge_base",
      "action_center",
      "health_monitoring",
      "recommendations",
      "automations_basic",
      "self_healing",
      "advanced_insights",
      "support_ai_advanced",
      "teams",
      "executive_center",
    ],
    description: "Growth features plus self-healing, advanced insights, teams, Executive Center.",
  },
  enterprise: {
    plan: "enterprise",
    domains: "custom",
    installations: "custom",
    users: "custom",
    modules: [
      "presence_center",
      "executive_briefing_basic",
      "support_ai_basic",
      "knowledge_base",
      "action_center",
      "health_monitoring",
      "recommendations",
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
    description: "Business features plus dedicated intelligence, custom modules, enterprise privacy, dedicated support.",
  },
};

export function planIncludesModule(plan: PlanType, moduleKey: string): boolean {
  return PRODUCT_PACKAGES[plan].modules.includes(moduleKey);
}

export function getPlanLimit(
  plan: PlanType,
  resource: "domains" | "installations" | "users"
): number | "custom" {
  return PRODUCT_PACKAGES[plan][resource];
}
