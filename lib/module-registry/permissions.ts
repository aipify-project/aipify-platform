import type { ModulePermissionKind } from "./types";

/** Standard permission keys generated per module */
export const STANDARD_MODULE_PERMISSION_SUFFIXES: readonly ModulePermissionKind[] = [
  "view",
  "create",
  "edit",
  "delete",
  "manage",
  "report",
  "approve",
];

export function buildModulePermissionKey(moduleKey: string, kind: string): string {
  return `${moduleKey}.${kind}`;
}

export function buildStandardModulePermissions(moduleKey: string): string[] {
  return STANDARD_MODULE_PERMISSION_SUFFIXES.map((kind) => buildModulePermissionKey(moduleKey, kind));
}
