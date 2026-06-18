export type RouteCategory =
  | "customer_app"
  | "platform_admin"
  | "super_admin"
  | "api"
  | "marketing"
  | "business_packs"
  | "other";

export type RouteKind = "page" | "route" | "layout";

export type RouteEntry = {
  filePath: string;
  urlPattern: string;
  category: RouteCategory;
  owner: string;
  module: string;
  kind: RouteKind;
  lastModified: string;
  status: "active" | "legacy" | "warning";
};

export type GovernanceSeverity = "critical" | "warning" | "info";

export type GovernanceIssueCode =
  | "duplicate_url"
  | "duplicate_homepage"
  | "invalid_catch_all_placement"
  | "duplicate_api_handler"
  | "legacy_route_remnant"
  | "route_naming_violation"
  | "api_barrel_import"
  | "duplicate_route_group_root"
  | "circular_import"
  | "invalid_barrel_export";

export type GovernanceIssue = {
  code: GovernanceIssueCode;
  severity: GovernanceSeverity;
  message: string;
  filePath?: string;
  relatedPaths?: string[];
  urlPattern?: string;
};

export type RouteStatistics = {
  totalRoutes: number;
  apiRoutes: number;
  marketingRoutes: number;
  customerRoutes: number;
  platformRoutes: number;
  superRoutes: number;
  businessPackRoutes: number;
  dynamicRoutes: number;
  pageRoutes: number;
};

export type GovernanceScanResult = {
  scannedAt: string;
  routes: RouteEntry[];
  issues: GovernanceIssue[];
  statistics: RouteStatistics;
  passed: boolean;
  criticalCount: number;
  warningCount: number;
};

export type BuildHealthStatus = {
  buildStatus: "pass" | "fail" | "unknown";
  typecheckStatus: "pass" | "fail" | "unknown" | "not_run";
  routeValidationStatus: "pass" | "fail" | "warn";
  duplicateRouteCheck: "pass" | "fail";
  routeCount: number;
  apiRouteCount: number;
  dynamicRouteCount: number;
  buildDurationMs: number | null;
  lastSuccessfulDeployment: string | null;
  warnings: string[];
  criticalIssues: GovernanceIssue[];
  statistics: RouteStatistics;
  scannedAt: string;
};

export type RouteRegistryRow = RouteEntry & {
  id: string;
  statusLabel: string;
};

export type BuildMemoryIncident = {
  issue: string;
  rootCause: string;
  fix: string;
  date: string;
  affectedModules: string[];
  resolution: string;
};
