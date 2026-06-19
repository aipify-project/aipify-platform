import type { CompanionSkillsCenter } from "./types";

export function parseCompanionSkillsCenter(data: unknown): CompanionSkillsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    principle: row.principle as string | undefined,
    governance_note: row.governance_note as string | undefined,
    section: row.section as string | undefined,
    organization: row.organization as CompanionSkillsCenter["organization"],
    overview: row.overview as CompanionSkillsCenter["overview"],
    skill_registry: row.skill_registry as CompanionSkillsCenter["skill_registry"],
    skill_marketplace: row.skill_marketplace as CompanionSkillsCenter["skill_marketplace"],
    specialist_framework: row.specialist_framework as CompanionSkillsCenter["specialist_framework"],
    knowledge_source_governance: row.knowledge_source_governance as CompanionSkillsCenter["knowledge_source_governance"],
    skill_permissions: row.skill_permissions as Record<string, unknown> | undefined,
    training_engine: row.training_engine as CompanionSkillsCenter["training_engine"],
    capability_profiles: row.capability_profiles as CompanionSkillsCenter["capability_profiles"],
    capability_bundles: row.capability_bundles as CompanionSkillsCenter["capability_bundles"],
    business_pack_integration: row.business_pack_integration as CompanionSkillsCenter["business_pack_integration"],
    skill_health_monitoring: row.skill_health_monitoring as CompanionSkillsCenter["skill_health_monitoring"],
    installation_workflow: row.installation_workflow as Record<string, unknown> | undefined,
    companion_skill_advisor: row.companion_skill_advisor as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: row.audit_recent as CompanionSkillsCenter["audit_recent"],
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error as string | undefined,
  };
}
