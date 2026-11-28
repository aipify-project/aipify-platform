/**
 * Phase A — Sales Partner → APP migration IA / route / access contract.
 *
 * Documentation + testable constants only. Does not change runtime nav, redirects,
 * APP shell, or `/partners` cutover. Phase B owns thin APP hosts.
 *
 * Source preflight: AIPIFY_SALES_PARTNER_APP_MIGRATION_PREFLIGHT_READY (28.11.2026).
 */

import { APP_CONTENT_MAX_WIDTH_PX, AppLayoutClasses } from "@/lib/design/app-layout";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { CSP_PARTNER_PORTAL_ALLOWED_STATUSES } from "@/lib/certified-sales-partner/partner-access";
import { CSP_PARTNER_PORTAL_NAV_GROUPS } from "@/lib/partners-portal/csp-nav";

export const SALES_PARTNER_APP_MIGRATION_PHASE = "A" as const;
export const SALES_PARTNER_APP_MODULE_BASE = "/app/sales-partner" as const;
export const SALES_PARTNER_MODULE_KEY = "sales_partner" as const;

/** Design tokens Phase B hosts must use (APP shell — no parallel layout). */
export const SALES_PARTNER_APP_DESIGN_CONTRACT = {
  contentMaxWidthPx: APP_CONTENT_MAX_WIDTH_PX,
  pageWidthClass: AppLayoutClasses.pageWidth,
  pagePaddingXClass: AppLayoutClasses.pagePaddingX,
  naming: {
    kompisLocales: ["no", "sv", "da"] as const,
    buddyLocales: ["en", "pl", "uk", "es"] as const,
  },
} as const;

/**
 * Aipify's own certified seller program (CSP) vs future paid Sales Partner module
 * for external companies. Phase A documents the split — does not build multi-tenant commerce.
 */
export const SALES_PARTNER_PROGRAM_IDENTITY = {
  aipifyCertifiedProgram: {
    id: "aipify_certified_sales_partner",
    identitySource: "csp_partner_profiles.auth_user_id + status",
    accessPolicy: "partner_identity",
    tenantScope: "program_scoped_partner_id — not customer APP product entitlement",
    dataPlane: "csp_* tables + /api/certified-sales-partner/*",
    automaticAppProductEntitlement: false,
  },
  futureExternalPaidModule: {
    id: "external_tenant_sales_partner_module",
    status: "not_in_phase_a",
    isolationRequired: "per customer organization_id / tenant — no cross-tenant ledger or settlement",
    commercialEngineInPhaseA: false,
  },
} as const;

export type SalesPartnerRouteCapability =
  | "overview"
  | "products"
  | "links"
  | "sales_page"
  | "leads"
  | "customers"
  | "pipeline"
  | "commissions"
  | "academy"
  | "certificates"
  | "tools"
  | "materials"
  | "email_templates"
  | "messages"
  | "notifications"
  | "profile"
  | "help";

export type SalesPartnerRouteRow = {
  capability: SalesPartnerRouteCapability;
  /** Canonical CSP seller URL today (authenticated panel). */
  currentPartnersPath: string;
  /** Target APP module path (Phase B hosts). */
  targetAppPath: string;
  /** Host CSP panel in APP first, or reuse shared APP surface. */
  hostStrategy: "thin_app_host" | "reuse_app_surface";
  parityNotes: string;
};

