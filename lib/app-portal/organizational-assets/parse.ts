import type {
  AssetCriticalityLevel,
  AssetRecommendation,
  AssetStatus,
  AssetType,
  OrganizationalAssetDetail,
  OrganizationalAssetItem,
  OrganizationalAssetListResponse,
  OrganizationalAssetsDashboard,
} from "./types";

const TYPES = new Set<AssetType>([
  "software_license", "hardware", "subscription", "domain_name", "api_key_reference",
  "shared_account", "training_resource", "internal_resource", "documentation_resource", "custom_asset",
]);
const STATUSES = new Set<AssetStatus>([
  "active", "under_review", "pending_renewal", "retired", "archived",
]);
const CRITICALITY = new Set<AssetCriticalityLevel>(["low", "moderate", "high", "mission_critical"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseItem(raw: unknown): OrganizationalAssetItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const type = str(d.asset_type, "software_license") as AssetType;
  const status = str(d.status, "active") as AssetStatus;
  const crit = str(d.criticality_level, "moderate") as AssetCriticalityLevel;
  return {
    id: str(d.id),
    asset_name: str(d.asset_name),
    asset_type: TYPES.has(type) ? type : "software_license",
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    backup_owner_id: str(d.backup_owner_id) || null,
    backup_owner_name: str(d.backup_owner_name, "Unassigned"),
    status: STATUSES.has(status) ? status : "active",
    vendor: str(d.vendor),
    purchase_date: str(d.purchase_date) || null,
    renewal_date: str(d.renewal_date) || null,
    renewal_reminder_date: str(d.renewal_reminder_date) || null,
    criticality_level: CRITICALITY.has(crit) ? crit : "moderate",
    internal_notes: str(d.internal_notes_full) || str(d.internal_notes) || undefined,
    internal_notes_full: str(d.internal_notes_full) || undefined,
    related_modules: strArray(d.related_modules),
    related_external_relationship_ids: strArray(d.related_external_relationship_ids),
    needs_review: d.needs_review === true,
    renewal_upcoming: d.renewal_upcoming === true,
    renewal_expired: d.renewal_expired === true,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): AssetRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), asset_id: str(row.asset_id) || undefined };
  });
}

function parseDashboard(raw: unknown): OrganizationalAssetsDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    needs_review: typeof d.needs_review === "number" ? d.needs_review : 0,
    upcoming_renewals: typeof d.upcoming_renewals === "number" ? d.upcoming_renewals : 0,
    mission_critical: typeof d.mission_critical === "number" ? d.mission_critical : 0,
    without_owner: typeof d.without_owner === "number" ? d.without_owner : 0,
    recently_updated: Array.isArray(d.recently_updated) ? d.recently_updated.map(parseItem) : [],
  };
}

export function parseOrganizationalAssetList(data: unknown): OrganizationalAssetListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseItem) : [],
    dashboard: parseDashboard(d.dashboard),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseOrganizationalAssetDetail(data: unknown): OrganizationalAssetDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return {
          id: str(row.id),
          event_type: str(row.event_type),
          description: str(row.description),
          created_at: str(row.created_at),
          performed_by: str(row.performed_by),
        };
      })
    : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    asset: d.asset ? parseItem(d.asset) : undefined,
    related_risks: Array.isArray(d.related_risks)
      ? d.related_risks.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    related_follow_ups: Array.isArray(d.related_follow_ups)
      ? d.related_follow_ups.map((f) => {
          const row = f as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    related_external_relationships: Array.isArray(d.related_external_relationships)
      ? d.related_external_relationships.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), name: str(row.name), status: str(row.status) };
        })
      : [],
    renewal_history: Array.isArray(d.renewal_history)
      ? d.renewal_history.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
        })
      : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseOrganizationalAssetItem(data: unknown): OrganizationalAssetItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.asset) return parseItem(d.asset);
  return parseItem(d);
}
