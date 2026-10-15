/**
 * D2F / D2M — Generic Platform/Core customer create environment_type contract.
 *
 * Canonical create-path values: production | internal.
 * Schema also allows pilot/customer/enterprise/staging (legacy + staging harness);
 * those are not selectable via ordinary Platform create prepare.
 *
 * Post-D2L (2026-10-15): Core create is 6-arg with p_environment_type (default
 * production). Internal create remains fail-closed while Core helper and Platform
 * CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED stay false. This module must
 * not be read as "internal sandbox available" or "Bedrift demo works".
 */

/** Values accepted on the future generic create path (NOT connected to Core yet). */
export const PLATFORM_CUSTOMER_CREATE_ENVIRONMENT_TYPES = [
  "production",
  "internal",
] as const;

export type PlatformCustomerCreateEnvironmentType =
  (typeof PLATFORM_CUSTOMER_CREATE_ENVIRONMENT_TYPES)[number];

/**
 * Live customers.environment_type check constraint values after
 * 20261935700000_platform_website_staging_verification_v2.sql.
 */
export const CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES = [
  "internal",
  "pilot",
  "customer",
  "enterprise",
  "production",
  "staging",
] as const;

export type CustomersEnvironmentTypeSchemaValue =
  (typeof CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES)[number];

export const CUSTOMER_CREATE_ENVIRONMENT_TYPE_CONTRACT_ID =
  "platform_customer_create_environment_type_v1" as const;

/**
 * Server-side authorization to request environment_type=internal on create.
 * Empty/false by design — never trust a client-supplied internal flag alone.
 */
export const CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED = false;

/**
 * Whether Core create RPC accepts p_environment_type.
 * True after D2L applied v1.1 enforcement SQL (SHA 546c60b9…78584).
 * Does NOT authorize internal create or Platform execute.
 */
export const CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED = true;

/**
 * Canonical apply candidate (D2J): D2G enforcement SQL + service_role EXECUTE.
 * NOT_APPLIED — not in supabase/migrations/. SHA must match file bytes exactly.
 */
export const CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_PATH =
  "docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_1_service_role_grant.sql" as const;

export const CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_SHA256 =
  "546c60b949f85097479207de8ad9e1a8bbe313e25e0def7d0f2732db70f78584" as const;

/**
 * D2G v1 (superseded for apply — omitted service_role EXECUTE after DROP/CREATE).
 * Kept for historical identity checks only; do not cite for Production apply.
 */
export const CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_PATH =
  "docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql" as const;

export const CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256 =
  "83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b" as const;

/**
 * Default Core persist when p_environment_type is omitted (RPC default).
 * Post-D2L Core no longer hardcodes ignoring the parameter; production remains
 * the safe default for ordinary Platform create.
 */
export const CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE =
  "production" as const;

/** Alias — preferred name after D2L connected the RPC parameter. */
export const CUSTOMER_CREATE_CORE_DEFAULT_ENVIRONMENT_TYPE =
  CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE;

export type CustomerCreateEnvironmentTypeErrorCode =
  | "invalid_environment_type"
  | "internal_environment_not_authorized"
  | "environment_type_rpc_not_connected";

export type CustomerCreateEnvironmentResolution = {
  requested: PlatformCustomerCreateEnvironmentType | null;
  resolved: PlatformCustomerCreateEnvironmentType;
  defaultApplied: boolean;
  serverInternalAuthorized: boolean;
  rpcConnected: boolean;
  /** Honest: what Core would persist if create ran today. */
  coreWouldPersistToday: typeof CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE;
  enforcementStatus: "not_enforced" | "prepare_only" | "enforced";
  clientForgeryRejected: boolean;
};

export type InternalEnvironmentInvariantStatus = {
  key: string;
  declared: true;
  enforcedToday: boolean;
  /**
   * Honest post-apply expectation for the D2G NOT_APPLIED executable SQL only.
   * Still false until an owner apply YES; Platform connect may remain separate.
   */
  enforcedAfterExecutableSqlApply: boolean;
  evidence: string;
};

