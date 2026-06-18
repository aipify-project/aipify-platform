/**
 * Phase 500 — Aipify Master Structure Blueprint
 * Canonical layer identifiers. See AIPIFY_MASTER_STRUCTURE_BLUEPRINT.md
 */

export const AIPIFY_STRUCTURE_LAYERS = [
  "super_admin",
  "platform",
  "app",
  "employees",
  "partners",
] as const;

export type AipifyStructureLayer = (typeof AIPIFY_STRUCTURE_LAYERS)[number];

export type AppLicenseStatus = "active" | "trial" | "suspended" | "cancelled";

export type EmployeeAccessLevel = "active" | "suspended" | "disabled";

export type BusinessPackActivationStage =
  | "platform_catalog"
  | "app_purchased"
  | "pack_activated"
  | "menu_visible"
  | "access_granted"
  | "employee_use";

export type StructureLayerDefinition = {
  layer: AipifyStructureLayer;
  title: string;
  purpose: string;
  routePrefixes: readonly string[];
  codePaths: readonly string[];
  sellsProducts: boolean;
  ownsCustomers: boolean;
  receivesAttributionOnly: boolean;
  responsibilities: readonly string[];
  mustNever: readonly string[];
};
