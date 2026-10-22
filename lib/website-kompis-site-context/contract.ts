/**
 * Written product/data contract for Kompis Web site-scoped knowledge — Phase 1.
 * Authoritative runtime retrieval still uses frozen public chain + Core RPCs.
 */

export const WEBSITE_KOMPIS_SITE_SCOPED_KNOWLEDGE_PHASE = "1.0" as const;

export const WEBSITE_KOMPIS_SITE_SCOPE_CONTRACT = {
  tenant: "customers.id (= organizations.id bridge); APP via get_app_organization_context.customer_id",
  site: "installations.id bound through customer_domains.installation_id (verified + active preferred)",
  locale: "per FAQ row (tenant_public_companion_faq_items.locale); not inferred from Bedrift",
  published: "status=published AND public_safe AND surface=website_kompis for visitor retrieval",
  legacyNullInstallId:
    "install_id IS NULL is kept and is not assigned to a website. One website may still show it. More than one website hides it in APP.",
  bedrift:
    "employee_knowledge_items / Kompis Bedrift never feed public Website Kompis FAQ or ask",
  appListRpc:
    "list_tenant_public_companion_faq_items has no p_install_id — APP filters after list using server-owned site set",
  appUpsertRpc:
    "upsert_tenant_public_companion_faq_item accepts p_install_id but does not validate ownership — APP must validate",
  visitorSearch:
    "search_tenant_public_visitor_knowledge matches (install_id IS NULL OR install_id = resolved) — CROSS_SITE PARTIAL until SQL job",
  organizationDomainsVsCustomerDomains:
    "APP Domain License Center uses organization_domains; public trust uses customer_domains — dual-store gap",
  domainNormalization:
    "Core normalize_domain: lower + strip scheme/path; sanitizePublicCompanionDomain similar; www≠apex unless both bound",
} as const;

/** Recommended canonical domain policy (analysis only — no Production writes in Phase 1). */
export const WEBSITE_KOMPIS_CANONICAL_DOMAIN_RECOMMENDATION = {
  preferHostLoaderDomain: "Keep data-domain equal to a verified customer_domains row (today: www.* when host uses www).",
  apexAndWww:
    "Treat apex and www as separate hostnames until an owner-approved alias/migration binds both to the same install.",
  organizationDomainsRepair:
    "Separate data job: ensure organization_domains includes every customer_domains hostname used in APP connection UI; do not invent aliases automatically.",
  noAutoAliasInPhase1: true,
} as const;

/**
 * Proposed future Core change-set (NOT applied in Phase 1).
 * Requires separate owner authorization — may touch visitor retrieval.
 */
export const WEBSITE_KOMPIS_SITE_SCOPE_FUTURE_SQL_CHANGESET = {
  status: "blocked_until_owner_auth",
  goals: [
    "Add optional p_install_id to list_tenant_public_companion_faq_items with server-side ownership check",
    "Validate upsert p_install_id belongs to tenant via customer_domains/installations",
    "Visitor search: include NULL install_id only when the tenant has at most one verified active installation. Do not bulk-assign existing NULL rows.",
  ],
  frozenRisk:
    "Changing search_tenant_public_visitor_knowledge / ask path may require named Website Kompis Public Chain reopen",
  consequences: [
    "Without visitor SQL change, legacy NULL FAQs remain visible to every install under the tenant",
    "APP-only filtering cannot claim CROSS_SITE_FAQ_ISOLATION=VERIFIED",
  ],
} as const;
