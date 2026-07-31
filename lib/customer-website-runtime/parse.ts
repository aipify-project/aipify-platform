function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function parseRuntimeRpcFailure(data: unknown): { ok: false; reason: string } {
  const row = asRecord(data);
  return { ok: false, reason: typeof row.reason === "string" ? row.reason : "unavailable" };
}

export function parseRuntimeContextRpc(data: unknown) {
  const row = asRecord(data);
  if (row.ok !== true) return parseRuntimeRpcFailure(data);
  return {
    ok: true as const,
    contractVersion: (typeof row.contract_version === "string"
      ? row.contract_version
      : "customer_website_runtime_v1") as "customer_website_runtime_v1",
    published: row.published === true,
    reason: typeof row.reason === "string" ? row.reason : undefined,
    installationRef: String(row.installation_ref ?? ""),
    organizationRef: String(row.organization_ref ?? ""),
    websiteRef: String(row.website_ref ?? ""),
    domain: String(row.domain ?? ""),
    environment: String(row.environment ?? ""),
    versionRef: typeof row.version_ref === "string" ? row.version_ref : undefined,
    versionNumber: typeof row.version_number === "number" ? row.version_number : undefined,
    manifestChecksum: typeof row.manifest_checksum === "string" ? row.manifest_checksum : undefined,
    defaultLocale: String(row.default_locale ?? "en"),
    activeLocales: asStringArray(row.active_locales),
    publishedRoutes: Array.isArray(row.published_routes)
      ? row.published_routes.map((item) => {
          const r = asRecord(item);
          return { path: String(r.path ?? "/"), locale: String(r.locale ?? "en") };
        })
      : [],
    mountedPaths: asStringArray(row.mounted_paths),
    homepageEnabled: row.homepage_enabled === true,
    fallbackMode: (row.fallback_mode === "unavailable" ? "unavailable" : "customer_runtime") as
      | "customer_runtime"
      | "unavailable",
    acknowledgementRequired: row.acknowledgement_required !== false,
    cacheToken: String(row.cache_token ?? ""),
    configVersion: Number(row.config_version ?? 1),
  };
}

export function parseRuntimePageRpc(data: unknown) {
  const row = asRecord(data);
  if (row.ok !== true) return parseRuntimeRpcFailure(data);
  return {
    ok: true as const,
    contractVersion: "customer_website_runtime_v1" as const,
    path: String(row.path ?? "/"),
    locale: String(row.locale ?? "en"),
    fallbackLocale: typeof row.fallback_locale === "string" ? row.fallback_locale : null,
    versionRef: String(row.version_ref ?? ""),
    versionNumber: Number(row.version_number ?? 0),
    manifestChecksum: String(row.manifest_checksum ?? ""),
    pageChecksum: String(row.page_checksum ?? ""),
    title: String(row.title ?? ""),
    content: asRecord(row.content),
    seo: asRecord(row.seo),
    robots: String(row.robots ?? "index, follow"),
    cacheToken: String(row.cache_token ?? ""),
  };
}

export function parseRuntimeManifestRpc(data: unknown) {
  const row = asRecord(data);
  if (row.ok !== true) return parseRuntimeRpcFailure(data);
  return {
    ok: true as const,
    contractVersion: "customer_website_runtime_v1" as const,
    versionRef: String(row.version_ref ?? ""),
    versionNumber: Number(row.version_number ?? 0),
    manifestChecksum: String(row.manifest_checksum ?? ""),
    defaultLocale: String(row.default_locale ?? "en"),
    locales: asStringArray(row.locales),
    pages: Array.isArray(row.pages)
      ? row.pages.map((item) => {
          const p = asRecord(item);
          return {
            path: String(p.path ?? "/"),
            locale: String(p.locale ?? "en"),
            title: String(p.title ?? ""),
            contentChecksum: String(p.content_checksum ?? ""),
            revisionNumber: Number(p.revision_number ?? 0),
          };
        })
      : [],
    cacheToken: String(row.cache_token ?? ""),
  };
}

function asMountedPaths(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.startsWith("/"));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("/")) return [trimmed];
    try {
      return asMountedPaths(JSON.parse(trimmed) as unknown);
    } catch {
      return [];
    }
  }
  return [];
}

export function parseRuntimeStatusRpc(data: unknown) {
  const row = asRecord(data);
  return {
    available: row.available === true,
    websiteProvisioned: row.website_provisioned === true,
    contractVersion: typeof row.contract_version === "string" ? row.contract_version : null,
    runtimeEnabled: row.runtime_enabled === true,
    homepageEnabled: row.homepage_enabled === true,
    mountedPaths: asMountedPaths(row.mounted_paths),
    fallbackMode: typeof row.fallback_mode === "string" ? row.fallback_mode : "customer_runtime",
    configVersion: Number(row.config_version ?? 0),
    activeVersionNumber:
      typeof row.active_version_number === "number" ? row.active_version_number : null,
    manifestChecksum: typeof row.manifest_checksum === "string" ? row.manifest_checksum : null,
    dbPublished: row.db_published === true,
    acknowledgementStatus:
      typeof row.acknowledgement_status === "string" ? row.acknowledgement_status : null,
    httpStatus: typeof row.http_status === "string" ? row.http_status : null,
    lastOperationStatus:
      typeof row.last_operation_status === "string" ? row.last_operation_status : null,
    fullyVerified: row.fully_verified === true,
    lastFullyVerifiedAt:
      typeof row.last_fully_verified_at === "string" ? row.last_fully_verified_at : null,
  };
}
