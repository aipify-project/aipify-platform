/**
 * Canonical Business Pack identifier resolver (Phase 620).
 * Single registry — normalizes slug, pack ID, entitlement key, recommendation key, and legacy aliases.
 */

export type BusinessPackResolutionKind = "catalog_pack" | "capability" | "unknown";

export type BusinessPackCatalogEntry = {
  kind: "catalog_pack";
  slug: string;
  catalogPackKey: string;
  recommendationKey: string;
  entitlementKey: string;
  nameKey: string;
  relatedSlugs: string[];
};

export type BusinessPackCapabilityEntry = {
  kind: "capability";
  slug: string;
  capabilityKey: string;
  recommendationKey: string;
  nameKey: string;
  relatedSlugs: string[];
};

export type BusinessPackUnknownEntry = {
  kind: "unknown";
  slug: string;
  input: string;
};

export type ResolvedBusinessPack =
  | BusinessPackCatalogEntry
  | BusinessPackCapabilityEntry
  | BusinessPackUnknownEntry;

type RegistryRow = {
  slug: string;
  kind: BusinessPackResolutionKind;
  catalogPackKey?: string;
  capabilityKey?: string;
  recommendationKey: string;
  entitlementKey?: string;
  nameKey: string;
  relatedSlugs: string[];
  aliases: string[];
};

const CATALOG_BASE = "/app/business-packs/available";

const REGISTRY: RegistryRow[] = [
  {
    slug: "aipify-hosts",
    kind: "catalog_pack",
    catalogPackKey: "aipify_hosts",
    recommendationKey: "aipify_hosts",
    entitlementKey: "aipify_hosts",
    nameKey: "customerApp.portalStructure.businessPackResolver.packs.aipifyHosts",
    relatedSlugs: ["support-operations", "governance"],
    aliases: [
      "aipify_hosts",
      "aipify-hosts",
      "hosts",
      "hospitality",
      "aipify hosts",
    ],
  },
  {
    slug: "governance",
    kind: "catalog_pack",
    catalogPackKey: "enterprise_governance",
    recommendationKey: "governance",
    entitlementKey: "enterprise_governance",
    nameKey: "customerApp.portalStructure.businessPackResolver.packs.governance",
    relatedSlugs: ["executive-intelligence"],
    aliases: [
      "governance",
      "governance_pack",
      "advanced_governance",
      "aipify_governance",
      "enterprise_governance",
      "enterprise-governance",
    ],
  },
  {
    slug: "commerce-intelligence",
    kind: "catalog_pack",
    catalogPackKey: "aipify_commerce",
    recommendationKey: "commerce_intelligence",
    entitlementKey: "aipify_commerce",
    nameKey: "customerApp.portalStructure.businessPackResolver.packs.commerceIntelligence",
    relatedSlugs: ["analytics"],
    aliases: [
      "commerce_intelligence",
      "commerce-intelligence",
      "commerce intelligence",
      "e_commerce",
      "e-commerce",
      "aipify_commerce",
      "aipify-commerce",
    ],
  },
  {
    slug: "support-operations",
    kind: "catalog_pack",
    catalogPackKey: "aipify_support",
    recommendationKey: "support_operations",
    entitlementKey: "aipify_support",
    nameKey: "customerApp.portalStructure.businessPackResolver.packs.supportOperations",
    relatedSlugs: ["aipify-hosts", "workflows"],
    aliases: [
      "support_operations",
      "support-operations",
      "support operations",
      "aipify_support",
      "aipify-support",
    ],
  },
  {
    slug: "executive-intelligence",
    kind: "catalog_pack",
    catalogPackKey: "aipify_executive",
    recommendationKey: "executive_intelligence",
    entitlementKey: "aipify_executive",
    nameKey: "customerApp.portalStructure.businessPackResolver.packs.executiveIntelligence",
    relatedSlugs: ["governance", "analytics"],
    aliases: [
      "executive_intelligence",
      "executive-intelligence",
      "executive intelligence",
      "aipify_executive",
      "aipify-executive",
    ],
  },
  {
    slug: "essentials",
    kind: "catalog_pack",
    catalogPackKey: "general_business",
    recommendationKey: "general_business",
    entitlementKey: "general_business",
    nameKey: "customerApp.portalStructure.businessPackResolver.packs.essentials",
    relatedSlugs: ["analytics", "workflows"],
    aliases: [
      "general_business",
      "general-business",
      "essentials",
      "aipify essentials",
    ],
  },
  {
    slug: "analytics",
    kind: "capability",
    capabilityKey: "analytics",
    recommendationKey: "analytics",
    nameKey: "customerApp.portalStructure.businessPackResolver.capabilities.analytics",
    relatedSlugs: ["commerce-intelligence"],
    aliases: ["analytics", "operational_analytics", "operational-analytics"],
  },
  {
    slug: "workflows",
    kind: "capability",
    capabilityKey: "workflows",
    recommendationKey: "workflows",
    nameKey: "customerApp.portalStructure.businessPackResolver.capabilities.workflows",
    relatedSlugs: ["support-operations"],
    aliases: ["workflows", "workflow", "automation", "automations"],
  },
  {
    slug: "growth",
    kind: "catalog_pack",
    catalogPackKey: "aipify_growth",
    recommendationKey: "aipify_growth",
    entitlementKey: "aipify_growth",
    nameKey: "customerApp.portalStructure.businessPackResolver.packs.growth",
    relatedSlugs: ["analytics"],
    aliases: ["aipify_growth", "aipify-growth", "growth"],
  },
];

