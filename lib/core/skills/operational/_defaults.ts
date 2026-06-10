import type { SkillDefinition } from "../types";

type OperationalSkillInput = Omit<
  SkillDefinition,
  "category" | "tenantScoped" | "tenantIsolation" | "core" | "minimumPlan"
> & {
  minimumPlan?: SkillDefinition["minimumPlan"];
  tenantIsolation?: SkillDefinition["tenantIsolation"];
};

export function operationalSkill(input: OperationalSkillInput): SkillDefinition {
  return {
    minimumPlan: "starter",
    core: true,
    ...input,
    category: "operational",
    tenantScoped: true,
    tenantIsolation: input.tenantIsolation ?? "tenant",
  };
}
