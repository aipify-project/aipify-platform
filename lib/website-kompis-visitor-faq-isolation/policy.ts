/**
 * Public visitor FAQ isolation policy.
 * A read-only Production check found the exact-one predicate in
 * search_tenant_public_visitor_knowledge. This module does not apply SQL
 * and does not change the frozen public ask chain.
 */

export const WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_PHASE = "2.0" as const;

export type VisitorFaqLegacyNullPolicy =
  | "allow_when_tenant_has_exactly_one_active_verified_install"
  | "deny_when_tenant_has_multiple_active_installs";

/**
 * Deterministic legacy NULL policy (universal — no customer hardcoding).
 *
 * - NULL install_id means legacy tenant-global FAQ authored before site scoping.
 * - Exactly one active verified install: keep NULL rows visible (preserves existing
 *   single-site published FAQ without mass migration).
 * - Zero active verified installs: do not include NULL.
 * - Multiple active verified installs: NEVER mix NULL into every site; only
 *   rows with explicit matching install_id are visitor-visible.
 */
export const WEBSITE_KOMPIS_VISITOR_FAQ_LEGACY_NULL_POLICY = {
  singleActiveInstall: "allow_when_tenant_has_exactly_one_active_verified_install" as const,
  multiActiveInstall: "deny_when_tenant_has_multiple_active_installs" as const,
  meaningOfNull: "legacy_tenant_global_pre_site_scope",
  noRandomAssignment: true,
  noCustomerHardcoding: true,
} as const;

/** Previous search predicate, still present in migration 202619325. The live function no longer uses it. */
export const WEBSITE_KOMPIS_VISITOR_FAQ_CURRENT_LEAK_SQL_FRAGMENT =
  "f.install_id is null or f.install_id = ctx.resolved_install_id";

/**
 * Target filter semantics for search_tenant_public_visitor_knowledge (proposal).
 * Applied only via authorized migration — not executed by this module.
 */
export function shouldIncludeFaqRowForVisitor(input: {
  faqInstallId: string | null;
  resolvedInstallId: string | null;
  tenantActiveVerifiedInstallCount: number;
  contextTrusted: boolean;
}): boolean {
  if (!input.contextTrusted || !input.resolvedInstallId) {
    return false;
  }
  if (input.faqInstallId === input.resolvedInstallId) {
    return true;
  }
  if (input.faqInstallId == null) {
    return input.tenantActiveVerifiedInstallCount === 1;
  }
  return false;
}

export const WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_STATUS = {
  appAdminIsolation: "multi_site_legacy_null_hidden",
  coreVisitorIsolation: "live_exact_one_null",
  wholeChainIsolation: "partial",
} as const;

export const WEBSITE_KOMPIS_VISITOR_FAQ_CROSS_PRODUCT_BOUNDARY = {
  employeeKnowledge: "never_in_visitor_faq_rpc",
  bedriftDocuments: "never_in_visitor_faq_rpc",
  surfaceRequired: "website_kompis",
  publishedRequired: true,
  publicSafeRequired: true,
} as const;
