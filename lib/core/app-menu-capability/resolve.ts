import { buildCanonicalNavContracts } from "@/lib/app-portal/canonical-nav/contract";
import { APP_MENU_CAPABILITY_CONTRACT_VERSION } from "./version";
import type {
  AppCapabilityState,
  AppMenuCapability,
  AppMenuCapabilityBundle,
  AppMenuCapabilityLoadContext,
} from "./types";

function roleAllows(required: "any" | "owner_admin" | "manager_plus", role: string | null): boolean {
  const normalized = (role ?? "").toLowerCase().replace(/\s+/g, "_");
  if (required === "any") return true;
  const isOwnerAdmin =
    normalized.includes("owner") ||
    normalized.includes("admin") ||
    normalized === "organization_owner" ||
    normalized === "organization_admin";
  if (required === "owner_admin") return isOwnerAdmin;
  return (
    isOwnerAdmin ||
    normalized.includes("manager") ||
    normalized === "organization_manager"
  );
}

function resolveOne(
  contract: ReturnType<typeof buildCanonicalNavContracts>[number],
  ctx: AppMenuCapabilityLoadContext
): AppMenuCapability {
  const capabilityId = contract.id;

  if (contract.readiness === "foundation") {
    return {
      capabilityId,
      state: "foundation",
      visibleInNavigation: false,
      usable: false,
      reasonCode: "foundation_hidden",
    };
  }
  if (contract.readiness === "disabled") {
    return {
      capabilityId,
      state: "disabled",
      visibleInNavigation: false,
      usable: false,
      reasonCode: "disabled_hidden",
    };
  }
  if (contract.readiness === "preview") {
    return {
      capabilityId,
      state: "available",
      visibleInNavigation: false,
      usable: false,
      reasonCode: "preview_catalog_only",
    };
  }

  if (!roleAllows(contract.requiredRole, ctx.role)) {
    return {
      capabilityId,
      state: "disabled",
      visibleInNavigation: false,
      usable: false,
      reasonCode: "unauthorized_role",
    };
  }

  if (contract.requiredPermissionKeys?.length) {
    const allowed = contract.requiredPermissionKeys.some(
      (key) => ctx.permissionGranted.get(key) === true
    );
    if (!allowed) {
      return {
        capabilityId,
        state: "disabled",
        visibleInNavigation: false,
        usable: false,
        reasonCode: "permission_denied",
      };
    }
  }

  if (contract.requiredEntitlement === "business_packs") {
    const hasRevoked = ctx.revokedPackKeys.size > 0 && ctx.activePackKeys.size === 0;
    if (hasRevoked) {
      return {
        capabilityId,
        state: "revoked",
        visibleInNavigation: false,
        usable: false,
        reasonCode: "pack_revoked",
      };
    }
    if (ctx.pendingPackKeys.size > 0 && ctx.activePackKeys.size === 0) {
      return {
        capabilityId,
        state: "pending",
        visibleInNavigation: false,
        usable: false,
        reasonCode: "pack_pending",
      };
    }
    const featureOn = ctx.featureEnabled.get("business_packs") !== false;
    if (!featureOn && ctx.activePackKeys.size === 0) {
      return {
        capabilityId,
        state: "available",
        visibleInNavigation: false,
        usable: false,
        reasonCode: "pack_not_active",
      };
    }
  } else if (contract.requiredFeatureKey) {
    const enabled = ctx.featureEnabled.get(contract.requiredFeatureKey);
    if (enabled === false) {
      return {
        capabilityId,
        state: "available",
        visibleInNavigation: false,
        usable: false,
        reasonCode: "feature_not_entitled",
      };
    }
  }

  if (contract.visibilityPolicy === "catalog_only") {
    return {
      capabilityId,
      state: "available",
      visibleInNavigation: false,
      usable: false,
      reasonCode: "catalog_only",
    };
  }

  const state: AppCapabilityState =
    contract.requiredFeatureKey || contract.requiredEntitlement ? "active" : "included";

  return {
    capabilityId,
    state,
    visibleInNavigation: true,
    usable: true,
    reasonCode: "visible",
  };
}

/**
 * Pure Core resolver — authoritative visibility decisions.
 * Unknown capability ids are never emitted as visible.
 */
export function resolveAppMenuCapabilityBundle(
  ctx: AppMenuCapabilityLoadContext
): AppMenuCapabilityBundle {
  const capabilities: AppMenuCapability[] = [];
  const seen = new Set<string>();

  for (const contract of buildCanonicalNavContracts()) {
    if (seen.has(contract.id)) continue;
    seen.add(contract.id);
    capabilities.push(resolveOne(contract, ctx));
  }

  return {
    organizationId: ctx.organizationId ?? "",
    userId: ctx.userId ?? "",
    role: ctx.role ?? "",
    version: APP_MENU_CAPABILITY_CONTRACT_VERSION,
    capabilities,
    generatedAt: new Date().toISOString(),
  };
}

/** Fail-closed minimal allowlist when resolver cannot load entitlements. */
export const FAIL_CLOSED_SAFE_CAPABILITY_IDS = [
  "appDashboard",
  "commandBrief",
  "appNotifications",
  "gettingStarted",
  "knowledgeCenter",
  "organizationSettings",
] as const;

export function buildFailClosedAppMenuCapabilityBundle(input: {
  organizationId: string | null;
  userId: string | null;
  role: string | null;
}): AppMenuCapabilityBundle {
  const safe = new Set<string>(FAIL_CLOSED_SAFE_CAPABILITY_IDS);
  const capabilities: AppMenuCapability[] = buildCanonicalNavContracts().map((contract) => {
    const roleOk = roleAllows(contract.requiredRole, input.role);
    const allowed =
      safe.has(contract.id) && contract.readiness === "operational" && roleOk;
    return {
      capabilityId: contract.id,
      state: allowed ? "included" : contract.readiness === "foundation" ? "foundation" : "disabled",
      visibleInNavigation: allowed,
      usable: allowed,
      reasonCode: allowed
        ? "fail_closed_safe"
        : !roleOk
          ? "unauthorized_role"
          : "fail_closed_hidden",
    };
  });

  return {
    organizationId: input.organizationId ?? "",
    userId: input.userId ?? "",
    role: input.role ?? "",
    version: APP_MENU_CAPABILITY_CONTRACT_VERSION,
    capabilities,
    generatedAt: new Date().toISOString(),
  };
}

export function getVisibleCapabilityIds(bundle: AppMenuCapabilityBundle): Set<string> {
  return new Set(
    bundle.capabilities
      .filter((item) => item.visibleInNavigation && item.usable)
      .map((item) => item.capabilityId)
  );
}

export function isCapabilityAllowed(
  bundle: AppMenuCapabilityBundle,
  capabilityId: string
): boolean {
  const match = bundle.capabilities.find((item) => item.capabilityId === capabilityId);
  if (!match) return false;
  return match.visibleInNavigation === true && match.usable === true;
}
