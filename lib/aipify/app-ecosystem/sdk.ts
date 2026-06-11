import type { AppManifest } from "./manifest";

export type SkillDefinition = {
  key: string;
  name: string;
  description?: string;
  permissions: string[];
  category?: "skill";
  risk_level?: "low" | "medium" | "high" | "restricted";
  deployment_modes?: string[];
};

export type AgentExtensionDefinition = {
  key: string;
  name: string;
  description?: string;
  permissions: string[];
  target_agent?: string;
  risk_level?: "low" | "medium" | "high" | "restricted";
  deployment_modes?: string[];
};

export type DashboardWidgetDefinition = {
  key: string;
  name: string;
  permissions: string[];
  category: "dashboard_module";
};

export type WorkflowPackDefinition = {
  key: string;
  name: string;
  permissions: string[];
  category: "workflow_pack";
  risk_level?: "high" | "restricted";
};

type ManifestInput =
  | (SkillDefinition & { category?: string })
  | AgentExtensionDefinition
  | DashboardWidgetDefinition
  | WorkflowPackDefinition;

function toManifest(def: ManifestInput): AppManifest {
  const category =
    "category" in def && def.category
      ? def.category
      : "target_agent" in def
        ? "agent_extension"
        : "skill";
  return {
    name: def.name,
    app_key: def.key,
    version: "1.0.0",
    author: "Developer",
    description: "description" in def ? def.description : undefined,
    category,
    permissions: def.permissions,
    deployment_modes: "deployment_modes" in def ? def.deployment_modes ?? ["cloud"] : ["cloud"],
    risk_level: "risk_level" in def && def.risk_level ? def.risk_level : "medium",
    minimum_aipify_version: "1.0.0",
  };
}

/** Register a Skill extension for the App Ecosystem. */
export function defineAipifySkill(def: SkillDefinition): AppManifest {
  return toManifest({ ...def, category: "skill" });
}

/** Register an Agent Extension for collaboration agents. */
export function defineAgentExtension(def: AgentExtensionDefinition): AppManifest {
  return toManifest(def);
}

/** Register a Dashboard Widget module. */
export function defineDashboardWidget(def: DashboardWidgetDefinition): AppManifest {
  return toManifest(def);
}

/** Register a Workflow Pack. */
export function defineWorkflowPack(def: WorkflowPackDefinition): AppManifest {
  return toManifest({ ...def, category: "workflow_pack", risk_level: def.risk_level ?? "high" });
}

/** Register a Knowledge Pack manifest. */
export function defineKnowledgePack(def: Omit<SkillDefinition, "category">): AppManifest {
  const m = toManifest({ ...def, category: "skill", risk_level: def.risk_level ?? "low" });
  return { ...m, category: "knowledge_pack" };
}

export const SDK_VERSION = "1.0.0";

export const SANDBOX_RESTRICTIONS = [
  "No unrestricted filesystem access",
  "No unrestricted database access",
  "No direct secret access",
  "No cross-tenant access",
  "No Governance bypass",
  "No Policy Engine bypass",
] as const;