/**
 * Owner-stated D2F inputs for the future named sandbox create job.
 * NOT verified registry/auth facts. NOT execute authorization.
 */
export const D2F_OWNER_STATED_SANDBOX_IDENTITY = {
  legalName: "Aipify Group AS",
  organizationNumberOwnerStated: "937978960",
  organizationNumberVerified: false,
  organizationNumberVerificationSource: null as
    | "brreg"
    | "operator"
    | null,
  plannedSlug: "aipify-internal-bedrift-demo",
  adminEmail: "admin@aipify.ai",
  adminAuthVerified: false,
  adminInviteDeliveryVerified: false,
  desiredEnvironmentType: "internal" as const,
  purpose: [
    "internal_functional_test",
    "later_internal_sales_demonstrations",
  ] as const,
  notPublicWebsite: true,
  notBillable: true,
} as const;

function text(value: unknown): string | null {
  const result = value == null ? "" : String(value).trim().toLowerCase();
  return result || null;
}

export function isPlatformCustomerCreateEnvironmentType(
  value: unknown,
): value is PlatformCustomerCreateEnvironmentType {
  return (
    typeof value === "string" &&
    (PLATFORM_CUSTOMER_CREATE_ENVIRONMENT_TYPES as readonly string[]).includes(
      value,
    )
  );
}

export function isCustomersEnvironmentTypeSchemaValue(
  value: unknown,
): value is CustomersEnvironmentTypeSchemaValue {
  return (
    typeof value === "string" &&
    (CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES as readonly string[]).includes(
      value,
    )
  );
}

/**
 * Resolve create-path environment_type from request + server authorization.
 * Defaults to production. Rejects unknown values. Rejects internal unless
 * CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED is true (server flag).
 */
export function resolveCustomerCreateEnvironmentType(input: {
  requested: unknown;
  /**
   * Must come from trusted server config / allowlist evaluation — never from
   * a client boolean such as `isInternal: true`.
   */
  serverInternalAuthorized?: boolean;
}):
  | { ok: true; value: CustomerCreateEnvironmentResolution }
  | { ok: false; code: CustomerCreateEnvironmentTypeErrorCode } {
  const serverInternalAuthorized =
    input.serverInternalAuthorized ??
    CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED;

  const raw = text(input.requested);
  if (raw == null) {
    return {
      ok: true,
      value: {
        requested: null,
        resolved: "production",
        defaultApplied: true,
        serverInternalAuthorized,
        rpcConnected: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
        coreWouldPersistToday: CUSTOMER_CREATE_CORE_DEFAULT_ENVIRONMENT_TYPE,
        enforcementStatus: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED
          ? "enforced"
          : "not_enforced",
        clientForgeryRejected: false,
      },
    };
  }

  if (!isPlatformCustomerCreateEnvironmentType(raw)) {
    return { ok: false, code: "invalid_environment_type" };
  }

  if (raw === "internal" && !serverInternalAuthorized) {
    return { ok: false, code: "internal_environment_not_authorized" };
  }

  return {
    ok: true,
    value: {
      requested: raw,
      resolved: raw,
      defaultApplied: false,
      serverInternalAuthorized,
      rpcConnected: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
      // When RPC is connected, Core persists the resolved value (still blocked
      // for internal by Core helper + Platform authorize flags).
      coreWouldPersistToday: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED
        ? raw
        : CUSTOMER_CREATE_CORE_DEFAULT_ENVIRONMENT_TYPE,
      enforcementStatus: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED
        ? "enforced"
        : "prepare_only",
      clientForgeryRejected: false,
    },
  };
}

