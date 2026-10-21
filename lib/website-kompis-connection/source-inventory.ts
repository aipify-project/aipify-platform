/**
 * Job 66 — Kompis Web connection / license / domain truth inventory (presentation only).
 * No new license model; compose existing Core contracts.
 */

export const WEBSITE_KOMPIS_CONNECTION_CENTER_VERSION = "66.1";

export type ConnectionTruthSourceId =
  | "product_module"
  | "subscription_license"
  | "domain_license_center"
  | "customer_domain_binding"
  | "installation"
  | "public_runtime"
  | "page_visibility";

export type ConnectionTruthSourceRow = {
  id: ConnectionTruthSourceId;
  authoritative: string;
  readPath: string;
  writePath: string;
  customerVisible: boolean;
  customerCanMutate: boolean;
  notes: string;
};

export const WEBSITE_KOMPIS_CONNECTION_TRUTH_SOURCES: ConnectionTruthSourceRow[] = [
  {
    id: "product_module",
    authoritative: "tenant_modules + is_tenant_module_enabled('website_kompis')",
    readPath: "RPC is_tenant_module_enabled / access-control plane",
    writePath: "Platform delivery / commercial packages (not this page)",
    customerVisible: true,
    customerCanMutate: false,
    notes: "Fail closed when unknown. Distinct from Subscription billing UI.",
  },
  {
    id: "subscription_license",
    authoritative: "get_app_organization_context + resolve_license_service_status",
    readPath: "Org context license_status / plan_name; licensed availability evaluator",
    writePath: "Account Subscription + Platform — never force-active from APP",
    customerVisible: true,
    customerCanMutate: false,
    notes: "Payment alone does not mean product ready.",
  },
  {
    id: "domain_license_center",
    authoritative: "organization_domains read for the active organization; page load does not call get_domain_license_center",
    readPath: "GET /api/app/domains",
    writePath: "POST /api/app/domains/action (create/activate/remove/purchase…)",
    customerVisible: true,
    customerCanMutate: true,
    notes: "Owner/admin. Domain list for APP license packs.",
  },
  {
    id: "customer_domain_binding",
    authoritative: "customer_domains (verified + active + installation_id)",
    readPath: "resolveWebsiteKompisCustomerDomainBinding (server)",
    writePath: "activate/deactivate_website_kompis_for_domain",
    customerVisible: true,
    customerCanMutate: true,
    notes: "Must correlate with org domain hostname; dual-store gap documented.",
  },
  {
    id: "installation",
    authoritative: "installations (status ready/installing/active/warning)",
    readPath: "Binding install id + domain settings API",
    writePath: "Install Engine / domain activation — no new keys in this job",
    customerVisible: true,
    customerCanMutate: false,
    notes: "Public install id may be shown for embed; never private secrets.",
  },
  {
    id: "public_runtime",
    authoritative: "Frozen public launcher + licensed availability at ask time",
    readPath: "No APP heartbeat inventory RPC",
    writePath: "none from this surface",
    customerVisible: true,
    customerCanMutate: false,
    notes: "Honest unavailable for last-seen; do not invent client health.",
  },
  {
    id: "page_visibility",
    authoritative: "Frozen loader default + protected-route hide (job 51)",
    readPath: "Documented runtime contract only — no APP page-rule CRUD",
    writePath: "none (would require migration + frozen-chain approval)",
    customerVisible: true,
    customerCanMutate: false,
    notes: "Default: all approved public pages on approved domain; protected routes hidden.",
  },
];

export const CONNECTION_UNSUPPORTED_WITHOUT_MIGRATION = [
  "app_install_heartbeat_last_seen",
  "customer_editable_page_include_exclude_rules",
  "unified_org_and_customer_domain_sot_rpc",
  "public_runtime_probe_from_app",
] as const;

/** Aggregate connection statuses shown to customers (business language). */
export const CONNECTION_AGGREGATE_STATUSES = [
  "active",
  "pending",
  "action_required",
  "error",
  "suspended",
  "unconfigured",
] as const;

export type ConnectionAggregateStatus = (typeof CONNECTION_AGGREGATE_STATUSES)[number];

export type ConnectionCheckpointId =
  | "product"
  | "subscription"
  | "license"
  | "domain"
  | "installation"
  | "public_runtime";

export type ConnectionCheckpointState =
  | "ok"
  | "pending"
  | "action_required"
  | "error"
  | "suspended"
  | "unavailable"
  | "unconfigured";

export type ConnectionDiagnosisCode =
  | "all_clear"
  | "product_not_enabled"
  | "license_inactive"
  | "subscription_inactive"
  | "domain_unverified"
  | "no_domain"
  | "install_missing"
  | "runtime_unknown"
  | "access_denied"
  | "unknown_conflict";
