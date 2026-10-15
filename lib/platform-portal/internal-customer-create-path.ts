/**
 * D2S — Internal customer create path (Platform + Core interface).
 *
 * Concrete, least-privilege path for a future super_admin-authorized
 * environment_type=internal create. Ship with all gates CLOSED.
 *
 * Ordinary Platform create remains production-only. This module must never be
 * read as permission to create a sandbox, invite an admin, or grant Bedrift.
 */

import {
  CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
  CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  D2F_OWNER_STATED_SANDBOX_IDENTITY,
  type PlatformCustomerCreateEnvironmentType,
} from "./customer-environment-type-contract";
import { CUSTOMER_CREATE_EXECUTE_ENABLED } from "./create-customer-prepare";
import {
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_HELPER_FLIP_AUTHORIZED,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256,
  INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED,
} from "./internal-sandbox-enablement-contract";
import { PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED } from "./legal-acceptance-evidence-contract";
import {
  ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
  ADMIN_PROVISION_OWNER_ALLOWLIST,
} from "./admin-provisioning";

export const INTERNAL_CUSTOMER_CREATE_PATH_CONTRACT_ID =
  "platform_internal_customer_create_path_v1" as const;

/**
 * Live Platform execute of internal create stays off until a named owner job.
 * Distinct from ordinary production create (which uses Core RPC as today).
 */
export const INTERNAL_CUSTOMER_CREATE_PATH_EXECUTE_ENABLED = false;

/**
 * Empty — no auth user id is authorized to request internal create on Platform.
 * Populating this set is a separate named owner job (never in D2S).
 */
export const INTERNAL_CUSTOMER_CREATE_ACTOR_ALLOWLIST: ReadonlySet<string> =
  new Set();

/** Core helper-allowlist SQL (NOT_APPLIED). Empty table ⇒ helper still false. */
export const INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_PATH =
  "docs/platform/NOT_APPLIED_platform_internal_customer_create_helper_allowlist_v1.sql" as const;

export const INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_SHA256 =
  "23c0a794320e21ca5bf246c96749dafba74707b69f5ed10b08c3bd45d60d3396" as const;

export const INTERNAL_CUSTOMER_CREATE_INTENDED_SLUG =
  "aipify-internal-bedrift-demo" as const;

export const INTERNAL_CUSTOMER_CREATE_INTENDED_ADMIN_EMAIL =
  "admin@aipify.ai" as const;

export type PlatformCustomerCreateActorRole =
  | "super_admin"
  | "platform_support"
  | null;

export type InternalCustomerCreatePathDenialCode =
  | "internal_create_path_execute_disabled"
  | "platform_internal_environment_not_authorized"
  | "platform_create_execute_disabled"
  | "actor_not_super_admin"
  | "actor_not_on_internal_create_allowlist"
  | "core_environment_type_rpc_not_connected"
  | "client_forged_internal_environment"
  | "internal_intent_required";

export type CustomerCreateRpcEnvironmentSelection = {
  p_environment_type: PlatformCustomerCreateEnvironmentType;
  path: "ordinary_production" | "internal_authorized" | "denied";
  denialCode: InternalCustomerCreatePathDenialCode | null;
  clientForgeryAttempt: boolean;
  actorRole: PlatformCustomerCreateActorRole;
  gates: {
    pathExecuteEnabled: boolean;
    platformInternalAuthorized: boolean;
    platformCreateExecuteEnabled: boolean;
    actorIsSuperAdmin: boolean;
    actorOnAllowlist: boolean;
    rpcConnected: boolean;
    coreHelperExpectedToday: false;
  };
};

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

function gateOn(flag: boolean): boolean {
  return flag;
}

/**
 * Resolve p_environment_type for create_platform_portal_customer.
 *
 * Ordinary create: always production (authorizedInternalCreateIntent=false).
 * Internal create: every named gate must pass; otherwise denied.
 * Client-supplied environment_type is never sufficient authorization.
 */
