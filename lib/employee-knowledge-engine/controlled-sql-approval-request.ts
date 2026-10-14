/**
 * CONTROLLED SQL APPROVAL REQUEST
 * Job: AIPIFY_KOMPIS_BEDRIFT_ANSATTKUNNSKAP_SHARED_LOAD_REPAIR_V1_2026_10_14
 *
 * Ordinary APP code cannot fix the shared Ansattkunnskap load failure.
 * PostgREST runs STABLE RPCs in READ ONLY transactions; the center RPC writes
 * via ensure_eke_settings → SQLSTATE 25006 → GET /api/employee-knowledge 400.
 * Production apply (authorized 2026-10-14): migration 202619383 on Core.
 */

export const EKE_CENTER_SHARED_LOAD_SQL_APPROVAL = {
  status: "PRODUCTION_APPLIED_2026_10_14" as const,
  targetProject: {
    name: "Aipify Core",
    ref: "qbcqoixhrvhnuwphefvw",
  },
  migrationFile:
    "supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql",
  exactSql: `alter function public.get_customer_employee_knowledge_center()
  volatile;`,
  rootCause: {
    rpc: "get_customer_employee_knowledge_center",
    currentVolatility: "STABLE (provolatile=s)",
    writeCallee: "ensure_eke_settings(uuid)",
    postgrestRule:
      "POST /rpc + STABLE → READ ONLY; INSERT fails with SQLSTATE 25006",
    provenProbe:
      "ensure_eke_settings under transaction_read_only → cannot execute INSERT in a read-only transaction",
    appPath:
      "GET /api/employee-knowledge → rpc(get_customer_employee_knowledge_center) → 400 → loadError",
  },
  consequences: {
    changes: [
      "Volatility of get_customer_employee_knowledge_center() STABLE → VOLATILE",
    ],
    doesNotChange: [
      "Table schema",
      "RLS policies",
      "EXECUTE grants",
      "Return JSON contract",
      "Tenant/auth helpers",
      "Website Kompis Public Chain (46 files)",
      "Migration 20261938200000 visitor FAQ isolation",
    ],
  },
  postApplyVerification: [
    "select p.provolatile from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='get_customer_employee_knowledge_center'; -- expect 'v'",
    "Authenticated GET /api/employee-knowledge returns 200 with has_customer true|false (not 400 read-only)",
    "Four Bedrift cards → /app/settings/employee-knowledge load without loadError",
  ],
  forbiddenWithoutSeparateApproval: [
    "apply migration to Production",
    "push/merge deployable migration as LIVE without SQL gate",
    "weaken RLS / service-role bypass in APP",
    "mock-success empty center",
    "edit frozen Website Kompis Public Chain files",
    "edit or re-apply 20261938200000",
  ],
} as const;