/** Declared internal invariants vs today's honest enforcement. */
export function listInternalEnvironmentInvariants(): InternalEnvironmentInvariantStatus[] {
  return [
    {
      key: "not_billable",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "D2L applied: triggers block subscriptions + license links for internal; Stripe/provider objects remain a separate gate",
    },
    {
      key: "no_automatic_provisioning",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "Create RPC creates identity only (no licenses/domains/installs)",
    },
    {
      key: "no_public_website_binding",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "D2L applied: triggers block organization_domains, customer_domains, installations for internal; website CMS publish paths remain a separate gate",
    },
    {
      key: "no_automatic_license_grant",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "Create does not write tenant_modules; Bedrift activate remain allowlist-gated; license-link trigger blocks internal; commercial activate still needs subscription (D2M exception SQL separate)",
    },
    {
      key: "no_security_control_bypass",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "Platform access still required; internal additionally requires super_admin + fail-closed helper",
    },
    {
      key: "super_admin_only_internal_create",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "D2L applied: platform_support denied via INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED; helper still false so super_admin also denied",
    },
    {
      key: "admin_reporting_label",
      declared: true,
      enforcedToday: false,
      enforcedAfterExecutableSqlApply: false,
      evidence:
        "No Platform UI badge/filter for internal create-path customers yet (UI follow-up)",
    },
    {
      key: "full_audit_isolation",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "D2L applied: platform_customer_created audit metadata includes environment_type",
    },
    {
      key: "persisted_environment_type_internal",
      declared: true,
      enforcedToday: true,
      enforcedAfterExecutableSqlApply: true,
      evidence:
        "D2L applied: create accepts p_environment_type; helper remains false so unauthorized internal create stays blocked",
    },
  ];
}

export function buildCustomerCreateEnvironmentTypePreparePacket(input?: {
  requested?: unknown;
  serverInternalAuthorized?: boolean;
}): {
  contractId: typeof CUSTOMER_CREATE_ENVIRONMENT_TYPE_CONTRACT_ID;
  mode: "prepare";
  dryRun: true;
  createPathValues: typeof PLATFORM_CUSTOMER_CREATE_ENVIRONMENT_TYPES;
  schemaValues: typeof CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES;
  rpcConnected: boolean;
  internalAuthorized: boolean;
  coreHardcodedToday: typeof CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE;
  resolution:
    | CustomerCreateEnvironmentResolution
    | { error: CustomerCreateEnvironmentTypeErrorCode };
  invariants: InternalEnvironmentInvariantStatus[];
  ownerStatedSandboxIdentity: typeof D2F_OWNER_STATED_SANDBOX_IDENTITY;
  falsePassForbidden: true;
  sideEffects: {
    appliesSql: false;
    createsCustomer: false;
    changesCoreRpc: false;
  };
} {
  const resolved = resolveCustomerCreateEnvironmentType({
    requested: input?.requested,
    serverInternalAuthorized: input?.serverInternalAuthorized,
  });

  return {
    contractId: CUSTOMER_CREATE_ENVIRONMENT_TYPE_CONTRACT_ID,
    mode: "prepare",
    dryRun: true,
    createPathValues: PLATFORM_CUSTOMER_CREATE_ENVIRONMENT_TYPES,
    schemaValues: CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES,
    rpcConnected: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
    internalAuthorized:
      input?.serverInternalAuthorized ??
      CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
    coreHardcodedToday: CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE,
    resolution: resolved.ok
      ? resolved.value
      : { error: resolved.code },
    invariants: listInternalEnvironmentInvariants(),
    ownerStatedSandboxIdentity: D2F_OWNER_STATED_SANDBOX_IDENTITY,
    falsePassForbidden: true,
    sideEffects: {
      appliesSql: false,
      createsCustomer: false,
      changesCoreRpc: false,
    },
  };
}

/**
 * Fail-closed for internal create / execute. RPC may be connected after D2L
 * without authorizing sandbox creation.
 */
export function assertEnvironmentTypeContractIsPrepareOnly(): boolean {
  return (
    CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED === false &&
    CUSTOMER_CREATE_CORE_DEFAULT_ENVIRONMENT_TYPE === "production"
  );
}