/** Complete authenticated-panel route matrix — public surfaces are listed separately. */
export const SALES_PARTNER_APP_ROUTE_MATRIX: readonly SalesPartnerRouteRow[] = [
  {
    capability: "overview",
    currentPartnersPath: "/partners",
    targetAppPath: "/app/sales-partner",
    hostStrategy: "thin_app_host",
    parityNotes: "CertifiedSalesPartnerWorkspacePanel + portal session",
  },
  {
    capability: "products",
    currentPartnersPath: "/partners/marketing/product-catalog",
    targetAppPath: "/app/sales-partner/products",
    hostStrategy: "thin_app_host",
    parityNotes: "Same Product Center/Core; publish_sale for seller catalog; no customer buy CTA",
  },
  {
    capability: "links",
    currentPartnersPath: "/partners/referrals/links",
    targetAppPath: "/app/sales-partner/links",
    hostStrategy: "thin_app_host",
    parityNotes: "Attribution links; public /p/* unchanged",
  },
  {
    capability: "sales_page",
    currentPartnersPath: "/partners/sales-page",
    targetAppPath: "/app/sales-partner/sales-page",
    hostStrategy: "thin_app_host",
    parityNotes: "Personal landing; public /s/[code] unchanged",
  },
  {
    capability: "leads",
    currentPartnersPath: "/partners/customers/leads",
    targetAppPath: "/app/sales-partner/leads",
    hostStrategy: "thin_app_host",
    parityNotes: "CSP leads API",
  },
  {
    capability: "customers",
    currentPartnersPath: "/partners/customers/prospects",
    targetAppPath: "/app/sales-partner/customers",
    hostStrategy: "thin_app_host",
    parityNotes: "Canonical customers = prospects; APP binding /partners/customers has no page root today",
  },
  {
    capability: "pipeline",
    currentPartnersPath: "/partners/customers/pipeline",
    targetAppPath: "/app/sales-partner/pipeline",
    hostStrategy: "thin_app_host",
    parityNotes: "Sales pipeline",
  },
  {
    capability: "commissions",
    currentPartnersPath: "/partners/settlement",
    targetAppPath: "/app/sales-partner/commissions",
    hostStrategy: "thin_app_host",
    parityNotes:
      "CSP nav settlement is canonical; APP binding /partners/business-continuity/commission is a Phase A gap to resolve in B bindings (not cutover yet)",
  },
  {
    capability: "academy",
    currentPartnersPath: "/partners/academy/training",
    targetAppPath: "/app/sales-partner/academy",
    hostStrategy: "thin_app_host",
    parityNotes: "APP binding /partners/academy has no page root today",
  },
  {
    capability: "certificates",
    currentPartnersPath: "/partners/academy/certifications",
    targetAppPath: "/app/sales-partner/certificates",
    hostStrategy: "thin_app_host",
    parityNotes: "Public verify stays at /partners/academy/verify/[id] until stable redirect plan",
  },
  {
    capability: "tools",
    currentPartnersPath: "/partners/marketing/assets",
    targetAppPath: "/app/sales-partner/tools",
    hostStrategy: "thin_app_host",
    parityNotes: "Sales tools section of marketing center",
  },
  {
    capability: "materials",
    currentPartnersPath: "/partners/marketing/assets?section=library",
    targetAppPath: "/app/sales-partner/materials",
    hostStrategy: "thin_app_host",
    parityNotes: "Must become distinct route — stop relying on ?section=library panel switch",
  },
  {
    capability: "email_templates",
    currentPartnersPath: "/partners/marketing/email-templates",
    targetAppPath: "/app/sales-partner/email-templates",
    hostStrategy: "thin_app_host",
    parityNotes: "Marketing email templates",
  },
  {
    capability: "messages",
    currentPartnersPath: "/partners/account/messages",
    targetAppPath: "/app/sales-partner/messages",
    hostStrategy: "thin_app_host",
    parityNotes:
      "Phase B: host CSP inbox in APP; Phase C: evaluate merge with APP communications. Fix missing send button as migration requirement",
  },
  {
    capability: "notifications",
    currentPartnersPath: "/partners/account/notifications",
    targetAppPath: "/app/sales-partner/notifications",
    hostStrategy: "thin_app_host",
    parityNotes:
      "Phase C interim thin host (CSP unread). Shared /app/notifications reuse remains unknown until signed-in QA",
  },
  {
    capability: "profile",
    currentPartnersPath: "/partners/account/profile",
    targetAppPath: "/app/sales-partner/profile",
    hostStrategy: "thin_app_host",
    parityNotes:
      "Phase C thin host preserves payout/certification; do not auto-merge into /app/profile",
  },
  {
    capability: "help",
    currentPartnersPath: "/partners/account/settings",
    targetAppPath: "/app/sales-partner/help",
    hostStrategy: "thin_app_host",
    parityNotes:
      "Phase C thin host for partner settings; Support Ticket intake fenced to Agent 3 — dual-role may also open /app/support",
  },
] as const;

/** Surfaces that must stay public / out of APP authenticated module. */
export const SALES_PARTNER_PUBLIC_SURFACES = [
  { path: "/p/[slug]", kind: "attribution" },
  { path: "/p/[partnerSlug]/[productSlug]", kind: "product_attribution" },
  { path: "/s/[code]", kind: "personal_sales_page" },
  { path: "/partners/academy/verify/[certificateId]", kind: "certificate_verify" },
  { path: "/certified-sales-partner", kind: "registration_landing" },
] as const;

/** Must never be merged blindly into CSP Sales Partner module. */
export const SALES_PARTNER_EXCLUDED_APP_SURFACES = [
  "/app/growth-partner",
  "/app/partners",
  "/app/sales",
  "/app/sales-expert-engine",
  "/app/partner-success-engine",
  "/platform/sellers",
] as const;

export type LiveBindingGap = {
  navId: keyof typeof FOUNDATION_NAV_BINDINGS;
  liveHref: string;
  issue: "missing_page_root" | "diverges_from_csp_nav" | "ok";
  contractTarget: string;
};

