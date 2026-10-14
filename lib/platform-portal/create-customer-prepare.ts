/**
 * D1 — Platform prepare / dry-run for NEW customer identity creation.
 *
 * Does not create customers. Does not attach admins, send email, or grant
 * kompis_bedrift. Core uniqueness remains authoritative at create time;
 * registry scan via get_platform_portal_customers is advisory only (no new SQL).
 */

import {
  isReservedCustomerSlug,
  parseCustomerCreationInput,
  type PlatformPortalCustomerCreationErrorCode,
} from "./create-customer";
import {
  CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE,
  CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
  CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  resolveCustomerCreateEnvironmentType,
  type CustomerCreateEnvironmentResolution,
  type CustomerCreateEnvironmentTypeErrorCode,
  type PlatformCustomerCreateEnvironmentType,
} from "./customer-environment-type-contract";
import type { PlatformPortalCustomerCreationInput } from "./types";

const SECRET_REASON =
  /(sk-|rk_|bearer\s|password|secret|api[_-]?key|totp|mfa|authorization:)/i;

/** Empty — D1 execute create is not authorized in this job. */
export const CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST: ReadonlySet<string> =
  new Set();

/** Live D1 execute path stays off until a named owner job. */
export const CUSTOMER_CREATE_EXECUTE_ENABLED = false;

export type CustomerCreatePrepareErrorCode =
  | PlatformPortalCustomerCreationErrorCode
  | CustomerCreateEnvironmentTypeErrorCode
  | "confirmation_required"
  | "invalid_internal_reason"
  | "invalid_idempotency_key"
  | "owner_create_authorization_required"
  | "create_execute_not_enabled";

export type CustomerCreatePrepareBlockReason = {
  code: string;
  severity: "block" | "advisory";
  satisfied: boolean;
};

export type CustomerCreatePreparePlan = {
  mode: "prepare";
  dryRun: true;
  readyForLaterCreate: boolean;
  normalizedInput: PlatformPortalCustomerCreationInput;
  environmentType: {
    requested: PlatformCustomerCreateEnvironmentType | null;
    resolved: PlatformCustomerCreateEnvironmentType;
    resolution: CustomerCreateEnvironmentResolution;
    rpcConnected: boolean;
    coreWouldPersistToday: typeof CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE;
    internalAuthorized: boolean;
  };
  blockReasons: CustomerCreatePrepareBlockReason[];
  productSeparation: {
    noAdminAttach: true;
    noEmailAsTenantLink: true;
    noKompisBedriftGrant: true;
    noUnoNightMutation: true;
    noMembership: true;
  };
  sideEffects: {
    createsCompany: false;
    createsCustomer: false;
    createsOrganization: false;
    createsAuthUser: false;
    sendsEmail: false;
    writesMembership: false;
    grantsKompisBedrift: false;
    mutatesUnoNight: false;
  };
  duplicateProbe: {
    source: "platform_customers_registry_scan";
    authoritative: false;
    note: "core_uniqueness_enforced_only_on_create_rpc";
    organizationNumberMatchCustomerId: string | null;
    slugMatchCustomerId: string | null;
  };
  executeBlockedReasons: string[];
  ownerApprovalRequired: true;
  idempotencyKey: string;
  internalReason: string;
};

export type RegistryCustomerScanRow = {
  customerId: string;
  organizationNumber: string | null;
  organizationSlug: string | null;
};

export function createCustomerPrepareIdempotencyKey(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `cpk-${suffix}`;
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown): string | null {
  const result = value == null ? "" : String(value).trim();
  return result || null;
}

