import type {
  SkillsMarketplaceActivationMethod,
  SkillsMarketplaceCatalogItem,
  SkillsMarketplaceCategory,
  SkillsMarketplaceDisplayStatus,
  SkillsMarketplaceExperience,
  SkillsMarketplaceGovernanceItem,
  SkillsMarketplaceInstalledSkill,
  SkillsMarketplaceOverview,
  SkillsMarketplacePerformanceItem,
  SkillsMarketplacePipelineStage,
  SkillsMarketplaceRecommendation,
  SkillsMarketplaceReleaseStage,
  SkillsMarketplaceScope,
} from "./types";

const DISPLAY_STATUSES = new Set<SkillsMarketplaceDisplayStatus>([
  "operational",
  "pilot",
  "beta",
  "paused",
  "requires_attention",
]);

const RELEASE_STAGES = new Set<SkillsMarketplaceReleaseStage>([
  "internal_development",
  "customer_zero",
  "pilot_customers",
  "growth_partners",
  "stable_release",
]);

const ACTIVATION_METHODS = new Set<SkillsMarketplaceActivationMethod>([
  "activate",
  "request_access",
  "coming_soon",
  "active",
]);

const CATEGORIES = new Set<SkillsMarketplaceCategory>([
  "executive",
  "support",
  "commerce",
  "operations",
  "knowledge",
  "growth",
  "compliance",
  "automation",
  "companion",
]);

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseDisplayStatus(value: unknown): SkillsMarketplaceDisplayStatus {
  const status = asString(value, "operational");
  return DISPLAY_STATUSES.has(status as SkillsMarketplaceDisplayStatus)
    ? (status as SkillsMarketplaceDisplayStatus)
    : "operational";
}

function parseReleaseStage(value: unknown): SkillsMarketplaceReleaseStage {
  const stage = asString(value, "internal_development");
  return RELEASE_STAGES.has(stage as SkillsMarketplaceReleaseStage)
    ? (stage as SkillsMarketplaceReleaseStage)
    : "internal_development";
}

function parseActivation(value: unknown): SkillsMarketplaceActivationMethod {
  const method = asString(value, "activate");
  return ACTIVATION_METHODS.has(method as SkillsMarketplaceActivationMethod)
    ? (method as SkillsMarketplaceActivationMethod)
    : "activate";
}

function parseCategory(value: unknown): SkillsMarketplaceCategory {
  const category = asString(value, "operations");
  return CATEGORIES.has(category as SkillsMarketplaceCategory)
    ? (category as SkillsMarketplaceCategory)
    : "operations";
}

function parseOverview(raw: unknown): SkillsMarketplaceOverview {
  const data = (raw ?? {}) as Record<string, unknown>;
  return {
    installed_count: asNumber(data.installed_count),
    available_count: asNumber(data.available_count),
    pilot_count: asNumber(data.pilot_count),
    pending_reviews: asNumber(data.pending_reviews),
  };
}

function parseInstalled(raw: unknown): SkillsMarketplaceInstalledSkill[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      tenant_skill_id: row.tenant_skill_id != null ? asString(row.tenant_skill_id) : undefined,
      key: asString(row.key),
      name: asString(row.name),
      description: asString(row.description),
      display_status: parseDisplayStatus(row.display_status),
      version: asString(row.version, "1.0.0"),
      environment: asString(row.environment, "production"),
      owner: asString(row.owner, "Aipify"),
      category: parseCategory(row.category),
      release_stage: parseReleaseStage(row.release_stage),
      success_rate: row.success_rate != null ? asNumber(row.success_rate) : undefined,
      health_score: row.health_score != null ? asNumber(row.health_score) : undefined,
      install_count: row.install_count != null ? asNumber(row.install_count) : undefined,
    };
  });
}

function parseRecommended(raw: unknown): SkillsMarketplaceRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      key: asString(row.key),
      name: asString(row.name),
      description: asString(row.description),
      category: parseCategory(row.category),
      reason_key: asString(row.reason_key, "operations_efficiency"),
      impact_key: asString(row.impact_key, "operations_impact"),
      activation_method: parseActivation(row.activation_method),
      plan_allowed: row.plan_allowed === true,
    };
  });
}

function parseMarketplace(raw: unknown): SkillsMarketplaceCatalogItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      key: asString(row.key),
      name: asString(row.name),
      description: asString(row.description),
      category: parseCategory(row.category),
      operational_status: asString(row.operational_status, "active"),
      estimated_value_key: asString(row.estimated_value_key, "operations_impact"),
      activation_method: parseActivation(row.activation_method),
      release_stage: parseReleaseStage(row.release_stage),
      minimum_plan: asString(row.minimum_plan, "starter"),
      requires_approval: row.requires_approval === true,
      installed: row.installed === true,
      plan_allowed: row.plan_allowed !== false,
    };
  });
}

function parsePipeline(raw: unknown): SkillsMarketplacePipelineStage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        key: parseReleaseStage(row.key),
        order: asNumber(row.order),
      };
    })
    .sort((a, b) => a.order - b.order);
}

function parseGovernance(raw: unknown): SkillsMarketplaceGovernanceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      key: asString(row.key),
      name: asString(row.name),
      tenant_skill_id: row.tenant_skill_id != null ? asString(row.tenant_skill_id) : undefined,
      permission_scope: asString(row.permission_scope, "[]"),
      risk_level: asString(row.risk_level, "low"),
      owner: asString(row.owner, "Aipify"),
      requires_approval: row.requires_approval === true,
      last_review_at: row.last_review_at != null ? asString(row.last_review_at) : undefined,
      status: asString(row.status, "under_review"),
      unapproved_permissions:
        row.unapproved_permissions != null ? asNumber(row.unapproved_permissions) : undefined,
    };
  });
}

function parsePerformance(raw: unknown): SkillsMarketplacePerformanceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      key: asString(row.key),
      name: asString(row.name),
      tenant_skill_id: row.tenant_skill_id != null ? asString(row.tenant_skill_id) : undefined,
      success_rate: asNumber(row.success_rate),
      usage_frequency: asNumber(row.usage_frequency),
      business_impact_key: asString(row.business_impact_key, "operations_impact"),
      avg_execution_ms: asNumber(row.avg_execution_ms),
      satisfaction_score: asNumber(row.satisfaction_score),
    };
  });
}

export function parseSkillsMarketplaceExperience(data: unknown): SkillsMarketplaceExperience | null {
  if (!data || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const scope = asString(raw.scope, "customer") as SkillsMarketplaceScope;

  return {
    scope: scope === "platform" ? "platform" : "customer",
    tenant_id: raw.tenant_id != null ? asString(raw.tenant_id) : undefined,
    plan: raw.plan != null ? asString(raw.plan) : undefined,
    overview: parseOverview(raw.overview),
    installed_skills: parseInstalled(raw.installed_skills),
    recommended_skills: parseRecommended(raw.recommended_skills),
    marketplace: parseMarketplace(raw.marketplace),
    pipeline: parsePipeline(raw.pipeline),
    governance: parseGovernance(raw.governance),
    performance: parsePerformance(raw.performance),
    principle: raw.principle != null ? asString(raw.principle) : undefined,
  };
}
