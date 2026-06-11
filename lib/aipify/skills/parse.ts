import type {
  SkillCatalogItem,
  SkillDetail,
  SkillInstallEvent,
  SkillInstallResult,
  SkillStoreCard,
} from "./types";

export function parseSkillStoreCard(data: unknown): SkillStoreCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    installed_count: d.installed_count as number | undefined,
    available_count: d.available_count as number | undefined,
    pending_approvals: d.pending_approvals as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseSkillCatalog(data: unknown): SkillCatalogItem[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const s = row as Record<string, unknown>;
    return {
      id: String(s.id),
      key: String(s.key ?? ""),
      slug: String(s.slug ?? s.key ?? ""),
      name: String(s.name ?? ""),
      description: String(s.description ?? ""),
      category: String(s.category ?? ""),
      version: String(s.version ?? "1.0.0"),
      author: String(s.author ?? "Aipify"),
      risk_level: String(s.risk_level ?? "low"),
      minimum_plan: String(s.minimum_plan ?? "starter"),
      requires_approval: Boolean(s.requires_approval),
      requires_installation: Boolean(s.requires_installation),
      status: String(s.status ?? "active"),
      installed: Boolean(s.installed),
      plan_allowed: Boolean(s.plan_allowed ?? true),
    };
  });
}

export function parseSkillDetail(data: unknown): SkillDetail {
  const d = (data ?? {}) as Record<string, unknown>;
  const depCheck = (d.dependency_check ?? {}) as Record<string, unknown>;
  return {
    id: String(d.id ?? ""),
    key: String(d.key ?? ""),
    slug: String(d.slug ?? d.key ?? ""),
    name: String(d.name ?? ""),
    description: String(d.description ?? ""),
    category: String(d.category ?? ""),
    version: String(d.version ?? "1.0.0"),
    author: String(d.author ?? "Aipify"),
    risk_level: String(d.risk_level ?? "low"),
    minimum_plan: String(d.minimum_plan ?? "starter"),
    requires_approval: Boolean(d.requires_approval),
    requires_installation: Boolean(d.requires_installation),
    status: String(d.status ?? "active"),
    installed: Boolean(d.installed),
    plan_allowed: Boolean(d.plan_allowed ?? true),
    required_permissions: Array.isArray(d.required_permissions)
      ? (d.required_permissions as string[])
      : [],
    required_integrations: Array.isArray(d.required_integrations)
      ? (d.required_integrations as string[])
      : [],
    documentation_links: Array.isArray(d.documentation_links)
      ? (d.documentation_links as string[])
      : [],
    knowledge_center_category: d.knowledge_center_category as string | null | undefined,
    module_key: d.module_key as string | null | undefined,
    deployment_support: Array.isArray(d.deployment_support)
      ? (d.deployment_support as string[])
      : ["cloud_saas"],
    requires_agent: Boolean(d.requires_agent),
    data_residency_behavior: String(d.data_residency_behavior ?? "cloud"),
    dependencies: Array.isArray(d.dependencies)
      ? (d.dependencies as SkillDetail["dependencies"])
      : [],
    dependency_check: {
      satisfied: Boolean(depCheck.satisfied),
      missing: Array.isArray(depCheck.missing)
        ? (depCheck.missing as SkillDetail["dependencies"])
        : [],
    },
    tenant_skill_id: d.tenant_skill_id as string | null | undefined,
    tenant_status: d.tenant_status as string | null | undefined,
    permissions: Array.isArray(d.permissions)
      ? (d.permissions as SkillDetail["permissions"])
      : [],
  };
}

export function parseSkillInstallHistory(data: unknown): SkillInstallEvent[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const e = row as Record<string, unknown>;
    return {
      id: String(e.id),
      event_type: String(e.event_type ?? ""),
      skill_key: String(e.skill_key ?? ""),
      skill_name: String(e.skill_name ?? ""),
      metadata: (e.metadata as Record<string, unknown>) ?? {},
      created_at: String(e.created_at ?? ""),
    };
  });
}

export function parseSkillInstallResult(data: unknown): SkillInstallResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    status: String(d.status ?? ""),
    tenant_skill_id: d.tenant_skill_id as string | undefined,
    skill_key: d.skill_key as string | undefined,
  };
}