export function parseCustomerCreatePrepareInput(
  body: unknown,
):
  | {
      ok: true;
      value: {
        input: PlatformPortalCustomerCreationInput;
        environmentResolution: CustomerCreateEnvironmentResolution;
        internalReason: string;
        confirmation: boolean;
        idempotencyKey: string;
        mode: "prepare" | "execute";
      };
    }
  | { ok: false; code: CustomerCreatePrepareErrorCode } {
  const row = record(body) ?? {};
  const modeRaw = (text(row.mode) ?? "prepare").toLowerCase();
  const mode = modeRaw === "execute" ? "execute" : "prepare";

  // Strip prepare-only fields before identity parse (strict allowlist there).
  const identityBody = { ...row };
  delete identityBody.mode;
  delete identityBody.internalReason;
  delete identityBody.internal_reason;
  delete identityBody.confirmation;
  delete identityBody.idempotencyKey;
  delete identityBody.idempotency_key;
  delete identityBody.environmentType;
  delete identityBody.environment_type;

  const parsed = parseCustomerCreationInput(identityBody);
  if (!parsed.ok) return { ok: false, code: parsed.code };

  const environmentResolved = resolveCustomerCreateEnvironmentType({
    requested: row.environmentType ?? row.environment_type,
    serverInternalAuthorized: CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  });
  if (!environmentResolved.ok) {
    return { ok: false, code: environmentResolved.code };
  }

  const internalReason = text(row.internalReason ?? row.internal_reason);
  const idempotencyKey = text(row.idempotencyKey ?? row.idempotency_key);
  if (
    !internalReason ||
    internalReason.length < 3 ||
    internalReason.length > 500 ||
    SECRET_REASON.test(internalReason)
  ) {
    return { ok: false, code: "invalid_internal_reason" };
  }
  if (row.confirmation !== true) {
    return { ok: false, code: "confirmation_required" };
  }
  if (
    !idempotencyKey ||
    idempotencyKey.length < 8 ||
    idempotencyKey.length > 128 ||
    !idempotencyKey.startsWith("cpk-")
  ) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  return {
    ok: true,
    value: {
      input: parsed.value,
      environmentResolution: environmentResolved.value,
      internalReason,
      confirmation: true,
      idempotencyKey,
      mode,
    },
  };
}

export function scanRegistryForCustomerConflicts(
  rows: RegistryCustomerScanRow[],
  input: PlatformPortalCustomerCreationInput,
): {
  organizationNumberMatchCustomerId: string | null;
  slugMatchCustomerId: string | null;
} {
  const orgNeedle = input.organizationNumber.trim().toLowerCase();
  const slugNeedle = input.slug.trim().toLowerCase();
  let organizationNumberMatchCustomerId: string | null = null;
  let slugMatchCustomerId: string | null = null;

  for (const row of rows) {
    const org = (row.organizationNumber ?? "").trim().toLowerCase();
    const slug = (row.organizationSlug ?? "").trim().toLowerCase();
    if (!organizationNumberMatchCustomerId && org && org === orgNeedle) {
      organizationNumberMatchCustomerId = row.customerId;
    }
    if (!slugMatchCustomerId && slug && slug === slugNeedle) {
      slugMatchCustomerId = row.customerId;
    }
  }

  return { organizationNumberMatchCustomerId, slugMatchCustomerId };
}

export function extractRegistryScanRows(payload: unknown): RegistryCustomerScanRow[] {
  const root = record(payload);
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(root?.customers)
      ? root?.customers
      : Array.isArray(root?.items)
        ? root?.items
        : [];

  const rows: RegistryCustomerScanRow[] = [];
  for (const entry of list) {
    const row = record(entry);
    if (!row) continue;
    const customerId = text(row.customerId ?? row.customer_id ?? row.id);
    if (!customerId) continue;
    rows.push({
      customerId,
      organizationNumber: text(
        row.organizationNumber ?? row.organization_number,
      ),
      organizationSlug: text(
        row.organizationSlug ??
          row.organization_slug ??
          row.slug ??
          row.customer_slug,
      ),
    });
  }
  return rows;
}

