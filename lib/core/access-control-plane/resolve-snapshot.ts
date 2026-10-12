import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";
import {
  ACCESS_CAPABILITY_CATALOG,
  KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY,
  isReservedHiddenCapability,
} from "./capability-catalog";
import { createAccessCorrelationId } from "./correlation";
import {
  evaluateActivationGate,
  isLicenseServiceUsable,
  isSubscriptionUsable,
} from "./activation-gate";
import type {
  AccessControlPlaneSnapshot,
  AccessLicenseServiceStatus,
  AccessModuleView,
  AccessProductContextView,
  AccessProductStatus,
  AccessReasonCode,
  AccessSubscriptionStatus,
} from "./types";

export type ResolveAccessControlPlaneInput = {
  organizationId: string | null;
  customerId: string | null;
  userId: string | null;
  role: string | null;
  membershipValid: boolean;
  subscriptionStatus: AccessSubscriptionStatus;
  licenseServiceStatus: AccessLicenseServiceStatus;
  /**
   * tenant_modules truth:
   * - has `website_kompis` → Web module assigned/enabled
   * - has `__website_kompis_denied__` → explicitly off
   * - neither → unknown (fail closed for Web)
   */
  activeModuleKeys: ReadonlySet<string>;
  /** Optional: Bedrift module when present in tenant_modules. */
  bedriftModuleEnabled?: boolean | null;
  correlationId?: string;
  generatedAt?: string;
};

function mapWebProduct(
  input: ResolveAccessControlPlaneInput,
  licenseOk: boolean,
  subscriptionOk: boolean
): AccessProductContextView {
  if (!input.membershipValid) {
    return {
      productId: "kompisWeb",
      status: "unavailable",
      authorized: false,
      reasonCode: "membership_missing",
      moduleKey: "website_kompis",
    };
  }
  if (input.activeModuleKeys.has("__website_kompis_denied__")) {
    return {
      productId: "kompisWeb",
      status: "unavailable",
      authorized: false,
      reasonCode: "product_not_entitled",
      moduleKey: "website_kompis",
    };
  }
  if (!input.activeModuleKeys.has("website_kompis")) {
    return {
      productId: "kompisWeb",
      status: "conflict",
      authorized: false,
      reasonCode: "module_status_unknown",
      moduleKey: "website_kompis",
    };
  }
  // Explicit pause blocks; unknown license still allows Web when module is explicitly enabled.
  if (input.licenseServiceStatus === "paused") {
    return {
      productId: "kompisWeb",
      status: "suspended",
      authorized: false,
      reasonCode: "license_paused",
      moduleKey: "website_kompis",
    };
  }
  if (
    input.subscriptionStatus === "cancelled" ||
    input.subscriptionStatus === "expired"
  ) {
    return {
      productId: "kompisWeb",
      status: input.subscriptionStatus === "expired" ? "expired" : "cancelled",
      authorized: false,
      reasonCode: "subscription_invalid",
      moduleKey: "website_kompis",
    };
  }

  const gate = evaluateActivationGate({
    paymentOrContractValid: subscriptionOk || input.subscriptionStatus === "unknown",
    subscriptionValid: subscriptionOk || input.subscriptionStatus === "unknown",
    licenseValid: licenseOk || input.licenseServiceStatus === "unknown",
    moduleAssignmentValid: true,
    tenantProductValid: true,
    runtimeCapabilityReady: true,
  });

  return {
    productId: "kompisWeb",
    status: gate.open ? "active" : "pending",
    authorized: gate.open,
    reasonCode:
      gate.open && input.licenseServiceStatus === "unknown" ? "license_unknown" : gate.reasonCode,
    moduleKey: "website_kompis",
  };
}

function mapBedriftProduct(
  input: ResolveAccessControlPlaneInput,
  licenseOk: boolean,
  subscriptionOk: boolean
): AccessProductContextView {
  if (!input.membershipValid) {
    return {
      productId: "kompisBedrift",
      status: "unavailable",
      authorized: false,
      reasonCode: "membership_missing",
      moduleKey: "kompis_bedrift",
    };
  }
  // No dedicated tenant_modules row yet for Bedrift — membership + license gate.
  // Explicit false when a future module key is present and disabled.
  if (input.bedriftModuleEnabled === false) {
    return {
      productId: "kompisBedrift",
      status: "unavailable",
      authorized: false,
      reasonCode: "product_not_entitled",
      moduleKey: "kompis_bedrift",
    };
  }
  if (input.licenseServiceStatus === "paused") {
    return {
      productId: "kompisBedrift",
      status: "suspended",
      authorized: false,
      reasonCode: "license_paused",
      moduleKey: "kompis_bedrift",
    };
  }
  if (
    input.subscriptionStatus === "cancelled" ||
    input.subscriptionStatus === "expired"
  ) {
    return {
      productId: "kompisBedrift",
      status: input.subscriptionStatus === "expired" ? "expired" : "cancelled",
      authorized: false,
      reasonCode: "subscription_invalid",
      moduleKey: "kompis_bedrift",
    };
  }

  // Membership-gated until a dedicated Bedrift tenant_modules key is authoritative.
  return {
    productId: "kompisBedrift",
    status: "active",
    authorized: true,
    reasonCode:
      input.licenseServiceStatus === "unknown" && !licenseOk ? "license_unknown" : "ok",
    moduleKey: "kompis_bedrift",
  };
}

