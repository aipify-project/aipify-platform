import fs from "node:fs";
import path from "node:path";
import type { RouteCategory, RouteEntry, RouteKind } from "./types";

const ROUTE_FILES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);
const API_FILES = new Set(["route.ts", "route.js"]);

function isRouteGroupSegment(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")");
}

function isPrivateSegment(segment: string): boolean {
  return segment.startsWith("_");
}

function isParallelSegment(segment: string): boolean {
  return segment.startsWith("@");
}

function segmentToUrlPart(segment: string): string | null {
  if (isRouteGroupSegment(segment) || isPrivateSegment(segment) || isParallelSegment(segment)) {
    return null;
  }
  if (segment.startsWith("[[...") && segment.endsWith("]]")) {
    return `[[...${segment.slice(5, -2)}]]`;
  }
  if (segment.startsWith("[...") && segment.endsWith("]")) {
    return `[...${segment.slice(4, -1)}]`;
  }
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return `[${segment.slice(1, -1)}]`;
  }
  return segment;
}

export function filePathToUrlPattern(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  const fileName = parts.pop() ?? "";
  const isApi = API_FILES.has(fileName);
  const urlParts = parts
    .map(segmentToUrlPart)
    .filter((part): part is string => part !== null);
  if (isApi) {
    return `/${urlParts.join("/")}`;
  }
  return urlParts.length ? `/${urlParts.join("/")}` : "/";
}

export function classifyRoute(filePath: string): RouteCategory {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.startsWith("app/(marketing)/")) return "marketing";
  if (normalized.startsWith("app/api/")) return "api";
  if (normalized.startsWith("app/platform/")) return "platform_admin";
  if (normalized.startsWith("app/super/")) return "super_admin";
  if (normalized.startsWith("app/app/aipify-hosts/")) return "business_packs";
  if (normalized.startsWith("app/app/")) return "customer_app";
  if (normalized.startsWith("app/dashboard/")) return "customer_app";
  return "other";
}

export function routeOwner(category: RouteCategory): string {
  switch (category) {
    case "customer_app":
      return "Customer App";
    case "platform_admin":
      return "Platform Admin";
    case "super_admin":
      return "Super Admin";
    case "api":
      return "Shared API";
    case "marketing":
      return "Marketing";
    case "business_packs":
      return "Business Packs";
    default:
      return "Shared";
  }
}

function moduleFromPath(filePath: string, category: RouteCategory): string {
  const parts = filePath.replace(/\\/g, "/").split("/");
  if (category === "api" && parts[2] === "api") {
    return parts[3] ?? "api";
  }
  if (category === "customer_app") {
    const idx = parts.indexOf("app");
    return parts[idx + 1] ?? "core";
  }
  if (category === "platform_admin") {
    const idx = parts.indexOf("platform");
    return parts[idx + 1] ?? "platform";
  }
  if (category === "marketing") {
    const marketingIdx = parts.findIndex((p) => p === "(marketing)");
    return parts[marketingIdx + 1]?.replace(/\.tsx?$/, "") ?? "home";
  }
  return parts[parts.length - 2] ?? "core";
}

function routeStatus(filePath: string, category: RouteCategory): RouteEntry["status"] {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.includes("/app/dashboard/")) return "legacy";
  if (normalized.includes("/page.tsx.legacy")) return "legacy";
  return category === "other" ? "warning" : "active";
}

function walkAppDir(appRoot: string, relativeDir = ""): RouteEntry[] {
  const entries: RouteEntry[] = [];
  const absoluteDir = path.join(appRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) return entries;

  for (const name of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const relPath = relativeDir ? `${relativeDir}/${name.name}` : name.name;
    if (name.isDirectory()) {
      entries.push(...walkAppDir(appRoot, relPath));
      continue;
    }

    let kind: RouteKind | null = null;
    if (ROUTE_FILES.has(name.name)) kind = "page";
    else if (API_FILES.has(name.name)) kind = "route";
    else if (name.name === "layout.tsx" || name.name === "layout.ts") kind = "layout";
    if (!kind || kind === "layout") continue;

    const filePath = `app/${relPath}`.replace(/\/+/g, "/");
    const category = classifyRoute(filePath);
    const stat = fs.statSync(path.join(appRoot, relPath));
    entries.push({
      filePath,
      urlPattern: filePathToUrlPattern(filePath.replace(/^app\//, "")),
      category,
      owner: routeOwner(category),
      module: moduleFromPath(filePath, category),
      kind,
      lastModified: stat.mtime.toISOString(),
      status: routeStatus(filePath, category),
    });
  }

  return entries;
}

export function scanRoutes(projectRoot: string): RouteEntry[] {
  const appRoot = path.join(projectRoot, "app");
  return walkAppDir(appRoot).sort((a, b) => a.urlPattern.localeCompare(b.urlPattern));
}

export function isDynamicUrlPattern(urlPattern: string): boolean {
  return /\[/.test(urlPattern);
}

export function hasInvalidCatchAllPlacement(filePath: string): boolean {
  const parts = filePath.replace(/\\/g, "/").split("/");
  const catchAllIdx = parts.findIndex(
    (part) => /^\[\[\.\.\..+\]\]$/.test(part) || /^\[\.\.\..+\]$/.test(part)
  );
  if (catchAllIdx === -1) return false;
  const afterCatchAll = parts.slice(catchAllIdx + 1);
  if (afterCatchAll.length <= 1) return false;
  const routeFile = afterCatchAll[afterCatchAll.length - 1];
  const foldersAfterCatchAll = afterCatchAll.slice(0, -1);
  return foldersAfterCatchAll.some(
    (segment) => !ROUTE_FILES.has(segment) && !API_FILES.has(segment)
  ) && (ROUTE_FILES.has(routeFile) || API_FILES.has(routeFile));
}
