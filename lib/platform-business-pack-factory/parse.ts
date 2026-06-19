import type {
  CompanionSkill,
  IndustryFramework,
  PackBlueprint,
  PlatformBusinessPackFactoryCenter,
} from "./types";

function parseFramework(row: Record<string, unknown>): IndustryFramework {
  return {
    framework_key: String(row.framework_key ?? ""),
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : undefined,
    industry_category: row.industry_category ? String(row.industry_category) : undefined,
    reusable_engines: row.reusable_engines,
    default_modules: row.default_modules,
  };
}

function parseBlueprint(row: Record<string, unknown>): PackBlueprint {
  return {
    id: String(row.id ?? row.pack_key ?? ""),
    pack_key: String(row.pack_key ?? ""),
    pack_name: String(row.pack_name ?? ""),
    industry_key: row.industry_key ? String(row.industry_key) : undefined,
    blueprint_status: row.blueprint_status ? String(row.blueprint_status) : undefined,
    modules: row.modules,
    dependencies: row.dependencies,
    reusable_engines: row.reusable_engines,
    version: row.version ? String(row.version) : undefined,
  };
}

function parseSkill(row: Record<string, unknown>): CompanionSkill {
  return {
    id: String(row.id ?? ""),
    pack_key: String(row.pack_key ?? ""),
    skill_key: String(row.skill_key ?? ""),
    skill_name: String(row.skill_name ?? ""),
    industry_context: row.industry_context ? String(row.industry_context) : undefined,
    description: row.description ? String(row.description) : undefined,
    status: row.status ? String(row.status) : undefined,
  };
}

export function parsePlatformBusinessPackFactoryCenter(
  row: Record<string, unknown> | null
): PlatformBusinessPackFactoryCenter | null {
  if (!row || typeof row !== "object") return null;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    industry_frameworks: Array.isArray(row.industry_frameworks)
      ? row.industry_frameworks.map((r) => parseFramework(r as Record<string, unknown>))
      : undefined,
    templates: Array.isArray(row.templates)
      ? row.templates.map((r) => parseBlueprint(r as Record<string, unknown>))
      : undefined,
    pack_blueprints: Array.isArray(row.pack_blueprints)
      ? row.pack_blueprints.map((r) => parseBlueprint(r as Record<string, unknown>))
      : undefined,
    blueprint_system: Array.isArray(row.blueprint_system)
      ? row.blueprint_system.map((r) => parseBlueprint(r as Record<string, unknown>))
      : undefined,
    pack_builder: row.pack_builder as Record<string, unknown> | undefined,
    dependencies: Array.isArray(row.dependencies) ? row.dependencies : undefined,
    companion_skills: Array.isArray(row.companion_skills)
      ? row.companion_skills.map((r) => parseSkill(r as Record<string, unknown>))
      : undefined,
    knowledge_templates: Array.isArray(row.knowledge_templates) ? row.knowledge_templates : undefined,
    workflow_templates: Array.isArray(row.workflow_templates) ? row.workflow_templates : undefined,
    certification_engine: row.certification_engine as Record<string, unknown> | undefined,
    localization_framework: row.localization_framework as Record<string, unknown> | undefined,
    testing_center: row.testing_center as Record<string, unknown> | undefined,
    simulation_integration: row.simulation_integration as Record<string, unknown> | undefined,
    marketplace_publishing: row.marketplace_publishing as Record<string, unknown> | undefined,
    analytics: row.analytics as Record<string, unknown> | undefined,
    companion_recommendations: row.companion_recommendations as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            event_type: String(e.event_type ?? ""),
            summary: String(e.summary ?? ""),
            pack_key: e.pack_key ? String(e.pack_key) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
  };
}
