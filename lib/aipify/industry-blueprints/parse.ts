import type {
  BlueprintApplyResult,
  BlueprintCard,
  BlueprintDashboard,
  BlueprintInstall,
  BlueprintPrecheck,
  BlueprintRecommendation,
  IndustryBlueprint,
  TenantIndustryProfile,
} from "./types";

export function parseIndustryBlueprint(row: unknown): IndustryBlueprint {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    blueprint_key: String(s.blueprint_key ?? ""),
    slug: String(s.slug ?? ""),
    title: String(s.title ?? ""),
    short_description: s.short_description as string | null | undefined,
    long_description: s.long_description as string | null | undefined,
    industry_category: String(s.industry_category ?? ""),
    risk_level: String(s.risk_level ?? "low"),
    version: String(s.version ?? "1.0.0"),
    business_size_fit: Array.isArray(s.business_size_fit) ? (s.business_size_fit as string[]) : [],
    supported_deployment_modes: Array.isArray(s.supported_deployment_modes)
      ? (s.supported_deployment_modes as string[])
      : [],
    blueprint_manifest: (s.blueprint_manifest ?? s.manifest) as Record<string, unknown> | undefined,
  };
}

export function parseBlueprintRecommendation(row: unknown): BlueprintRecommendation {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    recommendation_type: String(s.recommendation_type ?? ""),
    title: String(s.title ?? ""),
    summary: s.summary as string | null | undefined,
    reason: s.reason as string | null | undefined,
    priority: Number(s.priority ?? 0),
    risk_level: String(s.risk_level ?? "low"),
    status: String(s.status ?? "pending"),
    target_ref: s.target_ref as string | null | undefined,
    metadata: s.metadata as Record<string, unknown> | undefined,
  };
}

export function parseTenantIndustryProfile(row: unknown): TenantIndustryProfile {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    tenant_id: String(s.tenant_id ?? ""),
    selected_blueprint_id: s.selected_blueprint_id as string | null | undefined,
    industry_category: s.industry_category as string | null | undefined,
    business_model: s.business_model as string | null | undefined,
    business_size: s.business_size as string | null | undefined,
    primary_goals: Array.isArray(s.primary_goals) ? (s.primary_goals as string[]) : [],
    auto_recommend_packs: Boolean(s.auto_recommend_packs ?? true),
    notify_new_packs: Boolean(s.notify_new_packs ?? true),
    discovery_answers: s.discovery_answers as Record<string, unknown> | undefined,
  };
}

export function parseBlueprintCard(data: unknown): BlueprintCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    completeness_score: d.completeness_score as number | undefined,
    has_blueprint: d.has_blueprint as boolean | undefined,
    blueprint_title: d.blueprint_title as string | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseBlueprintDashboard(data: unknown): BlueprintDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const completenessRaw = d.completeness as Record<string, unknown> | undefined;
  const recs = Array.isArray(d.pending_recommendations)
    ? (d.pending_recommendations as unknown[]).map(parseBlueprintRecommendation)
    : [];
  const applied = Array.isArray(d.applied_installs)
    ? (d.applied_installs as unknown[]).map((row) => {
        const r = (row ?? {}) as Record<string, unknown>;
        return {
          id: String(r.id ?? ""),
          status: String(r.status ?? ""),
          applied_at: r.applied_at as string | null | undefined,
          blueprint: r.blueprint ? parseIndustryBlueprint(r.blueprint) : undefined,
        };
      })
    : [];
  return {
    has_customer: Boolean(d.has_customer),
    profile: d.profile ? parseTenantIndustryProfile(d.profile) : undefined,
    completeness: completenessRaw
      ? {
          has_blueprint: Boolean(completenessRaw.has_blueprint),
          score: Number(completenessRaw.score ?? 0),
          total_recommendations: completenessRaw.total_recommendations as number | undefined,
          applied_count: completenessRaw.applied_count as number | undefined,
          pending_count: completenessRaw.pending_count as number | undefined,
          blueprint: completenessRaw.blueprint
            ? parseIndustryBlueprint(completenessRaw.blueprint)
            : undefined,
        }
      : undefined,
    pending_recommendations: recs,
    applied_installs: applied,
  };
}

export function parseIndustryBlueprints(data: unknown): IndustryBlueprint[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.blueprints)
    ? (d.blueprints as unknown[]).map(parseIndustryBlueprint)
    : [];
}

export function parseBlueprintPrecheck(data: unknown): BlueprintPrecheck {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    allowed: Boolean(d.allowed),
    reason: d.reason as string | undefined,
    requires_approval: d.requires_approval as boolean | undefined,
    blueprint: d.blueprint ? parseIndustryBlueprint(d.blueprint) : undefined,
    policy: d.policy as Record<string, unknown> | undefined,
    pending_recommendations: d.pending_recommendations as number | undefined,
  };
}

export function parseBlueprintDetail(data: unknown): {
  blueprint: IndustryBlueprint;
  versions: Record<string, unknown>[];
  precheck: BlueprintPrecheck;
} | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.blueprint || d.error) return null;
  return {
    blueprint: parseIndustryBlueprint(d.blueprint),
    versions: Array.isArray(d.versions) ? (d.versions as Record<string, unknown>[]) : [],
    precheck: parseBlueprintPrecheck(d.precheck),
  };
}

export function parseBlueprintRecommendations(data: unknown): BlueprintRecommendation[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.recommendations)
    ? (d.recommendations as unknown[]).map(parseBlueprintRecommendation)
    : [];
}

export function parseBlueprintInstalls(data: unknown): BlueprintInstall[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.installs)) return [];
  return (d.installs as unknown[]).map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      status: String(r.status ?? ""),
      applied_at: r.applied_at as string | null | undefined,
      install_summary: r.install_summary as string | null | undefined,
      installed_items: r.installed_items,
      blueprint: r.blueprint ? parseIndustryBlueprint(r.blueprint) : undefined,
    };
  });
}

export function parseBlueprintApplyResult(data: unknown): BlueprintApplyResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    status: String(d.status ?? ""),
    install_id: d.install_id as string | undefined,
    applied: d.applied as number | undefined,
    installed: Array.isArray(d.installed) ? d.installed : undefined,
    failed: Array.isArray(d.failed) ? d.failed : undefined,
    precheck: d.precheck ? parseBlueprintPrecheck(d.precheck) : undefined,
  };
}

export function parseTenantIndustryProfileResponse(data: unknown): {
  profile?: TenantIndustryProfile;
  blueprint?: IndustryBlueprint;
} {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    profile: d.profile ? parseTenantIndustryProfile(d.profile) : undefined,
    blueprint: d.blueprint ? parseIndustryBlueprint(d.blueprint) : undefined,
  };
}
