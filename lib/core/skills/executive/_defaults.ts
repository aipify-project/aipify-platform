import type { SkillDefinition } from "../types";

type ExecutiveSkillInput = Omit<
  SkillDefinition,
  | "category"
  | "tenantScoped"
  | "tenantIsolation"
  | "core"
  | "requiresInstallation"
> & {
  requiresInstallation?: SkillDefinition["requiresInstallation"];
};

export function executiveSkill(input: ExecutiveSkillInput): SkillDefinition {
  return {
    requiresInstallation: false,
    ...input,
    category: "executive",
    tenantScoped: true,
    tenantIsolation: "tenant",
    core: false,
  };
}
