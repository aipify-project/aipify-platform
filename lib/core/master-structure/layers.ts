import type { StructureLayerDefinition } from "./types";

/** Canonical layer registry — Phase 500 */
export const MASTER_STRUCTURE_LAYERS: Record<
  StructureLayerDefinition["layer"],
  StructureLayerDefinition
> = {
  super_admin: {
    layer: "super_admin",
    title: "Super Admin",
    purpose: "Own and govern the entire Aipify ecosystem — Aipify Group AS only.",
    routePrefixes: ["/super"],
    codePaths: ["app/super/", "components/super/", "lib/super-admin/"],
    sellsProducts: false,
    ownsCustomers: false,
    receivesAttributionOnly: false,
    responsibilities: [
      "System health",
      "Emergency controls",
      "Global governance",
      "Platform settings",
      "Module registry",
      "Feature flags",
      "Tenant controls",
      "License engine governance",
      "Security controls",
      "Platform ownership",
    ],
    mustNever: [
      "Customer access",
      "Growth Partner access",
      "Customer business workflows",
    ],
  },
  platform: {
    layer: "platform",
    title: "Platform",
    purpose: "Operate the Aipify business — customers, billing, catalog, governance.",
    routePrefixes: ["/platform"],
    codePaths: ["app/platform/", "components/platform/", "lib/platform/"],
    sellsProducts: true,
    ownsCustomers: true,
    receivesAttributionOnly: false,
    responsibilities: [
      "Customers",
      "Growth Partners program governance",
      "Subscriptions",
      "Billing",
      "Commissions oversight",
      "Business Packs catalog",
      "Marketplace",
      "Platform support",
      "Platform governance",
      "Customer success (platform view)",
      "Platform reporting",
    ],
    mustNever: [
      "Customer daily operational workspace",
      "Cross-tenant customer operational data exposure",
    ],
  },
  app: {
    layer: "app",
    title: "APP",
    purpose: "Customer organization workspace — every paying organization.",
    routePrefixes: ["/app", "/dashboard"],
    codePaths: ["app/app/", "components/app/", "lib/app/"],
    sellsProducts: false,
    ownsCustomers: false,
    receivesAttributionOnly: false,
    responsibilities: [
      "Employees, roles, permissions",
      "Knowledge, tasks, documents",
      "Companion (tenant-scoped)",
      "Business Pack purchase and activation",
      "Organization settings",
      "Reporting and workflows",
      "Operations",
    ],
    mustNever: [
      "Platform-wide billing administration for other tenants",
      "Super Admin controls",
      "Other customers' data",
    ],
  },
  employees: {
    layer: "employees",
    title: "Employees",
    purpose: "Users inside APP — inherit access; perform work.",
    routePrefixes: ["/app", "/dashboard"],
    codePaths: ["app/app/", "components/app/", "lib/app/"],
    sellsProducts: false,
    ownsCustomers: false,
    receivesAttributionOnly: false,
    responsibilities: [
      "Perform work",
      "Use assigned modules",
      "Complete tasks",
      "Access knowledge",
      "Collaborate",
    ],
    mustNever: [
      "Purchase Business Packs",
      "Manage subscriptions",
      "Own licenses directly",
    ],
  },
  partners: {
    layer: "partners",
    title: "Partners",
    purpose: "Generate leads and sales — sibling to APP under PLATFORM.",
    routePrefixes: ["/partners", "/growth-partners"],
    codePaths: [
      "app/partners/",
      "components/partners-portal/",
      "lib/partners-portal/",
      "app/app/growth-partner/",
      "lib/growth-partner-attribution/",
    ],
    sellsProducts: false,
    ownsCustomers: false,
    receivesAttributionOnly: true,
    responsibilities: [
      "Training",
      "Marketing and campaigns",
      "Leads",
      "Commissions (partner view)",
      "Payouts (partner view)",
      "Certifications",
      "Partner reporting",
    ],
    mustNever: [
      "Own customers",
      "Access Super Admin",
      "Access other partners' statistics",
      "Access customer internal APP data",
    ],
  },
};

/** Install Engine — APP-owned embedded layer (documented extension of APP) */
export const APP_EMBEDDED_LAYER = {
  title: "Install Engine (embedded)",
  routePrefixes: ["/api/install", "/api/embed"],
  codePaths: ["app/api/install/", "app/api/embed/", "lib/install/", "lib/embed/"],
  ownerLayer: "app" as const,
};

export const AIPIFY_STRUCTURE_PRINCIPLE =
  "PLATFORM sells · APP operates · EMPLOYEES use · PARTNERS sell.";

export const AIPIFY_CUSTOMER_OWNERSHIP_RULE =
  "Customers always belong to Aipify Platform. Partners receive attribution and commission only.";
