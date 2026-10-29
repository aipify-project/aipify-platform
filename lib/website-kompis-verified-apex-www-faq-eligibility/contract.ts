/**
 * FROZEN: Website Kompis verified apex↔www FAQ visitor domain eligibility.
 *
 * Changing the SQL predicate, verification checks, or install isolation for
 * this contract requires explicit owner approval and updated contract tests.
 *
 * Enforce with:
 *   npx --yes tsx lib/website-kompis-verified-apex-www-faq-eligibility/verified-apex-www-faq-eligibility.contract.test.ts
 */

export const WEBSITE_KOMPIS_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_CONTRACT = {
  status: "FROZEN",
  taskId: "AIPIFY_KOMPIS_CORE_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_REPAIR_V1",
  migrationRelativePath:
    "supabase/migrations/20261939600000_website_kompis_verified_apex_www_faq_eligibility_v1.sql",
  rpc: "public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer)",
  helpers: [
    "public._wpkf_is_exact_apex_www_pair(text, text)",
    "public._wpkf_faq_domain_eligible_for_resolved_visitor(text, text, uuid, uuid)",
  ] as const,
  rules: [
    "Keep NULL FAQ domain and NULL resolved_domain eligible (legacy).",
    "Keep exact f.domain = resolved_domain eligible.",
    "Additional match only for exact one-label www ↔ apex pair (normalize_domain; no general www strip).",
    "Both hostnames must be verified + active customer_domains with installation_id = resolved_install_id for the visitor tenant.",
    "Do not equate unrelated subdomains, unverified/inactive aliases, or cross-tenant/cross-install hosts.",
    "Do not change _wpkf_resolve_visitor_context, ranking, scoring, or frozen Public Chain TypeScript in this contract.",
  ] as const,
  forbiddenBarePredicateInSearchBody: /^\s*or f\.domain = s\.resolved_domain\s*$/m,
  requiredEligibilityCall: "_wpkf_faq_domain_eligible_for_resolved_visitor",
  frozenPublicChainUntouched: [
    "lib/marketing/public-companion-ask.ts",
    "lib/marketing/public-companion-tenant-faq.ts",
  ] as const,
  enforceCommand:
    "npx --yes tsx lib/website-kompis-verified-apex-www-faq-eligibility/verified-apex-www-faq-eligibility.contract.test.ts",
  followUpNotInThisChange:
    "APP FAQ visibility diagnostic dry-run still probes item.domain (often apex) rather than the live widget host; separate follow-up — do not bundle into this SQL-only repair.",
  rollback:
    "Re-apply prior search_tenant_public_visitor_knowledge body from 20261938200000 (exact domain equality only) and drop the two helpers if unused; retain install isolation helpers from 202619382.",
} as const;

/** Authoritative migration SHA-256 of the SQL file bytes. */
export const WEBSITE_KOMPIS_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_MIGRATION_SHA256 =
  "1e51265f080086979d18b84fbc4b59cec12295e68f7f6098553d1e0b89879d9e";
