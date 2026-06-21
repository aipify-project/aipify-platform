import type { ComparisonCategoryDefinition } from "./types";

/** Canonical comparison registry — dynamic limits resolved from `getPublicPlanCatalog()`. */
export const PRICING_COMPARISON_REGISTRY: ComparisonCategoryDefinition[] = [
  {
    id: "pricing",
    icon: "credit-card",
    capabilities: [
      {
        id: "monthly_price",
        values: {
          starter: { type: "monthly_price" },
          professional: { type: "monthly_price" },
          business: { type: "monthly_price" },
          enterprise: { type: "monthly_price" },
        },
      },
      {
        id: "annual_price",
        values: {
          starter: { type: "contact" },
          professional: { type: "contact" },
          business: { type: "contact" },
          enterprise: { type: "custom" },
        },
      },
      {
        id: "trial_pilot",
        values: {
          starter: { type: "early_access" },
          professional: { type: "early_access" },
          business: { type: "early_access" },
          enterprise: { type: "consultation" },
        },
      },
    ],
  },
  {
    id: "organization",
    icon: "building",
    capabilities: [
      {
        id: "included_users",
        values: {
          starter: { type: "catalog_quantity", field: "users" },
          professional: { type: "catalog_quantity", field: "users" },
          business: { type: "catalog_quantity", field: "users" },
          enterprise: { type: "custom" },
        },
      },
      {
        id: "additional_users",
        values: {
          starter: { type: "upgrade" },
          professional: { type: "addon" },
          business: { type: "addon" },
          enterprise: { type: "custom" },
        },
      },
      {
        id: "included_domains",
        values: {
          starter: { type: "catalog_quantity", field: "domains" },
          professional: { type: "catalog_quantity", field: "domains" },
          business: { type: "catalog_quantity", field: "domains" },
          enterprise: { type: "custom" },
        },
      },
      {
        id: "additional_domains",
        values: {
          starter: { type: "upgrade" },
          professional: { type: "addon" },
          business: { type: "addon" },
          enterprise: { type: "custom" },
        },
      },
    ],
  },
  {
    id: "business_packs",
    icon: "package",
    capabilities: [
      {
        id: "pack_availability",
        values: {
          starter: { type: "not_included" },
          professional: { type: "addon" },
          business: { type: "addon" },
          enterprise: { type: "custom" },
        },
      },
      {
        id: "included_packs",
        values: {
          starter: { type: "not_included" },
          professional: { type: "not_included" },
          business: { type: "not_included" },
          enterprise: { type: "custom" },
        },
      },
    ],
  },
  {
    id: "operations",
    icon: "settings",
    capabilities: [
      {
        id: "workflows_approvals",
        values: {
          starter: { type: "level", level: "foundation" },
          professional: { type: "level", level: "included" },
          business: { type: "level", level: "advanced" },
          enterprise: { type: "custom" },
        },
      },
      {
        id: "reporting",
        values: {
          starter: { type: "level", level: "basic" },
          professional: { type: "level", level: "expanded" },
          business: { type: "level", level: "advanced" },
          enterprise: { type: "custom" },
        },
      },
    ],
  },
  {
    id: "companion",
    icon: "sparkles",
    capabilities: [
      {
        id: "companion_context",
        values: {
          starter: { type: "level", level: "essential" },
          professional: { type: "level", level: "expanded" },
          business: { type: "level", level: "advanced" },
          enterprise: { type: "level", level: "enterprise" },
        },
      },
    ],
  },
  {
    id: "governance",
    icon: "scale",
    capabilities: [
      {
        id: "policy_controls",
        values: {
          starter: { type: "level", level: "foundation" },
          professional: { type: "level", level: "approvals" },
          business: { type: "level", level: "advanced" },
          enterprise: { type: "level", level: "enterprise" },
        },
      },
    ],
  },
  {
    id: "support",
    icon: "life-buoy",
    capabilities: [
      {
        id: "support_level",
        values: {
          starter: { type: "catalog_support" },
          professional: { type: "catalog_support" },
          business: { type: "catalog_support" },
          enterprise: { type: "catalog_support" },
        },
      },
    ],
  },
  {
    id: "deployment",
    icon: "cloud",
    capabilities: [
      {
        id: "cloud_deployment",
        values: {
          starter: { type: "included" },
          professional: { type: "included" },
          business: { type: "included" },
          enterprise: { type: "included" },
        },
      },
      {
        id: "hybrid_deployment",
        values: {
          starter: { type: "not_included" },
          professional: { type: "not_included" },
          business: { type: "not_included" },
          enterprise: { type: "custom_assessment" },
        },
      },
    ],
  },
];
