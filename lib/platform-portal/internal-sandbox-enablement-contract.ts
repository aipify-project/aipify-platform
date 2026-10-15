/**
 * D2M — Internal sandbox enablement & non-billable Bedrift test entitlement
 * contract (Platform + Core design). Default-off. No Production writes.
 *
 * After D2L, Core create is 6-arg with p_environment_type and exposure
 * triggers block subscriptions / license links / domains / installations for
 * internal customers. Commercial activate_platform_portal_customer_kompis_bedrift
 * still requires a healthy subscription — so an internal demo cannot honestly
 * receive Bedrift via that path until a separate NOT_APPLIED exception is
 * applied and later authorized.
 *
 * This module must never be read as "sandbox is LIVE" or "Bedrift demo works".
 */

import {
  CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
  CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  D2F_OWNER_STATED_SANDBOX_IDENTITY,
} from "./customer-environment-type-contract";
import { CUSTOMER_CREATE_EXECUTE_ENABLED } from "./create-customer-prepare";
import {
  ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
  ADMIN_PROVISION_OWNER_ALLOWLIST,
} from "./admin-provisioning";
import { KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST } from "./kompis-bedrift-activation";
import { PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED } from "./legal-acceptance-evidence-contract";

export const INTERNAL_SANDBOX_ENABLEMENT_CONTRACT_ID =
  "platform_internal_sandbox_enablement_v1" as const;

/** Live enablement execute (create/invite/grant) stays off. */
export const INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED = false;

/**
 * Whether Core status/activate RPCs understand the non-billable internal demo
 * entitlement exception. False until the D2M NOT_APPLIED SQL is owner-applied.
 */
export const INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED = false;

/** Fail-closed — Core helper flip is a separate named owner job. */
export const INTERNAL_CUSTOMER_CREATE_HELPER_FLIP_AUTHORIZED = false;

/** Fail-closed — demo Bedrift helper flip is a separate named owner job. */
export const INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_HELPER_FLIP_AUTHORIZED = false;

export const INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH =
  "docs/platform/NOT_APPLIED_platform_internal_demo_bedrift_entitlement_exception_v1.sql" as const;

export const INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256 =
  "546723f178f51bde870aeb761e28f0e9ae37084c1158136b4801a6839ffaf393" as const;

/** Reserved existing Web pilot slug — never convert or entitle as Bedrift sandbox. */
export const FORBIDDEN_SANDBOX_COLLISION_SLUGS = ["unonight"] as const;

export type InternalSandboxEnablementBlockCode =
  | "core_create_helper_false"
  | "platform_internal_create_not_authorized"
  | "platform_create_execute_disabled"
  | "demo_bedrift_rpc_not_connected"
  | "demo_bedrift_helper_flip_not_authorized"
  | "legal_acceptance_unverified"
  | "admin_identity_unverified"
  | "invite_delivery_not_connected"
  | "organization_number_collides_existing_customer"
  | "organization_number_collides_unonight"
  | "organization_number_unverified"
  | "bedrift_activate_allowlist_empty"
  | "exposure_triggers_block_commercial_subscription_path"
  | "sandbox_execute_disabled";

export type RegistryCollisionProbe = {
  organizationNumber: string | null;
  matchingCustomerId: string | null;
  matchingSlug: string | null;
  matchingEnvironmentType: string | null;
};

export type InternalSandboxEnablementGate = {
  code: InternalSandboxEnablementBlockCode | string;
  satisfied: boolean;
  severity: "block" | "advisory";
  detail: string;
};

