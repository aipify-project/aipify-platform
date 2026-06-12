import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ImplementationBlueprintMeta,
  IntegrationLink,
  MarketplaceCard,
  MarketplaceDashboard,
  MarketplaceEngagementSummary,
  MarketplaceInstall,
  MarketplaceInstallResult,
  MarketplaceItem,
  MarketplaceItemDetail,
  MarketplacePrecheck,
  SkillsExtensionsMarketplaceBlueprint,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
}

function parseEngagementSummary(data: unknown): MarketplaceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MarketplaceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): SkillsExtensionsMarketplaceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SkillsExtensionsMarketplaceBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseMarketplaceItem(row: unknown): MarketplaceItem {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    item_key: String(s.item_key ?? ""),
    slug: String(s.slug ?? ""),
    title: String(s.title ?? ""),
    short_description: s.short_description as string | null | undefined,
    long_description: s.long_description as string | null | undefined,
    item_type: String(s.item_type ?? ""),
    category: String(s.category ?? ""),
    industry: s.industry as string | null | undefined,
    author_type: String(s.author_type ?? "aipify"),
    author_name: s.author_name as string | null | undefined,
    risk_level: String(s.risk_level ?? "low"),
    pricing_model: String(s.pricing_model ?? "free"),
    price: s.price as number | null | undefined,
    currency: String(s.currency ?? "USD"),
    trial_available: Boolean(s.trial_available),
    deployment_support: Array.isArray(s.deployment_support) ? (s.deployment_support as string[]) : [],
    requires_agent: Boolean(s.requires_agent),
    rating: Number(s.rating ?? 0),
    install_count: Number(s.install_count ?? 0),
    installed: s.installed as boolean | undefined,
    install_id: s.install_id as string | null | undefined,
  };
}

export function parseMarketplaceCard(data: unknown): MarketplaceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    catalog_count: d.catalog_count as number | undefined,
    installed_count: d.installed_count as number | undefined,
    updates_available: d.updates_available as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
    implementation_blueprint_phase112: parseBlueprintMeta(d.implementation_blueprint_phase112),
    marketplace_mission: typeof d.marketplace_mission === "string" ? d.marketplace_mission : undefined,
    marketplace_abos_principle:
      typeof d.marketplace_abos_principle === "string" ? d.marketplace_abos_principle : undefined,
    marketplace_engagement_summary: parseEngagementSummary(d.marketplace_engagement_summary),
    marketplace_note: typeof d.marketplace_note === "string" ? d.marketplace_note : undefined,
    marketplace_vision_note:
      typeof d.marketplace_vision_note === "string" ? d.marketplace_vision_note : undefined,
  };
}

