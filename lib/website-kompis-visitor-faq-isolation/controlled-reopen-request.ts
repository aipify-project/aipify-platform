/**
 * CONTROLLED REOPEN REQUEST — Website Kompis Public Chain / Core SQL
 * Visitor FAQ isolation Phase 2
 *
 * This module is documentation for owner authorization only.
 * It does not apply migrations or edit frozen runtime files.
 */

export const WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_REOPEN_REQUEST = {
  title: "Website Kompis Public Chain — visitor FAQ isolation Phase 2",
  status: "awaiting_owner_authorization",
  reason:
    "Public visitor FAQ search still matches install_id IS NULL for every install under a tenant. APP Phase 1 scoping cannot close this path. Fix requires Core SQL (and frozen TS only if post-RPC filtering is preferred over SQL).",

  threatModel: [
    "Tenant with installs A and B: legacy NULL FAQ authored for site A is returned to visitors on site B",
    "Site-scoped FAQ for B is correctly filtered today, but NULL rows bleed across installs",
    "Fail-open on ambiguous install/domain must not expose FAQ titles/snippets/metadata",
  ],

  preferredApproach: "sql_only_rpc_body_change",
  preferredApproachRationale:
    "Frozen TypeScript only invokes search_tenant_public_visitor_knowledge; changing the RPC WHERE clause alone can enforce isolation without editing the 46 protected runtime files — if owner authorizes SQL separately.",

  sqlObjectsRequired: [
    {
      object: "public.search_tenant_public_visitor_knowledge",
      change:
        "Replace NULL-OR-match with: exact install_id match OR (NULL AND tenant has ≤1 active verified install). Fail closed when visitor context unresolved.",
      baselineMigrationEvidence: [
        "supabase/migrations/20261932400000_tenant_public_companion_faq_rpcs.sql",
        "supabase/migrations/20261932500000_widen_website_kompis_faq_retrieval.sql",
      ],
    },
    {
      object: "public.list_tenant_public_companion_faq_items",
      change:
        "Add optional p_install_id with owner/admin + tenant ownership check; filter server-side (Phase 1 APP filter becomes defense-in-depth).",
    },
    {
      object: "public.upsert_tenant_public_companion_faq_item",
      change:
        "Validate p_install_id belongs to tenant via customer_domains/installations before insert/update; reject foreign installs.",
    },
  ],

  frozenRuntimeFiles: {
    requiredIfSqlOnly: [],
    requiredIfTsPostFilterChosenInstead: [
      {
        path: "lib/marketing/public-companion-tenant-faq.ts",
        role: "Tenant FAQ retrieval + relevance",
        baselineSha256FromManifest:
          "c3bc317ee311c365805855955a39e7da982612dc7741a3fd438359d8d6160737",
      },
      {
        path: "lib/marketing/public-companion-ask.ts",
        role: "Ask orchestration + evidence collection",
        baselineSha256FromManifest:
          "3f826ea8edaa509f7e7cadd0ca1ec5ffe87dca5805c5243f53c4c24937de1f96",
      },
      {
        path: "app/api/marketing/companion/ask/route.ts",
        role: "Public ask HTTP entry",
        baselineSha256FromManifest:
          "e2f497cebb8ddcf9506f25439aa06a945f749894597ab16fde514e3ce50797cd",
      },
    ],
    note: "Prefer SQL-only so frozen reopen is NOT required. If owner chooses TS post-filter, name these files explicitly in the authorization.",
  },

  whyNotWithoutFreezeOrSql:
    "Visitor ask path always calls the anon RPC; APP filters never run on public asks. No non-frozen TypeScript sits between ask route and the RPC result for FAQ rows.",

  compatibilityPlan: {
    singleActiveInstall:
      "Keep NULL legacy rows visible so existing single-site published FAQ (e.g. five published rows with mostly NULL install_id) continues to answer visitors.",
    multiActiveInstall:
      "Stop NULL bleed immediately; site-scoped rows continue; NULL rows remain in DB for admin migration job (separate).",
    rollback:
      "Restore previous function body from migration 20261932500000; no data rewrite required if NULL rows were not mass-updated.",
  },

  testMatrixRequiredBeforeLive: [
    "Tenant T installs A+B: FAQ A only on A, FAQ B only on B",
    "Tenant T legacy NULL: visible when install count ≤1; hidden from each install when count ≥2",
    "Invalid/wrong-tenant installId / domain mismatch: fail closed, no FAQ metadata leak",
    "Draft/unpublished/wrong surface/wrong locale: never public",
    "Employee knowledge / Bedrift: never in visitor FAQ RPC",
    "Site-index / current-page paths unchanged for non-FAQ evidence",
    "No paid Production AI load test",
  ],

  ownerDecisionRequired: [
    "Authorize SQL apply for the three RPC objects above (exact migration file to be authored after approval).",
    "Authorize Website Kompis Public Chain reopen ONLY if rejecting SQL-only and requiring TS post-filter (name the three files + goal: visitor FAQ isolation Phase 2).",
    "Confirm legacy NULL policy: allow for ≤1 active verified install; deny for multi-install (recommended).",
    "Confirm no Production FAQ mass-migration in the same job.",
  ],

  explicitlyNotAuthorizedByPhase2JobAlone: [
    "SQL/schema/RLS apply",
    "Frozen public chain file edits",
    "Production data mutation / domain repair",
    "Paid AI asks",
  ],
} as const;
