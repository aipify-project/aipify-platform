import type {
  PartnerMaterial,
  PartnerMaterialsCategories,
  PartnerMaterialsFavorites,
  PartnerMaterialsOverview,
  PartnerMaterialsRecommended,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parsePartnerMaterial(data: unknown): PartnerMaterial {
  const m = asRecord(data);
  return {
    id: String(m.id ?? ""),
    material_key: String(m.material_key ?? ""),
    title: String(m.title ?? ""),
    description: String(m.description ?? ""),
    category: String(m.category ?? ""),
    language_code: String(m.language_code ?? ""),
    format_type: String(m.format_type ?? ""),
    industry: String(m.industry ?? ""),
    business_pack: String(m.business_pack ?? ""),
    version_label: String(m.version_label ?? ""),
    is_current: Boolean(m.is_current),
    published_at: String(m.published_at ?? ""),
    updated_at: String(m.updated_at ?? ""),
    download_count: Number(m.download_count ?? 0),
    usage_recommendations: String(m.usage_recommendations ?? ""),
    release_notes: String(m.release_notes ?? ""),
    customizable: Boolean(m.customizable),
    preview_url: String(m.preview_url ?? ""),
    download_url: String(m.download_url ?? ""),
    is_favorite: Boolean(m.is_favorite),
  };
}

function parseMaterialList(data: unknown): PartnerMaterial[] {
  return asArray<unknown>(data).map(parsePartnerMaterial);
}

export function parsePartnerMaterialsOverview(data: unknown): PartnerMaterialsOverview | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const dashboard = d.dashboard ? asRecord(d.dashboard) : null;
  const centers = d.centers ? asRecord(d.centers) : null;
  const empty = d.empty_state ? asRecord(d.empty_state) : null;

  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    can_favorite: Boolean(d.can_favorite),
    team_role: d.team_role ? String(d.team_role) : undefined,
    access_denied: Boolean(d.access_denied),
    positioning: d.positioning ? String(d.positioning) : undefined,
    dashboard: dashboard
      ? {
          available_materials: Number(dashboard.available_materials ?? 0),
          recently_updated: parseMaterialList(dashboard.recently_updated),
          most_downloaded: parseMaterialList(dashboard.most_downloaded),
          language_coverage: asArray<string>(dashboard.language_coverage).map(String),
          readiness_score: Number(dashboard.readiness_score ?? 0),
        }
      : undefined,
    materials: parseMaterialList(d.materials),
    centers: centers
      ? {
          discovery: parseMaterialList(centers.discovery),
          objections: parseMaterialList(centers.objections),
          email_templates: parseMaterialList(centers.email_templates),
          social: parseMaterialList(centers.social),
          campaign_packs: parseMaterialList(centers.campaign_packs),
        }
      : undefined,
    empty_state: empty
      ? {
          title: String(empty.title ?? ""),
          message: String(empty.message ?? ""),
          cta: String(empty.cta ?? ""),
        }
      : undefined,
  };
}

export function parsePartnerMaterialsCategories(data: unknown): PartnerMaterialsCategories | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    categories: asArray<unknown>(d.categories).map((row) => {
      const c = asRecord(row);
      return { category: String(c.category ?? ""), count: Number(c.count ?? 0) };
    }),
    formats: asArray<string>(d.formats).map(String),
    languages: asArray<string>(d.languages).map(String),
  };
}

export function parsePartnerMaterialsFavorites(data: unknown): PartnerMaterialsFavorites | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    favorites: parseMaterialList(d.favorites),
    collections: asArray<unknown>(d.collections).map((row) => {
      const c = asRecord(row);
      return {
        id: String(c.id ?? ""),
        title: String(c.title ?? ""),
        collection_type: String(c.collection_type ?? ""),
        pack_type: String(c.pack_type ?? ""),
        item_count: Number(c.item_count ?? 0),
      };
    }),
  };
}

export function parsePartnerMaterialsRecommended(data: unknown): PartnerMaterialsRecommended | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    recommended: parseMaterialList(d.recommended),
  };
}