export function buildCustomerCreatePreparePlan(input: {
  creation: PlatformPortalCustomerCreationInput;
  registryRows: RegistryCustomerScanRow[];
  internalReason: string;
  idempotencyKey: string;
  environmentResolution?: CustomerCreateEnvironmentResolution;
}): CustomerCreatePreparePlan {
  const conflicts = scanRegistryForCustomerConflicts(
    input.registryRows,
    input.creation,
  );

  const environmentResolution =
    input.environmentResolution ??
    (() => {
      const resolved = resolveCustomerCreateEnvironmentType({
        requested: null,
        serverInternalAuthorized: CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
      });
      if (!resolved.ok) {
        throw new Error(`unexpected_environment_default:${resolved.code}`);
      }
      return resolved.value;
    })();

  const blockReasons: CustomerCreatePrepareBlockReason[] = [
    {
      code: "organization_identity_present",
      severity: "block",
      satisfied: Boolean(input.creation.organizationNumber),
    },
    {
      code: "display_name_present",
      severity: "block",
      satisfied: Boolean(input.creation.displayName),
    },
    {
      code: "slug_normalized",
      severity: "block",
      satisfied: Boolean(input.creation.slug),
    },
    {
      code: "slug_not_reserved",
      severity: "block",
      satisfied: !isReservedCustomerSlug(input.creation.slug),
    },
    {
      code: "environment_type_resolved",
      severity: "block",
      satisfied: Boolean(environmentResolution.resolved),
    },
    {
      code: "internal_environment_server_authorized_when_requested",
      severity: "block",
      satisfied:
        environmentResolution.resolved !== "internal" ||
        environmentResolution.serverInternalAuthorized,
    },
    {
      code: "organization_number_unique_in_registry_scan",
      severity: "advisory",
      satisfied: !conflicts.organizationNumberMatchCustomerId,
    },
    {
      code: "slug_unique_in_registry_scan",
      severity: "advisory",
      satisfied: !conflicts.slugMatchCustomerId,
    },
    {
      code: "core_create_uniqueness_deferred",
      severity: "advisory",
      satisfied: true,
    },
    {
      code: "environment_type_rpc_connected",
      severity: "advisory",
      satisfied: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
    },
  ];

  const hardBlocks = blockReasons.filter(
    (reason) => reason.severity === "block" && !reason.satisfied,
  );
  const advisoryConflicts = Boolean(
    conflicts.organizationNumberMatchCustomerId ||
      conflicts.slugMatchCustomerId,
  );

  const executeBlockedReasons: string[] = [
    "owner_create_authorization_required",
    "create_execute_not_enabled",
    "d1_prepare_only_no_production_create",
  ];
  if (!CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED) {
    executeBlockedReasons.push("environment_type_rpc_not_connected");
  }
  if (
    environmentResolution.resolved === "internal" &&
    !CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED
  ) {
    executeBlockedReasons.push(
      "core_would_persist_production_despite_internal_request",
    );
  }
  if (hardBlocks.length > 0) {
    executeBlockedReasons.push("prepare_hard_blocks_present");
  }
  if (advisoryConflicts) {
    executeBlockedReasons.push("registry_scan_conflict_advisory");
  }

  return {
    mode: "prepare",
    dryRun: true,
    readyForLaterCreate:
      hardBlocks.length === 0 &&
      !advisoryConflicts &&
      CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
    normalizedInput: input.creation,
    environmentType: {
      requested: environmentResolution.requested,
      resolved: environmentResolution.resolved,
      resolution: environmentResolution,
      rpcConnected: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
      coreWouldPersistToday: CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE,
      internalAuthorized: CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
    },
    blockReasons,
    productSeparation: {
      noAdminAttach: true,
      noEmailAsTenantLink: true,
      noKompisBedriftGrant: true,
      noUnoNightMutation: true,
      noMembership: true,
    },
    sideEffects: {
      createsCompany: false,
      createsCustomer: false,
      createsOrganization: false,
      createsAuthUser: false,
      sendsEmail: false,
      writesMembership: false,
      grantsKompisBedrift: false,
      mutatesUnoNight: false,
    },
    duplicateProbe: {
      source: "platform_customers_registry_scan",
      authoritative: false,
      note: "core_uniqueness_enforced_only_on_create_rpc",
      organizationNumberMatchCustomerId:
        conflicts.organizationNumberMatchCustomerId,
      slugMatchCustomerId: conflicts.slugMatchCustomerId,
    },
    executeBlockedReasons,
    ownerApprovalRequired: true,
    idempotencyKey: input.idempotencyKey,
    internalReason: input.internalReason,
  };
}

export function mapCustomerCreatePrepareError(
  code: CustomerCreatePrepareErrorCode,
): { status: number; code: CustomerCreatePrepareErrorCode } {
  switch (code) {
    case "unauthorized":
      return { status: 401, code };
    case "forbidden":
    case "owner_create_authorization_required":
    case "create_execute_not_enabled":
    case "internal_environment_not_authorized":
    case "environment_type_rpc_not_connected":
      return { status: 403, code };
    case "duplicate_organization_number":
    case "duplicate_slug":
      return { status: 409, code };
    case "unknown":
      return { status: 500, code };
    default:
      return { status: 400, code };
  }
}

export function assertNoHardcodedBedriftTestOrg(source: string): boolean {
  return !/admin@aipify\.tech/i.test(source);
}
