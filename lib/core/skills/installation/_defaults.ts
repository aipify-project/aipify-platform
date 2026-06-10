import type { SkillDefinition } from "../types";

type InstallationSkillInput = Omit<
  SkillDefinition,
  "category" | "tenantScoped" | "tenantIsolation" | "requiresInstallation" | "core" | "minimumPlan"
> & {
  minimumPlan?: SkillDefinition["minimumPlan"];
};

export function installationSkill(input: InstallationSkillInput): SkillDefinition {
  return {
    minimumPlan: "starter",
    core: true,
    requiresInstallation: true,
    ...input,
    category: "installation",
    tenantScoped: true,
    tenantIsolation: "installation",
  };
}
