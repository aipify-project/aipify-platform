import type { PlatformNavId } from "@/lib/platform/nav-config";

/**
 * Canonical Platform control-plane information architecture.
 * Navigation groups must map to these sections — do not invent parallel menus.
 */
export const PLATFORM_CONTROL_PLANE_SECTIONS = [
  "overview",
  "customers",
  "salesFinance",
  "partners",
  "productCore",
  "operations",
  "governance",
] as const;

export type PlatformControlPlaneSectionId =
  (typeof PLATFORM_CONTROL_PLANE_SECTIONS)[number];

export type PlatformControlPlaneReadiness =
  | "production"
  | "engine"
  | "hub"
  | "planned"
  | "stub";

export type PlatformControlPlaneSurface = {
  navId: PlatformNavId;
  href: string;
  readiness: PlatformControlPlaneReadiness;
  authoritativeSource: string;
  requiresCapability:
    | "customer_read"
    | "finance_read"
    | "partner_read"
    | "operations_read"
    | "security_read"
    | "audit_read"
    | "product_publish";
};

export type PlatformControlPlaneSection = {
  id: PlatformControlPlaneSectionId;
  labelKey: string;
  descriptionKey: string;
  surfaces: PlatformControlPlaneSurface[];
};

export const PLATFORM_CONTROL_PLANE_IA: PlatformControlPlaneSection[] = [
  {
    id: "overview",
    labelKey: "platform.navGroups.overview",
    descriptionKey: "platform.controlPlane.sections.overview.description",
    surfaces: [
      {
        navId: "overview",
        href: "/platform",
        readiness: "production",
        authoritativeSource: "get_platform_portal_dashboard",
        requiresCapability: "operations_read",
      },
    ],
  },
  {
    id: "customers",
    labelKey: "platform.navGroups.customers",
    descriptionKey: "platform.controlPlane.sections.customers.description",
    surfaces: [
      {
        navId: "organizations",
        href: "/platform/customers",
        readiness: "production",
        authoritativeSource: "get_platform_portal_customers",
        requiresCapability: "customer_read",
      },
      {
        navId: "customerSuccess",
        href: "/platform/customer-success",
        readiness: "production",
        authoritativeSource: "get_platform_portal_customer_success_overview",
        requiresCapability: "customer_read",
      },
      {
        navId: "support",
        href: "/platform/support",
        readiness: "engine",
        authoritativeSource: "list_platform_support_queue",
        requiresCapability: "customer_read",
      },
      {
        navId: "subscriptions",
        href: "/platform/subscriptions",
        readiness: "production",
        authoritativeSource: "get_platform_portal_customer_agreements_overview",
        requiresCapability: "customer_read",
      },
      {
        navId: "licenses",
        href: "/platform/licenses",
        readiness: "production",
        authoritativeSource: "get_platform_portal_licenses_overview",
        requiresCapability: "customer_read",
      },
      {
        navId: "installationOversight",
        href: "/platform/installations",
        readiness: "engine",
        authoritativeSource: "installations oversight readers",
        requiresCapability: "customer_read",
      },
    ],
  },
  {
    id: "salesFinance",
    labelKey: "platform.navGroups.salesFinance",
    descriptionKey: "platform.controlPlane.sections.salesFinance.description",
    surfaces: [
      {
        navId: "payments",
        href: "/platform/billing",
        readiness: "engine",
        authoritativeSource: "get_platform_billing_commerce_center",
        requiresCapability: "finance_read",
      },
      {
        navId: "invoices",
        href: "/platform/billing/invoices",
        readiness: "engine",
        authoritativeSource: "list_platform_invoices",
        requiresCapability: "finance_read",
      },
      {
        navId: "paymentOperations",
        href: "/platform/billing/payment-operations",
        readiness: "engine",
        authoritativeSource: "payment operations center",
        requiresCapability: "finance_read",
      },
      {
        navId: "commercialIntelligence",
        href: "/platform/revenue",
        readiness: "engine",
        authoritativeSource: "commercial intelligence center",
        requiresCapability: "finance_read",
      },
      {
        navId: "taxVerification",
        href: "/platform/billing/tax-verification",
        readiness: "engine",
        authoritativeSource: "billing tax verification",
        requiresCapability: "finance_read",
      },
    ],
  },
  {
    id: "partners",
    labelKey: "platform.navGroups.partners",
    descriptionKey: "platform.controlPlane.sections.partners.description",
    surfaces: [
      {
        navId: "growthPartners",
        href: "/platform/partners",
        readiness: "hub",
        authoritativeSource: "platform partners hub → billing + partners portal settlement",
        requiresCapability: "partner_read",
      },
      {
        navId: "growthPartnerAttribution",
        href: "/platform/billing/growth-partner-attribution",
        readiness: "engine",
        authoritativeSource: "get_platform_growth_partner_links_overview",
        requiresCapability: "partner_read",
      },
      {
        navId: "commissions",
        href: "/platform/billing/commissions",
        readiness: "engine",
        authoritativeSource: "unified billing admin commissions section",
        requiresCapability: "partner_read",
      },
    ],
  },
  {
    id: "productCore",
    labelKey: "platform.navGroups.productCore",
    descriptionKey: "platform.controlPlane.sections.productCore.description",
    surfaces: [
      {
        navId: "verifiedProviders",
        href: "/platform/providers",
        readiness: "engine",
        authoritativeSource: "get_platform_verified_provider_registry",
        requiresCapability: "product_publish",
      },
      {
        navId: "providerOnboarding",
        href: "/platform/provider-onboarding",
        readiness: "engine",
        authoritativeSource: "provider onboarding contracts",
        requiresCapability: "product_publish",
      },
      {
        navId: "moduleRegistry",
        href: "/platform/modules/registry",
        readiness: "engine",
        authoritativeSource: "get_platform_module_registry_overview",
        requiresCapability: "product_publish",
      },
      {
        navId: "kompisAi",
        href: "/platform/kompis-ai",
        readiness: "production",
        authoritativeSource: "platform portal Kompis status",
        requiresCapability: "product_publish",
      },
      {
        navId: "websiteReleaseVerification",
        href: "/platform/website-verification",
        readiness: "production",
        authoritativeSource: "website verification runs",
        requiresCapability: "product_publish",
      },
      {
        navId: "knowledgeCenter",
        href: "/platform/knowledge/evolution-center",
        readiness: "engine",
        authoritativeSource: "knowledge evolution center",
        requiresCapability: "product_publish",
      },
    ],
  },
  {
    id: "operations",
    labelKey: "platform.navGroups.operations",
    descriptionKey: "platform.controlPlane.sections.operations.description",
    surfaces: [
      {
        navId: "operationsOverview",
        href: "/platform/operations/overview",
        readiness: "engine",
        authoritativeSource: "platform operations snapshot",
        requiresCapability: "operations_read",
      },
      {
        navId: "platformHealth",
        href: "/platform/operations/platform-health",
        readiness: "engine",
        authoritativeSource: "get_platform_health_operations_center",
        requiresCapability: "operations_read",
      },
      {
        navId: "reliabilityOperations",
        href: "/platform/reliability",
        readiness: "engine",
        authoritativeSource: "get_platform_reliability_center",
        requiresCapability: "operations_read",
      },
      {
        navId: "changeOperations",
        href: "/platform/change-operations",
        readiness: "engine",
        authoritativeSource: "change operations center",
        requiresCapability: "operations_read",
      },
      {
        navId: "exceptionQueue",
        href: "/platform/exceptions",
        readiness: "hub",
        authoritativeSource: "platform control plane exception queue (links only)",
        requiresCapability: "operations_read",
      },
    ],
  },
  {
    id: "governance",
    labelKey: "platform.navGroups.governance",
    descriptionKey: "platform.controlPlane.sections.governance.description",
    surfaces: [
      {
        navId: "actions",
        href: "/platform/actions",
        readiness: "engine",
        authoritativeSource: "platform action approvals",
        requiresCapability: "audit_read",
      },
      {
        navId: "securityReviews",
        href: "/platform/trust/security",
        readiness: "engine",
        authoritativeSource: "get_platform_trust_governance",
        requiresCapability: "security_read",
      },
      {
        navId: "governanceRecords",
        href: "/platform/governance/compliance-center",
        readiness: "engine",
        authoritativeSource: "compliance governance center",
        requiresCapability: "audit_read",
      },
      {
        navId: "trust",
        href: "/platform/trust",
        readiness: "engine",
        authoritativeSource: "trust center aggregates",
        requiresCapability: "security_read",
      },
    ],
  },
];

export function listPrimaryNavSurfaces(): PlatformControlPlaneSurface[] {
  return PLATFORM_CONTROL_PLANE_IA.flatMap((section) =>
    section.surfaces.filter((surface) => surface.readiness !== "stub" && surface.readiness !== "planned"),
  );
}
