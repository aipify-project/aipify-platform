/**
 * SQL approval-gate proposal — not applied until owner authorization.
 * Exact task name: Website Kompis Public Chain — visitor FAQ isolation Phase 2
 */

export const WEBSITE_KOMPIS_VISITOR_FAQ_SQL_PROPOSAL = {
  exactTaskName: "Website Kompis Public Chain — visitor FAQ isolation Phase 2",
  status: "awaiting_owner_sql_apply_authorization",
  migrationRelativePath:
    "supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql",
  /** SHA-256 of the migration file bytes at approval-gate authorship. Recompute before apply. */
  migrationSha256:
    "ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e",
  targetEnvironment: "Aipify Core (Supabase project qbcqoixhrvhnuwphefvw)",
  sqlApplied: false,
  frozenFilesTouched: 0,
  preferredApproach: "sql_only",
  objects: [
    "public._wpkf_count_active_verified_installs(uuid)",
    "public._wpkf_assert_install_owned_by_tenant(uuid, uuid)",
    "public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer)",
    "public.upsert_tenant_public_companion_faq_item(...)",
  ],
  notInThisMigration: [
    "list_tenant_public_companion_faq_items signature change (would need APP TS + new auth)",
    "legacy NULL mass backfill / delete",
    "organization_domains vs customer_domains repair",
    "frozen Website Kompis Public Chain TypeScript",
  ],
  legacyNullPolicy: {
    singleActiveVerifiedInstall: "allow",
    multiActiveVerifiedInstall: "deny",
    countBasis: "distinct customer_domains.installation_id with verified+active domain and non-revoked install",
    aliasesDoNotCountAsSeparateInstalls: true,
  },
} as const;