const ALIAS_INDEX = buildAliasIndex(REGISTRY);

function buildAliasIndex(rows: RegistryRow[]): Map<string, RegistryRow> {
  const index = new Map<string, RegistryRow>();
  for (const row of rows) {
    const keys = new Set<string>([
      row.slug,
      row.recommendationKey,
      row.catalogPackKey,
      row.capabilityKey,
      row.entitlementKey,
      ...row.aliases,
    ].filter((value): value is string => Boolean(value)));

    for (const key of keys) {
      index.set(normalizeBusinessPackToken(key), row);
    }
  }
  return index;
}

export function normalizeBusinessPackToken(value?: string | null): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/_/g, "-");
}

function slugifyDisplayName(value: string): string {
  return normalizeBusinessPackToken(value).replace(/\s+/g, "-");
}

export function resolveBusinessPackIdentifier(
  input?: string | null
): ResolvedBusinessPack {
  const raw = (input ?? "").trim();
  if (!raw) {
    return { kind: "unknown", slug: "", input: raw };
  }

  const normalized = normalizeBusinessPackToken(raw);
  const slugCandidate = slugifyDisplayName(raw);
  const row =
    ALIAS_INDEX.get(normalized) ??
    ALIAS_INDEX.get(slugCandidate) ??
    ALIAS_INDEX.get(normalizeBusinessPackToken(raw.replace(/-/g, "_")));

  if (!row) {
    console.warn("[business-pack-resolver] Unknown identifier:", raw);
    return { kind: "unknown", slug: slugCandidate || normalized, input: raw };
  }

  if (row.kind === "catalog_pack" && row.catalogPackKey) {
    return {
      kind: "catalog_pack",
      slug: row.slug,
      catalogPackKey: row.catalogPackKey,
      recommendationKey: row.recommendationKey,
      entitlementKey: row.entitlementKey ?? row.catalogPackKey,
      nameKey: row.nameKey,
      relatedSlugs: row.relatedSlugs,
    };
  }

  if (row.kind === "capability" && row.capabilityKey) {
    return {
      kind: "capability",
      slug: row.slug,
      capabilityKey: row.capabilityKey,
      recommendationKey: row.recommendationKey,
      nameKey: row.nameKey,
      relatedSlugs: row.relatedSlugs,
    };
  }

  return { kind: "unknown", slug: row.slug, input: raw };
}

export function buildBusinessPackLearnMoreHref(
  input?: string | null,
  resolved?: ResolvedBusinessPack
): string | null {
  const pack = resolved ?? resolveBusinessPackIdentifier(input);
  if (pack.kind === "unknown") return null;
  const slug = pack.slug;
  if (!slug) return null;
  return `${CATALOG_BASE}?pack=${encodeURIComponent(slug)}`;
}

export function resolveRecommendationLearnMore(
  recommendation: {
    pack_key?: string;
    catalogSlug?: string;
    packId?: string;
  }
): { href: string | null; resolved: ResolvedBusinessPack } {
  const candidate =
    recommendation.catalogSlug ??
    recommendation.packId ??
    recommendation.pack_key ??
    "";
  const resolved = resolveBusinessPackIdentifier(candidate);
  return {
    href: buildBusinessPackLearnMoreHref(candidate, resolved),
    resolved,
  };
}

export function getCatalogPackKeyForApi(input?: string | null): string | null {
  const resolved = resolveBusinessPackIdentifier(input);
  if (resolved.kind === "catalog_pack") return resolved.catalogPackKey;
  return null;
}
