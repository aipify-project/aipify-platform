export type PlatformBusinessPackFactoryTab =
  | "overview"
  | "templates"
  | "industry_frameworks"
  | "pack_builder"
  | "dependencies"
  | "testing"
  | "certification"
  | "marketplace"
  | "reports"
  | "executive";

export type IndustryFramework = {
  framework_key: string;
  title: string;
  description?: string;
  industry_category?: string;
  reusable_engines?: unknown;
  default_modules?: unknown;
};

export type PackBlueprint = {
  id: string;
  pack_key: string;
  pack_name: string;
  industry_key?: string;
  blueprint_status?: string;
  modules?: unknown;
  dependencies?: unknown;
  reusable_engines?: unknown;
  version?: string;
};

export type CompanionSkill = {
  id: string;
  pack_key: string;
  skill_key: string;
  skill_name: string;
  industry_context?: string;
  description?: string;
  status?: string;
};

export type PlatformBusinessPackFactoryCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  overview?: Record<string, string | number | undefined>;
  industry_frameworks?: IndustryFramework[];
  templates?: PackBlueprint[];
  pack_blueprints?: PackBlueprint[];
  blueprint_system?: PackBlueprint[];
  pack_builder?: Record<string, unknown>;
  dependencies?: Record<string, unknown>[];
  companion_skills?: CompanionSkill[];
  knowledge_templates?: Record<string, unknown>[];
  workflow_templates?: Record<string, unknown>[];
  certification_engine?: Record<string, unknown>;
  localization_framework?: Record<string, unknown>;
  testing_center?: Record<string, unknown>;
  simulation_integration?: Record<string, unknown>;
  marketplace_publishing?: Record<string, unknown>;
  analytics?: Record<string, unknown>;
  companion_recommendations?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; pack_key?: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
};

export type PlatformBusinessPackFactoryLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  legacyLink: string;
  tabs: Record<PlatformBusinessPackFactoryTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  blueprintStatuses: Record<string, string>;
  builderPage: { title: string; subtitle: string };
  skillsPage: { title: string; subtitle: string };
  testingPage: { title: string; subtitle: string };
};
