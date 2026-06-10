import type { PlanType } from "@/lib/platform/types";
import type { SkillReleaseStage } from "./types";

/** Skill governance questions per Skill Engine §17. */
export const SKILL_GOVERNANCE_QUESTIONS = [
  "Does this align with Aipify Identity?",
  "Does this support Aipify's Mission?",
  "Does this respect privacy?",
  "Does this respect human control?",
  "Is this Core or Modular?",
  "Does it belong to the correct architectural layer?",
] as const;

/** Internal validation pipeline per Skill Engine §13. */
export const SKILL_RELEASE_PIPELINE: SkillReleaseStage[] = [
  "aipify_internal",
  "unonight_pilot",
  "limited_rollout",
  "general_availability",
];

const PLAN_ORDER: Record<PlanType, number> = {
  starter: 0,
  growth: 1,
  business: 2,
  enterprise: 3,
};

export function planMeetsSkillMinimum(
  tenantPlan: PlanType,
  minimumPlan: PlanType
): boolean {
  return PLAN_ORDER[tenantPlan] >= PLAN_ORDER[minimumPlan];
}

/** Plan skill tiers per Skill Engine §12. */
export const SKILL_PLAN_TIERS: Record<
  PlanType,
  { label: string; includes: string }
> = {
  starter: {
    label: "Starter",
    includes: "Core Operational Skills",
  },
  growth: {
    label: "Growth",
    includes: "Starter + expanded recommendations",
  },
  business: {
    label: "Business",
    includes: "Growth + Self-Healing + Advanced Executive Skills",
  },
  enterprise: {
    label: "Enterprise",
    includes: "Business + Custom Skills + Dedicated Intelligence",
  },
};
