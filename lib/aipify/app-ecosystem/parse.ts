import type {
  AppInstall,
  AppInstallPrecheck,
  AppInstallResult,
  AppMetric,
  AppReview,
  AppVersion,
  EcosystemApp,
  EcosystemAppDetail,
  EcosystemAppsCard,
  EcosystemAppsDashboard,
  ManifestValidation,
} from "./types";

export function parseEcosystemApp(row: unknown): EcosystemApp {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    app_key: String(s.app_key ?? ""),
    name: String(s.name ?? ""),
    description: s.description as string | null | undefined,
    category: String(s.category ?? ""),
    author: String(s.author ?? ""),
    author_tier: String(s.author_tier ?? "internal"),
    version: String(s.version ?? "1.0.0"),
    status: String(s.status ?? "published"),
    risk_level: String(s.risk_level ?? "low"),
    permissions: Array.isArray(s.permissions) ? (s.permissions as string[]) : [],
    deployment_modes: Array.isArray(s.deployment_modes) ? (s.deployment_modes as string[]) : [],
    required_modules: Array.isArray(s.required_modules) ? (s.required_modules as string[]) : [],
    minimum_aipify_version: s.minimum_aipify_version as string | undefined,
    support_contact: s.support_contact as string | null | undefined,
    sandbox_required: Boolean(s.sandbox_required ?? true),
    install_count: s.install_count as number | undefined,
    rating: s.rating as number | undefined,
    installed: Boolean(s.installed),
  };
}

export function parseAppInstall(row: unknown): AppInstall {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    install_id: String(s.install_id ?? ""),
    app_key: String(s.app_key ?? ""),
    name: String(s.name ?? ""),
    category: String(s.category ?? ""),
    version: String(s.version ?? ""),
    latest_version: s.latest_version as string | undefined,
    status: String(s.status ?? ""),
    risk_level: String(s.risk_level ?? "low"),
    permissions: Array.isArray(s.permissions) ? (s.permissions as string[]) : [],
    update_available: Boolean(s.update_available),
    installed_at: s.installed_at as string | undefined,
  };
}

export function parseEcosystemAppsCard(data: unknown): EcosystemAppsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    installed_apps: d.installed_apps as number | undefined,
    updates_available: d.updates_available as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseEcosystemAppsDashboard(data: unknown): EcosystemAppsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    catalog: Array.isArray(d.catalog) ? (d.catalog as unknown[]).map(parseEcosystemApp) : [],
    installed: Array.isArray(d.installed) ? (d.installed as unknown[]).map(parseAppInstall) : [],
    recent_reviews: Array.isArray(d.recent_reviews) ? (d.recent_reviews as AppReview[]) : [],
    installed_count: d.installed_count as number | undefined,
    updates_available: d.updates_available as number | undefined,
  };
}

export function parseEcosystemAppDetail(data: unknown): EcosystemAppDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.app || d.error) return null;
  return {
    app: parseEcosystemApp(d.app),
    install: d.install as EcosystemAppDetail["install"],
    versions: Array.isArray(d.versions) ? (d.versions as AppVersion[]) : [],
    reviews: Array.isArray(d.reviews) ? (d.reviews as AppReview[]) : [],
    metrics: Array.isArray(d.metrics) ? (d.metrics as AppMetric[]) : [],
    manifest: d.manifest as Record<string, unknown> | undefined,
  };
}

export function parseEcosystemApps(data: unknown): EcosystemApp[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.apps) ? (d.apps as unknown[]).map(parseEcosystemApp) : [];
}

export function parseManifestValidation(data: unknown): ManifestValidation {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    valid: Boolean(d.valid),
    errors: Array.isArray(d.errors) ? (d.errors as string[]) : undefined,
    sandbox_required: d.sandbox_required as boolean | undefined,
  };
}

export function parseAppInstallPrecheck(data: unknown): AppInstallPrecheck {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    allowed: Boolean(d.allowed),
    reason: d.reason as string | undefined,
    app: d.app ? parseEcosystemApp(d.app) : undefined,
    requires_approval: d.requires_approval as boolean | undefined,
    requires_governance: d.requires_governance as boolean | undefined,
    policy: d.policy as Record<string, unknown> | undefined,
    permissions: Array.isArray(d.permissions) ? (d.permissions as string[]) : undefined,
    sandbox_required: d.sandbox_required as boolean | undefined,
    risk_level: d.risk_level as string | undefined,
  };
}

export function parseAppInstallResult(data: unknown): AppInstallResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    status: String(d.status ?? ""),
    install_id: d.install_id as string | undefined,
    precheck: d.precheck ? parseAppInstallPrecheck(d.precheck) : undefined,
    version: d.version as string | undefined,
  };
}