export function selectCustomerCreateEnvironmentTypeForRpc(input: {
  actorRole: PlatformCustomerCreateActorRole;
  actorAuthUserId: string | null;
  /**
   * Trusted server-only intent. Must not be derived solely from client body.
   * D2S ships with callers always passing false for ordinary create.
   */
  authorizedInternalCreateIntent: boolean;
  /** Raw client field — forgery detection only. */
  clientEnvironmentType?: unknown;
}): CustomerCreateRpcEnvironmentSelection {
  const clientRaw = text(input.clientEnvironmentType);
  const clientForgeryAttempt =
    clientRaw === "internal" && !input.authorizedInternalCreateIntent;

  const actorIsSuperAdmin = input.actorRole === "super_admin";
  const actorOnAllowlist =
    typeof input.actorAuthUserId === "string" &&
    input.actorAuthUserId.length > 0 &&
    INTERNAL_CUSTOMER_CREATE_ACTOR_ALLOWLIST.has(input.actorAuthUserId);

  const gates = {
    pathExecuteEnabled: gateOn(INTERNAL_CUSTOMER_CREATE_PATH_EXECUTE_ENABLED),
    platformInternalAuthorized: gateOn(
      CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
    ),
    platformCreateExecuteEnabled: gateOn(CUSTOMER_CREATE_EXECUTE_ENABLED),
    actorIsSuperAdmin,
    actorOnAllowlist,
    rpcConnected: gateOn(CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED),
    coreHelperExpectedToday: false as const,
  };

  // Ordinary production path — ignore client environment_type.
  if (!input.authorizedInternalCreateIntent) {
    if (clientForgeryAttempt) {
      return {
        p_environment_type: "production",
        path: "denied",
        denialCode: "client_forged_internal_environment",
        clientForgeryAttempt: true,
        actorRole: input.actorRole,
        gates,
      };
    }
    return {
      p_environment_type: "production",
      path: "ordinary_production",
      denialCode: null,
      clientForgeryAttempt: false,
      actorRole: input.actorRole,
      gates,
    };
  }

  // Explicit internal intent — evaluate every gate.
  if (!gates.pathExecuteEnabled) {
    return {
      p_environment_type: "production",
      path: "denied",
      denialCode: "internal_create_path_execute_disabled",
      clientForgeryAttempt,
      actorRole: input.actorRole,
      gates,
    };
  }
  if (!gates.platformInternalAuthorized) {
    return {
      p_environment_type: "production",
      path: "denied",
      denialCode: "platform_internal_environment_not_authorized",
      clientForgeryAttempt,
      actorRole: input.actorRole,
      gates,
    };
  }
  if (!gates.platformCreateExecuteEnabled) {
    return {
      p_environment_type: "production",
      path: "denied",
      denialCode: "platform_create_execute_disabled",
      clientForgeryAttempt,
      actorRole: input.actorRole,
      gates,
    };
  }
  if (input.actorRole === "platform_support" || !actorIsSuperAdmin) {
    return {
      p_environment_type: "production",
      path: "denied",
      denialCode: "actor_not_super_admin",
      clientForgeryAttempt,
      actorRole: input.actorRole,
      gates,
    };
  }
  if (!actorOnAllowlist) {
    return {
      p_environment_type: "production",
      path: "denied",
      denialCode: "actor_not_on_internal_create_allowlist",
      clientForgeryAttempt,
      actorRole: input.actorRole,
      gates,
    };
  }
  if (!gates.rpcConnected) {
    return {
      p_environment_type: "production",
      path: "denied",
      denialCode: "core_environment_type_rpc_not_connected",
      clientForgeryAttempt,
      actorRole: input.actorRole,
      gates,
    };
  }

  return {
    p_environment_type: "internal",
    path: "internal_authorized",
    denialCode: null,
    clientForgeryAttempt,
    actorRole: input.actorRole,
    gates,
  };
}

export type InternalCustomerCreatePathPacket = {
  contractId: typeof INTERNAL_CUSTOMER_CREATE_PATH_CONTRACT_ID;
  mode: "author_only";
  dryRun: true;
  executeEnabled: false;
  ordinaryCreate: {
    alwaysPassesProduction: true;
    routeIgnoresClientEnvironmentTypeUnlessForgery: true;
  };
  intendedIdentity: {
    legalName: "Aipify Group AS";
    organizationNumberOwnerStated: "937978960";
    slug: typeof INTERNAL_CUSTOMER_CREATE_INTENDED_SLUG;
    adminEmail: typeof INTERNAL_CUSTOMER_CREATE_INTENDED_ADMIN_EMAIL;
    environmentType: "internal";
    classification: "INTERNAL_DEMO_NOT_BILLABLE";
    createAuthorizedInThisJob: false;
  };
  namedGatesClosed: {
    pathExecuteEnabled: false;
    platformInternalAuthorized: false;
    platformCreateExecuteEnabled: false;
    actorAllowlistEmpty: true;
    coreHelperReturnsFalse: true;
    coreHelperAllowlistSqlApplied: false;
  };
  dependenciesBlockedForFirstCreate: {
    legalAcceptance: "PROPOSED_NOT_APPROVED_OR_REQUIRE_REAL_SOURCE";
    legalSourceConnected: false;
    adminAuthVerified: false;
    inviteDeliveryConnected: false;
    inviteAllowlistEmpty: true;
    note: "D3 must provide real invite/accept for admin@aipify.ai — never fake membership inserts.";
  };
  entitlementPathSeparate: {
    product: "kompis_bedrift";
    billable: false;
    usesCommercialSubscription: false;
    sqlPath: typeof INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH;
    sqlSha256: typeof INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256;
    sqlApplied: false;
    rpcConnected: false;
    helperFlipAuthorized: false;
    sandboxEnablementExecuteEnabled: false;
    note: "Create path does not grant Bedrift. D2M exception SQL + helper flip are separate owner jobs after create.";
  };
  coreHelperAllowlistSql: {
    path: typeof INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_PATH;
    applied: false;
    effectWhenAppliedStillEmpty: "helper_remains_false";
  };
  nextOwnerDecision: {
    id: "d2t_apply_internal_customer_create_helper_allowlist_sql";
    requiresSeparateOwnerJob: true;
    scope: "Apply ONLY the NOT_APPLIED helper-allowlist SQL (table empty; helper still false). No tenant create. No Platform flag flip.";
  };
  sideEffects: {
    appliesSql: false;
    createsCustomer: false;
    createsAuthUser: false;
    sendsEmail: false;
    writesMembership: false;
    grantsKompisBedrift: false;
    flipsHelpers: false;
    mutatesUnoNight: false;
    enablesBilling: false;
  };
  falsePassForbidden: true;
};