export type InternalSandboxEnablementPacket = {
  contractId: typeof INTERNAL_SANDBOX_ENABLEMENT_CONTRACT_ID;
  mode: "prepare";
  dryRun: true;
  executeEnabled: false;
  corePostD2L: {
    createRpcArity: 6;
    createRpcConnectedInPlatform: boolean;
    internalCreateHelperAuthorized: false;
    exposureTriggersBlock: readonly [
      "subscriptions",
      "aipify_billing_license_links",
      "organization_domains",
      "customer_domains",
      "installations",
    ];
    commercialBedriftActivateRequiresSubscription: true;
    tenantModulesWritableWithoutSubscription: true;
  };
  ownerStatedIdentity: typeof D2F_OWNER_STATED_SANDBOX_IDENTITY;
  proposedEntitlement: {
    product: "kompis_bedrift";
    billable: false;
    usesCommercialSubscription: false;
    usesLicenseLinks: false;
    usesPublicDomainsOrInstalls: false;
    store: "tenant_modules";
    activatePath: "activate_platform_portal_customer_kompis_bedrift";
    exceptionHelper: "_platform_portal_internal_demo_bedrift_entitlement_authorized";
    exceptionDefault: false;
    sqlPath: typeof INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH;
    sqlApplied: false;
    rpcConnected: boolean;
  };
  gates: InternalSandboxEnablementGate[];
  nextOwnerDecision: {
    id: "d2m_apply_internal_demo_bedrift_entitlement_sql";
    requiresSeparateOwnerJob: true;
    scope:
      "Apply ONLY the NOT_APPLIED internal demo Bedrift entitlement exception SQL (helper remains false; no tenant create; no grant).";
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

/**
 * Detect unsafe orgnr reuse — especially the live collision of owner-stated
 * Aipify Group AS orgnr with the existing UnoNight customer row.
 */
export function evaluateSandboxOrganizationNumberSafety(input: {
  ownerStatedOrganizationNumber: string;
  organizationNumberVerified: boolean;
  collision: RegistryCollisionProbe | null;
}): InternalSandboxEnablementGate[] {
  const gates: InternalSandboxEnablementGate[] = [
    {
      code: "organization_number_unverified",
      satisfied: input.organizationNumberVerified,
      severity: "block",
      detail:
        "Owner-stated organization number is not yet verified against an authoritative registry before create.",
    },
  ];

  const match = input.collision;
  if (
    match?.matchingCustomerId &&
    match.organizationNumber === input.ownerStatedOrganizationNumber
  ) {
    const slug = (match.matchingSlug || "").toLowerCase();
    const isUnoNight = (FORBIDDEN_SANDBOX_COLLISION_SLUGS as readonly string[]).includes(
      slug,
    );
    gates.push({
      code: isUnoNight
        ? "organization_number_collides_unonight"
        : "organization_number_collides_existing_customer",
      satisfied: false,
      severity: "block",
      detail: isUnoNight
        ? "Owner-stated organization number is already used by the UnoNight customer. Never convert UnoNight into a Bedrift sandbox."
        : "Owner-stated organization number already belongs to another customer.",
    });
  } else {
    gates.push({
      code: "organization_number_collides_existing_customer",
      satisfied: true,
      severity: "block",
      detail: "No registry collision detected for the stated organization number.",
    });
  }

  return gates;
}

export function buildInternalSandboxEnablementPacket(input?: {
  collision?: RegistryCollisionProbe | null;
}): InternalSandboxEnablementPacket {
  const identity = D2F_OWNER_STATED_SANDBOX_IDENTITY;
  const collisionGates = evaluateSandboxOrganizationNumberSafety({
    ownerStatedOrganizationNumber: identity.organizationNumberOwnerStated,
    organizationNumberVerified: identity.organizationNumberVerified,
    collision: input?.collision ?? null,
  });

  const gates: InternalSandboxEnablementGate[] = [
    {
      code: "core_create_helper_false",
      satisfied: false,
      severity: "block",
      detail:
        "Core _platform_portal_internal_customer_create_authorized() returns false — internal create denied.",
    },
    {
      code: "platform_internal_create_not_authorized",
      satisfied: CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED === true,
      severity: "block",
      detail:
        "Platform CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED remains false.",
    },
    {
      code: "platform_create_execute_disabled",
      satisfied: CUSTOMER_CREATE_EXECUTE_ENABLED === true,
      severity: "block",
      detail: "CUSTOMER_CREATE_EXECUTE_ENABLED remains false.",
    },
    {
      code: "demo_bedrift_rpc_not_connected",
      satisfied: INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED === true,
      severity: "block",
      detail:
        "Internal demo Bedrift entitlement exception SQL is not applied / not connected.",
    },
    {
      code: "demo_bedrift_helper_flip_not_authorized",
      satisfied: INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_HELPER_FLIP_AUTHORIZED === true,
      severity: "block",
      detail:
        "Demo Bedrift entitlement helper flip is not authorized (default deny).",
    },
    {
      code: "legal_acceptance_unverified",
      satisfied: PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED === true,
      severity: "block",
      detail:
        "Legal acceptance source remains disconnected; AGREEMENT_UNVERIFIED; internal exception still PROPOSED_NOT_APPROVED.",
    },
    {
      code: "admin_identity_unverified",
      satisfied: identity.adminAuthVerified === true,
      severity: "block",
      detail: `Admin ${identity.adminEmail} is not a verified auth user; invite/accept not proven.`,
    },
    {
      code: "invite_delivery_not_connected",
      satisfied:
        ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED === true &&
        ADMIN_PROVISION_OWNER_ALLOWLIST.size > 0,
      severity: "block",
      detail:
        "invite_organization_user remains a stub; ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED=false; allowlist empty.",
    },
    {
      code: "bedrift_activate_allowlist_empty",
      satisfied: KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.size > 0,
      severity: "block",
      detail: "KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST is empty — no Production grant path.",
    },
    {
      code: "exposure_triggers_block_commercial_subscription_path",
      satisfied: false,
      severity: "advisory",
      detail:
        "D2L triggers block subscriptions/license links for internal — commercial Bedrift activate eligibility cannot be satisfied via paid agreement rows.",
    },
    {
      code: "sandbox_execute_disabled",
      satisfied: INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED === true,
      severity: "block",
      detail: "INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED remains false.",
    },
    ...collisionGates,
  ];

  return {
    contractId: INTERNAL_SANDBOX_ENABLEMENT_CONTRACT_ID,
    mode: "prepare",
    dryRun: true,
    executeEnabled: false,
    corePostD2L: {
      createRpcArity: 6,
      createRpcConnectedInPlatform: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
      internalCreateHelperAuthorized: false,
      exposureTriggersBlock: [
        "subscriptions",
        "aipify_billing_license_links",
        "organization_domains",
        "customer_domains",
        "installations",
      ],
      commercialBedriftActivateRequiresSubscription: true,
      tenantModulesWritableWithoutSubscription: true,
    },
    ownerStatedIdentity: identity,
    proposedEntitlement: {
      product: "kompis_bedrift",
      billable: false,
      usesCommercialSubscription: false,
      usesLicenseLinks: false,
      usesPublicDomainsOrInstalls: false,
      store: "tenant_modules",
      activatePath: "activate_platform_portal_customer_kompis_bedrift",
      exceptionHelper:
        "_platform_portal_internal_demo_bedrift_entitlement_authorized",
      exceptionDefault: false,
      sqlPath: INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH,
      sqlApplied: false,
      rpcConnected: INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED,
    },
    gates,
    nextOwnerDecision: {
      id: "d2m_apply_internal_demo_bedrift_entitlement_sql",
      requiresSeparateOwnerJob: true,
      scope:
        "Apply ONLY the NOT_APPLIED internal demo Bedrift entitlement exception SQL (helper remains false; no tenant create; no grant).",
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

export function assertInternalSandboxEnablementIsFailClosed(): boolean {
  return (
    INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED === false &&
    INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED === false &&
    INTERNAL_CUSTOMER_CREATE_HELPER_FLIP_AUTHORIZED === false &&
    INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_HELPER_FLIP_AUTHORIZED === false &&
    CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED === false &&
    KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.size === 0
  );
}