/**
 * Today's APP deep-links vs contract. Phase A documents gaps; Phase B may fix
 * bindings without retiring `/partners`.
 */
/**
 * Live APP deep-links after Phase B host cutover (menu → `/app/sales-partner/*`).
 * Historical Phase A gaps (missing customers/academy roots; commissions ≠ settlement)
 * are resolved by thin hosts + additive `/partners` root redirects — `/partners` not retired.
 */
export const SALES_PARTNER_LIVE_BINDING_GAPS: readonly LiveBindingGap[] = [
  {
    navId: "salesPartnerOverview",
    liveHref: FOUNDATION_NAV_BINDINGS.salesPartnerOverview,
    issue: "ok",
    contractTarget: "/app/sales-partner",
  },
  {
    navId: "salesPartnerProducts",
    liveHref: FOUNDATION_NAV_BINDINGS.salesPartnerProducts,
    issue: "ok",
    contractTarget: "/app/sales-partner/products",
  },
  {
    navId: "salesPartnerCustomers",
    liveHref: FOUNDATION_NAV_BINDINGS.salesPartnerCustomers,
    issue: "ok",
    contractTarget: "/app/sales-partner/customers",
  },
  {
    navId: "salesPartnerCommissions",
    liveHref: FOUNDATION_NAV_BINDINGS.salesPartnerCommissions,
    issue: "ok",
    contractTarget: "/app/sales-partner/commissions",
  },
  {
    navId: "salesPartnerAcademy",
    liveHref: FOUNDATION_NAV_BINDINGS.salesPartnerAcademy,
    issue: "ok",
    contractTarget: "/app/sales-partner/academy",
  },
] as const;

export type AccessActor =
  | "app_customer_no_partner"
  | "csp_approved_seller"
  | "csp_suspended_seller"
  | "dual_role_company_user_and_csp"
  | "unauthenticated"
  | "platform_admin";

export type AccessExpectation = {
  actor: AccessActor;
  salesPartnerModuleVisible: boolean;
  partnersPanelAllowed: boolean | "n/a";
  notes: string;
};

export const SALES_PARTNER_ACCESS_MATRIX: readonly AccessExpectation[] = [
  {
    actor: "app_customer_no_partner",
    salesPartnerModuleVisible: false,
    partnersPanelAllowed: false,
    notes: "partner_identity false — no automatic entitlement",
  },
  {
    actor: "csp_approved_seller",
    salesPartnerModuleVisible: true,
    partnersPanelAllowed: true,
    notes: "status in approved|active|certified|in_academy",
  },
  {
    actor: "csp_suspended_seller",
    salesPartnerModuleVisible: false,
    partnersPanelAllowed: false,
    notes: "hard deny — not soft mode",
  },
  {
    actor: "dual_role_company_user_and_csp",
    salesPartnerModuleVisible: true,
    partnersPanelAllowed: true,
    notes: "Generic login prefers APP company membership; seller module still identity-gated",
  },
  {
    actor: "unauthenticated",
    salesPartnerModuleVisible: false,
    partnersPanelAllowed: false,
    notes: "401 / login",
  },
  {
    actor: "platform_admin",
    salesPartnerModuleVisible: false,
    partnersPanelAllowed: false,
    notes: "Platform uses /platform/sellers — not seller module",
  },
] as const;

export const SALES_PARTNER_ALLOWED_STATUSES_CONTRACT = CSP_PARTNER_PORTAL_ALLOWED_STATUSES;

/** Product catalog display contract for seller module (no duplicate price source). */
export const SALES_PARTNER_PRODUCT_DISPLAY_CONTRACT = {
  authoritativeSource: "Product Center / Core csp_sales_products + variant prices",
  channelFlags: { publishSale: "seller catalog visibility", publishApp: "APP store — separate" },
  sellerSees: [
    "images",
    "info",
    "price_variants",
    "commission",
    "info_share_actions",
    "attribution_link",
  ] as const,
  sellerMustNotSee: ["customer_purchase_cta"] as const,
  hardCodedPricesForbidden: true,
  agent2DependencySqlForbiddenInThisStream: true,
} as const;

