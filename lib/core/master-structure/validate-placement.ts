import { APP_EMBEDDED_LAYER, MASTER_STRUCTURE_LAYERS } from "./layers";
import type { AipifyStructureLayer } from "./types";

export type PlacementValidationResult =
  | { ok: true; layer: AipifyStructureLayer; note?: string }
  | { ok: false; layer: null; reason: string; reviewRequired: true };

function matchesPrefix(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * Resolve canonical structure layer from a route or file path.
 * Returns null when placement is ambiguous — caller must pause for architecture review.
 */
export function resolveStructureLayerFromPath(path: string): AipifyStructureLayer | "embedded" | null {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (matchesPrefix(normalized, APP_EMBEDDED_LAYER.routePrefixes)) {
    return "embedded";
  }

  const matches: AipifyStructureLayer[] = [];
  for (const layer of Object.values(MASTER_STRUCTURE_LAYERS)) {
    if (matchesPrefix(normalized, layer.routePrefixes)) {
      matches.push(layer.layer);
    }
  }

  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    // APP and employees share routes — disambiguate by code path when possible
    if (normalized.startsWith("/app/growth-partner") || normalized.startsWith("/partners")) {
      return "partners";
    }
    if (matches.includes("app")) return "app";
    return null;
  }

  // Code path fallback (no leading slash)
  const codePath = path.replace(/^\//, "");
  for (const layer of Object.values(MASTER_STRUCTURE_LAYERS)) {
    if (layer.codePaths.some((cp) => codePath.startsWith(cp))) {
      return layer.layer;
    }
  }
  if (APP_EMBEDDED_LAYER.codePaths.some((cp) => codePath.startsWith(cp))) {
    return "embedded";
  }

  return null;
}

export function validateFeaturePlacement(input: {
  declaredLayer: AipifyStructureLayer;
  routeOrPath: string;
  featureName?: string;
}): PlacementValidationResult {
  const resolved = resolveStructureLayerFromPath(input.routeOrPath);

  if (resolved === "embedded") {
    if (input.declaredLayer === "app") {
      return { ok: true, layer: "app", note: "Install Engine is APP-owned embedded layer." };
    }
    return {
      ok: false,
      layer: null,
      reason: `Install Engine paths must be owned by APP, not ${input.declaredLayer}.`,
      reviewRequired: true,
    };
  }

  if (resolved === null) {
    return {
      ok: false,
      layer: null,
      reason: `Cannot resolve structure layer for "${input.routeOrPath}". Review AIPIFY_MASTER_STRUCTURE_BLUEPRINT.md before implementing${input.featureName ? ` ${input.featureName}` : ""}.`,
      reviewRequired: true,
    };
  }

  if (resolved === "employees" && input.declaredLayer === "app") {
    return { ok: true, layer: "app", note: "Employee surfaces are implemented inside APP with role scoping." };
  }

  if (resolved !== input.declaredLayer && !(resolved === "app" && input.declaredLayer === "employees")) {
    return {
      ok: false,
      layer: null,
      reason: `Declared layer "${input.declaredLayer}" conflicts with resolved layer "${resolved}" for path "${input.routeOrPath}".`,
      reviewRequired: true,
    };
  }

  return { ok: true, layer: input.declaredLayer };
}

export function assertStructureLayerDeclared(
  layer: AipifyStructureLayer | undefined
): asserts layer is AipifyStructureLayer {
  if (!layer) {
    throw new Error(
      "Feature owner layer required. Declare SUPER ADMIN, PLATFORM, APP, EMPLOYEES, or PARTNERS per AIPIFY_MASTER_STRUCTURE_BLUEPRINT.md"
    );
  }
}