export function buildInternalCustomerCreatePathPacket(): InternalCustomerCreatePathPacket {
  const identity = D2F_OWNER_STATED_SANDBOX_IDENTITY;
  return {
    contractId: INTERNAL_CUSTOMER_CREATE_PATH_CONTRACT_ID,
    mode: "author_only",
    dryRun: true,
    executeEnabled: false,
    ordinaryCreate: {
      alwaysPassesProduction: true,
      routeIgnoresClientEnvironmentTypeUnlessForgery: true,
    },
    intendedIdentity: {
      legalName: "Aipify Group AS",
      organizationNumberOwnerStated: identity.organizationNumberOwnerStated,
      slug: INTERNAL_CUSTOMER_CREATE_INTENDED_SLUG,
      adminEmail: INTERNAL_CUSTOMER_CREATE_INTENDED_ADMIN_EMAIL,
      environmentType: "internal",
      classification: "INTERNAL_DEMO_NOT_BILLABLE",
      createAuthorizedInThisJob: false,
    },
    namedGatesClosed: {
      pathExecuteEnabled: false,
      platformInternalAuthorized: false,
      platformCreateExecuteEnabled: false,
      actorAllowlistEmpty: true,
      coreHelperReturnsFalse: true,
      coreHelperAllowlistSqlApplied: false,
    },
    dependenciesBlockedForFirstCreate: {
      legalAcceptance: "PROPOSED_NOT_APPROVED_OR_REQUIRE_REAL_SOURCE",
      legalSourceConnected: PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
      adminAuthVerified: identity.adminAuthVerified,
      inviteDeliveryConnected: ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
      inviteAllowlistEmpty: ADMIN_PROVISION_OWNER_ALLOWLIST.size === 0,
      note: "D3 must provide real invite/accept for admin@aipify.ai — never fake membership inserts.",
    },
    entitlementPathSeparate: {
      product: "kompis_bedrift",
      billable: false,
      usesCommercialSubscription: false,
      sqlPath: INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH,
      sqlSha256: INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256,
      sqlApplied: false,
      rpcConnected: INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED,
      helperFlipAuthorized:
        INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_HELPER_FLIP_AUTHORIZED,
      sandboxEnablementExecuteEnabled: INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED,
      note: "Create path does not grant Bedrift. D2M exception SQL + helper flip are separate owner jobs after create.",
    },
    coreHelperAllowlistSql: {
      path: INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_PATH,
      applied: false,
      effectWhenAppliedStillEmpty: "helper_remains_false",
    },
    nextOwnerDecision: {
      id: "d2t_apply_internal_customer_create_helper_allowlist_sql",
      requiresSeparateOwnerJob: true,
      scope:
        "Apply ONLY the NOT_APPLIED helper-allowlist SQL (table empty; helper still false). No tenant create. No Platform flag flip.",
    },
    sideEffects: {
      appliesSql: false,
      createsCustomer: false,
      createsAuthUser: false,
      sendsEmail: false,
      writesMembership: false,
      grantsKompisBedrift: false,
      flipsHelpers: false,
      mutatesUnoNight: false,
      enablesBilling: false,
    },
    falsePassForbidden: true,
  };
}

/** Fail-closed invariant for merge safety. */
export function assertInternalCustomerCreatePathClosed(): boolean {
  return (
    INTERNAL_CUSTOMER_CREATE_PATH_EXECUTE_ENABLED === false &&
    CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED === false &&
    CUSTOMER_CREATE_EXECUTE_ENABLED === false &&
    INTERNAL_CUSTOMER_CREATE_ACTOR_ALLOWLIST.size === 0 &&
    INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED === false &&
    INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED === false
  );
}
