import type { PlanType } from "@/lib/platform/types";
import { planMeetsSkillMinimum } from "./governance";
import { companionSkill } from "./companion/companion";
import { CUSTOMER_SKILLS } from "./customer";
import { EXECUTIVE_SKILLS } from "./executive";
import { FUTURE_SKILLS } from "./future";
import { INSTALLATION_SKILLS } from "./installation";
import { OPERATIONAL_SKILLS } from "./operational";
import type {
  SkillCategory,
  SkillDefinition,
  SkillRegistrySummary,
  SkillState,
} from "./types";
import { SKILL_CATEGORIES, SKILL_STATES } from "./types";

/** Central Skill Registry — every capability must be registered here. */
export const SKILL_REGISTRY: SkillDefinition[] = [
  ...OPERATIONAL_SKILLS,
  ...CUSTOMER_SKILLS,
  ...EXECUTIVE_SKILLS,
  ...INSTALLATION_SKILLS,
  companionSkill,
  ...FUTURE_SKILLS,
];

export function getSkillById(id: string): SkillDefinition | undefined {
  return SKILL_REGISTRY.find((skill) => skill.id === id);
}

export function getSkillsByCategory(category: SkillCategory): SkillDefinition[] {
  return SKILL_REGISTRY.filter((skill) => skill.category === category);
}

export function getSkillsByState(state: SkillState): SkillDefinition[] {
  return SKILL_REGISTRY.filter((skill) => skill.status === state);
}

export function getSkillsForPlan(plan: PlanType): SkillDefinition[] {
  return SKILL_REGISTRY.filter((skill) =>
    planMeetsSkillMinimum(plan, skill.minimumPlan)
  );
}

export function isSkillAvailableForPlan(
  skillId: string,
  plan: PlanType
): boolean {
  const skill = getSkillById(skillId);
  if (!skill) return false;
  if (skill.status === "disabled" || skill.status === "deprecated") {
    return false;
  }
  return planMeetsSkillMinimum(plan, skill.minimumPlan);
}

export function getCoreSkills(): SkillDefinition[] {
  return SKILL_REGISTRY.filter((skill) => skill.core);
}

export function getActionCapableSkills(): SkillDefinition[] {
  return SKILL_REGISTRY.filter((skill) => skill.actionCapable);
}

/** Marketplace-prep: skills a tenant could enable/disable (no UI yet). */
export function getTenantSkillCatalog(plan: PlanType): SkillDefinition[] {
  return getSkillsForPlan(plan).filter(
    (skill) =>
      skill.status !== "planned" &&
      skill.status !== "internal_only" &&
      skill.category !== "future"
  );
}

export type TenantSkillInstallState = {
  skillId: string;
  installed: boolean;
  enabled: boolean;
};

/** Default install/enable state for marketplace architecture (§16). */
export function getDefaultTenantSkillStates(
  plan: PlanType
): TenantSkillInstallState[] {
  return getTenantSkillCatalog(plan).map((skill) => ({
    skillId: skill.id,
    installed: skill.enabledByDefault && skill.core,
    enabled: skill.enabledByDefault && skill.status === "active",
  }));
}

export function getSkillRegistrySummary(): SkillRegistrySummary {
  const byCategory = Object.fromEntries(
    SKILL_CATEGORIES.map((category) => [
      category,
      getSkillsByCategory(category).length,
    ])
  ) as Record<SkillCategory, number>;

  const byState = Object.fromEntries(
    SKILL_STATES.map((state) => [state, getSkillsByState(state).length])
  ) as Record<SkillState, number>;

  return {
    total: SKILL_REGISTRY.length,
    byCategory,
    byState,
    coreCount: getCoreSkills().length,
  };
}