export function parseMarketplaceDashboard(data: unknown): MarketplaceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = (key: string) =>
    Array.isArray(d[key]) ? (d[key] as unknown[]).map(parseMarketplaceItem) : [];
  const installed = Array.isArray(d.installed)
    ? (d.installed as unknown[]).map((row) => {
        const r = (row ?? {}) as Record<string, unknown>;
        return {
          install_id: String(r.install_id ?? ""),
          status: String(r.status ?? ""),
          installed_at: r.installed_at as string | undefined,
          item: parseMarketplaceItem(r.item),
        };
      })
    : [];
  const recommended = Array.isArray(d.recommended)
    ? (d.recommended as unknown[]).map(parseMarketplaceItem)
    : [];
  return {
    has_customer: Boolean(d.has_customer),
    catalog_count: d.catalog_count as number | undefined,
    featured: list("featured"),
    installed,
    recommended,
    implementation_blueprint_phase112: parseBlueprintMeta(d.implementation_blueprint_phase112),
    marketplace_engine_note:
      typeof d.marketplace_engine_note === "string" ? d.marketplace_engine_note : undefined,
    skills_extensions_marketplace_blueprint: parseBlueprintBlock(d.skills_extensions_marketplace_blueprint),
    marketplace_distinction_note:
      typeof d.marketplace_distinction_note === "string" ? d.marketplace_distinction_note : undefined,
    marketplace_mission: typeof d.marketplace_mission === "string" ? d.marketplace_mission : undefined,
    marketplace_philosophy:
      typeof d.marketplace_philosophy === "string" ? d.marketplace_philosophy : undefined,
    marketplace_abos_principle:
      typeof d.marketplace_abos_principle === "string" ? d.marketplace_abos_principle : undefined,
    marketplace_objectives: parseObjectives(d.marketplace_objectives),
    skills_marketplace_concept: parseRecord(d.skills_marketplace_concept),
    skill_categories: d.skill_categories as MarketplaceDashboard["skill_categories"],
    extensions_marketplace: parseRecord(d.extensions_marketplace),
    companion_adaptation: d.companion_adaptation as MarketplaceDashboard["companion_adaptation"],
    skill_quality_assurance: parseRecord(d.skill_quality_assurance),
    growth_partner_marketplace: parseRecord(d.growth_partner_marketplace),
    developer_ecosystem: parseRecord(d.developer_ecosystem),
    installation_experience: d.installation_experience as MarketplaceDashboard["installation_experience"],
    marketplace_self_love_connection:
      d.marketplace_self_love_connection as MarketplaceDashboard["marketplace_self_love_connection"],
    marketplace_leadership_connection: parseRecord(d.marketplace_leadership_connection),
    marketplace_trust_connection: parseRecord(d.marketplace_trust_connection),
    marketplace_limitation_principles:
      d.marketplace_limitation_principles as MarketplaceDashboard["marketplace_limitation_principles"],
    marketplace_dogfooding: parseRecord(d.marketplace_dogfooding),
    sembp112_integration_links: parseIntegrationLinks(d.sembp112_integration_links),
    marketplace_engagement_summary: parseEngagementSummary(d.marketplace_engagement_summary),
    marketplace_success_criteria: parseSuccessCriteria(d.marketplace_success_criteria),
    marketplace_vision: typeof d.marketplace_vision === "string" ? d.marketplace_vision : undefined,
    marketplace_vision_phrases: Array.isArray(d.marketplace_vision_phrases)
      ? (d.marketplace_vision_phrases as string[])
      : undefined,
    marketplace_privacy_note:
      typeof d.marketplace_privacy_note === "string" ? d.marketplace_privacy_note : undefined,
  };
}

export function parseMarketplaceItems(data: unknown): MarketplaceItem[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.items) ? (d.items as unknown[]).map(parseMarketplaceItem) : [];
}

export function parseMarketplaceItemDetail(data: unknown): MarketplaceItemDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.item || d.error) return null;
  return {
    item: parseMarketplaceItem(d.item) as MarketplaceItemDetail["item"],
    versions: Array.isArray(d.versions) ? (d.versions as Record<string, unknown>[]) : [],
    reviews: Array.isArray(d.reviews)
      ? (d.reviews as Array<{ rating: number; review_text?: string; created_at?: string }>)
      : [],
    precheck: parseMarketplacePrecheck(d.precheck),
  };
}

export function parseMarketplacePrecheck(data: unknown): MarketplacePrecheck {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    allowed: Boolean(d.allowed),
    reason: d.reason as string | undefined,
    requires_approval: d.requires_approval as boolean | undefined,
    risk_level: d.risk_level as string | undefined,
    required_permissions: Array.isArray(d.required_permissions)
      ? (d.required_permissions as string[])
      : [],
    included_skills: Array.isArray(d.included_skills) ? (d.included_skills as string[]) : [],
    missing_skills: Array.isArray(d.missing_skills) ? d.missing_skills : [],
    missing_modules: Array.isArray(d.missing_modules) ? d.missing_modules : [],
    deployment_mode: d.deployment_mode as string | undefined,
  };
}

export function parseMarketplaceInstalls(data: unknown): MarketplaceInstall[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.installs)) return [];
  return (d.installs as unknown[]).map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      status: String(r.status ?? ""),
      installed_at: r.installed_at as string | null | undefined,
      settings: r.settings as Record<string, unknown> | undefined,
      item: parseMarketplaceItem(r.item),
    };
  });
}

export function parseMarketplaceInstallResult(data: unknown): MarketplaceInstallResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    status: String(d.status ?? ""),
    install_id: d.install_id as string | undefined,
    item_key: d.item_key as string | undefined,
    precheck: d.precheck ? parseMarketplacePrecheck(d.precheck) : undefined,
    skills_installed: Array.isArray(d.skills_installed) ? d.skills_installed : undefined,
  };
}
