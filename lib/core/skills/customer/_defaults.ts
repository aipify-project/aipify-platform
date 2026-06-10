import type { SkillDefinition } from "../types";

type CustomerSkillInput = Omit<
  SkillDefinition,
  | "category"
  | "tenantScoped"
  | "tenantIsolation"
  | "core"
  | "enabledByDefault"
  | "requiresInstallation"
  | "minimumPlan"
> & {
  tenantIsolation?: SkillDefinition["tenantIsolation"];
  enabledByDefault?: SkillDefinition["enabledByDefault"];
  requiresInstallation?: SkillDefinition["requiresInstallation"];
  minimumPlan?: SkillDefinition["minimumPlan"];
};

export function customerSkill(input: CustomerSkillInput): SkillDefinition {
  return {
    enabledByDefault: true,
    requiresInstallation: false,
    minimumPlan: "starter",
    ...input,
    category: "customer",
    tenantScoped: true,
    tenantIsolation: input.tenantIsolation ?? "tenant",
    core: false,
  };
}
