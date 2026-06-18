import type {
  BuildHealthStatus,
  GovernanceScanResult,
  RouteEntry,
  RouteRegistryRow,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseRouteEntry(raw: unknown): RouteEntry {
  const d = asRecord(raw);
  return {
    filePath: asString(d.file_path ?? d.filePath),
    urlPattern: asString(d.url_pattern ?? d.urlPattern),
    category: asString(d.category, "other") as RouteEntry["category"],
    owner: asString(d.owner),
    module: asString(d.module),
    kind: asString(d.kind, "page") as RouteEntry["kind"],
    lastModified: asString(d.last_modified ?? d.lastModified),
    status: asString(d.status, "active") as RouteEntry["status"],
  };
}

export function parseGovernanceScanResult(raw: unknown): GovernanceScanResult {
  const d = asRecord(raw);
  return {
    scannedAt: asString(d.scanned_at ?? d.scannedAt),
    routes: Array.isArray(d.routes) ? d.routes.map(parseRouteEntry) : [],
    issues: Array.isArray(d.issues) ? d.issues.map(parseGovernanceIssue) : [],
    statistics: parseStatistics(d.statistics),
    passed: Boolean(d.passed),
    criticalCount: asNumber(d.critical_count ?? d.criticalCount),
    warningCount: asNumber(d.warning_count ?? d.warningCount),
  };
}

export function parseGovernanceIssue(raw: unknown) {
  const d = asRecord(raw);
  return {
    code: asString(d.code, "duplicate_url") as GovernanceScanResult["issues"][number]["code"],
    severity: asString(d.severity, "warning") as GovernanceScanResult["issues"][number]["severity"],
    message: asString(d.message),
    filePath: asString(d.file_path ?? d.filePath) || undefined,
    urlPattern: asString(d.url_pattern ?? d.urlPattern) || undefined,
    relatedPaths: Array.isArray(d.related_paths ?? d.relatedPaths)
      ? ((d.related_paths ?? d.relatedPaths) as unknown[]).map(String)
      : undefined,
  };
}

function parseStatistics(raw: unknown) {
  const d = asRecord(raw);
  return {
    totalRoutes: asNumber(d.total_routes ?? d.totalRoutes),
    apiRoutes: asNumber(d.api_routes ?? d.apiRoutes),
    marketingRoutes: asNumber(d.marketing_routes ?? d.marketingRoutes),
    customerRoutes: asNumber(d.customer_routes ?? d.customerRoutes),
    platformRoutes: asNumber(d.platform_routes ?? d.platformRoutes),
    superRoutes: asNumber(d.super_routes ?? d.superRoutes),
    businessPackRoutes: asNumber(d.business_pack_routes ?? d.businessPackRoutes),
    dynamicRoutes: asNumber(d.dynamic_routes ?? d.dynamicRoutes),
    pageRoutes: asNumber(d.page_routes ?? d.pageRoutes),
  };
}

export function parseBuildHealthCenter(raw: unknown): BuildHealthStatus & {
  registryPreview: RouteRegistryRow[];
  trend: Array<{ recorded_at: string; total_routes: number; api_routes: number }>;
} {
  const d = asRecord(raw);
  const scan = parseGovernanceScanResult(d.scan ?? d.latest_scan);
  const warnings = Array.isArray(d.warnings) ? d.warnings.map(String) : scan.issues.filter((i) => i.severity === "warning").map((i) => i.message);

  return {
    buildStatus: (asString(d.build_status ?? d.buildStatus, "unknown") as BuildHealthStatus["buildStatus"]),
    typecheckStatus: (asString(d.typecheck_status ?? d.typecheckStatus, "unknown") as BuildHealthStatus["typecheckStatus"]),
    routeValidationStatus: scan.passed
      ? scan.warningCount > 0
        ? "warn"
        : "pass"
      : "fail",
    duplicateRouteCheck: scan.issues.some((issue) => issue.code.startsWith("duplicate"))
      ? "fail"
      : "pass",
    routeCount: scan.statistics.totalRoutes,
    apiRouteCount: scan.statistics.apiRoutes,
    dynamicRouteCount: scan.statistics.dynamicRoutes,
    buildDurationMs:
      typeof d.build_duration_ms === "number"
        ? d.build_duration_ms
        : typeof d.buildDurationMs === "number"
          ? d.buildDurationMs
          : null,
    lastSuccessfulDeployment: asString(d.last_successful_deployment ?? d.lastSuccessfulDeployment) || null,
    warnings,
    criticalIssues: scan.issues.filter((issue) => issue.severity === "critical"),
    statistics: scan.statistics,
    scannedAt: scan.scannedAt,
    registryPreview: Array.isArray(d.registry_preview)
      ? d.registry_preview.map(parseRegistryRow)
      : scan.routes.slice(0, 100).map((route, index) => ({
          ...route,
          id: `${route.filePath}-${index}`,
          statusLabel: route.status,
        })),
    trend: Array.isArray(d.trend)
      ? d.trend.map((row) => {
          const item = asRecord(row);
          return {
            recorded_at: asString(item.recorded_at),
            total_routes: asNumber(item.total_routes),
            api_routes: asNumber(item.api_routes),
          };
        })
      : [],
  };
}

function parseRegistryRow(raw: unknown): RouteRegistryRow {
  const d = asRecord(raw);
  const route = parseRouteEntry(d);
  return {
    ...route,
    id: asString(d.id, route.filePath),
    statusLabel: asString(d.status_label ?? d.statusLabel, route.status),
  };
}

export function parseRouteRegistryDashboard(raw: unknown): {
  routes: RouteRegistryRow[];
  statistics: ReturnType<typeof parseStatistics>;
  categories: string[];
} {
  const d = asRecord(raw);
  return {
    routes: Array.isArray(d.routes) ? d.routes.map(parseRegistryRow) : [],
    statistics: parseStatistics(d.statistics),
    categories: Array.isArray(d.categories) ? d.categories.map(String) : [],
  };
}