function resolveModules(
  input: ResolveAccessControlPlaneInput,
  products: AccessProductContextView[]
): AccessModuleView[] {
  const webOk = products.find((p) => p.productId === "kompisWeb")?.authorized === true;
  const bedriftOk = products.find((p) => p.productId === "kompisBedrift")?.authorized === true;

  return ACCESS_CAPABILITY_CATALOG.map((entry) => {
    if (entry.capabilityKey === KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY) {
      return {
        capabilityKey: entry.capabilityKey,
        kind: entry.kind,
        lifecycle: "hidden_reserved",
        visible: false,
        usable: false,
        reasonCode: "reserved_capability_hidden" as AccessReasonCode,
        products: [...entry.products],
      };
    }

    if (entry.capabilityKey === "website_kompis") {
      const assigned = input.activeModuleKeys.has("website_kompis");
      const denied = input.activeModuleKeys.has("__website_kompis_denied__");
      const gate = evaluateActivationGate({
        paymentOrContractValid: isSubscriptionUsable(input.subscriptionStatus),
        subscriptionValid: isSubscriptionUsable(input.subscriptionStatus),
        licenseValid: isLicenseServiceUsable(input.licenseServiceStatus),
        moduleAssignmentValid: assigned && !denied,
        tenantProductValid: webOk || assigned,
        runtimeCapabilityReady: assigned && !denied,
      });
      return {
        capabilityKey: entry.capabilityKey,
        kind: entry.kind,
        lifecycle: gate.open ? "active" : denied ? "inactive" : assigned ? "pending_provisioning" : "inactive",
        visible: gate.open,
        usable: gate.open,
        reasonCode: gate.open ? "ok" : denied ? "module_inactive" : "module_status_unknown",
        products: [...entry.products],
      };
    }

    if (entry.capabilityKey === "kompis_bedrift") {
      const assigned = input.bedriftModuleEnabled !== false && input.membershipValid;
      const gate = evaluateActivationGate({
        paymentOrContractValid: isSubscriptionUsable(input.subscriptionStatus),
        subscriptionValid: isSubscriptionUsable(input.subscriptionStatus),
        licenseValid: isLicenseServiceUsable(input.licenseServiceStatus),
        moduleAssignmentValid: assigned,
        tenantProductValid: bedriftOk,
        runtimeCapabilityReady: assigned,
      });
      return {
        capabilityKey: entry.capabilityKey,
        kind: entry.kind,
        lifecycle: gate.open ? "active" : "inactive",
        visible: gate.open,
        usable: gate.open,
        reasonCode: gate.open ? "ok" : "module_inactive",
        products: [...entry.products],
      };
    }

    return {
      capabilityKey: entry.capabilityKey,
      kind: entry.kind,
      lifecycle: entry.defaultLifecycle,
      visible: false,
      usable: false,
      reasonCode: isReservedHiddenCapability(entry.capabilityKey)
        ? "reserved_capability_hidden"
        : "module_inactive",
      products: [...entry.products],
    };
  });
}

/** Pure snapshot builder — authoritative APP/Platform read contract. */
export function resolveAccessControlPlaneSnapshot(
  input: ResolveAccessControlPlaneInput
): AccessControlPlaneSnapshot {
  const licenseOk = isLicenseServiceUsable(input.licenseServiceStatus);
  const subscriptionOk = isSubscriptionUsable(input.subscriptionStatus);

  const products: AccessProductContextView[] = [
    mapWebProduct(input, licenseOk, subscriptionOk),
    mapBedriftProduct(input, licenseOk, subscriptionOk),
  ];

  const authorizedProductIds = products
    .filter((p) => p.authorized)
    .map((p) => p.productId) as AppProductContextId[];

  return {
    correlationId: input.correlationId ?? createAccessCorrelationId(),
    organizationId: input.organizationId,
    customerId: input.customerId,
    userId: input.userId,
    role: input.role,
    membershipValid: input.membershipValid,
    subscriptionStatus: input.subscriptionStatus,
    licenseServiceStatus: input.licenseServiceStatus,
    products,
    modules: resolveModules(input, products),
    authorizedProductIds,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
  };
}
