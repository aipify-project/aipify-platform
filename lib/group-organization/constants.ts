import { COMPANY_CONFIG } from "@/lib/company/company.config";

export const HIERARCHY_LEVELS = [
  { level: 1, key: "parent", name: COMPANY_CONFIG.legalCompanyName },
  { level: 2, key: "entity", name: "Business Entities" },
  { level: 3, key: "department", name: "Departments" },
  { level: 4, key: "team", name: "Teams" },
  { level: 5, key: "user", name: "Users" },
] as const;

export const ENTITY_TYPES = [
  "product_brand",
  "subsidiary",
  "acquisition",
  "venture",
  "internal",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export const ENTITY_STATUSES = ["active", "archived", "pending_setup"] as const;

export type EntityStatus = (typeof ENTITY_STATUSES)[number];

export const DEPARTMENT_KEYS = [
  "support",
  "sales",
  "marketing",
  "finance",
  "operations",
  "development",
  "hr",
  "other",
] as const;

export const INVESTMENT_ASSET_CLASSES = ["company", "real_estate", "partnership", "other"] as const;

export const INVESTMENT_STATUSES = ["active", "exited", "pending", "under_review"] as const;

export const SHARED_SIGNAL_TYPES = [
  "similar_support_request",
  "shared_best_practice",
  "cross_sell_opportunity",
  "growth_recommendation",
  "operational_pattern",
] as const;

export const ENTITY_ACTIONS = [
  "create",
  "archive",
  "assign_administrator",
  "transfer_ownership",
  "connect_domain",
  "connect_payment_provider",
  "create_department",
  "create_team",
] as const;

export type EntityAction = (typeof ENTITY_ACTIONS)[number];

export const AUDIT_EVENT_TYPES = [
  "entity_created",
  "entity_archived",
  "ownership_changed",
  "permission_changed",
  "administrator_assigned",
  "administrator_removed",
  "domain_connected",
  "payment_provider_connected",
  "investment_created",
  "investment_updated",
  "department_created",
  "team_created",
] as const;