/** Concrete migration requirements (do not patch old portal in Phase A). */
export const SALES_PARTNER_MIGRATION_REQUIREMENTS = [
  {
    id: "portal_load_60_120s",
    symptom: "60–120s blank / hung first paint",
    primaryFiles: [
      "components/partners-portal/CspPortalSessionProvider.tsx",
      "app/api/certified-sales-partner/portal/route.ts",
      "lib/certified-sales-partner/core-rpc.ts",
      "lib/partners-portal/server-access.ts",
      "app/partners/layout.tsx",
    ],
    phase: "B",
  },
  {
    id: "messages_missing_send",
    symptom: "Missing or unreachable send control / message errors",
    primaryFiles: [
      "components/partners-portal/PartnersMessagesCenterPanel.tsx",
      "app/api/certified-sales-partner/messages/route.ts",
      "app/partners/account/messages/page.tsx",
    ],
    phase: "B",
  },
  {
    id: "materials_section_query_panel_switch",
    symptom: "Guidelines/materials nav switches in-page panel via ?section=library",
    primaryFiles: [
      "lib/partners-portal/csp-nav.ts",
      "components/partners-portal/CertifiedSalesPartnerMarketingCenter.tsx",
      "components/partners-portal/PartnersPortalShell.tsx",
    ],
    phase: "B",
  },
] as const;

/** Exact Phase B thin-host file order (create under APP; reuse CSP panels). */
export const SALES_PARTNER_PHASE_B_FILE_PLAN = [
  {
    order: 1,
    action: "add",
    path: "lib/sales-partner-app-migration/phase-b-hosts.ts",
    note: "Host registry mapping targetAppPath → CSP panel import",
  },
  {
    order: 2,
    action: "add",
    path: "app/app/sales-partner/layout.tsx",
    note: "APP shell + partner_identity server gate (adapt server-access; no /partners cutover)",
  },
  {
    order: 3,
    action: "add",
    path: "app/app/sales-partner/page.tsx",
    note: "Overview thin host",
  },
  {
    order: 4,
    action: "add",
    path: "app/app/sales-partner/products/page.tsx",
    note: "Catalog thin host — Core only",
  },
  {
    order: 5,
    action: "add",
    path: "app/app/sales-partner/{links,sales-page,leads,customers,pipeline,commissions,academy,certificates,tools,materials,email-templates,messages}/page.tsx",
    note: "Remaining thin hosts per route matrix",
  },
  {
    order: 6,
    action: "extend",
    path: "locales/{en,no,sv,da,pl,uk}/customer-app/*.json",
    note: "salesPartner module labels — Buddy/Kompis naming",
  },
  {
    order: 7,
    action: "test",
    path: "lib/sales-partner-app-migration/phase-b-hosts.test.ts",
    note: "Host parity + gate contract tests",
  },
] as const;

export const SALES_PARTNER_PHASE_C_SCOPE =
  "Shared APP profile/notifications/feedback/KC/support parity; messages unification decision" as const;
export const SALES_PARTNER_PHASE_D_SCOPE =
  "Retire authenticated /partners shell only after separate owner YES; keep public URLs + history" as const;

export type ProvenUnknown = { id: string; status: "proven" | "unknown"; detail: string };

export const SALES_PARTNER_PHASE_A_PROVEN_VS_UNKNOWN: readonly ProvenUnknown[] = [
  {
    id: "csp_nav_paths",
    status: "proven",
    detail: "CSP_PARTNER_PORTAL_NAV_GROUPS paths exist in repo",
  },
  {
    id: "binding_customers_academy_roots_missing",
    status: "proven",
    detail: "No app/partners/customers/page.tsx or academy/page.tsx roots",
  },
  {
    id: "commission_binding_diverges",
    status: "proven",
    detail: "FOUNDATION_NAV_BINDINGS.salesPartnerCommissions ≠ CSP settlement",
  },
  {
    id: "access_statuses",
    status: "proven",
    detail: "CSP_PARTNER_PORTAL_ALLOWED_STATUSES match partner-access.ts",
  },
  {
    id: "design_width_1560",
    status: "proven",
    detail: "APP_CONTENT_MAX_WIDTH_PX and AppLayoutClasses.pageWidth",
  },
  {
    id: "external_tenant_paid_module_isolation_model",
    status: "unknown",
    detail: "Future commercial multi-tenant seller program schema not designed — Phase A forbids building it",
  },
  {
    id: "messages_merge_into_app_comms",
    status: "proven",
    detail:
      "Phase C keeps CSP inbox module-local at /app/sales-partner/messages — not merged into APP communications",
  },
  {
    id: "dual_role_ux_default_landing",
    status: "proven",
    detail: "get-post-login-path prefers active company_users over partners for generic login",
  },
] as const;

/** CSP nav hrefs that must appear as currentPartnersPath (or materials query variant). */
export function listCspNavHrefs(): string[] {
  return CSP_PARTNER_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
}

export function findMatrixRowByCurrentPath(path: string): SalesPartnerRouteRow | undefined {
  return SALES_PARTNER_APP_ROUTE_MATRIX.find((r) => r.currentPartnersPath === path);
}
