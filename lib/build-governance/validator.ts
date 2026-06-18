import fs from "node:fs";
import path from "node:path";
import type { GovernanceIssue, RouteEntry, RouteStatistics } from "./types";
import { scanImportGraphIssues } from "./import-graph";
import { hasInvalidCatchAllPlacement, isDynamicUrlPattern, scanRoutes } from "./scanner";

const LEGACY_PREFIXES = ["app/dashboard/"];

const API_BARREL_PATTERN = /from\s+["']@\/lib\/aipify\/([^/"']+)["']/g;
const API_COMPONENTS_PATTERN = /from\s+["']@\/components\//;

function countByCategory(routes: RouteEntry[], category: RouteEntry["category"]): number {
  return routes.filter((route) => route.category === category).length;
}

export function computeStatistics(routes: RouteEntry[]): RouteStatistics {
  const pagesAndApi = routes.filter((route) => route.kind === "page" || route.kind === "route");
  return {
    totalRoutes: pagesAndApi.length,
    apiRoutes: routes.filter((route) => route.kind === "route").length,
    marketingRoutes: countByCategory(routes, "marketing"),
    customerRoutes: countByCategory(routes, "customer_app"),
    platformRoutes: countByCategory(routes, "platform_admin"),
    superRoutes: countByCategory(routes, "super_admin"),
    businessPackRoutes: countByCategory(routes, "business_packs"),
    dynamicRoutes: pagesAndApi.filter((route) => isDynamicUrlPattern(route.urlPattern)).length,
    pageRoutes: routes.filter((route) => route.kind === "page").length,
  };
}

function findDuplicateUrls(routes: RouteEntry[]): GovernanceIssue[] {
  const byUrl = new Map<string, RouteEntry[]>();
  for (const route of routes.filter((r) => r.kind === "page" || r.kind === "route")) {
    const list = byUrl.get(route.urlPattern) ?? [];
    list.push(route);
    byUrl.set(route.urlPattern, list);
  }

  const issues: GovernanceIssue[] = [];
  for (const [urlPattern, group] of byUrl.entries()) {
    if (group.length <= 1) continue;
    issues.push({
      code: "duplicate_url",
      severity: urlPattern === "/" ? "critical" : "critical",
      message: `Multiple route files resolve to ${urlPattern}`,
      urlPattern,
      filePath: group[0]?.filePath,
      relatedPaths: group.map((route) => route.filePath),
    });
  }
  return issues;
}

function findDuplicateHomepages(routes: RouteEntry[]): GovernanceIssue[] {
  const homePages = routes.filter((route) => route.kind === "page" && route.urlPattern === "/");
  if (homePages.length <= 1) return [];
  return [
    {
      code: "duplicate_homepage",
      severity: "critical",
      message: "Multiple homepage routes detected at /",
      urlPattern: "/",
      relatedPaths: homePages.map((route) => route.filePath),
    },
  ];
}

function findInvalidCatchAllRoutes(routes: RouteEntry[]): GovernanceIssue[] {
  return routes
    .filter((route) => hasInvalidCatchAllPlacement(route.filePath))
    .map((route) => ({
      code: "invalid_catch_all_placement",
      severity: "critical",
      message: "Catch-all segment must be the last path segment before the route file",
      filePath: route.filePath,
      urlPattern: route.urlPattern,
    }));
}

function findLegacyRemnants(routes: RouteEntry[]): GovernanceIssue[] {
  return routes
    .filter((route) => LEGACY_PREFIXES.some((prefix) => route.filePath.startsWith(prefix)))
    .map((route) => ({
      code: "legacy_route_remnant",
      severity: "warning",
      message: "Legacy dashboard route — canonical customer routes live under app/app/",
      filePath: route.filePath,
      urlPattern: route.urlPattern,
    }));
}

function findNamingViolations(routes: RouteEntry[]): GovernanceIssue[] {
  return routes
    .filter((route) => /[A-Z]/.test(route.filePath) || route.filePath.includes(" "))
    .map((route) => ({
      code: "route_naming_violation",
      severity: "warning",
      message: "Route file path should use kebab-case segments only",
      filePath: route.filePath,
      urlPattern: route.urlPattern,
    }));
}

function scanApiImportIssues(projectRoot: string): GovernanceIssue[] {
  const apiRoot = path.join(projectRoot, "app/api");
  if (!fs.existsSync(apiRoot)) return [];

  const issues: GovernanceIssue[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.startsWith("route.")) continue;
      const src = fs.readFileSync(full, "utf8");
      if (API_COMPONENTS_PATTERN.test(src)) {
        issues.push({
          code: "api_barrel_import",
          severity: "critical",
          message: "API route imports client/dashboard components",
          filePath: full.replace(`${projectRoot}/`, "").replace(/\\/g, "/"),
        });
      }
      for (const match of src.matchAll(API_BARREL_PATTERN)) {
        issues.push({
          code: "api_barrel_import",
          severity: "warning",
          message: `API route uses barrel import @/lib/aipify/${match[1]} — prefer /parse or submodule`,
          filePath: full.replace(`${projectRoot}/`, "").replace(/\\/g, "/"),
        });
      }
    }
  };
  walk(apiRoot);
  return issues;
}

function findDuplicateRouteGroupRoots(routes: RouteEntry[]): GovernanceIssue[] {
  const roots = new Map<string, RouteEntry[]>();
  for (const route of routes.filter((r) => r.kind === "page")) {
    const parts = route.filePath.split("/");
    const appIdx = parts.indexOf("app");
    const rootSegment = parts[appIdx + 1] ?? "";
    if (!rootSegment.startsWith("(")) continue;
    const list = roots.get(rootSegment) ?? [];
    list.push(route);
    roots.set(rootSegment, list);
  }

  const homepageGroups = [...roots.entries()].filter(([, group]) =>
    group.some((route) => route.urlPattern === "/")
  );
  if (homepageGroups.length <= 1) return [];

  return [
    {
      code: "duplicate_route_group_root",
      severity: "critical",
      message: "Multiple route groups define a homepage at /",
      urlPattern: "/",
      relatedPaths: homepageGroups.flatMap(([, group]) => group.map((route) => route.filePath)),
    },
  ];
}

export function validateRoutes(projectRoot: string, routes = scanRoutes(projectRoot)): GovernanceIssue[] {
  return [
    ...findDuplicateUrls(routes),
    ...findDuplicateHomepages(routes),
    ...findDuplicateRouteGroupRoots(routes),
    ...findInvalidCatchAllRoutes(routes),
    ...findLegacyRemnants(routes),
    ...findNamingViolations(routes),
    ...scanApiImportIssues(projectRoot),
    ...scanImportGraphIssues(projectRoot),
  ];
}

export function runGovernanceScan(projectRoot: string) {
  const routes = scanRoutes(projectRoot);
  const issues = validateRoutes(projectRoot, routes);
  const statistics = computeStatistics(routes);
  const criticalCount = issues.filter((issue) => issue.severity === "critical").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;

  return {
    scannedAt: new Date().toISOString(),
    routes,
    issues,
    statistics,
    passed: criticalCount === 0,
    criticalCount,
    warningCount,
  };
}
